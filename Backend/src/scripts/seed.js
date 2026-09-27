const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const User = require('../models/User');
const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Quant = require('../models/Quant');
const Ledger = require('../models/Ledger');
const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Transfer = require('../models/Transfer');
const Adjustment = require('../models/Adjustment');

const ATLAS_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://invexa:invexa%40123@cluster0.trkwqdl.mongodb.net/invexa?retryWrites=true&w=majority&appName=Cluster0';

async function seedDatabase() {
  console.log('🚀 Connecting to MongoDB Atlas Database...');
  console.log(`[Target URI]: ${ATLAS_URI.replace(/:([^:@]+)@/, ':****@')}`);

  try {
    await mongoose.connect(ATLAS_URI, {
      serverSelectionTimeoutMS: 20000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${mongoose.connection.host}, database: ${mongoose.connection.name}`);

    console.log('🧹 Purging existing collections to ensure a pristine seed state...');
    await Promise.all([
      User.deleteMany({}),
      Warehouse.deleteMany({}),
      Location.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Quant.deleteMany({}),
      Ledger.deleteMany({}),
      Receipt.deleteMany({}),
      Delivery.deleteMany({}),
      Transfer.deleteMany({}),
      Adjustment.deleteMany({})
    ]);
    console.log('✨ All target collections cleared.');

    // 1. Seed Warehouses (WH-001 to WH-004)
    console.log('🏢 Seeding Warehouses...');
    const warehouseData = [
      {
        name: 'Main Distribution Warehouse',
        shortName: 'Main Warehouse',
        code: 'WH-001',
        city: 'Gandhinagar',
        address: 'Plot 42, GIDC Industrial Estate, Sector 26, Gandhinagar, Gujarat',
        type: 'Central Hub',
        capacity: 15000,
        manager: 'Alex Rivera',
        status: 'Active',
        active: true
      },
      {
        name: 'Kalol Production Warehouse',
        shortName: 'Production Warehouse',
        code: 'WH-002',
        city: 'Kalol',
        address: 'Highway Bypass Rd, Kalol Industrial Zone, Gujarat',
        type: 'Production & Assembly',
        capacity: 8500,
        manager: 'Priya Sharma',
        status: 'Active',
        active: true
      },
      {
        name: 'Express Transit Hub',
        shortName: 'Transit Hub',
        code: 'WH-003',
        city: 'Ahmedabad',
        address: 'Cargo Terminal 2, Sarkhej-Bavla Road, Ahmedabad',
        type: 'Cross-Dock',
        capacity: 5000,
        manager: 'Devendra Patel',
        status: 'Active',
        active: true
      },
      {
        name: 'Central Staging Facility',
        shortName: 'Staging Facility',
        code: 'WH-004',
        city: 'Vadodara',
        address: 'Makarpura GIDC, Vadodara, Gujarat',
        type: 'Cold & Secure Storage',
        capacity: 4200,
        manager: 'Vikram Mehta',
        status: 'Active',
        active: true
      }
    ];

    const warehouses = await Warehouse.insertMany(warehouseData);
    const whMap = {};
    warehouses.forEach(w => {
      whMap[w.code] = w;
    });

    // 2. Seed Storage Locations (LOC-001 to LOC-008)
    console.log('📍 Seeding Storage Locations...');
    const locationData = [
      {
        warehouseId: whMap['WH-001']._id,
        warehouseName: whMap['WH-001'].name,
        name: 'Rack A - Heavy Metals & Raw',
        code: 'LOC-001',
        type: 'Storage',
        capacity: 5000,
        occupied: 3200,
        aisle: 'Aisle 1',
        shelf: 'Tier 1-4',
        active: true
      },
      {
        warehouseId: whMap['WH-001']._id,
        warehouseName: whMap['WH-001'].name,
        name: 'Rack B - Finished Furniture',
        code: 'LOC-002',
        type: 'Storage',
        capacity: 3500,
        occupied: 1800,
        aisle: 'Aisle 2',
        shelf: 'Tier 1-3',
        active: true
      },
      {
        warehouseId: whMap['WH-001']._id,
        warehouseName: whMap['WH-001'].name,
        name: 'Rack C - Electronics & IT',
        code: 'LOC-003',
        type: 'Secure Cage',
        capacity: 2000,
        occupied: 450,
        aisle: 'Aisle 3',
        shelf: 'Locked Bay',
        active: true
      },
      {
        warehouseId: whMap['WH-001']._id,
        warehouseName: whMap['WH-001'].name,
        name: 'Inbound Dock 1',
        code: 'LOC-004',
        type: 'Receiving Dock',
        capacity: 1500,
        occupied: 620,
        aisle: 'Gate North',
        shelf: 'Staging Floor',
        active: true
      },
      {
        warehouseId: whMap['WH-001']._id,
        warehouseName: whMap['WH-001'].name,
        name: 'Outbound Staging Bay 3',
        code: 'LOC-005',
        type: 'Dispatch Dock',
        capacity: 1200,
        occupied: 410,
        aisle: 'Gate South',
        shelf: 'Pallet Line',
        active: true
      },
      {
        warehouseId: whMap['WH-002']._id,
        warehouseName: whMap['WH-002'].name,
        name: 'Production Rack - Assembly Line 1',
        code: 'LOC-006',
        type: 'Production',
        capacity: 4000,
        occupied: 2900,
        aisle: 'Shop Floor A',
        shelf: 'Bin P1-P8',
        active: true
      },
      {
        warehouseId: whMap['WH-002']._id,
        warehouseName: whMap['WH-002'].name,
        name: 'Raw Material Feed Bay',
        code: 'LOC-007',
        type: 'Production',
        capacity: 2500,
        occupied: 1100,
        aisle: 'Shop Floor B',
        shelf: 'Feed Row 2',
        active: true
      },
      {
        warehouseId: whMap['WH-003']._id,
        warehouseName: whMap['WH-003'].name,
        name: 'Transit Staging Bay Alpha',
        code: 'LOC-008',
        type: 'Cross-Dock',
        capacity: 3000,
        occupied: 950,
        aisle: 'Zone 1',
        shelf: 'Floor Bay',
        active: true
      }
    ];

    const locations = await Location.insertMany(locationData);
    const locMap = {};
    locations.forEach(l => {
      locMap[l.code] = l;
    });

    // 3. Seed Users & Staff
    console.log('👤 Seeding System Users & Staff Members...');
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
    const staffPasswordHash = await bcrypt.hash('Staff@123', salt);

    const userData = [
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@invexa.io',
        loginId: 'alex.rivera',
        passwordHash: adminPasswordHash,
        role: 'Inventory Manager',
        department: 'Supply Chain Operations',
        phone: '+91 98765 43210',
        warehouse: 'Main Distribution Warehouse (WH-001)',
        assignedWarehouses: [whMap['WH-001']._id, whMap['WH-002']._id, whMap['WH-003']._id, whMap['WH-004']._id],
        active: true
      },
      {
        name: 'Warehouse Operator',
        email: 'staff@invexa.io',
        loginId: 'staff.operator',
        passwordHash: staffPasswordHash,
        role: 'Warehouse Staff',
        department: 'Floor Operations & Logistics',
        phone: '+91 98250 11223',
        warehouse: 'Main Distribution Warehouse (WH-001)',
        assignedWarehouses: [whMap['WH-001']._id],
        active: true
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@invexa.io',
        loginId: 'priya.s',
        passwordHash: staffPasswordHash,
        role: 'Warehouse Staff',
        department: 'Floor Operations & Logistics',
        phone: '+91 98250 44556',
        warehouse: 'Kalol Production Warehouse (WH-002)',
        assignedWarehouses: [whMap['WH-002']._id],
        active: true
      },
      {
        name: 'Vikram Mehta',
        email: 'vikram.mehta@invexa.io',
        loginId: 'vikram.m',
        passwordHash: staffPasswordHash,
        role: 'Warehouse Staff',
        department: 'Dock & Heavy Loading',
        phone: '+91 98112 33445',
        warehouse: 'Main Distribution Warehouse (WH-001)',
        assignedWarehouses: [whMap['WH-001']._id],
        active: true
      },
      {
        name: 'Rajesh Patel',
        email: 'rajesh.patel@invexa.io',
        loginId: 'rajesh.p',
        passwordHash: staffPasswordHash,
        role: 'Warehouse Staff',
        department: 'Inventory Auditing',
        phone: '+91 98980 44556',
        warehouse: 'Express Transit Hub (WH-003)',
        assignedWarehouses: [whMap['WH-003']._id],
        active: true
      }
    ];

    const users = await User.insertMany(userData);
    const adminUser = users[0];
    const staffUser = users[1];

    // 4. Seed Categories (CAT-001 to CAT-006)
    console.log('🏷️  Seeding Product Categories...');
    const categoryData = [
      {
        name: 'Raw Materials',
        code: 'RAW',
        description: 'Metals, plastics, raw stock and primary components',
        color: '#2563EB',
        icon: 'Cpu',
        productCount: 4,
        active: true
      },
      {
        name: 'Furniture',
        code: 'FURN',
        description: 'Ergonomic seating, desks, storage units and fixtures',
        color: '#0EA5E9',
        icon: 'Armchair',
        productCount: 3,
        active: true
      },
      {
        name: 'Electronics',
        code: 'ELEC',
        description: 'Laptops, server gear, circuits and sensory units',
        color: '#8B5CF6',
        icon: 'Laptop',
        productCount: 3,
        active: true
      },
      {
        name: 'Finished Goods',
        code: 'FG',
        description: 'Packaged ready-for-sale enterprise products',
        color: '#16A34A',
        icon: 'Package',
        productCount: 2,
        active: true
      },
      {
        name: 'Packaging',
        code: 'PKG',
        description: 'Corrugated cartons, bubble rolls and sealing tapes',
        color: '#F59E0B',
        icon: 'Boxes',
        productCount: 2,
        active: true
      },
      {
        name: 'Office Supplies',
        code: 'OFF',
        description: 'Stationery, printer consumables and accessories',
        color: '#64748B',
        icon: 'Printer',
        productCount: 1,
        active: true
      }
    ];

    const categories = await Category.insertMany(categoryData);
    const catMap = {};
    categories.forEach(c => {
      catMap[c.code] = c;
    });

    // 5. Seed Products Master List (PROD-001 to PROD-008)
    console.log('📦 Seeding Products Master List...');
    const productData = [
      {
        name: 'Steel Rods (12mm High-Grade)',
        sku: 'STL-001',
        category: 'Raw Materials',
        categoryId: catMap['RAW']._id.toString(),
        unit: 'kg',
        unitOfMeasure: 'kg',
        costPrice: 85.00,
        sellingPrice: 120.00,
        reorderPoint: 50,
        reorderLevel: 50,
        maxStock: 500,
        reorderQty: 100,
        warehouseId: whMap['WH-001']._id,
        warehouseName: whMap['WH-001'].name,
        locationId: locMap['LOC-001']._id,
        locationName: locMap['LOC-001'].name,
        description: 'Industrial grade structural high-tensile steel reinforcement rods for manufacturing and heavy construction.',
        active: true
      },
      {
        name: 'Ergonomic Executive Office Chair',
        sku: 'FURN-CHR-002',
        category: 'Furniture',
        categoryId: catMap['FURN']._id.toString(),
        unit: 'units',
        unitOfMeasure: 'units',
        costPrice: 4200.00,
        sellingPrice: 7500.00,
        reorderPoint: 20,
        reorderLevel: 20,
        maxStock: 100,
        reorderQty: 30,
        warehouseId: whMap['WH-001']._id,
        warehouseName: whMap['WH-001'].name,
        locationId: locMap['LOC-002']._id,
        locationName: locMap['LOC-002'].name,
        description: 'High-back mesh ergonomic executive chair with 4D lumbar support and synchro-tilt mechanism.',
        active: true
      },
      {
        name: 'StockSense Enterprise Core i7 Laptop',
        sku: 'ELEC-LPT-003',
        category: 'Electronics',
        categoryId: catMap['ELEC']._id.toString(),
        unit: 'units',
        unitOfMeasure: 'units',
        costPrice: 58000.00,
        sellingPrice: 79999.00,
        reorderPoint: 5,
        reorderLevel: 5,
        maxStock: 50,
        reorderQty: 15,
        warehouseId: whMap['WH-001']._id,
        warehouseName: whMap['WH-001'].name,
        locationId: locMap['LOC-003']._id,
        locationName: locMap['LOC-003'].name,
        description: '14-inch FHD ruggedized enterprise field workstation laptops with Intel Core i7 & 32GB RAM.',
        active: true
      },
      {
        name: 'Industrial Work Desk [DESK001]',
        sku: 'DESK-001',
        category: 'Furniture',
        categoryId: catMap['FURN']._id.toString(),
        unit: 'units',
        unitOfMeasure: 'units',
        costPrice: 3000.00,
        sellingPrice: 5200.00,
        reorderPoint: 15,
        reorderLevel: 15,
        maxStock: 150,
        reorderQty: 40,
        warehouseId: whMap['WH-001']._id,
        warehouseName: whMap['WH-001'].name,
        locationId: locMap['LOC-002']._id,
        locationName: locMap['LOC-002'].name,
        description: 'Heavy duty powder-coated steel frame modular assembly work desks with cable raceways.',
        active: true
      },
      {
        name: 'Aluminum Extrusion Profile 4040',
        sku: 'ALU-EXT-005',
        category: 'Raw Materials',
        categoryId: catMap['RAW']._id.toString(),
        unit: 'meters',
        unitOfMeasure: 'meters',
        costPrice: 240.00,
        sellingPrice: 380.00,
        reorderPoint: 100,
        reorderLevel: 100,
        maxStock: 1000,
        reorderQty: 250,
        warehouseId: whMap['WH-002']._id,
        warehouseName: whMap['WH-002'].name,
        locationId: locMap['LOC-006']._id,
        locationName: locMap['LOC-006'].name,
        description: 'Anodized 40x40 T-slot aluminum structural extrusions for automation jigs and framing.',
        active: true
      },
      {
        name: 'Hydraulic Solenoid Valve 24V DC',
        sku: 'VALV-HYD-006',
        category: 'Raw Materials',
        categoryId: catMap['RAW']._id.toString(),
        unit: 'units',
        unitOfMeasure: 'units',
        costPrice: 1850.00,
        sellingPrice: 2900.00,
        reorderPoint: 25,
        reorderLevel: 25,
        maxStock: 80,
        reorderQty: 30,
        warehouseId: whMap['WH-002']._id,
        warehouseName: whMap['WH-002'].name,
        locationId: locMap['LOC-006']._id,
        locationName: locMap['LOC-006'].name,
        description: 'Directional spool hydraulic valves rated for 315 bar max operating fluid pressure.',
        active: true
      },
      {
        name: 'Heavy Duty 5-Ply Corrugated Master Cartons',
        sku: 'PKG-BOX-007',
        category: 'Packaging',
        categoryId: catMap['PKG']._id.toString(),
        unit: 'pcs',
        unitOfMeasure: 'pcs',
        costPrice: 35.00,
        sellingPrice: 55.00,
        reorderPoint: 300,
        reorderLevel: 300,
        maxStock: 3000,
        reorderQty: 800,
        warehouseId: whMap['WH-001']._id,
        warehouseName: whMap['WH-001'].name,
        locationId: locMap['LOC-001']._id,
        locationName: locMap['LOC-001'].name,
        description: 'Export-grade double wall corrugated dispatch packaging boxes (600x400x400mm).',
        active: true
      },
      {
        name: 'Industrial Barcode / RFID Handheld Scanner',
        sku: 'ELEC-SCN-008',
        category: 'Electronics',
        categoryId: catMap['ELEC']._id.toString(),
        unit: 'units',
        unitOfMeasure: 'units',
        costPrice: 14500.00,
        sellingPrice: 22000.00,
        reorderPoint: 8,
        reorderLevel: 8,
        maxStock: 60,
        reorderQty: 20,
        warehouseId: whMap['WH-001']._id,
        warehouseName: whMap['WH-001'].name,
        locationId: locMap['LOC-003']._id,
        locationName: locMap['LOC-003'].name,
        description: 'Android 13 IP67 rugged mobile computer with Long-Range 2D Imager & Wi-Fi 6.',
        active: true
      }
    ];

    const products = await Product.insertMany(productData);
    const prodMap = {};
    products.forEach(p => {
      prodMap[p.sku] = p;
    });

    // 6. Seed Opening Stock Quants & Double-Entry Audit Ledgers
    console.log('📊 Seeding Quants & Financial Ledgers...');
    const quantRecords = [];
    const ledgerRecords = [];

    const stockLevels = [
      { product: prodMap['STL-001'], qty: 250, loc: locMap['LOC-001'] },
      { product: prodMap['FURN-CHR-002'], qty: 12, loc: locMap['LOC-002'] },
      { product: prodMap['DESK-001'], qty: 50, loc: locMap['LOC-002'] },
      { product: prodMap['ALU-EXT-005'], qty: 480, loc: locMap['LOC-006'] },
      { product: prodMap['VALV-HYD-006'], qty: 18, loc: locMap['LOC-006'] },
      { product: prodMap['PKG-BOX-007'], qty: 1250, loc: locMap['LOC-001'] },
      { product: prodMap['ELEC-SCN-008'], qty: 28, loc: locMap['LOC-003'] }
    ];

    for (const item of stockLevels) {
      quantRecords.push({
        warehouseId: item.loc.warehouseId,
        locationId: item.loc._id,
        productId: item.product._id,
        quantity: mongoose.Types.Decimal128.fromString(item.qty.toString())
      });

      ledgerRecords.push({
        documentId: new mongoose.Types.ObjectId(),
        type: 'adjustment',
        warehouseId: item.loc.warehouseId,
        locationId: item.loc._id,
        productId: item.product._id,
        quantityDelta: mongoose.Types.Decimal128.fromString(item.qty.toString()),
        balanceAfter: mongoose.Types.Decimal128.fromString(item.qty.toString()),
        reasonCode: 'found',
        user: adminUser._id,
        timestamp: new Date('2026-09-25T10:00:00Z')
      });
    }

    await Quant.insertMany(quantRecords);
    await Ledger.insertMany(ledgerRecords);

    // 7. Seed Inbound Receipts (Done & Ready)
    console.log('📥 Seeding Inbound Receipts...');
    const receiptData = [
      {
        warehouseId: whMap['WH-001']._id,
        locationId: locMap['LOC-001']._id,
        supplier: 'Azure Interior & Metal Works',
        status: 'done',
        lines: [
          {
            productId: prodMap['STL-001']._id,
            quantity: mongoose.Types.Decimal128.fromString('50')
          }
        ],
        createdBy: adminUser._id
      },
      {
        warehouseId: whMap['WH-001']._id,
        locationId: locMap['LOC-001']._id,
        supplier: 'Apex Heavy Metallics Ltd',
        status: 'ready',
        lines: [
          {
            productId: prodMap['STL-001']._id,
            quantity: mongoose.Types.Decimal128.fromString('100')
          },
          {
            productId: prodMap['PKG-BOX-007']._id,
            quantity: mongoose.Types.Decimal128.fromString('300')
          }
        ],
        createdBy: adminUser._id
      }
    ];

    const receipts = await Receipt.insertMany(receiptData);

    // 8. Seed Outbound Deliveries (Done)
    console.log('🚚 Seeding Outbound Deliveries...');
    const deliveryData = [
      {
        warehouseId: whMap['WH-001']._id,
        locationId: locMap['LOC-001']._id,
        customer: 'Skyline Infrastructure Pvt Ltd',
        status: 'done',
        lines: [
          {
            productId: prodMap['STL-001']._id,
            quantity: mongoose.Types.Decimal128.fromString('20')
          }
        ],
        createdBy: adminUser._id
      }
    ];

    const deliveries = await Delivery.insertMany(deliveryData);

    // 9. Seed Internal Transfers (Done)
    console.log('🔄 Seeding Internal Transfers...');
    const transferData = [
      {
        sourceWarehouseId: whMap['WH-001']._id,
        sourceLocationId: locMap['LOC-001']._id,
        destWarehouseId: whMap['WH-002']._id,
        destLocationId: locMap['LOC-006']._id,
        status: 'done',
        lines: [
          {
            productId: prodMap['STL-001']._id,
            quantity: mongoose.Types.Decimal128.fromString('100')
          }
        ],
        createdBy: staffUser._id
      }
    ];

    const transfers = await Transfer.insertMany(transferData);

    // 10. Seed Adjustments
    console.log('⚖️  Seeding Stock Adjustments...');
    const adjustmentData = [
      {
        productId: prodMap['STL-001']._id,
        warehouseId: whMap['WH-001']._id,
        locationId: locMap['LOC-001']._id,
        countedQuantity: mongoose.Types.Decimal128.fromString('97'),
        reasonCode: 'damage',
        status: 'done',
        createdBy: adminUser._id
      }
    ];

    const adjustments = await Adjustment.insertMany(adjustmentData);

    // Save JSON snapshot for local inspection
    const dumpDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dumpDir)) {
      fs.mkdirSync(dumpDir, { recursive: true });
    }
    const snapshot = {
      timestamp: new Date().toISOString(),
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      counts: {
        warehouses: warehouses.length,
        locations: locations.length,
        users: users.length,
        categories: categories.length,
        products: products.length,
        quants: quantRecords.length,
        ledgers: ledgerRecords.length,
        receipts: receipts.length,
        deliveries: deliveries.length,
        transfers: transfers.length,
        adjustments: adjustments.length
      },
      categories: categories.map(c => ({ id: c._id, name: c.name, code: c.code })),
      products: products.map(p => ({ id: p._id, sku: p.sku, name: p.name, category: p.category, stockUnit: p.unit })),
      users: users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role, loginId: u.loginId }))
    };
    fs.writeFileSync(path.join(dumpDir, 'seed_data_snapshot.json'), JSON.stringify(snapshot, null, 2));

    console.log('\n============================================================');
    console.log('🎉 ALL DUMMY DATA SEEDED ACCURATELY TO MONGODB ATLAS!');
    console.log('============================================================');
    console.log(`📦 Categories Seeded (${categories.length}):`, categories.map(c => c.name).join(', '));
    console.log(`🏷️  Products Seeded (${products.length}):`, products.map(p => `${p.sku} (${p.category})`).join(', '));
    console.log(`🏢 Warehouses Seeded: ${warehouses.length}`);
    console.log(`📍 Storage Locations: ${locations.length}`);
    console.log(`👤 Users & Staff: ${users.length}`);
    console.log(`📊 Stock Quants: ${quantRecords.length}`);
    console.log(`📜 Ledger Entries: ${ledgerRecords.length}`);
    console.log(`📥 Receipts: ${receipts.length}`);
    console.log(`🚚 Deliveries: ${deliveries.length}`);
    console.log(`🔄 Transfers: ${transfers.length}`);
    console.log(`⚖️  Adjustments: ${adjustments.length}`);
    console.log('============================================================\n');

    await mongoose.disconnect();
    console.log('🔌 Disconnected cleanly from MongoDB Atlas.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

seedDatabase();
