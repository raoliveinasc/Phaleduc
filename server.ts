import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase (Server-side)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Stripe (Simulated if key is missing)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51Placeholder';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-02-25.clover' as any,
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Nodemailer for SiteGround SMTP
  const smtpPort = parseInt(process.env.SMTP_PORT || '465');
  console.log('Initializing SMTP Transporter with port:', smtpPort);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports (like 587)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false // Helps with shared hosting certificate issues
    }
  });

  // Middleware for Stripe Webhook (needs raw body)
  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      console.log('⚠️ Webhook signature or secret missing. Skipping validation for simulation.');
      return res.status(200).send({ received: true, simulated: true });
    }

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const orderId = paymentIntent.metadata.orderId;
          
          if (orderId) {
            console.log(`💰 Payment successful for Order: ${orderId}`);
            await fulfillOrder(orderId, paymentIntent.id);
          }
          break;
        case 'payment_intent.payment_failed':
          const failedIntent = event.data.object as Stripe.PaymentIntent;
          const failedOrderId = failedIntent.metadata.orderId;
          if (failedOrderId) {
            console.log(`❌ Payment failed for Order: ${failedOrderId}`);
            await supabase
              .from('store_orders')
              .update({ status: 'falhou' })
              .eq('id', failedOrderId);
          }
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error(`❌ Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // Regular JSON middleware for other routes
  app.use(express.json());

  // API Route: Send Order Confirmation Email
  app.post('/api/send-order-email', async (req, res) => {
    const { order, customerEmail, customerName } = req.body;

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('⚠️ SMTP credentials missing. Skipping email sending.');
      return res.json({ success: true, simulated: true });
    }

    try {
      const itemsHtml = order.items.map((item: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <div style="font-weight: bold; color: #1a1a1a;">${item.name}</div>
            ${item.variant_name ? `<div style="font-size: 12px; color: #666;">Variante: ${item.variant_name}</div>` : ''}
            <div style="font-size: 12px; color: #999;">SKU: ${item.sku}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #666;">
            ${item.quantity}x
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #1a1a1a;">
            US$ ${(item.price / 100).toFixed(2)}
          </td>
        </tr>
      `).join('');

      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Phaleduc'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: `Pedido Confirmado! 🎒 Sua mochila Phaleduc está pronta (#${order.id.slice(0, 8).toUpperCase()})`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 16px; overflow: hidden;">
            <div style="background-color: #1a1a1a; padding: 40px; text-align: center;">
              <img src="https://raw.githubusercontent.com/raoliveinasc/Phaleduc/main/logo-phaleduc.png" alt="Phaleduc Logo" style="max-width: 150px; margin-bottom: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Phaleduc</h1>
              <p style="color: #ffffff; opacity: 0.6; margin-top: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Educação Bilíngue de Herança</p>
            </div>
            <div style="padding: 40px;">
              <h2 style="color: #1a1a1a; margin-top: 0;">Olá, ${customerName}!</h2>
              <p style="color: #666; line-height: 1.6;">Seu pedido foi recebido e está sendo processado. Obrigado por fortalecer o bilinguismo de herança com a Phaleduc!</p>
              
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 12px; margin: 30px 0;">
                <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #999; letter-spacing: 1px;">Resumo do Pedido</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  ${itemsHtml}
                </table>
                <div style="margin-top: 20px; text-align: right;">
                  <div style="font-size: 12px; color: #999; text-transform: uppercase;">Total do Pedido</div>
                  <div style="font-size: 24px; font-weight: bold; color: #1a1a1a;">US$ ${(order.total_amount_cents / 100).toFixed(2)}</div>
                </div>
              </div>

              <div style="border-top: 1px solid #eee; padding-top: 30px; margin-top: 30px;">
                <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #999; letter-spacing: 1px;">Endereço de Entrega</h3>
                <p style="color: #666; font-size: 14px; line-height: 1.6;">
                  ${order.address_line1}${order.address_line2 ? `, ${order.address_line2}` : ''}<br>
                  ${order.city}, ${order.state_province} ${order.postal_code}<br>
                  ${order.country}
                </p>
              </div>

              <div style="margin-top: 40px; text-align: center;">
                <a href="${req.headers.origin || 'https://phaleduc.com'}/alunos-pais" style="background-color: #FFD700; color: #1a1a1a; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Acompanhar Pedido</a>
              </div>

              <div style="margin-top: 40px; text-align: center;">
                <img src="https://raw.githubusercontent.com/raoliveinasc/Phaleduc/main/mascote.png" alt="Mascote Phaleduc" style="max-width: 100px;">
              </div>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              &copy; ${new Date().getFullYear()} Phaleduc. Todos os direitos reservados.
            </div>
          </div>
        `,
      };

      console.log('Sending order confirmation email...');
      await transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent successfully.');
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error sending confirmation email:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Send Order Status Update Email
  app.post('/api/send-order-status-update', async (req, res) => {
    const { orderId, status, customerEmail, customerName, trackingNumber } = req.body;

    console.log(`📧 Attempting to send status update email for Order #${orderId} to ${customerEmail} (Status: ${status})`);

    if (!orderId) {
      console.error('❌ Cannot send email: Order ID is missing.');
      return res.status(400).json({ error: 'Order ID is required' });
    }

    if (!customerEmail) {
      console.error('❌ Cannot send email: Customer email is missing.');
      return res.status(400).json({ error: 'Customer email is required' });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️ SMTP credentials missing. Email sending skipped (Simulation Mode).');
      return res.json({ 
        success: true, 
        simulated: true, 
        message: 'SMTP não configurado. O e-mail foi simulado no console.' 
      });
    }

    const shortOrderId = String(orderId).slice(0, 8);
    let statusTitle = '';
    let statusMessage = '';
    let statusColor = '#1a1a1a';

    switch (status) {
      case 'pago':
        statusTitle = 'Pagamento Confirmado';
        statusMessage = 'Seu pagamento foi confirmado com sucesso. Estamos preparando seu pedido!';
        statusColor = '#10b981';
        break;
      case 'enviado':
        statusTitle = 'Pedido Enviado';
        statusMessage = `Seu pedido já está a caminho! ${trackingNumber ? `Código de rastreio: ${trackingNumber}` : ''}`;
        statusColor = '#6366f1';
        break;
      case 'entregue':
        statusTitle = 'Pedido Entregue';
        statusMessage = 'Seu pedido foi entregue. Esperamos que você e seu filho(a) aproveitem muito!';
        statusColor = '#059669';
        break;
      case 'cancelado':
        statusTitle = 'Pedido Cancelado';
        statusMessage = 'Seu pedido foi cancelado. Se você não solicitou isso, entre em contato conosco.';
        statusColor = '#e11d48';
        break;
      default:
        statusTitle = `Status do Pedido: ${status}`;
        statusMessage = `O status do seu pedido #${shortOrderId} foi atualizado para: ${status}`;
    }

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Phaleduc Store'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Atualização do Pedido #${shortOrderId}: ${statusTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
            <img src="https://raw.githubusercontent.com/raoliveinasc/Phaleduc/main/logo-phaleduc.png" alt="Phaleduc Logo" style="max-width: 120px;">
          </div>
          <div style="padding: 40px;">
            <h2 style="color: ${statusColor}; text-align: center; margin-top: 0;">${statusTitle}</h2>
            <p>Olá, <strong>${customerName || 'Cliente'}</strong>,</p>
            <p style="color: #444; line-height: 1.6;">${statusMessage}</p>
            
            ${status === 'enviado' && trackingNumber ? `
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center; border: 1px solid #eee;">
              <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Código de Rastreamento</p>
              <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #1a1a1a; letter-spacing: 2px;">${trackingNumber}</p>
            </div>
            ` : ''}

            <div style="margin-top: 30px; text-align: center;">
              <a href="${req.headers.origin || 'https://phaleduc.com'}/alunos-pais" style="display: inline-block; background-color: #FFD700; color: #1a1a1a; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px;">Ver Detalhes do Pedido</a>
            </div>
            
            <div style="margin-top: 40px; text-align: center;">
              <img src="https://raw.githubusercontent.com/raoliveinasc/Phaleduc/main/mascote.png" alt="Mascote Phaleduc" style="max-width: 80px;">
            </div>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
            &copy; ${new Date().getFullYear()} Phaleduc. Todos os direitos reservados.
          </div>
        </div>
      `,
    };

    try {
      console.log('Sending status update email...');
      await transporter.sendMail(mailOptions);
      console.log('Status update email sent successfully.');
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error sending status update email:', error);
      res.status(500).json({ 
        error: 'Failed to send status update email: ' + error.message,
        code: error.code,
        response: error.response
      });
    }
  });

  // API Route: Create Stripe Customer Portal Session
  app.post('/api/create-portal-session', async (req, res) => {
    const { customerId } = req.body;

    try {
      if (stripeSecretKey.includes('Placeholder')) {
        const origin = req.headers.origin || 'http://localhost:3000';
        return res.json({ url: `${origin}/alunos-pais?portal_simulated=true` });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.headers.origin}/alunos-pais`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error creating portal session:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Create Payment Intent
  app.post('/api/create-payment-intent', async (req, res) => {
    const { items, customerEmail, country, orderId } = req.body;

    try {
      // 1. Calculate totals on server to prevent tampering
      let cartTotal = 0;
      
      // Fetch products from DB to verify prices
      const productIds = items.map((i: any) => i.id);
      const { data: dbProducts } = await supabase
        .from('store_products')
        .select('id, price_cents')
        .in('id', productIds);

      if (!dbProducts) throw new Error('Products not found');

      for (const item of items) {
        const dbProd = dbProducts.find(p => p.id === item.id);
        if (dbProd) {
          cartTotal += dbProd.price_cents * item.quantity;
        }
      }

      const shippingCost = country === 'United States' ? 0 : 2500;
      const taxRate = country === 'United States' ? 0.07 : 0;
      const taxAmount = Math.round(cartTotal * taxRate);
      const finalTotal = cartTotal + shippingCost + taxAmount;

      // 2. Create Payment Intent
      if (stripeSecretKey.includes('Placeholder')) {
        return res.json({
          clientSecret: 'pi_simulated_secret_' + Math.random().toString(36).substring(7),
          simulated: true,
          amount: finalTotal
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: finalTotal,
        currency: 'usd',
        metadata: { orderId, customerEmail },
        automatic_payment_methods: { enabled: true },
      });

      res.json({ clientSecret: paymentIntent.client_secret, amount: finalTotal });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Simulate Payment Success (for dev/test without real Stripe)
  app.post('/api/simulate-payment-success', async (req, res) => {
    const { orderId, paymentIntentId } = req.body;
    try {
      await fulfillOrder(orderId, paymentIntentId || 'pi_simulated_' + Date.now());
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Helper function to fulfill order (called by webhook or simulation)
  async function fulfillOrder(orderId: string, paymentIntentId: string) {
    try {
      // 1. Get Order details
      const { data: order, error: fetchError } = await supabase
        .from('store_orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (fetchError || !order) throw new Error('Order not found');
      if (order.status === 'pago') return; // Already fulfilled

      // 2. Update Order Status
      await supabase
        .from('store_orders')
        .update({ 
          status: 'pago', 
          stripe_payment_intent_id: paymentIntentId 
        })
        .eq('id', orderId);

      // 3. Process Items (Stock & Subscriptions)
      const items = order.items || [];
      for (const item of items) {
        // Stock
        if (item.type === 'fisico') {
          if (item.variant_id) {
            await supabase.rpc('decrement_product_variant_stock', {
              variant_id: item.variant_id,
              quantity: item.quantity
            });
          } else {
            await supabase.rpc('decrement_product_stock', {
              product_id: item.id,
              quantity: item.quantity
            });
          }
        }

        // Subscriptions
        if (item.is_subscription_activator && order.parent_id) {
          const planType = item.name.toLowerCase().includes('anual') ? 'anual' : 
                          item.name.toLowerCase().includes('semestral') ? 'semestral' : 'mensal';
          
          const durationDays = planType === 'anual' ? 365 : planType === 'semestral' ? 180 : 30;
          const expiration = new Date();
          expiration.setDate(expiration.getDate() + durationDays);

          await supabase.from('subscriptions').upsert({
            user_id: order.parent_id,
            plan_type: planType,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: expiration.toISOString(),
            stripe_customer_id: 'store_purchase'
          }, { onConflict: 'user_id' });
        }
      }

      // 4. Send Email
      await sendOrderConfirmationEmail(order);
      
      console.log(`✅ Order ${orderId} fulfilled successfully`);
    } catch (err) {
      console.error(`❌ Error fulfilling order ${orderId}:`, err);
    }
  }

  async function sendOrderConfirmationEmail(order: any) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

    const itemsHtml = order.items.map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="font-weight: bold; color: #1a1a1a;">${item.name}</div>
          ${item.variant_name ? `<div style="font-size: 12px; color: #666;">Variante: ${item.variant_name}</div>` : ''}
          <div style="font-size: 12px; color: #999;">SKU: ${item.sku}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #666;">
          ${item.quantity}x
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #1a1a1a;">
          US$ ${(item.price / 100).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Phaleduc'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: order.customer_email,
      subject: `Pedido Confirmado! 🎒 Sua mochila Phaleduc está pronta (#${order.id.slice(0, 8).toUpperCase()})`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #1a1a1a; padding: 40px; text-align: center;">
            <img src="https://raw.githubusercontent.com/raoliveinasc/Phaleduc/main/logo-phaleduc.png" alt="Phaleduc Logo" style="max-width: 150px; margin-bottom: 20px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Phaleduc</h1>
            <p style="color: #ffffff; opacity: 0.6; margin-top: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Educação Bilíngue de Herança</p>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Olá, ${order.customer_name}!</h2>
            <p style="color: #666; line-height: 1.6;">Seu pedido foi recebido e está sendo processado. Obrigado por fortalecer o bilinguismo de herança com a Phaleduc!</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 12px; margin: 30px 0;">
              <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #999; letter-spacing: 1px;">Resumo do Pedido</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
              </table>
              <div style="margin-top: 20px; text-align: right;">
                <div style="font-size: 12px; color: #999; text-transform: uppercase;">Total do Pedido</div>
                <div style="font-size: 24px; font-weight: bold; color: #1a1a1a;">US$ ${(order.total_amount_cents / 100).toFixed(2)}</div>
              </div>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 30px; margin-top: 30px;">
              <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #999; letter-spacing: 1px;">Endereço de Entrega</h3>
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                ${order.address_line1}${order.address_line2 ? `, ${order.address_line2}` : ''}<br>
                ${order.city}, ${order.state_province} ${order.postal_code}<br>
                ${order.country}
              </p>
            </div>

            <div style="margin-top: 40px; text-align: center;">
              <img src="https://raw.githubusercontent.com/raoliveinasc/Phaleduc/main/mascote.png" alt="Mascote Phaleduc" style="max-width: 100px;">
            </div>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
            &copy; ${new Date().getFullYear()} Phaleduc. Todos os direitos reservados.
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      await supabase
        .from('store_orders')
        .update({ 
          confirmation_email_sent: true,
          confirmation_email_at: new Date().toISOString()
        })
        .eq('id', order.id);
    } catch (err) {
      console.error('Error sending confirmation email:', err);
    }
  }

  // API Route: Health Check
  app.post('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API Route: Test SMTP Configuration
  app.post('/api/test-smtp', async (req, res) => {
    console.log('Received SMTP test request for:', req.body.testEmail);
    console.log('Current SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      fromName: process.env.SMTP_FROM_NAME,
      fromEmail: process.env.SMTP_FROM_EMAIL
    });
    const { testEmail } = req.body;

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(400).json({ error: 'Configuração SMTP incompleta (HOST, USER ou PASS faltando).' });
    }

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Phaleduc Test'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: testEmail || process.env.SMTP_USER,
      subject: 'Teste de Configuração SMTP - Phaleduc',
      text: 'Se você está recebendo este e-mail, sua configuração SMTP está funcionando corretamente!',
      html: '<h1>Teste de Configuração SMTP</h1><p>Se você está recebendo este e-mail, sua configuração SMTP está funcionando corretamente!</p>'
    };

    try {
      console.log('Verifying SMTP connection...');
      await transporter.verify();
      console.log('SMTP connection verified successfully.');

      console.log('Attempting to send test email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('Test email sent successfully:', info.messageId);
      res.json({ success: true, messageId: info.messageId });
    } catch (error: any) {
      console.error('SMTP Test Error Details:', error);
      res.status(500).json({ 
        error: error.message, 
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
