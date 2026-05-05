import { useState, useMemo } from 'react'
import {
  Users, Shield, UserCheck, UserX, Plus, Edit, Trash2, Search,
  Key, Settings, CheckCircle, AlertTriangle, X, Eye, Download,
  ChevronDown, ChevronUp, Mail, Phone, Calendar, Lock, Unlock,
  Activity, Heart, Dumbbell, FileText, BarChart2
} from 'lucide-react'

// 用户类型
type UserType = 'doctor' | 'technician' | 'nurse' | 'admin' | 'viewer'

// 用户状态
type UserStatus = 'active' | 'inactive' | 'locked' | 'pending'

// 角色类型
interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  createTime: string
  isSystem: boolean
}

// 用户接口
interface User {
  id: string
  username: string
  realName: string
  email: string
  phone: string
  department: string
  title: string
  type: UserType
  status: UserStatus
  roles: string[]
  lastLogin?: string
  lastActivity?: string
  createTime: string
  avatar?: string
}

// 权限定义
interface Permission {
  id: string
  name: string
  module: string
  description: string
  type: 'read' | 'write' | 'delete' | 'admin'
}

// 审计日志
interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  module: string
  target?: string
  ip: string
  timestamp: string
  status: 'success' | 'failed'
}

export default function UserRolePage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions' | 'audit'>('users')
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['modules']))

  // 权限模块定义
  const permissionModules = useMemo(() => [
    {
      id: 'ecg12',
      name: '12导联心电图',
      icon: Heart,
      permissions: [
        { id: 'ecg12_view', name: '查看列表', type: 'read' as const },
        { id: 'ecg12_detail', name: '查看详情', type: 'read' as const },
        { id: 'ecg12_report', name: '书写报告', type: 'write' as const },
        { id: 'ecg12_review', name: '审核报告', type: 'write' as const },
        { id: 'ecg12_delete', name: '删除记录', type: 'delete' as const },
        { id: 'ecg12_print', name: '打印报告', type: 'read' as const },
      ]
    },
    {
      id: 'holter',
      name: '动态心电图',
      icon: Activity,
      permissions: [
        { id: 'holter_view', name: '查看列表', type: 'read' as const },
        { id: 'holter_detail', name: '查看详情', type: 'read' as const },
        { id: 'holter_report', name: '书写报告', type: 'write' as const },
        { id: 'holter_review', name: '审核报告', type: 'write' as const },
        { id: 'holter_delete', name: '删除记录', type: 'delete' as const },
      ]
    },
    {
      id: 'exercise',
      name: '运动平板试验',
      icon: Dumbbell,
      permissions: [
        { id: 'exercise_view', name: '查看列表', type: 'read' as const },
        { id: 'exercise_detail', name: '查看详情', type: 'read' as const },
        { id: 'exercise_report', name: '书写报告', type: 'write' as const },
        { id: 'exercise_review', name: '审核报告', type: 'write' as const },
      ]
    },
    {
      id: 'critical',
      name: '危急值管理',
      icon: AlertTriangle,
      permissions: [
        { id: 'critical_view', name: '查看列表', type: 'read' as const },
        { id: 'critical_notify', name: '发送通知', type: 'write' as const },
        { id: 'critical_handle', name: '处理记录', type: 'write' as const },
        { id: 'critical_config', name: '配置规则', type: 'admin' as const },
      ]
    },
    {
      id: 'device',
      name: '设备管理',
      icon: Settings,
      permissions: [
        { id: 'device_view', name: '查看列表', type: 'read' as const },
        { id: 'device_add', name: '添加设备', type: 'write' as const },
        { id: 'device_edit', name: '编辑设备', type: 'write' as const },
        { id: 'device_delete', name: '删除设备', type: 'delete' as const },
        { id: 'device_maintenance', name: '维护记录', type: 'write' as const },
      ]
    },
    {
      id: 'system',
      name: '系统管理',
      icon: Shield,
      permissions: [
        { id: 'system_user', name: '用户管理', type: 'admin' as const },
        { id: 'system_role', name: '角色管理', type: 'admin' as const },
        { id: 'system_permission', name: '权限管理', type: 'admin' as const },
        { id: 'system_config', name: '系统配置', type: 'admin' as const },
        { id: 'system_audit', name: '审计日志', type: 'admin' as const },
        { id: 'system_backup', name: '数据备份', type: 'admin' as const },
      ]
    },
  ], [])

  // 角色数据
  const roles = useMemo<Role[]>(() => [
    {
      id: 'ROLE001',
      name: '心电图医师',
      description: '具有12导联、动态心电、运动平板的诊断权限',
      permissions: ['ecg12_view', 'ecg12_detail', 'ecg12_report', 'ecg12_review', 'ecg12_print', 'holter_view', 'holter_detail', 'holter_report', 'holter_review', 'exercise_view', 'exercise_detail', 'exercise_report', 'exercise_review', 'critical_view', 'critical_notify', 'critical_handle'],
      userCount: 12,
      createTime: '2022-01-01',
      isSystem: true,
    },
    {
      id: 'ROLE002',
      name: '心电图技师',
      description: '具有心电图采集和初步报告权限',
      permissions: ['ecg12_view', 'ecg12_detail', 'ecg12_report', 'ecg12_print', 'holter_view', 'holter_detail', 'holter_report', 'exercise_view', 'exercise_detail', 'exercise_report'],
      userCount: 8,
      createTime: '2022-01-01',
      isSystem: true,
    },
    {
      id: 'ROLE003',
      name: '临床医生',
      description: '本科室患者心电图查看权限',
      permissions: ['ecg12_view', 'ecg12_detail', 'ecg12_print', 'holter_view', 'holter_detail', 'exercise_view', 'exercise_detail'],
      userCount: 156,
      createTime: '2022-01-01',
      isSystem: true,
    },
    {
      id: 'ROLE004',
      name: '护理人员',
      description: '心电图检查预约和结果查看',
      permissions: ['ecg12_view', 'ecg12_detail', 'ecg12_print'],
      userCount: 45,
      createTime: '2022-06-15',
      isSystem: false,
    },
    {
      id: 'ROLE005',
      name: '科室主任',
      description: '科室数据统计和分析报表权限',
      permissions: ['ecg12_view', 'ecg12_detail', 'holter_view', 'holter_detail', 'exercise_view', 'exercise_detail', 'critical_view', 'device_view', 'BarChart2'],
      userCount: 5,
      createTime: '2022-09-01',
      isSystem: false,
    },
    {
      id: 'ROLE006',
      name: '系统管理员',
      description: '系统全部管理权限',
      permissions: ['system_user', 'system_role', 'system_permission', 'system_config', 'system_audit', 'system_backup', 'device_add', 'device_edit', 'device_delete', 'device_maintenance', 'critical_config'],
      userCount: 3,
      createTime: '2022-01-01',
      isSystem: true,
    },
    {
      id: 'ROLE007',
      name: '区域协作医院',
      description: '区域心电会诊和协作权限',
      permissions: ['ecg12_view', 'ecg12_detail', 'holter_view', 'holter_detail'],
      userCount: 28,
      createTime: '2023-03-01',
      isSystem: false,
    },
  ], [])

  // 用户数据
  const users = useMemo<User[]>(() => [
    { id: 'U001', username: 'gaofeng', realName: '高峰', email: 'gaofeng@hospital.com', phone: '13800001001', department: '心电图室', title: '主任医师', type: 'doctor', status: 'active', roles: ['心电图医师', '科室主任'], lastLogin: '2025-05-02 08:30', createTime: '2022-01-15' },
    { id: 'U002', username: 'linzj', realName: '林志杰', email: 'linzj@hospital.com', phone: '13800001002', department: '心电图室', title: '副主任医师', type: 'doctor', status: 'active', roles: ['心电图医师'], lastLogin: '2025-05-02 09:15', createTime: '2022-03-20' },
    { id: 'U003', username: 'sunzg', realName: '孙志国', email: 'sunzg@hospital.com', phone: '13800001003', department: '心内科', title: '主治医师', type: 'doctor', status: 'active', roles: ['临床医生'], lastLogin: '2025-05-01 14:22', createTime: '2022-06-10' },
    { id: 'U004', username: 'zhangzw', realName: '张志伟', email: 'zhangzw@hospital.com', phone: '13800001004', department: '心电图室', title: '主管技师', type: 'technician', status: 'active', roles: ['心电图技师'], lastLogin: '2025-05-02 07:45', createTime: '2022-02-28' },
    { id: 'U005', username: 'liuxy', realName: '刘秀英', email: 'liuxy@hospital.com', phone: '13800001005', department: '心电图室', title: '技师', type: 'technician', status: 'active', roles: ['心电图技师'], lastLogin: '2025-05-02 08:00', createTime: '2023-01-05' },
    { id: 'U006', username: 'mayzl', realName: '马志伟', email: 'mayzl@hospital.com', phone: '13800001006', department: '老年病科', title: '副主任医师', type: 'doctor', status: 'active', roles: ['临床医生'], lastLogin: '2025-04-30 16:30', createTime: '2022-08-15' },
    { id: 'U007', username: 'caoxm', realName: '曹雪梅', email: 'caoxm@hospital.com', phone: '13800001007', department: '神经内科', title: '主治医师', type: 'doctor', status: 'active', roles: ['临床医生'], lastLogin: '2025-05-01 10:00', createTime: '2022-11-20' },
    { id: 'U008', username: 'zhengxh', realName: '郑晓华', email: 'zhengxh@hospital.com', phone: '13800001008', department: '心电图室', title: '技师', type: 'technician', status: 'active', roles: ['心电图技师'], lastLogin: '2025-05-02 08:10', createTime: '2023-04-12' },
    { id: 'U009', username: 'guoxh', realName: '郭晓华', email: 'guoxh@hospital.com', phone: '13800001009', department: '心电图室', title: '技师', type: 'technician', status: 'inactive', roles: ['心电图技师'], lastLogin: '2025-03-15 11:20', createTime: '2022-05-08' },
    { id: 'U010', username: 'maxl', realName: '马晓丽', email: 'maxl@hospital.com', phone: '13800001010', department: '心电图室', title: '技师', type: 'technician', status: 'locked', roles: ['心电图技师'], lastLogin: '2025-04-28 09:00', createTime: '2022-07-22' },
    { id: 'U011', username: 'liujg', realName: '刘建国', email: 'liujg@hospital.com', phone: '13800001011', department: '耳鼻喉科', title: '主任医师', type: 'doctor', status: 'active', roles: ['临床医生'], lastLogin: '2025-05-01 15:45', createTime: '2022-09-30' },
    { id: 'U012', username: 'sysadmin', realName: '系统管理员', email: 'sysadmin@hospital.com', phone: '13800001012', department: '信息中心', title: '系统管理员', type: 'admin', status: 'active', roles: ['系统管理员'], lastLogin: '2025-05-02 06:00', createTime: '2022-01-01' },
    { id: 'U013', username: 'chenlh', realName: '陈丽华', email: 'chenlh@hospital.com', phone: '13800001013', department: '心电图室', title: '技师', type: 'technician', status: 'active', roles: ['心电图技师'], lastLogin: '2025-05-02 07:55', createTime: '2024-02-01' },
    { id: 'U014', username: 'wangd', realName: '王医生', email: 'wangd@hospital.com', phone: '13800001014', department: '急诊科', title: '主治医师', type: 'doctor', status: 'pending', roles: ['临床医生'], lastLogin: '-', createTime: '2025-04-28' },
    { id: 'U015', username: 'liuxf', realName: '刘晓芳', email: 'liuxf@hospital.com', phone: '13800001015', department: '保健科', title: '主任医师', type: 'doctor', status: 'active', roles: ['临床医生'], lastLogin: '2025-05-01 11:30', createTime: '2022-10-15' },
  ], [])

  // 审计日志
  const auditLogs = useMemo<AuditLog[]>(() => [
    { id: 'AUD001', userId: 'U001', userName: '高峰', action: '审核报告', module: '12导联心电图', target: 'EG20240502001', ip: '192.168.1.101', timestamp: '2025-05-02 10:30:15', status: 'success' },
    { id: 'AUD002', userId: 'U004', userName: '张志伟', action: '书写报告', module: '12导联心电图', target: 'EG20240502002', ip: '192.168.1.104', timestamp: '2025-05-02 10:15:42', status: 'success' },
    { id: 'AUD003', userId: 'U012', userName: '系统管理员', action: '修改用户', module: '系统管理', target: 'U010', ip: '192.168.10.50', timestamp: '2025-05-02 09:00:00', status: 'success' },
    { id: 'AUD004', userId: 'U006', userName: '马志伟', action: '查看报告', module: '12导联心电图', target: 'EG20240501015', ip: '192.168.5.106', timestamp: '2025-05-02 08:45:30', status: 'success' },
    { id: 'AUD005', userId: 'U003', userName: '孙志国', action: '打印报告', module: '12导联心电图', target: 'EG20240501008', ip: '192.168.3.103', timestamp: '2025-05-02 08:30:15', status: 'success' },
    { id: 'AUD006', userId: 'U010', userName: '马晓丽', action: '登录系统', module: '系统管理', target: '-', ip: '192.168.1.110', timestamp: '2025-05-02 08:00:00', status: 'failed' },
    { id: 'AUD007', userId: 'U001', userName: '高峰', action: '发送危急值通知', module: '危急值管理', target: 'CV20240502001', ip: '192.168.1.101', timestamp: '2025-05-02 07:50:00', status: 'success' },
    { id: 'AUD008', userId: 'U005', userName: '刘秀英', action: '采集完成', module: '动态心电图', target: 'HD20240501005', ip: '192.168.1.105', timestamp: '2025-05-01 18:30:00', status: 'success' },
    { id: 'AUD009', userId: 'U012', userName: '系统管理员', action: '系统配置', module: '系统管理', target: '危急值规则', ip: '192.168.10.50', timestamp: '2025-05-01 03:00:00', status: 'success' },
    { id: 'AUD010', userId: 'U002', userName: '林志杰', action: '审核报告', module: '运动平板试验', target: 'EX20240501003', ip: '192.168.1.102', timestamp: '2025-05-01 16:20:00', status: 'success' },
  ], [])

  // 统计数据
  const stats = useMemo(() => ({
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    inactiveUsers: users.filter(u => u.status === 'inactive').length,
    lockedUsers: users.filter(u => u.status === 'locked').length,
    pendingUsers: users.filter(u => u.status === 'pending').length,
    totalRoles: roles.length,
    totalPermissions: permissionModules.reduce((sum, m) => sum + m.permissions.length, 0),
    todayLogins: 28,
    failedLogins: 1,
  }), [users, roles, permissionModules])

  // 筛选后的用户
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (filterType !== 'all' && user.type !== filterType) return false
      if (filterStatus !== 'all' && user.status !== filterStatus) return false
      if (searchText) {
        const search = searchText.toLowerCase()
        return (
          user.username.toLowerCase().includes(search) ||
          user.realName.toLowerCase().includes(search) ||
          user.department.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
        )
      }
      return true
    })
  }, [users, filterType, filterStatus, searchText])

  // 获取用户类型信息
  const getUserTypeInfo = (type: UserType) => {
    switch (type) {
      case 'doctor': return { label: '医生', color: '#1e40af', bg: '#eff6ff' }
      case 'technician': return { label: '技师', color: '#0891b2', bg: '#ecfeff' }
      case 'nurse': return { label: '护士', color: '#7c3aed', bg: '#f5f3ff' }
      case 'admin': return { label: '管理员', color: '#dc2626', bg: '#fef2f2' }
      case 'viewer': return { label: '访客', color: '#64748b', bg: '#f1f5f9' }
    }
  }

  // 获取用户状态信息
  const getUserStatusInfo = (status: UserStatus) => {
    switch (status) {
      case 'active': return { label: '正常', color: '#16a34a', bg: '#f0fdf4' }
      case 'inactive': return { label: '停用', color: '#64748b', bg: '#f1f5f9' }
      case 'locked': return { label: '锁定', color: '#dc2626', bg: '#fef2f2' }
      case 'pending': return { label: '待审核', color: '#d97706', bg: '#fff7ed' }
    }
  }

  // 切换展开
  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div style={{ fontSize: 16 }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>用户权限管理</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>用户账户、角色权限和系统访问控制</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <Download size={14} />
            导出
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              background: '#1e40af',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            添加用户
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Users size={16} color="#1e40af" />
            <span style={{ color: '#64748b', fontSize: 13 }}>用户总数</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>{stats.totalUsers}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <UserCheck size={16} color="#16a34a" />
            <span style={{ color: '#64748b', fontSize: 13 }}>活跃用户</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#16a34a' }}>{stats.activeUsers}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <UserX size={16} color="#dc2626" />
            <span style={{ color: '#64748b', fontSize: 13 }}>锁定用户</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#dc2626' }}>{stats.lockedUsers}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Shield size={16} color="#7c3aed" />
            <span style={{ color: '#64748b', fontSize: 13 }}>角色总数</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#7c3aed' }}>{stats.totalRoles}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Key size={16} color="#d97706" />
            <span style={{ color: '#64748b', fontSize: 13 }}>权限总数</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#d97706' }}>{stats.totalPermissions}</div>
        </div>
      </div>

      {/* 标签页 */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
        {[
          { key: 'users', label: '用户管理', count: users.length },
          { key: 'roles', label: '角色管理', count: roles.length },
          { key: 'permissions', label: '权限配置', count: stats.totalPermissions },
          { key: 'audit', label: '审计日志', count: auditLogs.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #1e40af' : '2px solid transparent',
              color: activeTab === tab.key ? '#1e40af' : '#64748b',
              fontSize: 14,
              fontWeight: activeTab === tab.key ? 600 : 400,
              cursor: 'pointer',
              marginBottom: -1,
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* 用户管理 */}
      {activeTab === 'users' && (
        <>
          {/* 筛选栏 */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="搜索用户名/姓名/科室..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                fontSize: 14,
                outline: 'none',
              }}
            >
              <option value="all">全部类型</option>
              <option value="doctor">医生</option>
              <option value="technician">技师</option>
              <option value="nurse">护士</option>
              <option value="admin">管理员</option>
              <option value="viewer">访客</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                fontSize: 14,
                outline: 'none',
              }}
            >
              <option value="all">全部状态</option>
              <option value="active">正常</option>
              <option value="inactive">停用</option>
              <option value="locked">锁定</option>
              <option value="pending">待审核</option>
            </select>
          </div>

          {/* 用户表格 */}
          <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['用户', '类型', '科室', '角色', '状态', '最后登录', '操作'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const typeInfo = getUserTypeInfo(user.type)
                  const statusInfo = getUserStatusInfo(user.status)
                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{user.realName}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>@{user.username}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', background: typeInfo.bg, color: typeInfo.color, borderRadius: 4, fontSize: 12 }}>
                          {typeInfo.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{user.department}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {user.roles.map(role => (
                            <span key={role} style={{ padding: '2px 8px', background: '#f1f5f9', color: '#475569', borderRadius: 4, fontSize: 11 }}>
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', background: statusInfo.bg, color: statusInfo.color, borderRadius: 4, fontSize: 12 }}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{user.lastLogin}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#1e40af' }} title="编辑"><Edit size={14} /></button>
                          <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }} title="权限"><Key size={14} /></button>
                          {user.status === 'active' ? (
                            <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626' }} title="锁定"><Lock size={14} /></button>
                          ) : (
                            <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#16a34a' }} title="解锁"><Unlock size={14} /></button>
                          )}
                          <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626' }} title="删除"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 角色管理 */}
      {activeTab === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {roles.map(role => (
            <div
              key={role.id}
              style={{
                background: '#fff',
                borderRadius: 8,
                padding: 20,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>{role.name}</h4>
                    {role.isSystem && (
                      <span style={{ padding: '2px 6px', background: '#fef3c7', color: '#d97706', borderRadius: 4, fontSize: 10 }}>
                        系统
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{role.description}</p>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#1e40af' }}><Edit size={14} /></button>
                  {!role.isSystem && <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={14} /></button>}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>
                  <Users size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {role.userCount} 人
                </span>
                <span style={{ fontSize: 13, color: '#64748b' }}>
                  <Key size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {role.permissions.length} 项权限
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 权限配置 */}
      {activeTab === 'permissions' && (
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {permissionModules.map((module, idx) => {
            const ModuleIcon = module.icon
            const isExpanded = expandedSections.has(module.id)
            return (
              <div key={module.id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: idx % 2 === 0 ? '#f8fafc' : '#fff',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleSection(module.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <ModuleIcon size={18} color="#1e40af" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{module.name}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>({module.permissions.length}项)</span>
                  </div>
                  {isExpanded ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                </div>
                {isExpanded && (
                  <div style={{ padding: '0 20px 16px 50px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {module.permissions.map(perm => (
                      <div
                        key={perm.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: '#f8fafc',
                          borderRadius: 6,
                          fontSize: 13,
                        }}
                      >
                        <span style={{ color: '#475569' }}>{perm.name}</span>
                        <span style={{
                          padding: '2px 6px',
                          background: perm.type === 'admin' ? '#fef2f2' : perm.type === 'delete' ? '#fff7ed' : perm.type === 'write' ? '#eff6ff' : '#f0fdf4',
                          color: perm.type === 'admin' ? '#dc2626' : perm.type === 'delete' ? '#d97706' : perm.type === 'write' ? '#1e40af' : '#16a34a',
                          borderRadius: 4,
                          fontSize: 10,
                        }}>
                          {perm.type === 'read' ? '读' : perm.type === 'write' ? '写' : perm.type === 'delete' ? '删' : '管'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 审计日志 */}
      {activeTab === 'audit' && (
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['时间', '用户', '操作', '模块', '目标', 'IP地址', '状态'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{log.timestamp}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{log.userName}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{log.action}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{log.module}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>{log.target}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{log.ip}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      background: log.status === 'success' ? '#f0fdf4' : '#fef2f2',
                      color: log.status === 'success' ? '#16a34a' : '#dc2626',
                      borderRadius: 4,
                      fontSize: 12,
                    }}>
                      {log.status === 'success' ? '成功' : '失败'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
