const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Warehouse = require('../models/Warehouse');
const { requireAuth, requireRole } = require('../middleware/auth');
const { hashPassword } = require('../services/passwordUtils');

const router = express.Router();

/**
 * Helper to look up a staff user by ObjectId, loginId, or email
 */
async function findStaffByIdOrIdentifier(id, body = {}) {
  const idStr = (id || '').trim();
  if (idStr && mongoose.Types.ObjectId.isValid(idStr)) {
    const u = await User.findById(idStr);
    if (u) return u;
  }

  const cleanEmail = body.email ? body.email.toLowerCase().trim() : '';
  const cleanLoginId = body.loginId ? body.loginId.trim() : '';

  const conditions = [];
  if (idStr) {
    conditions.push({ loginId: idStr });
    conditions.push({ email: idStr.toLowerCase() });
  }
  if (cleanEmail) {
    conditions.push({ email: cleanEmail });
  }
  if (cleanLoginId) {
    conditions.push({ loginId: cleanLoginId });
  }

  if (conditions.length === 0) return null;
  return User.findOne({ $or: conditions });
}

/**
 * Helper to format user doc into StaffMember shape
 */
function formatStaffMember(u, warehouseMap = new Map()) {
  const wh = u.warehouseId ? warehouseMap.get(u.warehouseId.toString()) : null;
  const whName = u.warehouseName || (wh ? wh.name : (u.warehouse || 'Main Distribution Warehouse'));
  const idStr = u._id.toString();

  return {
    id: idStr,
    _id: idStr,
    loginId: u.loginId || u.email.split('@')[0],
    fullName: u.fullName || u.name || 'Warehouse Staff',
    name: u.name || u.fullName || 'Warehouse Staff',
    email: u.email,
    phone: u.phone || '+91 98765 00000',
    role: u.role === 'manager' ? 'Inventory Manager' : (u.role === 'staff' ? 'Warehouse Staff' : u.role),
    warehouseId: u.warehouseId ? u.warehouseId.toString() : (wh ? wh._id.toString() : 'WH-001'),
    warehouseName: whName,
    department: u.department || 'Floor Operations & Logistics',
    shift: u.shift || 'Morning Shift (06:00 - 14:00)',
    status: u.status || (u.active ? 'Active' : 'Inactive'),
    avatar: u.avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.abs(idStr.charCodeAt(0) * 10000000)}?w=150&auto=format&fit=crop&q=80`,
    joinedDate: u.joinedDate || (u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'September 2026'),
    lastActive: u.lastActive || 'Active now',
    assignedTasks: u.assignedTasks || 0,
    completedTasks: u.completedTasks || 0,
    active: u.active !== false,
    createdBy: u.createdBy ? u.createdBy.toString() : null,
  };
}

/**
 * GET /api/staff
 * Lists staff operators added by the requesting manager. Does not return managers.
 */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { search, warehouseId, role, shift, status, active } = req.query;
    const conditions = [];

    // Strictly exclude any manager or admin accounts
    conditions.push({
      role: { $nin: ['manager', 'admin', 'inventory manager'] },
    });

    // Only show staff added by this particular manager (or global/unassigned seed staff)
    if (req.user && req.user._id) {
      conditions.push({
        $or: [
          { createdBy: req.user._id },
          { createdBy: null },
          { createdBy: { $exists: false } },
        ],
      });
    }

    if (active === 'true') {
      conditions.push({ active: true });
    } else if (active === 'false') {
      conditions.push({ active: false });
    }

    if (status && status !== 'ALL') {
      conditions.push({ status });
    }

    if (shift && shift !== 'ALL') {
      conditions.push({ shift });
    }

    if (role && role !== 'ALL') {
      conditions.push({
        $or: [
          { role },
          { role: role.toLowerCase() },
        ],
      });
    }

    if (warehouseId && warehouseId !== 'ALL') {
      if (mongoose.Types.ObjectId.isValid(warehouseId)) {
        conditions.push({
          $or: [
            { warehouseId: new mongoose.Types.ObjectId(warehouseId) },
            { assignedWarehouses: new mongoose.Types.ObjectId(warehouseId) },
          ],
        });
      }
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      conditions.push({
        $or: [
          { name: searchRegex },
          { fullName: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
          { loginId: searchRegex },
          { department: searchRegex },
        ],
      });
    }

    const finalFilter = conditions.length > 0 ? { $and: conditions } : {};

    const [users, warehouses] = await Promise.all([
      User.find(finalFilter).sort({ createdAt: -1 }).lean(),
      Warehouse.find({}).lean(),
    ]);

    const whMap = new Map();
    warehouses.forEach((w) => whMap.set(w._id.toString(), w));

    const staffList = users.map((u) => formatStaffMember(u, whMap));

    return res.json({
      data: staffList,
      count: staffList.length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/staff/:id
 */
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await findStaffByIdOrIdentifier(id);
    if (!user) {
      return res.status(404).json({
        error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found.' },
      });
    }

    const warehouses = await Warehouse.find({}).lean();
    const whMap = new Map();
    warehouses.forEach((w) => whMap.set(w._id.toString(), w));

    const userObj = user.toObject ? user.toObject() : user;
    return res.json({
      data: formatStaffMember(userObj, whMap),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/staff
 * Manager / Admin creates a new staff operator.
 */
router.post('/', requireAuth, requireRole('manager'), async (req, res, next) => {
  try {
    const {
      fullName,
      name,
      email,
      phone,
      role = 'staff',
      warehouseId,
      warehouseName,
      department,
      shift,
      status = 'Active',
      password,
      avatar,
      loginId,
    } = req.body;

    const displayName = (fullName || name || '').trim();
    if (!displayName || !email) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Full name and email are required.',
        },
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({
        error: {
          code: 'DUPLICATE_EMAIL',
          message: `User with email '${cleanEmail}' already exists.`,
        },
      });
    }

    const rawPassword = password || 'Invexa@2026';
    const passwordHash = await hashPassword(rawPassword);

    let whObjId = null;
    let resolvedWhName = warehouseName || '';
    if (warehouseId && mongoose.Types.ObjectId.isValid(warehouseId)) {
      whObjId = new mongoose.Types.ObjectId(warehouseId);
      const wh = await Warehouse.findById(whObjId).lean();
      if (wh) resolvedWhName = wh.name;
    }

    const user = await User.create({
      name: displayName,
      fullName: displayName,
      email: cleanEmail,
      loginId: loginId || cleanEmail.split('@')[0],
      passwordHash,
      role: 'staff',
      phone: phone || '',
      department: department || 'Floor Operations & Logistics',
      shift: shift || 'Morning Shift (06:00 - 14:00)',
      status: status || 'Active',
      avatar: avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000000)}?w=150&auto=format&fit=crop&q=80`,
      warehouse: resolvedWhName,
      warehouseName: resolvedWhName,
      warehouseId: whObjId,
      assignedWarehouses: whObjId ? [whObjId] : [],
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      lastActive: 'Just registered',
      assignedTasks: 0,
      completedTasks: 0,
      active: status !== 'Inactive',
      createdBy: req.user?._id || null,
    });

    return res.status(201).json({
      message: 'Staff operator created successfully.',
      data: formatStaffMember(user.toObject()),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/staff/:id and PATCH /api/staff/:id
 * Manager / Admin updates staff operator.
 */
const updateStaffHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await findStaffByIdOrIdentifier(id, req.body);
    if (!user) {
      return res.status(404).json({
        error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found.' },
      });
    }

    const {
      fullName,
      name,
      email,
      phone,
      role,
      warehouseId,
      warehouseName,
      department,
      shift,
      status,
      avatar,
      active,
      assignedTasks,
      completedTasks,
      password,
      loginId,
    } = req.body;

    if (fullName !== undefined) {
      user.fullName = fullName.trim();
      user.name = fullName.trim();
    } else if (name !== undefined) {
      user.name = name.trim();
      user.fullName = name.trim();
    }

    if (loginId !== undefined && loginId.trim()) {
      user.loginId = loginId.trim();
    }

    if (email !== undefined) {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail !== user.email) {
        const existing = await User.findOne({ email: cleanEmail, _id: { $ne: user._id } });
        if (existing) {
          return res.status(400).json({
            error: {
              code: 'DUPLICATE_EMAIL',
              message: `User with email '${cleanEmail}' already exists.`,
            },
          });
        }
        user.email = cleanEmail;
      }
    }

    if (phone !== undefined) user.phone = phone.trim();
    if (role !== undefined) user.role = role.toLowerCase().includes('manager') ? 'manager' : 'staff';
    if (department !== undefined) user.department = department.trim();
    if (shift !== undefined) user.shift = shift.trim();
    if (status !== undefined) {
      user.status = status;
      if (status === 'Inactive') user.active = false;
      else user.active = true;
    }
    if (avatar !== undefined) user.avatar = avatar;
    if (active !== undefined) user.active = Boolean(active);
    if (assignedTasks !== undefined) user.assignedTasks = Number(assignedTasks);
    if (completedTasks !== undefined) user.completedTasks = Number(completedTasks);
    
    // Hash password if supplied
    const pwdToUpdate = (password !== undefined && password !== null) ? String(password).trim() : '';
    if (pwdToUpdate) {
      user.passwordHash = await hashPassword(pwdToUpdate);
    }

    if (warehouseId !== undefined) {
      if (warehouseId && mongoose.Types.ObjectId.isValid(warehouseId)) {
        user.warehouseId = new mongoose.Types.ObjectId(warehouseId);
        user.assignedWarehouses = [user.warehouseId];
        const wh = await Warehouse.findById(user.warehouseId).lean();
        if (wh) {
          user.warehouseName = wh.name;
          user.warehouse = wh.name;
        }
      } else {
        user.warehouseId = null;
        user.assignedWarehouses = [];
        if (warehouseName) {
          user.warehouseName = warehouseName;
          user.warehouse = warehouseName;
        }
      }
    }

    await user.save();

    return res.json({
      message: 'Staff operator updated successfully.',
      data: formatStaffMember(user.toObject()),
    });
  } catch (err) {
    next(err);
  }
};

router.put('/:id', requireAuth, requireRole('manager'), updateStaffHandler);
router.patch('/:id', requireAuth, requireRole('manager'), updateStaffHandler);

/**
 * PATCH /api/staff/:id/toggle-status
 */
router.patch('/:id/toggle-status', requireAuth, requireRole('manager'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await findStaffByIdOrIdentifier(id);
    if (!user) {
      return res.status(404).json({
        error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found.' },
      });
    }

    const current = user.status || (user.active ? 'Active' : 'Inactive');
    const nextStatus = current === 'Active' ? 'On Leave' : (current === 'On Leave' ? 'Inactive' : 'Active');

    user.status = nextStatus;
    user.active = nextStatus !== 'Inactive';
    await user.save();

    return res.json({
      message: `Status updated to ${nextStatus}.`,
      data: formatStaffMember(user.toObject()),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/staff/:id
 */
router.delete('/:id', requireAuth, requireRole('manager'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await findStaffByIdOrIdentifier(id);
    if (!user) {
      return res.status(404).json({
        error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found.' },
      });
    }

    user.active = false;
    user.status = 'Inactive';
    await user.save();

    return res.json({
      message: 'Staff operator deactivated successfully.',
      id: user._id.toString(),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
