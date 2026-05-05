import { useState, useMemo } from 'react'
import { 
  Activity, Heart, AlertTriangle, Users, Clock, CheckCircle,
  TrendingUp, TrendingDown, Minus, Zap, Thermometer, Wind,
  BarChart2, PieChart as PieChartIcon, ArrowUp, ArrowDown,
  Monitor, Server, Database, Wifi, Battery
} from 'lucide-react'
import { 
  ecg12Records, holterRecords, criticalECGRecords, 
  regionalECGHospitals, regionalECGRequests, exerciseRecords 
} from '../data/initialData'

// 统计数据类型
interface StatCard {
  label: string
  value: number | string
  change?: number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  icon: React.ElementType
  color: string
}

// KPI指标类型
interface KPIGroup {
  title: string
  items: { label: string; value: string | number; status: 'normal' | 'warning' | 'critical' }[]
}

// 系统状态类型
interface SystemStatus {
  name: string
  status: 'online' | 'warning' | 'offline'
  uptime: string
  lastUpdate: string
}

export default function HQPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today')
  const [selectedDept, setSelectedDept] = useState<string>('all')

  // 今日数据统计
  const today = '2025-05-02'
  
  // 计算统计数据
  const stats = useMemo<StatCard[]>(() => {
    const todayECG = ecg12Records.filter(r => r.reportTime.startsWith(today))
    const todayHolter = holterRecords.filter(r => r.reportTime.startsWith(today))
    const todayCritical = criticalECGRecords.filter(r => r.reportedTime.startsWith(today))
    const todayExercise = exerciseRecords.filter(r => r.reportTime.startsWith(today))
    const pendingReview = ecg12Records.filter(r => r.status === '待审核').length
    const criticalPending = criticalECGRecords.filter(r => r.status !== '已处理').length
    
    return [
      { 
        label: '今日12导联', 
        value: todayECG.length, 
        change: 12.5,
        trend: 'up',
        icon: Heart, 
        color: '#1e40af' 
      },
      { 
        label: '动态心电', 
        value: todayHolter.length + holterRecords.filter(r => r.status === '监测中').length, 
        change: 8.2,
        trend: 'up',
        icon: Activity, 
        color: '#0891b2' 
      },
      { 
        label: '运动平板', 
        value: todayExercise.length, 
        change: -3.1,
        trend: 'down',
        icon: Clock, 
        color: '#059669' 
      },
      { 
        label: '危急值', 
        value: todayCritical.length, 
        change: 0,
        trend: 'stable',
        icon: AlertTriangle, 
        color: '#dc2626' 
      },
      { 
        label: '待审核', 
        value: pendingReview, 
        change: -15.3,
        trend: 'down',
        icon: CheckCircle, 
        color: '#d97706' 
      },
      { 
        label: '区域协作', 
        value: regionalECGRequests.filter(r => r.status !== '已完成').length, 
        change: 5.7,
        trend: 'up',
        icon: Users, 
        color: '#7c3aed' 
      },
    ]
  }, [])

  // KPI指标分组
  const kpiGroups = useMemo<KPIGroup[]>(() => [
    {
      title: '心电检查质量指标',
      items: [
        { label: '平均报告生成时间', value: '23分钟', status: 'normal' },
        { label: '报告完整率', value: '98.5%', status: 'normal' },
        { label: '危急值10分钟内通知率', value: '96.8%', status: 'warning' },
        { label: '一次审核通过率', value: '92.3%', status: 'normal' },
        { label: '复查率', value: '4.2%', status: 'normal' },
        { label: '误诊率', value: '0.12%', status: 'normal' },
      ]
    },
    {
      title: '设备运行指标',
      items: [
        { label: '心电图机在线率', value: '99.2%', status: 'normal' },
        { label: '动态心电设备使用率', value: '87.5%', status: 'normal' },
        { label: '运动平板设备使用率', value: '68.3%', status: 'normal' },
        { label: '设备故障率', value: '0.8%', status: 'normal' },
        { label: '平均设备等待时间', value: '12分钟', status: 'warning' },
        { label: '设备维护准时率', value: '100%', status: 'normal' },
      ]
    },
    {
      title: '区域协作指标',
      items: [
        { label: '协作医院在线数', value: `${regionalECGHospitals.filter(h => h.online).length}/${regionalECGHospitals.length}`, status: 'normal' },
        { label: '平均会诊响应时间', value: '28分钟', status: 'warning' },
        { label: '会诊完成率', value: '97.8%', status: 'normal' },
        { label: '远程心电传输成功率', value: '99.6%', status: 'normal' },
        { label: '疑难病例讨论数', value: '15例', status: 'normal' },
        { label: '转诊率', value: '1.2%', status: 'normal' },
      ]
    },
    {
      title: '工作效率指标',
      items: [
        { label: '今日完成检查数', value: ecg12Records.length + holterRecords.length, status: 'normal' },
        { label: '当前等待人数', value: ecg12Records.filter(r => r.status === '待报告').length, status: 'warning' },
        { label: '平均检查时长', value: '18分钟', status: 'normal' },
        { label: '医师人均报告数', value: '32份/日', status: 'normal' },
        { label: '加班时长占比', value: '8.5%', status: 'normal' },
        { label: '患者满意度', value: '96.2%', status: 'normal' },
      ]
    },
  ], [])

  // 系统状态数据
  const systemStatuses = useMemo<SystemStatus[]>(() => [
    { name: '心电图采集服务', status: 'online', uptime: '99.98%', lastUpdate: '刚刚' },
    { name: '动态心电分析引擎', status: 'online', uptime: '99.95%', lastUpdate: '刚刚' },
    { name: '区域心电交换中心', status: 'online', uptime: '99.87%', lastUpdate: '刚刚' },
    { name: '危急值预警系统', status: 'warning', uptime: '99.12%', lastUpdate: '3分钟前' },
    { name: '电子病历集成服务', status: 'online', uptime: '99.99%', lastUpdate: '刚刚' },
    { name: '数据库集群', status: 'online', uptime: '99.999%', lastUpdate: '刚刚' },
    { name: '网络存储服务', status: 'online', uptime: '99.93%', lastUpdate: '刚刚' },
    { name: '移动端同步服务', status: 'online', uptime: '98.45%', lastUpdate: '刚刚' },
  ], [])

  // 各科室检查量统计
  const deptStats = useMemo(() => {
    const deptMap = new Map<string, { ecg: number; holter: number; exercise: number; total: number }>()
    
    ecg12Records.forEach(r => {
      const existing = deptMap.get(r.dept) || { ecg: 0, holter: 0, exercise: 0, total: 0 }
      existing.ecg++
      existing.total++
      deptMap.set(r.dept, existing)
    })
    
    holterRecords.forEach(r => {
      const existing = deptMap.get(r.dept) || { ecg: 0, holter: 0, exercise: 0, total: 0 }
      existing.holter++
      existing.total++
      deptMap.set(r.dept, existing)
    })
    
    exerciseRecords.forEach(r => {
      const existing = deptMap.get(r.dept) || { ecg: 0, holter: 0, exercise: 0, total: 0 }
      existing.exercise++
      existing.total++
      deptMap.set(r.dept, existing)
    })
    
    return Array.from(deptMap.entries())
      .map(([dept, data]) => ({ dept, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
  }, [])

  // 过去7天的检查趋势数据
  const weeklyTrend = useMemo(() => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    const ecgData = [45, 52, 48, 61, 55, 32, 28]
    const holterData = [12, 15, 14, 18, 16, 8, 6]
    const exerciseData = [8, 10, 9, 12, 11, 5, 4]
    
    return days.map((day, i) => ({
      day,
      ecg: ecgData[i],
      holter: holterData[i],
      exercise: exerciseData[i],
      total: ecgData[i] + holterData[i] + exerciseData[i]
    }))
  }, [])

  // 诊断分布统计
  const diagnosisDistribution = useMemo(() => [
    { diagnosis: '窦性心律', count: 156, percentage: 38.2, color: '#1e40af' },
    { diagnosis: '室性早搏', count: 68, percentage: 16.6, color: '#0891b2' },
    { diagnosis: 'ST段改变', count: 52, percentage: 12.7, color: '#d97706' },
    { diagnosis: 'T波改变', count: 45, percentage: 11.0, color: '#7c3aed' },
    { diagnosis: '心房颤动', count: 32, percentage: 7.8, color: '#dc2626' },
    { diagnosis: '传导阻滞', count: 28, percentage: 6.9, color: '#059669' },
    { diagnosis: '其他异常', count: 27, percentage: 6.8, color: '#64748b' },
  ], [])

  // 年龄分布统计
  const ageDistribution = useMemo(() => [
    { range: '0-18岁', male: 12, female: 8 },
    { range: '19-35岁', male: 35, female: 28 },
    { range: '36-50岁', male: 68, female: 52 },
    { range: '51-65岁', male: 95, female: 78 },
    { range: '66-80岁', male: 86, female: 92 },
    { range: '>80岁', male: 45, female: 58 },
  ], [])

  // 获取状态颜色
  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'normal': return '#16a34a'
      case 'warning': return '#d97706'
      case 'critical': return '#dc2626'
    }
  }

  // 获取状态背景色
  const getStatusBg = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'normal': return '#f0fdf4'
      case 'warning': return '#fef3c7'
      case 'critical': return '#fef2f2'
    }
  }

  // 获取趋势图标
  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp size={14} color="#16a34a" />
      case 'down': return <ArrowDown size={14} color="#dc2626" />
      default: return <Minus size={14} color="#64748b" />
    }
  }

  return (
    <div style={{ fontSize: 16 }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>主任驾驶舱</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>全院心电信息系统运行态势全景展示</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {(['today', 'week', 'month'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: '1px solid',
                borderColor: selectedPeriod === period ? '#1e40af' : '#e2e8f0',
                background: selectedPeriod === period ? '#1e40af' : '#fff',
                color: selectedPeriod === period ? '#fff' : '#64748b',
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {period === 'today' ? '今日' : period === 'week' ? '本周' : '本月'}
            </button>
          ))}
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 24 }}>
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.label} 
              style={{ 
                background: '#fff', 
                borderRadius: 8, 
                padding: 20, 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 8, 
                  background: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={18} color={stat.color} />
                </div>
                <span style={{ color: '#64748b', fontSize: 13 }}>{stat.label}</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                {stat.value}
                {stat.unit && <span style={{ fontSize: 14, fontWeight: 400, color: '#64748b' }}>{stat.unit}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                {getTrendIcon(stat.trend)}
                <span style={{ color: stat.trend === 'up' ? '#16a34a' : stat.trend === 'down' ? '#dc2626' : '#64748b' }}>
                  {(stat.change ?? 0) !== 0 && `${(stat.change ?? 0) > 0 ? '+' : ''}${stat.change ?? 0}%`}
                </span>
                <span style={{ color: '#94a3b8' }}>vs昨日</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* KPI指标面板 */}
      <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={18} color="#1e40af" />
          KPI指标监控
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {kpiGroups.map(group => (
            <div key={group.title}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                {group.title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.items.map(item => (
                  <div 
                    key={item.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: getStatusBg(item.status),
                      borderRadius: 6,
                      borderLeft: `3px solid ${getStatusColor(item.status)}`,
                    }}
                  >
                    <span style={{ fontSize: 13, color: '#475569' }}>{item.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: getStatusColor(item.status) }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 系统状态监控 */}
      <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Server size={18} color="#1e40af" />
          系统运行状态
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {systemStatuses.map(sys => (
            <div 
              key={sys.name}
              style={{
                padding: 16,
                background: sys.status === 'online' ? '#f0fdf4' : sys.status === 'warning' ? '#fef3c7' : '#fef2f2',
                borderRadius: 8,
                border: '1px solid',
                borderColor: sys.status === 'online' ? '#bbf7d0' : sys.status === 'warning' ? '#fcd34d' : '#fecaca',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: sys.status === 'online' ? '#16a34a' : sys.status === 'warning' ? '#d97706' : '#dc2626',
                }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{sys.name}</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                <div>可用率: <span style={{ fontWeight: 600, color: '#1e293b' }}>{sys.uptime}</span></div>
                <div>更新: {sys.lastUpdate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 趋势分析 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* 周趋势图 */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} color="#1e40af" />
            本周检查趋势
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {weeklyTrend.map(day => (
              <div key={day.day} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ width: 40, fontSize: 13, color: '#64748b' }}>{day.day}</span>
                <div style={{ flex: 1, display: 'flex', gap: 4 }}>
                  <div style={{ 
                    flex: day.ecg, 
                    height: 24, 
                    background: '#1e40af', 
                    borderRadius: '4px 0 0 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {day.ecg > 0 && <span style={{ fontSize: 11, color: '#fff', fontWeight: 500 }}>{day.ecg}</span>}
                  </div>
                  <div style={{ 
                    flex: day.holter, 
                    height: 24, 
                    background: '#0891b2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {day.holter > 0 && <span style={{ fontSize: 11, color: '#fff', fontWeight: 500 }}>{day.holter}</span>}
                  </div>
                  <div style={{ 
                    flex: day.exercise, 
                    height: 24, 
                    background: '#059669',
                    borderRadius: '0 4px 4px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {day.exercise > 0 && <span style={{ fontSize: 11, color: '#fff', fontWeight: 500 }}>{day.exercise}</span>}
                  </div>
                </div>
                <span style={{ width: 50, fontSize: 13, fontWeight: 600, color: '#1e293b', textAlign: 'right' }}>
                  {day.total}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 16, justifyContent: 'center' }}>
            {[
              { label: '12导联', color: '#1e40af' },
              { label: '动态心电', color: '#0891b2' },
              { label: '运动平板', color: '#059669' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }} />
                <span style={{ fontSize: 12, color: '#64748b' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 诊断分布饼图 */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <PieChartIcon size={18} color="#1e40af" />
            诊断类型分布
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {diagnosisDistribution.map(item => (
              <div key={item.diagnosis}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#475569' }}>{item.diagnosis}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                    {item.count} <span style={{ fontSize: 11, color: '#94a3b8' }}>({item.percentage}%)</span>
                  </span>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${item.percentage}%`, 
                    height: '100%', 
                    background: item.color,
                    borderRadius: 3,
                    transition: 'width 0.3s',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 科室分布与年龄分布 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* 科室检查量排名 */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart2 size={18} color="#1e40af" />
            科室检查量排名
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {deptStats.slice(0, 8).map((dept, index) => (
              <div key={dept.dept} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 20, fontSize: 12, color: index < 3 ? '#1e40af' : '#94a3b8', fontWeight: index < 3 ? 600 : 400 }}>
                  {index + 1}
                </span>
                <span style={{ flex: 1, fontSize: 13, color: '#475569' }}>{dept.dept}</span>
                <div style={{ display: 'flex', gap: 8, fontSize: 11 }}>
                  <span style={{ color: '#1e40af' }}>心:{dept.ecg}</span>
                  <span style={{ color: '#0891b2' }}>动:{dept.holter}</span>
                  <span style={{ color: '#059669' }}>平:{dept.exercise}</span>
                </div>
                <span style={{ width: 40, fontSize: 13, fontWeight: 600, color: '#1e293b', textAlign: 'right' }}>
                  {dept.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 年龄性别分布 */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} color="#1e40af" />
            患者年龄性别分布
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ageDistribution.map(age => {
              const total = age.male + age.female
              const maxVal = Math.max(...ageDistribution.map(a => a.male + a.female))
              return (
                <div key={age.range}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{age.range}</span>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                      <span style={{ color: '#1e40af' }}>♂ {age.male}</span>
                      <span style={{ color: '#dc2626' }}>♀ {age.female}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 2, height: 20, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ 
                      flex: age.male, 
                      background: '#1e40af',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {age.male > 0 && <span style={{ fontSize: 10, color: '#fff' }}>{age.male}</span>}
                    </div>
                    <div style={{ 
                      flex: age.female, 
                      background: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {age.female > 0 && <span style={{ fontSize: 10, color: '#fff' }}>{age.female}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 16, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: '#1e40af' }} />
              <span style={{ fontSize: 12, color: '#64748b' }}>男性</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: '#dc2626' }} />
              <span style={{ fontSize: 12, color: '#64748b' }}>女性</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部时间戳 */}
      <div style={{ marginTop: 24, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
        数据更新时间: {new Date().toLocaleString('zh-CN')} · 全院心电信息系统 v0.2.0
      </div>
    </div>
  )
}
