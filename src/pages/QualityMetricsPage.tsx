import { useState, useMemo } from 'react'
import {
  TrendingUp, TrendingDown, Minus, Activity, Heart, AlertTriangle,
  CheckCircle, Clock, Users, BarChart2, PieChart as PieChartIcon,
  LineChart, Calendar, Download, Filter, RefreshCw, Target,
  Zap, Shield, Award, ThumbsUp, ThumbsDown, Eye
} from 'lucide-react'
import {
  ecg12Records, holterRecords, exerciseRecords,
  criticalECGRecords
} from '../data/initialData'

// 质量指标类型
interface QualityMetric {
  id: string
  category: string
  name: string
  description: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
  dataSource: string
  frequency: 'daily' | 'weekly' | 'monthly'
}

// 月度趋势数据
interface TrendData {
  month: string
  value: number
  target: number
}

// 科室质量评分
interface DeptScore {
  dept: string
  score: number
  rank: number
  trends: { metric: string; change: number }[]
}

// 质控事件
interface QCEvent {
  id: string
  type: 'alert' | 'warning' | 'info' | 'success'
  title: string
  description: string
  timestamp: string
  department?: string
  metric?: string
}

export default function QualityMetricsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // 质量指标数据
  const qualityMetrics = useMemo<QualityMetric[]>(() => [
    // 报告质量
    { id: 'QM001', category: '报告质量', name: '报告完整率', description: '心电图报告信息完整度', value: 98.5, target: 98.0, unit: '%', trend: 'up', change: 0.3, status: 'excellent', dataSource: '系统统计', frequency: 'daily' },
    { id: 'QM002', category: '报告质量', name: '一次审核通过率', description: '首次审核即通过的比例', value: 92.3, target: 90.0, unit: '%', trend: 'up', change: 1.2, status: 'good', dataSource: '系统统计', frequency: 'daily' },
    { id: 'QM003', category: '报告质量', name: '报告合格率', description: '经复核后合格的报告比例', value: 99.8, target: 99.5, unit: '%', trend: 'stable', change: 0.1, status: 'excellent', dataSource: '系统统计', frequency: 'daily' },
    { id: 'QM004', category: '报告质量', name: '诊断准确率', description: '心电图诊断与最终确认一致的比例', value: 96.2, target: 95.0, unit: '%', trend: 'up', change: 0.5, status: 'good', dataSource: '专家抽检', frequency: 'monthly' },
    { id: 'QM005', category: '报告质量', name: '复查率', description: '需重新检查的比例', value: 4.2, target: 5.0, unit: '%', trend: 'down', change: -0.3, status: 'good', dataSource: '系统统计', frequency: 'daily' },

    // 时效性
    { id: 'QM006', category: '时效性', name: '平均报告生成时间', description: '从检查完成到报告生成', value: 23, target: 30, unit: '分钟', trend: 'down', change: -2, status: 'excellent', dataSource: '系统统计', frequency: 'daily' },
    { id: 'QM007', category: '时效性', name: '危急值10分钟通知率', description: '危急值发现后10分钟内通知临床', value: 96.8, target: 95.0, unit: '%', trend: 'up', change: 0.8, status: 'good', dataSource: '系统统计', frequency: 'daily' },
    { id: 'QM008', category: '时效性', name: '急诊报告出具时间', description: '急诊心电图报告出具平均时间', value: 8, target: 10, unit: '分钟', trend: 'down', change: -1, status: 'excellent', dataSource: '系统统计', frequency: 'daily' },
    { id: 'QM009', category: '时效性', name: '报告审核及时率', description: '2小时内完成审核的比例', value: 94.5, target: 92.0, unit: '%', trend: 'up', change: 1.5, status: 'good', dataSource: '系统统计', frequency: 'daily' },
    { id: 'QM010', category: '时效性', name: '会诊响应时间', description: '区域心电会诊平均响应时间', value: 28, target: 30, unit: '分钟', trend: 'down', change: -3, status: 'good', dataSource: '系统统计', frequency: 'daily' },

    // 设备质量
    { id: 'QM011', category: '设备质量', name: '设备完好率', description: '心电图设备正常运行比例', value: 99.2, target: 98.0, unit: '%', trend: 'stable', change: 0, status: 'excellent', dataSource: '设备监控', frequency: 'daily' },
    { id: 'QM012', category: '设备质量', name: '心电图采集质量合格率', description: '采集图像质量满足诊断要求', value: 97.8, target: 96.0, unit: '%', trend: 'up', change: 0.4, status: 'good', dataSource: '质控抽检', frequency: 'weekly' },
    { id: 'QM013', category: '设备质量', name: '设备故障率', description: '设备故障发生频率', value: 0.8, target: 1.0, unit: '%', trend: 'down', change: -0.1, status: 'excellent', dataSource: '设备监控', frequency: 'daily' },
    { id: 'QM014', category: '设备质量', name: '设备使用率', description: '心电图设备实际使用时间占比', value: 78.5, target: 75.0, unit: '%', trend: 'up', change: 2.3, status: 'good', dataSource: '系统统计', frequency: 'daily' },

    // 人员绩效
    { id: 'QM015', category: '人员绩效', name: '人均报告数量', description: '医师人均日完成报告数', value: 32, target: 30, unit: '份/日', trend: 'up', change: 2, status: 'good', dataSource: '系统统计', frequency: 'daily' },
    { id: 'QM016', category: '人员绩效', name: '报告超时率', description: '超过规定时间出具报告的比例', value: 2.1, target: 3.0, unit: '%', trend: 'down', change: -0.4, status: 'excellent', dataSource: '系统统计', frequency: 'daily' },
    { id: 'QM017', category: '人员绩效', name: '医师覆盖率', description: '可出具报告的医师占比', value: 85.0, target: 80.0, unit: '%', trend: 'up', change: 1.5, status: 'good', dataSource: '人事系统', frequency: 'monthly' },
    { id: 'QM018', category: '人员绩效', name: '加班时长占比', description: '工作时间外工作时长占比', value: 8.5, target: 10.0, unit: '%', trend: 'down', change: -1.2, status: 'excellent', dataSource: '考勤系统', frequency: 'monthly' },

    // 患者安全
    { id: 'QM019', category: '患者安全', name: '危急值漏报率', description: '危急值未及时报告的比例', value: 0.2, target: 0.5, unit: '%', trend: 'down', change: -0.1, status: 'excellent', dataSource: '系统统计', frequency: 'daily' },
    { id: 'QM020', category: '患者安全', name: '误诊率', description: '心电图误诊比例', value: 0.12, target: 0.2, unit: '%', trend: 'down', change: -0.02, status: 'excellent', dataSource: '专家抽检', frequency: 'monthly' },
    { id: 'QM021', category: '患者安全', name: '不良事件发生数', description: '与心电图检查相关的不良事件', value: 0, target: 1, unit: '例', trend: 'stable', change: 0, status: 'excellent', dataSource: '上报系统', frequency: 'daily' },
    { id: 'QM022', category: '患者安全', name: '患者满意度', description: '心电图检查患者满意度评分', value: 96.2, target: 95.0, unit: '分', trend: 'up', change: 0.5, status: 'good', dataSource: '问卷调查', frequency: 'monthly' },

    // 综合评价
    { id: 'QM023', category: '综合评价', name: '综合质量得分', description: '各项指标综合评分', value: 94.8, target: 92.0, unit: '分', trend: 'up', change: 0.6, status: 'excellent', dataSource: '系统计算', frequency: 'monthly' },
    { id: 'QM024', category: '综合评价', name: '等级评审得分', description: '医院等级评审心电专项得分', value: 96.5, target: 95.0, unit: '分', trend: 'up', change: 0.5, status: 'excellent', dataSource: '评审材料', frequency: 'monthly' },
  ], [])

  // 月度趋势数据
  const monthlyTrends = useMemo<TrendData[]>(() => [
    { month: '2024-10', value: 91.2, target: 90 },
    { month: '2024-11', value: 91.8, target: 90 },
    { month: '2024-12', value: 92.5, target: 90 },
    { month: '2025-01', value: 93.1, target: 92 },
    { month: '2025-02', value: 93.4, target: 92 },
    { month: '2025-03', value: 94.2, target: 92 },
    { month: '2025-04', value: 94.5, target: 92 },
    { month: '2025-05', value: 94.8, target: 92 },
  ], [])

  // 科室质量评分
  const deptScores = useMemo<DeptScore[]>(() => [
    { dept: '心电图室', score: 96.5, rank: 1, trends: [{ metric: '报告质量', change: 0.8 }, { metric: '时效性', change: 1.2 }] },
    { dept: '心内科', score: 95.2, rank: 2, trends: [{ metric: '报告质量', change: 0.5 }, { metric: '时效性', change: 0.3 }] },
    { dept: '急诊科', score: 94.8, rank: 3, trends: [{ metric: '报告质量', change: 0.2 }, { metric: '时效性', change: 1.5 }] },
    { dept: '老年病科', score: 94.1, rank: 4, trends: [{ metric: '报告质量', change: 0.6 }, { metric: '时效性', change: -0.2 }] },
    { dept: '神经内科', score: 93.8, rank: 5, trends: [{ metric: '报告质量', change: 0.3 }, { metric: '时效性', change: 0.5 }] },
    { dept: '保健科', score: 93.5, rank: 6, trends: [{ metric: '报告质量', change: 0.4 }, { metric: '时效性', change: 0.1 }] },
    { dept: '血液科', score: 92.9, rank: 7, trends: [{ metric: '报告质量', change: 0.1 }, { metric: '时效性', change: 0.2 }] },
    { dept: '泌尿外科', score: 92.4, rank: 8, trends: [{ metric: '报告质量', change: 0.3 }, { metric: '时效性', change: -0.1 }] },
  ], [])

  // 质控事件
  const qcEvents = useMemo<QCEvent[]>(() => [
    { id: 'EVT001', type: 'success', title: '连续安全生产500天', description: '心电图室实现连续500天无安全事故', timestamp: '2025-05-01 00:00:00' },
    { id: 'EVT002', type: 'info', title: '月度质控会议', description: '2025年4月心电图质量控制会议圆满召开', timestamp: '2025-04-30 15:00:00', department: '心电图室' },
    { id: 'EVT003', type: 'warning', title: '设备需要维护', description: '动态心电-02设备电池需要更换', timestamp: '2025-05-02 08:30:00', department: '设备科', metric: 'QM013' },
    { id: 'EVT004', type: 'success', title: '危急值处理及时', description: '5月1日所有危急值均在10分钟内完成通知', timestamp: '2025-05-02 00:00:00', metric: 'QM007' },
    { id: 'EVT005', type: 'alert', title: '报告超时预警', description: '3份报告超过2小时未审核，请相关医师注意', timestamp: '2025-05-02 10:15:00' },
    { id: 'EVT006', type: 'info', title: '新设备到位', description: '新采购的GE MAC 1200心电图机已到位', timestamp: '2025-04-28 09:00:00', department: '设备科' },
    { id: 'EVT007', type: 'success', title: '培训完成', description: '新入职技师心电图操作培训圆满完成', timestamp: '2025-04-25 17:00:00', department: '人事科' },
    { id: 'EVT008', type: 'warning', title: '会诊量增加', description: '区域协作医院会诊请求较上月增加15%', timestamp: '2025-05-02 08:00:00', metric: 'QM010' },
  ], [])

  // 统计数据
  const stats = useMemo(() => {
    const excellent = qualityMetrics.filter(m => m.status === 'excellent').length
    const good = qualityMetrics.filter(m => m.status === 'good').length
    const warning = qualityMetrics.filter(m => m.status === 'warning').length
    const critical = qualityMetrics.filter(m => m.status === 'critical').length
    const avgScore = qualityMetrics.reduce((sum, m) => sum + m.value, 0) / qualityMetrics.length

    return {
      totalMetrics: qualityMetrics.length,
      excellent,
      good,
      warning,
      critical,
      avgScore: Math.round(avgScore * 10) / 10,
      monthlyTarget: 92.0,
      trend: '+0.6',
    }
  }, [qualityMetrics])

  // 筛选后的指标
  const filteredMetrics = useMemo(() => {
    let filtered = qualityMetrics
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(m => m.category === selectedCategory)
    }
    return filtered
  }, [qualityMetrics, selectedCategory])

  // 获取类别统计
  const categoryStats = useMemo(() => {
    const categories = [...new Set(qualityMetrics.map(m => m.category))]
    return categories.map(cat => ({
      name: cat,
      count: qualityMetrics.filter(m => m.category === cat).length,
      excellent: qualityMetrics.filter(m => m.category === cat && m.status === 'excellent').length,
      good: qualityMetrics.filter(m => m.category === cat && m.status === 'good').length,
    }))
  }, [qualityMetrics])

  // 获取状态颜色
  const getStatusStyle = (status: QualityMetric['status']) => {
    switch (status) {
      case 'excellent': return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', label: '优秀' }
      case 'good': return { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe', label: '良好' }
      case 'warning': return { bg: '#fff7ed', color: '#d97706', border: '#fed7aa', label: '警告' }
      case 'critical': return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: '危险' }
    }
  }

  // 获取趋势图标
  const getTrendIcon = (trend: QualityMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp size={14} color="#16a34a" />
      case 'down': return <TrendingDown size={14} color="#dc2626" />
      default: return <Minus size={14} color="#64748b" />
    }
  }

  // 获取事件类型颜色
  const getEventStyle = (type: QCEvent['type']) => {
    switch (type) {
      case 'alert': return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
      case 'warning': return { bg: '#fff7ed', color: '#d97706', border: '#fed7aa' }
      case 'info': return { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' }
      case 'success': return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' }
    }
  }

  return (
    <div style={{ fontSize: 16 }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>质量指标管理</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>全院心电信息系统质量监控与持续改进</p>
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
            导出报告
          </button>
          <button
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
            <Target size={14} />
            设置目标
          </button>
        </div>
      </div>

      {/* 统计概览 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Award size={16} color="#1e40af" />
            <span style={{ color: '#64748b', fontSize: 13 }}>指标总数</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>{stats.totalMetrics}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <CheckCircle size={16} color="#16a34a" />
            <span style={{ color: '#64748b', fontSize: 13 }}>优秀</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#16a34a' }}>{stats.excellent}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <ThumbsUp size={16} color="#1e40af" />
            <span style={{ color: '#64748b', fontSize: 13 }}>良好</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#1e40af' }}>{stats.good}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={16} color="#d97706" />
            <span style={{ color: '#64748b', fontSize: 13 }}>警告</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#d97706' }}>{stats.warning}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Shield size={16} color="#dc2626" />
            <span style={{ color: '#64748b', fontSize: 13 }}>危险</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#dc2626' }}>{stats.critical}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <BarChart2 size={16} color="#7c3aed" />
            <span style={{ color: '#64748b', fontSize: 13 }}>综合得分</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#7c3aed' }}>{stats.avgScore}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
            <TrendingUp size={12} color="#16a34a" />
            <span style={{ color: '#16a34a' }}>+0.6</span>
          </div>
        </div>
      </div>

      {/* 类别筛选与趋势 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* 质量指标趋势图 */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} color="#1e40af" />
              质量综合得分趋势
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['daily', 'weekly', 'monthly'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: selectedPeriod === period ? '#1e40af' : '#e2e8f0',
                    background: selectedPeriod === period ? '#1e40af' : '#fff',
                    color: selectedPeriod === period ? '#fff' : '#64748b',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {period === 'daily' ? '日' : period === 'weekly' ? '周' : '月'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {monthlyTrends.map((data, idx) => {
              const maxVal = Math.max(...monthlyTrends.map(d => Math.max(d.value, d.target)))
              const valueHeight = (data.value / maxVal) * 100
              const targetHeight = (data.target / maxVal) * 100
              return (
                <div key={data.month} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ width: 60, fontSize: 13, color: '#64748b' }}>{data.month}</span>
                  <div style={{ flex: 1, display: 'flex', gap: 4, height: 28, alignItems: 'flex-end' }}>
                    <div style={{ flex: data.value, height: `${valueHeight}%`, background: '#1e40af', borderRadius: '4px 0 0 4px', minWidth: 4 }} />
                    <div style={{ flex: data.target, height: `${targetHeight}%`, background: '#e2e8f0', borderRadius: '0 4px 4px 0' }} />
                  </div>
                  <span style={{ width: 50, fontSize: 13, fontWeight: 600, color: '#1e293b', textAlign: 'right' }}>{data.value}</span>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 16, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: '#1e40af' }} />
              <span style={{ fontSize: 12, color: '#64748b' }}>实际得分</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: '#e2e8f0' }} />
              <span style={{ fontSize: 12, color: '#64748b' }}>目标值</span>
            </div>
          </div>
        </div>

        {/* 质控事件 */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={18} color="#1e40af" />
            质控动态
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {qcEvents.slice(0, 6).map(evt => {
              const style = getEventStyle(evt.type)
              return (
                <div
                  key={evt.id}
                  style={{
                    padding: 12,
                    background: style.bg,
                    borderRadius: 6,
                    borderLeft: `3px solid ${style.border.split(':')[1]}`,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1e293b', marginBottom: 4 }}>{evt.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{evt.description}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{evt.timestamp}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 指标类别 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: '1px solid',
            borderColor: selectedCategory === 'all' ? '#1e40af' : '#e2e8f0',
            background: selectedCategory === 'all' ? '#1e40af' : '#fff',
            color: selectedCategory === 'all' ? '#fff' : '#64748b',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          全部 ({qualityMetrics.length})
        </button>
        {categoryStats.map(cat => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid',
              borderColor: selectedCategory === cat.name ? '#1e40af' : '#e2e8f0',
              background: selectedCategory === cat.name ? '#1e40af' : '#fff',
              color: selectedCategory === cat.name ? '#fff' : '#64748b',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* 质量指标详情 */}
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['指标名称', '类别', '当前值', '目标值', '达标情况', '趋势', '更新时间', '数据来源'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMetrics.map((metric, idx) => {
              const statusStyle = getStatusStyle(metric.status)
              const attainmentRate = metric.target > 0 ? Math.min((metric.value / metric.target) * 100, 100) : 0
              return (
                <tr key={metric.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafbfc' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 500, color: '#1e293b', marginBottom: 2 }}>{metric.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{metric.description}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', background: '#f1f5f9', color: '#475569', borderRadius: 4, fontSize: 12 }}>
                      {metric.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: statusStyle.color }}>
                      {metric.value}
                      <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 2 }}>{metric.unit}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 14, color: '#64748b' }}>
                      {metric.target}
                      <span style={{ fontSize: 11, marginLeft: 2 }}>{metric.unit}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ marginBottom: 4 }}>
                      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, width: 100 }}>
                        <div style={{ width: `${attainmentRate}%`, height: '100%', background: statusStyle.color, borderRadius: 3 }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: statusStyle.color }}>{attainmentRate.toFixed(1)}%</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {getTrendIcon(metric.trend)}
                      <span style={{ fontSize: 12, color: metric.trend === 'up' ? '#16a34a' : metric.trend === 'down' ? '#dc2626' : '#64748b' }}>
                        {metric.change > 0 ? '+' : ''}{metric.change}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>2025-05-02</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', background: '#f8fafc', color: '#64748b', borderRadius: 4, fontSize: 11 }}>
                      {metric.dataSource}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 科室质量评分排名 */}
      <div style={{ marginTop: 24, background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart2 size={18} color="#1e40af" />
          科室质量评分排名
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {deptScores.map(dept => (
            <div
              key={dept.dept}
              style={{
                padding: 16,
                background: dept.rank <= 3 ? '#f0fdf4' : '#f8fafc',
                borderRadius: 8,
                border: '1px solid',
                borderColor: dept.rank === 1 ? '#fbbf24' : dept.rank === 2 ? '#94a3b8' : dept.rank === 3 ? '#cd7c32' : '#e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: dept.rank === 1 ? '#fbbf24' : dept.rank === 2 ? '#94a3b8' : dept.rank === 3 ? '#cd7c32' : '#e2e8f0',
                  color: dept.rank <= 3 ? '#fff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  {dept.rank}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{dept.dept}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1e40af', marginBottom: 8 }}>{dept.score}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {dept.trends.map(t => (
                  <span
                    key={t.metric}
                    style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      background: t.change >= 0 ? '#f0fdf4' : '#fef2f2',
                      color: t.change >= 0 ? '#16a34a' : '#dc2626',
                      borderRadius: 4,
                    }}
                  >
                    {t.metric} {t.change >= 0 ? '+' : ''}{t.change}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部说明 */}
      <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 8, fontSize: 12, color: '#64748b' }}>
        <strong style={{ color: '#475569' }}>数据说明：</strong>
        本页面数据每日凌晨2:00自动更新一次。本月数据统计周期为2025年5月1日至今日。
        质量指标计算方法参照《心电图质量控制规范(2024版)》，目标值根据三级甲等医院评审标准制定。
        如有疑问，请联系心电图室质量控制管理员。
      </div>
    </div>
  )
}
