import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Stripe (Simulated if key is missing)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51Placeholder';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-02-25.clover' as any,
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
      // In simulation mode, we might just return 200
      return res.status(200).send({ received: true, simulated: true });
    }

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      
      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`💰 PaymentIntent for ${paymentIntent.amount} was successful!`);
          // Here you would update Supabase order status to 'pago'
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
