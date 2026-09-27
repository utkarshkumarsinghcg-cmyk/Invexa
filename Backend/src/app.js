const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const warehousesRouter = require('./routes/warehouses');
const locationsRouter = require('./routes/locations');
const categoriesRouter = require('./routes/categories');
const receiptsRouter = require('./routes/receipts');
const deliveriesRouter = require('./routes/deliveries');
const transfersRouter = require('./routes/transfers');
const adjustmentsRouter = require('./routes/adjustments');
const ledgerRouter = require('./routes/ledger');
const dashboardRouter = require('./routes/dashboard');
const adminRouter = require('./routes/admin');
const staffRouter = require('./routes/staff');
const notificationsRouter = require('./routes/notifications');
const reorderRulesRouter = require('./routes/reorderRules');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health check endpoints
const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    service: 'Invexa / StockSense IMS Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
};

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Invexa / StockSense Inventory API',
    health: '/health',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);
app.get('/api/v1/health', healthHandler);

// Helper to mount routes on both /api and /api/v1
function mount(path, router) {
  app.use(`/api${path}`, router);
  app.use(`/api/v1${path}`, router);
}

// API Routes
mount('/auth', authRouter);
mount('/setup', authRouter);
mount('/products', productsRouter);
mount('/warehouses', warehousesRouter);
mount('/locations', locationsRouter);
mount('/categories', categoriesRouter);
mount('/receipts', receiptsRouter);
mount('/deliveries', deliveriesRouter);
mount('/transfers', transfersRouter);
mount('/adjustments', adjustmentsRouter);
mount('/ledger', ledgerRouter);
mount('/dashboard', dashboardRouter);
mount('/move-history', dashboardRouter);
mount('/admin', adminRouter);
mount('/staff', staffRouter);
mount('/users', staffRouter);
mount('/notifications', notificationsRouter);
mount('/reorder-rules', reorderRulesRouter);

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
