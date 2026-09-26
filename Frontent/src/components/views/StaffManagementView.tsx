import React, { useState, useMemo } from 'react';
import { useStockSense } from '../../context/StockSenseContext';
import { StaffMember } from '../../types';
import { CustomSelect } from '../common/CustomSelect';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Building2,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Shield,
  UserCheck,
  IdCard,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  Download,
  Check,
  X,
  Calendar,
  Activity,
  MapPin,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  Lock,
  EyeOff,
  KeyRound
} from 'lucide-react';

const getInitials = (name: string): string => {
  if (!name) return 'OP';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarGradient = (name: string): string => {
  const gradients = [
    'from-blue-600 to-indigo-700 text-white',
    'from-indigo-600 to-purple-700 text-white',
    'from-sky-500 to-blue-700 text-white',
    'from-emerald-600 to-teal-700 text-white',
    'from-violet-600 to-fuchsia-700 text-white',
    'from-amber-500 to-orange-600 text-white',
    'from-rose-500 to-pink-700 text-white'
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = (name || '').charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

export const StaffManagementView: React.FC = () => {
  const {
    staffMembers,
    warehouses,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    showToast,
    currentUser
  } = useStockSense();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedShift, setSelectedShift] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    loginId: '',
    email: '',
    phone: '',
    password: 'Operator@123',
    role: 'Warehouse Staff',
    warehouseId: 'WH-001',
    department: 'Floor Operations & Logistics',
    shift: 'Morning Shift (06:00 - 14:00)',
    status: 'Active' as 'Active' | 'On Leave' | 'Inactive'
  });

  const resetForm = () => {
    setFormData({
      fullName: '',
      loginId: '',
      email: '',
      phone: '',
      password: 'Operator@123',
      role: 'Warehouse Staff',
      warehouseId: warehouses[0]?.id || 'WH-001',
      department: 'Floor Operations & Logistics',
      shift: 'Morning Shift (06:00 - 14:00)',
      status: 'Active'
    });
    setEditingStaff(null);
    setShowModalPassword(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({
      fullName: staff.fullName,
      loginId: staff.loginId,
      email: staff.email,
      phone: staff.phone,
      password: '',
      role: staff.role,
      warehouseId: staff.warehouseId,
      department: staff.department,
      shift: staff.shift,
      status: staff.status
    });
    setShowModalPassword(false);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      showToast('Please provide full name and corporate email.', 'warning');
      return;
    }

    if (!editingStaff && (!formData.password || formData.password.length < 6)) {
      showToast('Login password must be at least 6 characters long.', 'warning');
      return;
    }

    if (editingStaff && formData.password && formData.password.length < 6) {
      showToast('New password must be at least 6 characters long.', 'warning');
      return;
    }

    const matchedWh = warehouses.find(w => w.id === formData.warehouseId) || warehouses[0];

    if (editingStaff) {
      await updateStaffMember(editingStaff.id, {
        ...formData,
        warehouseName: matchedWh?.name || 'Main Distribution Warehouse'
      });
    } else {
      await addStaffMember({
        ...formData,
        warehouseName: matchedWh?.name || 'Main Distribution Warehouse'
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleDeleteStaff = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove staff member "${name}" from the active roster?`)) {
      await deleteStaffMember(id);
    }
  };

  const handleToggleStatus = async (staff: StaffMember) => {
    const nextStatus: 'Active' | 'On Leave' | 'Inactive' =
      staff.status === 'Active' ? 'On Leave' : 'Active';
    await updateStaffMember(staff.id, { status: nextStatus });
  };

  // Select options for filters
  const warehouseFilterOptions = useMemo(() => [
    { value: 'ALL', label: 'All Warehouses' },
    ...warehouses.map(w => ({
      value: w.id,
      label: `${w.shortName || w.name} (${w.city})`
    }))
  ], [warehouses]);

  const roleFilterOptions = [
    { value: 'ALL', label: 'All Roles' },
    { value: 'Warehouse Staff', label: 'Warehouse Staff' },
    { value: 'Forklift & Dock Operator', label: 'Forklift & Dock Operator' },
    { value: 'Inventory Auditor', label: 'Inventory Auditor' },
    { value: 'Shelf Stacker', label: 'Shelf Stacker' }
  ];

  const shiftFilterOptions = [
    { value: 'ALL', label: 'All Shifts' },
    { value: 'Morning', label: 'Morning Shift (06:00 - 14:00)' },
    { value: 'General', label: 'General Shift (09:00 - 18:00)' },
    { value: 'Night', label: 'Night Shift (22:00 - 06:00)' }
  ];

  const statusFilterOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'Active', label: 'Active', badge: 'Active', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { value: 'On Leave', label: 'On Leave', badge: 'On Leave', badgeColor: 'bg-amber-100 text-amber-800' },
    { value: 'Inactive', label: 'Inactive', badge: 'Inactive', badgeColor: 'bg-slate-100 text-slate-700' }
  ];

  // Select options for modal form
  const modalRoleOptions = [
    { value: 'Warehouse Staff', label: 'Warehouse Staff' },
    { value: 'Forklift & Dock Operator', label: 'Forklift & Dock Operator' },
    { value: 'Inventory Auditor', label: 'Inventory Auditor' },
    { value: 'Shelf Stacker', label: 'Shelf Stacker' }
  ];

  const modalWarehouseOptions = useMemo(() => warehouses.map(w => ({
    value: w.id,
    label: `${w.name} (${w.city})`,
    subLabel: `Code: ${w.shortName || w.code || w.id}`
  })), [warehouses]);

  const modalShiftOptions = [
    { value: 'Morning Shift (06:00 - 14:00)', label: 'Morning Shift (06:00 - 14:00)' },
    { value: 'General Shift (09:00 - 18:00)', label: 'General Shift (09:00 - 18:00)' },
    { value: 'Night Shift (22:00 - 06:00)', label: 'Night Shift (22:00 - 06:00)' }
  ];

  const modalStatusOptions = [
    { value: 'Active', label: 'Active', badge: 'Active', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { value: 'On Leave', label: 'On Leave', badge: 'On Leave', badgeColor: 'bg-amber-100 text-amber-800' },
    { value: 'Inactive', label: 'Inactive', badge: 'Inactive', badgeColor: 'bg-slate-100 text-slate-700' }
  ];

  // Base staff members belonging to this specific manager (strictly excluding managers and other managers' staff)
  const myStaffMembers = useMemo(() => {
    return (staffMembers || []).filter(staff => {
      // Never show any manager or admin accounts in Staff Management
      const roleLower = (staff.role || '').toLowerCase();
      if (roleLower.includes('manager') || roleLower.includes('admin')) {
        return false;
      }

      // If user is a manager, only show staff created by this manager (or unassigned/global seed staff)
      if (currentUser) {
        const currentUserId = currentUser.id || (currentUser as any)._id;
        const currentLoginId = currentUser.loginId;
        const currentEmail = currentUser.email;

        if (staff.createdBy) {
          const matchesCreator =
            staff.createdBy === currentUserId ||
            staff.createdBy === currentLoginId ||
            staff.createdBy === currentEmail;
          if (!matchesCreator) {
            return false;
          }
        }
      }

      return true;
    });
  }, [staffMembers, currentUser]);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return myStaffMembers.filter(staff => {
      const matchesSearch =
        staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesWh = selectedWarehouse === 'ALL' || staff.warehouseId === selectedWarehouse;
      const matchesRole = selectedRole === 'ALL' || staff.role === selectedRole;
      const matchesShift = selectedShift === 'ALL' || staff.shift.includes(selectedShift);
      const matchesStatus = selectedStatus === 'ALL' || staff.status === selectedStatus;

      return matchesSearch && matchesWh && matchesRole && matchesShift && matchesStatus;
    });
  }, [myStaffMembers, searchTerm, selectedWarehouse, selectedRole, selectedShift, selectedStatus]);

  // KPIs
  const totalStaff = myStaffMembers.length;
  const activeStaff = myStaffMembers.filter(s => s.status === 'Active').length;
  const onLeaveStaff = myStaffMembers.filter(s => s.status === 'On Leave').length;
  const uniqueWarehouses = new Set(myStaffMembers.map(s => s.warehouseId)).size;

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID,Full Name,Login ID,Email,Phone,Role,Warehouse,Department,Shift,Status,Joined Date'];
    const rows = filteredStaff.map(s =>
      `"${s.id}","${s.fullName}","${s.loginId}","${s.email}","${s.phone}","${s.role}","${s.warehouseName}","${s.department}","${s.shift}","${s.status}","${s.joinedDate}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `invexa_staff_roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Staff roster CSV exported successfully.', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Shield className="w-4 h-4" />
            <span>Inventory Manager • Administration & Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-blue-600" />
            Staff & Floor Operators Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Assign warehouse shifts, manage operator permissions, monitor live duty statuses, and roster floor pickers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            title="Export Roster as CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export Roster</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Operator</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Roster Staff
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">{totalStaff}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">Across all departments</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Active On-Duty
            </span>
            <span className="text-2xl font-black text-emerald-600 font-mono">{activeStaff}</span>
            <span className="block text-[10px] text-emerald-600 mt-0.5 font-semibold">
              {Math.round((activeStaff / (totalStaff || 1)) * 100)}% active duty rate
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              On Leave / Standby
            </span>
            <span className="text-2xl font-black text-amber-600 font-mono">{onLeaveStaff}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">Rotational leave schedule</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Warehouses Staffed
            </span>
            <span className="text-2xl font-black text-indigo-600 font-mono">{uniqueWarehouses}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">Distribution & transit hubs</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID, email, role, phone..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Card Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Data Table
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Warehouse filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Warehouse
            </label>
            <CustomSelect
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              options={warehouseFilterOptions}
              size="sm"
            />
          </div>

          {/* Role filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Role
            </label>
            <CustomSelect
              value={selectedRole}
              onChange={setSelectedRole}
              options={roleFilterOptions}
              size="sm"
            />
          </div>

          {/* Shift filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Shift
            </label>
            <CustomSelect
              value={selectedShift}
              onChange={setSelectedShift}
              options={shiftFilterOptions}
              size="sm"
            />
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Status
            </label>
            <CustomSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusFilterOptions}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* 4. Staff List: Grid Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map(staff => (
            <div
              key={staff.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top User Info & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                          staff.fullName
                        )} flex items-center justify-center font-extrabold text-sm tracking-wide shadow-2xs ring-2 ring-slate-100 select-none`}
                      >
                        {getInitials(staff.fullName)}
                      </div>
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          staff.status === 'Active'
                            ? 'bg-emerald-500'
                            : staff.status === 'On Leave'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                        title={`Status: ${staff.status}`}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {staff.fullName}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400 block font-medium">
                        @{staff.loginId}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      staff.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : staff.status === 'On Leave'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {staff.status}
                  </span>
                </div>

                {/* Role & Warehouse Badge */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{staff.role}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{staff.warehouseName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{staff.shift}</span>
                  </div>
                </div>

                {/* Contact Info Pills */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1 text-xs">
                  <a
                    href={`mailto:${staff.email}`}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-[11px] font-mono">{staff.email}</span>
                  </a>

                  <a
                    href={`tel:${staff.phone}`}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors truncate"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-[11px] font-mono">{staff.phone}</span>
                  </a>
                </div>

                {/* Floor Task Stats */}
                <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Active Tasks
                    </span>
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      {staff.assignedTasks || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Completed
                    </span>
                    <span className="text-xs font-bold text-emerald-600 font-mono">
                      {staff.completedTasks || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setViewingStaff(staff)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(staff)}
                    className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                    title="Toggle Active / Leave status"
                  >
                    {staff.status === 'Active' ? 'Mark Leave' : 'Set Active'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(staff)}
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors cursor-pointer"
                    title="Edit Staff Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteStaff(staff.id, staff.fullName)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors cursor-pointer"
                    title="Remove Operator"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Staff List: Table Mode */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Operator / Staff</th>
                  <th className="py-3 px-4">Role & Department</th>
                  <th className="py-3 px-4">Assigned Warehouse</th>
                  <th className="py-3 px-4">Shift Schedule</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map(staff => (
                  <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarGradient(
                            staff.fullName
                          )} flex items-center justify-center font-bold text-xs shadow-2xs ring-1 ring-slate-200 shrink-0 select-none`}
                        >
                          {getInitials(staff.fullName)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{staff.fullName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">@{staff.loginId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{staff.role}</span>
                      <span className="text-[10px] text-slate-400 block">{staff.department}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800">{staff.warehouseName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-600 text-[11px]">{staff.shift}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div>{staff.email}</div>
                      <div className="text-slate-400">{staff.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                          staff.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : staff.status === 'On Leave'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {staff.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingStaff(staff)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(staff)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staff.id, staff.fullName)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredStaff.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No staff members match criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting search keywords, warehouse filters, or add a new warehouse operator to the roster.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer"
          >
            + Add Staff Operator
          </button>
        </div>
      )}

      {/* MODAL: ADD / EDIT OPERATOR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  {editingStaff ? <Edit2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingStaff ? 'Edit Staff Profile' : 'Add New Warehouse Operator'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Assign role, warehouse location, shift schedule and login credentials
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Login ID / Username
                  </label>
                  <input
                    type="text"
                    value={formData.loginId}
                    onChange={e => setFormData({ ...formData, loginId: e.target.value })}
                    placeholder="e.g. priya.operator"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Corporate Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="priya@invexa.io"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98250 11223"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Role
                  </label>
                  <CustomSelect
                    value={formData.role}
                    onChange={val => setFormData({ ...formData, role: val })}
                    options={modalRoleOptions}
                    size="md"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Assigned Warehouse
                  </label>
                  <CustomSelect
                    value={formData.warehouseId}
                    onChange={val => setFormData({ ...formData, warehouseId: val })}
                    options={modalWarehouseOptions}
                    size="md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Shift Assignment
                  </label>
                  <CustomSelect
                    value={formData.shift}
                    onChange={val => setFormData({ ...formData, shift: val })}
                    options={modalShiftOptions}
                    size="md"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <CustomSelect
                    value={formData.status}
                    onChange={val => setFormData({ ...formData, status: val as any })}
                    options={modalStatusOptions}
                    size="md"
                  />
                </div>
              </div>

              {/* Login Password for website login */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    {editingStaff ? 'Login Password (leave blank to keep current)' : 'Login Password'}{' '}
                    {!editingStaff && <span className="text-rose-500">*</span>}
                  </label>
                  {!editingStaff && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, password: 'Operator@123' })}
                      className="text-[10.5px] text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>Use Default (Operator@123)</span>
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showModalPassword ? 'text' : 'password'}
                    required={!editingStaff}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingStaff ? 'Enter new password to reset' : 'Min 6 characters (e.g. Operator@123)'}
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPassword(!showModalPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
                    title={showModalPassword ? 'Hide password' : 'Show password'}
                  >
                    {showModalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  Operator will use their Login ID (<strong className="font-mono text-slate-600">{formData.loginId || formData.email?.split('@')[0] || 'login ID'}</strong>) or email with this password to log in.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  {editingStaff ? 'Save Changes' : 'Add Operator to Roster'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW STAFF PROFILE DETAILS */}
      {viewingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Operator Telemetry Dossier
              </span>
              <button
                onClick={() => setViewingStaff(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                    viewingStaff.fullName
                  )} flex items-center justify-center font-extrabold text-xl shadow-md ring-2 ring-blue-100 select-none`}
                >
                  {getInitials(viewingStaff.fullName)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{viewingStaff.fullName}</h3>
                  <span className="text-xs font-mono text-blue-600 font-bold block">
                    @{viewingStaff.loginId}
                  </span>
                  <span className="text-xs text-slate-500 block">{viewingStaff.role}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Warehouse:</span>
                  <span className="font-bold text-slate-800">{viewingStaff.warehouseName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Department:</span>
                  <span className="font-medium text-slate-800">{viewingStaff.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Shift:</span>
                  <span className="font-medium text-slate-800">{viewingStaff.shift}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Status:</span>
                  <span className="font-bold text-emerald-600">{viewingStaff.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Joined:</span>
                  <span className="font-medium text-slate-800">{viewingStaff.joinedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Last Active:</span>
                  <span className="font-mono text-slate-600">{viewingStaff.lastActive || 'Today'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${viewingStaff.email}`}
                  className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
                <a
                  href={`tel:${viewingStaff.phone}`}
                  className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Operator</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
