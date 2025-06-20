const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const express = require('express');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
const { getCustomerByPhone, listCustomers } = require('./services/customer');
const { listOrders, createOrderFromWebhook, createOrUpdateOrder } = require('./services/order');
const app = express();

// Middleware
app.use(cors());

// API Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from production!' });
});

app.get('/api/areas/', async (req, res) => {
  try {
    const response = await fetch("https://api.parceltracer.app/v1/external/areas/", {
      method: "GET",
      headers: {
        "X-Api-Key": 'OAdCVgTa2j07FhSCM-aLUJhwYo9qeU6l6VnHxUohXyZrM-Wo64Yxjw46G61e39huLN9ROleFhFMOphHDnDkQnA',
      }
    })

    res.json(await response.json())
  } catch {
    res.json({ "error": true })
  }
})

app.post('/customers', express.json(), async (req, res) => {
  try {
    const customer = await createCustomer(req.body);
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/customers', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    const customers = await listCustomers({
      searchTerm: search,
      page: Number(page),
      limit: Math.min(Number(limit), 100)
    });

    res.json(customers);

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

app.get('/customers/:phone/orders', async (req, res) => {
  const orders = await getOrdersByCustomer(req.params.phone);
  res.json(orders);
});

// List orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await listOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook endpoint with signature verification
app.post('/webhook', express.json({ verify: (req, res, buf) => { req.rawBody = buf } }), async (req, res) => {
  try {
    const signatureHeader = req.headers['x-pt-webhook-signature'];
    console.log("Request headers:")
    console.log(req.headers)
    if (!signatureHeader) {
      return res.status(401).json({ error: 'Missing signature header' });
    }

    // Replace this with your actual secret key
    const secret = '20e2617e512c9dfb3515ec2848f4f253907d3a7dfdc822d1c7f5beefedb7712d';

    // Calculate HMAC
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.rawBody)
      .digest('hex');

    if (signatureHeader !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Signature is valid, continue processing
    const webhookData = req.body.data;

    const order = await createOrUpdateOrder(webhookData);

    res.status(200).json(order);
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Serve static files from React
app.use(express.static(path.join(__dirname, 'client/build')));

// Handle React routing
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
