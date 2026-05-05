import { useState, useMemo } from 'react'
import {
  Monitor, Server, Database, Wifi, Battery, Search, Filter,
  Plus, Edit, Trash2, Eye, RefreshCw, CheckCircle,
  AlertTriangle, X, Download, Upload, Settings, Cpu,
  HardDrive, Printer, Activity as ActivityIcon
} from 'lucide-react'

// 设备类型
type DeviceType = 'ecg_machine' | 'holter_device' | 'exercise_device' | 'server' | 'workstation'

// 设备状态
type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error'

// 设备接口
interface Device {
  id: string
  name: string
  type: DeviceType
  model: string
  serialNumber: string
  location: string
  department: string
  status: DeviceStatus
  lastMaintenance: string
  nextMaintenance: string
  usageHours: number
  errorCount: number
  ipAddress?: string
  macAddress?: string
  firmwareVersion?: string
  purchaseDate: string
  warrantyEnd: string
}

// 设备运行记录
interface DeviceLog {
  id: string
  deviceId: string
  deviceName: string
  eventType: 'error' | 'maintenance' | 'usage' | 'update'
  description: string
  timestamp: string
  operator: string
}

// 耗材记录
interface Consumable {
  id: string
  deviceId: string
  deviceName: string
  consumableType: string
  lastReplaced: string
  nextReplaced: string
  stockCount: number
  status: 'normal' | 'low' | 'critical'
}

// 统计数据
interface DeviceStats {
  totalDevices: number
  onlineCount: number
  offlineCount: number
  maintenanceCount: number
  errorCount: number
  avgUsageRate: number
  totalUsageHours: number
  pendingMaintenance: number
  criticalAlerts: number
}

export default function DeviceManagementPage() {
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [activeTab, setActiveTab] = useState<'devices' | 'logs' | 'consumables'>('devices')

  // 模拟设备数据
  const devices = useMemo<Device[]>(() => [
    {
      id: 'DEV001',
      name: '心电图机-1200-01',
      type: 'ecg_machine',
      model: 'GE MAC 1200',
      serialNumber: 'SN2024ECG001',
      location: '门诊楼2层201诊室',
      department: '心电图室',
      status: 'online',
      lastMaintenance: '2025-03-15',
      nextMaintenance: '2025-06-15',
      usageHours: 2847,
      errorCount: 2,
      ipAddress: '192.168.1.101',
      macAddress: '00:1A:2B:3C:4D:5E',
      firmwareVersion: 'v3.2.1',
      purchaseDate: '2022-06-15',
      warrantyEnd: '2027-06-14',
    },
    {
      id: 'DEV002',
      name: '心电图机-1200-02',
      type: 'ecg_machine',
      model: 'GE MAC 1200',
      serialNumber: 'SN2024ECG002',
      location: '门诊楼2层202诊室',
      department: '心电图室',
      status: 'online',
      lastMaintenance: '2025-04-01',
      nextMaintenance: '2025-07-01',
      usageHours: 3156,
      errorCount: 0,
      ipAddress: '192.168.1.102',
      macAddress: '00:1A:2B:3C:4D:5F',
      firmwareVersion: 'v3.2.1',
      purchaseDate: '2022-06-15',
      warrantyEnd: '2027-06-14',
    },
    {
      id: 'DEV003',
      name: '心电图机-1200-03',
      type: 'ecg_machine',
      model: 'Philips GTX',
      serialNumber: 'SN2023ECG003',
      location: '住院楼5层501诊室',
      department: '心内科',
      status: 'maintenance',
      lastMaintenance: '2025-05-01',
      nextMaintenance: '2025-05-10',
      usageHours: 1923,
      errorCount: 5,
      ipAddress: '192.168.1.103',
      macAddress: '00:1A:2B:3C:4D:60',
      firmwareVersion: 'v2.8.0',
      purchaseDate: '2023-01-10',
      warrantyEnd: '2028-01-09',
    },
    {
      id: 'DEV004',
      name: '心电图机-1200-04',
      type: 'ecg_machine',
      model: 'Philips GTX',
      serialNumber: 'SN2023ECG004',
      location: '住院楼8层801诊室',
      department: '老年病科',
      status: 'online',
      lastMaintenance: '2025-02-20',
      nextMaintenance: '2025-05-20',
      usageHours: 2156,
      errorCount: 1,
      ipAddress: '192.168.1.104',
      macAddress: '00:1A:2B:3C:4D:61',
      firmwareVersion: 'v2.8.0',
      purchaseDate: '2023-01-10',
      warrantyEnd: '2028-01-09',
    },
    {
      id: 'DEV005',
      name: '心电图机-1200-05',
      type: 'ecg_machine',
      model: 'GE MAC 1200',
      serialNumber: 'SN2024ECG005',
      location: '急诊楼1层抢救室',
      department: '急诊科',
      status: 'online',
      lastMaintenance: '2025-03-28',
      nextMaintenance: '2025-06-28',
      usageHours: 3562,
      errorCount: 3,
      ipAddress: '192.168.1.105',
      macAddress: '00:1A:2B:3C:4D:62',
      firmwareVersion: 'v3.2.1',
      purchaseDate: '2024-02-01',
      warrantyEnd: '2029-01-31',
    },
    {
      id: 'DEV006',
      name: '动态心电-01',
      type: 'holter_device',
      model: 'Holter 24h Plus',
      serialNumber: 'SN2023HD001',
      location: '门诊楼2层203诊室',
      department: '心电图室',
      status: 'online',
      lastMaintenance: '2025-04-15',
      nextMaintenance: '2025-07-15',
      usageHours: 4521,
      errorCount: 2,
      purchaseDate: '2023-03-20',
      warrantyEnd: '2026-03-19',
    },
    {
      id: 'DEV007',
      name: '动态心电-02',
      type: 'holter_device',
      model: 'Holter 24h Plus',
      serialNumber: 'SN2023HD002',
      location: '门诊楼2层203诊室',
      department: '心电图室',
      status: 'offline',
      lastMaintenance: '2025-01-10',
      nextMaintenance: '2025-04-10',
      usageHours: 3892,
      errorCount: 8,
      purchaseDate: '2023-03-20',
      warrantyEnd: '2026-03-19',
    },
    {
      id: 'DEV008',
      name: '运动平板-01',
      type: 'exercise_device',
      model: 'CASE Exercise Testing System',
      serialNumber: 'SN2022EX001',
      location: '门诊楼2层运动平板室',
      department: '心电图室',
      status: 'online',
      lastMaintenance: '2025-05-02',
      nextMaintenance: '2025-08-02',
      usageHours: 1234,
      errorCount: 0,
      ipAddress: '192.168.1.108',
      firmwareVersion: 'v5.1.2',
      purchaseDate: '2022-09-01',
      warrantyEnd: '2027-08-31',
    },
    {
      id: 'DEV009',
      name: '心电服务器',
      type: 'server',
      model: 'Dell PowerEdge R750',
      serialNumber: 'SN2022SRV001',
      location: '信息中心机房',
      department: '信息中心',
      status: 'online',
      lastMaintenance: '2025-04-20',
      nextMaintenance: '2025-10-20',
      usageHours: 8760,
      errorCount: 0,
      ipAddress: '192.168.10.50',
      macAddress: '00:1A:2B:3C:4D:70',
      firmwareVersion: 'v2.0.5',
      purchaseDate: '2022-06-01',
      warrantyEnd: '2027-05-31',
    },
    {
      id: 'DEV010',
      name: '心电分析工作站-01',
      type: 'workstation',
      model: 'HP Z4 G4',
      serialNumber: 'SN2022WS001',
      location: '门诊楼2层205办公室',
      department: '心电图室',
      status: 'online',
      lastMaintenance: '2025-03-05',
      nextMaintenance: '2025-09-05',
      usageHours: 2341,
      errorCount: 1,
      ipAddress: '192.168.1.201',
      macAddress: '00:1A:2B:3C:4D:80',
      firmwareVersion: 'Win11 Pro',
      purchaseDate: '2022-08-15',
      warrantyEnd: '2025-08-14',
    },
    {
      id: 'DEV011',
      name: '心电分析工作站-02',
      type: 'workstation',
      model: 'HP Z4 G4',
      serialNumber: 'SN2022WS002',
      location: '住院楼5层501办公室',
      department: '心内科',
      status: 'error',
      lastMaintenance: '2025-02-15',
      nextMaintenance: '2025-05-15',
      usageHours: 2156,
      errorCount: 12,
      ipAddress: '192.168.1.202',
      macAddress: '00:1A:2B:3C:4D:81',
      firmwareVersion: 'Win11 Pro',
      purchaseDate: '2022-08-15',
      warrantyEnd: '2025-08-14',
    },
    {
      id: 'DEV012',
      name: '报告打印机-01',
      type: 'workstation',
      model: 'HP LaserJet Pro MFP',
      serialNumber: 'SN2023PRN001',
      location: '门诊楼2层护士站',
      department: '心电图室',
      status: 'online',
      lastMaintenance: '2025-04-10',
      nextMaintenance: '2025-07-10',
      usageHours: 1567,
      errorCount: 3,
      ipAddress: '192.168.1.301',
      firmwareVersion: 'v1.2.3',
      purchaseDate: '2023-05-20',
      warrantyEnd: '2026-05-19',
    },
  ], [])

  // 设备运行日志
  const deviceLogs = useMemo<DeviceLog[]>(() => [
    { id: 'LOG001', deviceId: 'DEV011', deviceName: '心电分析工作站-02', eventType: 'error', description: '系统崩溃，蓝屏错误代码0x0000007B', timestamp: '2025-05-02 08:32:15', operator: '系统' },
    { id: 'LOG002', deviceId: 'DEV007', deviceName: '动态心电-02', eventType: 'maintenance', description: '更换电池模组，清理内部灰尘', timestamp: '2025-05-01 14:20:00', operator: '李工程师' },
    { id: 'LOG003', deviceId: 'DEV001', deviceName: '心电图机-1200-01', eventType: 'usage', description: '完成第10000例心电图检查', timestamp: '2025-04-30 16:45:30', operator: '系统' },
    { id: 'LOG004', deviceId: 'DEV009', deviceName: '心电服务器', eventType: 'update', description: '更新安全补丁KB5034441', timestamp: '2025-04-29 03:00:00', operator: '自动更新' },
    { id: 'LOG005', deviceId: 'DEV003', deviceName: '心电图机-1200-03', eventType: 'maintenance', description: '进入定期维护状态，预计5月10日完成', timestamp: '2025-04-28 09:00:00', operator: '王技师' },
    { id: 'LOG006', deviceId: 'DEV005', deviceName: '心电图机-1200-05', eventType: 'error', description: '打印组件卡纸，清理后恢复', timestamp: '2025-04-27 11:23:45', operator: '张护士' },
    { id: 'LOG007', deviceId: 'DEV010', deviceName: '心电分析工作站-01', eventType: 'usage', description: '软件版本更新至v2.5.0', timestamp: '2025-04-26 18:00:00', operator: '刘工程师' },
    { id: 'LOG008', deviceId: 'DEV006', deviceName: '动态心电-01', eventType: 'error', description: '存储空间不足，清理历史数据', timestamp: '2025-04-25 08:15:30', operator: '系统' },
    { id: 'LOG009', deviceId: 'DEV012', deviceName: '报告打印机-01', eventType: 'maintenance', description: '更换墨盒，清洁滚轮', timestamp: '2025-04-24 15:30:00', operator: '后勤部' },
    { id: 'LOG010', deviceId: 'DEV002', deviceName: '心电图机-1200-02', eventType: 'usage', description: '完成本周质控校准', timestamp: '2025-04-23 10:00:00', operator: '质控员' },
  ], [])

  // 耗材数据
  const consumables = useMemo<Consumable[]>(() => [
    { id: 'CON001', deviceId: 'DEV001', deviceName: '心电图机-1200-01', consumableType: '心电图纸', lastReplaced: '2025-04-01', nextReplaced: '2025-06-01', stockCount: 45, status: 'normal' },
    { id: 'CON002', deviceId: 'DEV002', deviceName: '心电图机-1200-02', consumableType: '心电图纸', lastReplaced: '2025-04-15', nextReplaced: '2025-06-15', stockCount: 32, status: 'normal' },
    { id: 'CON003', deviceId: 'DEV006', deviceName: '动态心电-01', consumableType: 'Holter电极片', lastReplaced: '2025-03-20', nextReplaced: '2025-04-20', stockCount: 8, status: 'low' },
    { id: 'CON004', deviceId: 'DEV007', deviceName: '动态心电-02', consumableType: 'Holter电池', lastReplaced: '2025-05-01', nextReplaced: '2025-06-01', stockCount: 5, status: 'critical' },
    { id: 'CON005', deviceId: 'DEV012', deviceName: '报告打印机-01', consumableType: '墨盒(黑色)', lastReplaced: '2025-04-10', nextReplaced: '2025-05-10', stockCount: 2, status: 'critical' },
    { id: 'CON006', deviceId: 'DEV005', deviceName: '心电图机-1200-05', consumableType: '心电图纸', lastReplaced: '2025-04-20', nextReplaced: '2025-06-20', stockCount: 56, status: 'normal' },
  ], [])

  // 统计数据
  const stats = useMemo<DeviceStats>(() => {
    const onlineCount = devices.filter(d => d.status === 'online').length
    const offlineCount = devices.filter(d => d.status === 'offline').length
    const maintenanceCount = devices.filter(d => d.status === 'maintenance').length
    const errorCount = devices.filter(d => d.status === 'error').length
    const totalUsageHours = devices.reduce((sum, d) => sum + d.usageHours, 0)
    const avgUsageRate = devices.length > 0 ? (totalUsageHours / devices.length / 365 / 24) * 100 : 0
    
    const today = new Date()
    const pendingMaintenance = devices.filter(d => {
      const next = new Date(d.nextMaintenance)
      const diffDays = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 30 && diffDays > 0
    }).length
    
    return {
      totalDevices: devices.length,
      onlineCount,
      offlineCount,
      maintenanceCount,
      errorCount,
      avgUsageRate: Math.round(avgUsageRate * 10) / 10,
      totalUsageHours,
      pendingMaintenance,
      criticalAlerts: offlineCount + errorCount,
    }
  }, [devices])

  // 筛选后的设备
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      if (filterType !== 'all' && device.type !== filterType) return false
      if (filterStatus !== 'all' && device.status !== filterStatus) return false
      if (searchText) {
        const search = searchText.toLowerCase()
        return (
          device.name.toLowerCase().includes(search) ||
          device.serialNumber.toLowerCase().includes(search) ||
          device.location.toLowerCase().includes(search) ||
          device.department.toLowerCase().includes(search)
        )
      }
      return true
    })
  }, [devices, filterType, filterStatus, searchText])

  // 获取设备类型信息
  const getDeviceTypeInfo = (type: DeviceType) => {
    switch (type) {
      case 'ecg_machine': return { label: '心电图机', icon: ActivityIcon, color: '#1e40af' }
      case 'holter_device': return { label: '动态心电', icon: Monitor, color: '#0891b2' }
      case 'exercise_device': return { label: '运动平板', icon: ActivityIcon, color: '#059669' }
      case 'server': return { label: '服务器', icon: Server, color: '#7c3aed' }
      case 'workstation': return { label: '工作站', icon: Monitor, color: '#d97706' }
    }
  }

  // 获取状态信息
  const getStatusInfo = (status: DeviceStatus) => {
    switch (status) {
      case 'online': return { label: '在线', color: '#16a34a', bg: '#f0fdf4' }
      case 'offline': return { label: '离线', color: '#dc2626', bg: '#fef2f2' }
      case 'maintenance': return { label: '维护中', color: '#d97706', bg: '#fff7ed' }
      case 'error': return { label: '故障', color: '#dc2626', bg: '#fef2f2' }
    }
  }

  // 打开设备详情
  const openDeviceDetail = (device: Device) => {
    setSelectedDevice(device)
    setShowDetailModal(true)
  }

  return (
    <div style={{ fontSize: 16 }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>设备台账管理</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>全院心电设备统一管理，实时监控运行状态</p>
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
            添加设备
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Monitor size={18} color="#1e40af" />
            </div>
            <span style={{ color: '#64748b', fontSize: 13 }}>设备总数</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>{stats.totalDevices}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} color="#16a34a" />
            </div>
            <span style={{ color: '#64748b', fontSize: 13 }}>在线设备</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#16a34a' }}>{stats.onlineCount}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={18} color="#dc2626" />
            </div>
            <span style={{ color: '#64748b', fontSize: 13 }}>异常设备</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#dc2626' }}>{stats.errorCount + stats.offlineCount}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={18} color="#d97706" />
            </div>
            <span style={{ color: '#64748b', fontSize: 13 }}>待维护</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#d97706' }}>{stats.pendingMaintenance}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIcon size={18} color="#7c3aed" />
            </div>
            <span style={{ color: '#64748b', fontSize: 13 }}>平均使用率</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#7c3aed' }}>{stats.avgUsageRate}%</div>
        </div>
      </div>

      {/* 标签页切换 */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
        {[
          { key: 'devices', label: '设备列表', count: devices.length },
          { key: 'logs', label: '运行日志', count: deviceLogs.length },
          { key: 'consumables', label: '耗材管理', count: consumables.length },
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

      {/* 设备列表 */}
      {activeTab === 'devices' && (
        <>
          {/* 筛选栏 */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="搜索设备名称/序列号/位置..."
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
              <option value="ecg_machine">心电图机</option>
              <option value="holter_device">动态心电</option>
              <option value="exercise_device">运动平板</option>
              <option value="server">服务器</option>
              <option value="workstation">工作站</option>
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
              <option value="online">在线</option>
              <option value="offline">离线</option>
              <option value="maintenance">维护中</option>
              <option value="error">故障</option>
            </select>
          </div>

          {/* 设备表格 */}
          <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['设备名称', '类型', '型号/序列号', '位置', '使用时长', '状态', '下次维护', '操作'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map(device => {
                  const typeInfo = getDeviceTypeInfo(device.type)
                  const statusInfo = getStatusInfo(device.status)
                  const TypeIcon = typeInfo.icon
                  const daysToMaintenance = Math.ceil((new Date(device.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  
                  return (
                    <tr key={device.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <TypeIcon size={16} color={typeInfo.color} />
                          <span style={{ fontWeight: 500, color: '#1e293b' }}>{device.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{typeInfo.label}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 13, color: '#1e293b' }}>{device.model}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{device.serialNumber}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{device.location}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{device.usageHours}h</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{Math.round(device.usageHours / 24 / 365 * 10) / 10} 年</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          background: statusInfo.bg,
                          color: statusInfo.color,
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 500,
                        }}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 13, color: daysToMaintenance <= 30 ? '#d97706' : '#1e293b' }}>{device.nextMaintenance}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{daysToMaintenance}天后</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => openDeviceDetail(device)}
                            style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#1e40af' }}
                            title="查看详情"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                            title="编辑"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                            title="删除"
                          >
                            <Trash2 size={14} />
                          </button>
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

      {/* 运行日志 */}
      {activeTab === 'logs' && (
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['时间', '设备', '事件类型', '描述', '操作人'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deviceLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{log.timestamp}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{log.deviceName}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      background: log.eventType === 'error' ? '#fef2f2' : log.eventType === 'maintenance' ? '#fff7ed' : log.eventType === 'update' ? '#eff6ff' : '#f0fdf4',
                      color: log.eventType === 'error' ? '#dc2626' : log.eventType === 'maintenance' ? '#d97706' : log.eventType === 'update' ? '#1e40af' : '#16a34a',
                      borderRadius: 4,
                      fontSize: 12,
                    }}>
                      {log.eventType === 'error' ? '故障' : log.eventType === 'maintenance' ? '维护' : log.eventType === 'update' ? '更新' : '使用'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{log.description}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{log.operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 耗材管理 */}
      {activeTab === 'consumables' && (
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['设备', '耗材类型', '上次更换', '下次更换', '库存数量', '状态'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {consumables.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{item.deviceName}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{item.consumableType}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{item.lastReplaced}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{item.nextReplaced}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{item.stockCount}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      background: item.status === 'normal' ? '#f0fdf4' : item.status === 'low' ? '#fff7ed' : '#fef2f2',
                      color: item.status === 'normal' ? '#16a34a' : item.status === 'low' ? '#d97706' : '#dc2626',
                      borderRadius: 4,
                      fontSize: 12,
                    }}>
                      {item.status === 'normal' ? '正常' : item.status === 'low' ? '偏低' : '急需'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 设备详情弹窗 */}
      {showDetailModal && selectedDevice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{ background: '#fff', borderRadius: 12, width: 600, maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ padding: 20, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>设备详情</h3>
              <button onClick={() => setShowDetailModal(false)} style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <DetailItem label="设备名称" value={selectedDevice.name} />
                <DetailItem label="设备类型" value={getDeviceTypeInfo(selectedDevice.type).label} />
                <DetailItem label="型号" value={selectedDevice.model} />
                <DetailItem label="序列号" value={selectedDevice.serialNumber} />
                <DetailItem label="位置" value={selectedDevice.location} />
                <DetailItem label="科室" value={selectedDevice.department} />
                <DetailItem label="IP地址" value={selectedDevice.ipAddress || '-'} />
                <DetailItem label="MAC地址" value={selectedDevice.macAddress || '-'} />
                <DetailItem label="固件版本" value={selectedDevice.firmwareVersion || '-'} />
                <DetailItem label="购买日期" value={selectedDevice.purchaseDate} />
                <DetailItem label="保修截止" value={selectedDevice.warrantyEnd} />
                <DetailItem label="累计使用" value={`${selectedDevice.usageHours} 小时`} />
                <DetailItem label="上次维护" value={selectedDevice.lastMaintenance} />
                <DetailItem label="下次维护" value={selectedDevice.nextMaintenance} />
              </div>
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button style={{ flex: 1, padding: '10px 16px', background: '#1e40af', border: 'none', borderRadius: 6, color: '#fff', fontSize: 14, cursor: 'pointer' }}>编辑设备</button>
                  <button style={{ flex: 1, padding: '10px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, color: '#64748b', fontSize: 14, cursor: 'pointer' }}>维护记录</button>
                  <button style={{ flex: 1, padding: '10px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, color: '#64748b', fontSize: 14, cursor: 'pointer' }}>导出报告</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, color: '#1e293b' }}>{value}</div>
    </div>
  )
}
