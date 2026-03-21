import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Stripe (Simulated if key is missing)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51Placeholder';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-02-25.clover' as any,
});

// Initialize Nodemailer for SiteGround SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

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
          console.log(`💰 PaymentIntent for ${paymentIntent.amount} was successful!`);
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
                <a href="${req.headers.origin}/alunos-pais" style="background-color: #FFD700; color: #1a1a1a; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Acompanhar Pedido</a>
              </div>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              &copy; ${new Date().getFullYear()} Phaleduc. Todos os direitos reservados.
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: error.message });
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
    const { amount, currency, orderId, customerEmail } = req.body;

    try {
      // In simulation mode, if no real key, we just return a mock client secret
      if (stripeSecretKey.includes('Placeholder')) {
        return res.json({
          clientSecret: 'pi_simulated_secret_' + Math.random().toString(36).substring(7),
          simulated: true
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: currency || 'usd',
        metadata: { orderId, customerEmail },
        automatic_payment_methods: { enabled: true },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: error.message });
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
