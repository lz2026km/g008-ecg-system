import { useState, useMemo } from 'react'
import {
  CheckCircle, Clock, AlertTriangle, User, FileText, Heart,
  Activity, Dumbbell, Users, ArrowRight, Search, Filter,
  Bell, Calendar, X, Eye, Edit, Trash2, MessageSquare,
  ChevronDown, ChevronUp, Filter as FilterIcon, RefreshCw
} from 'lucide-react'
import {
  ecg12Records, holterRecords, exerciseRecords,
  criticalECGRecords, regionalECGRequests
} from '../data/initialData'

// 待办事项类型
interface TodoItem {
  id: string
  type: 'ecg12' | 'holter' | 'exercise' | 'critical' | 'regional' | 'review'
  priority: 'urgent' | 'high' | 'normal' | 'low'
  title: string
  patientName: string
  patientId: string
  dept: string
  description: string
  createTime: string
  deadline?: string
  assignedTo?: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  sourceId: string
}

// 筛选条件
interface FilterCondition {
  type?: string
  priority?: string
  status?: string
  dept?: string
  searchText?: string
}

export default function TodoCenterPage() {
  const [filter, setFilter] = useState<FilterCondition>({
    type: 'all',
    priority: 'all',
    status: 'all',
    dept: 'all',
    searchText: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  // 从initialData生成待办事项
  const todoItems = useMemo<TodoItem[]>(() => {
    const items: TodoItem[] = []

    // 12导联心电图待办
    ecg12Records.forEach(r => {
      if (r.status === '待报告') {
        items.push({
          id: `ecg12-report-${r.id}`,
          type: 'ecg12',
          priority: r.examType === '加急' ? 'urgent' : r.isCritical ? 'high' : 'normal',
          title: '12导联心电图报告',
          patientName: r.patientName,
          patientId: r.patientId,
          dept: r.dept,
          description: `${r.examType}检查，心率${r.heartRate}bpm，诊断：${r.diagnosis}`,
          createTime: r.reportTime,
          assignedTo: r.technician,
          status: 'pending',
          sourceId: r.id,
        })
      }
      if (r.status === '待审核') {
        items.push({
          id: `ecg12-review-${r.id}`,
          type: 'review',
          priority: r.isCritical ? 'urgent' : 'high',
          title: '12导联心电图审核',
          patientName: r.patientName,
          patientId: r.patientId,
          dept: r.dept,
          description: `诊断：${r.diagnosis}，报告医生：${r.doctor}`,
          createTime: r.reportTime,
          deadline: new Date(new Date(r.reportTime).getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
          status: 'pending',
          sourceId: r.id,
        })
      }
    })

    // 动态心电待办
    holterRecords.forEach(r => {
      if (r.status === '待报告') {
        items.push({
          id: `holter-report-${r.id}`,
          type: 'holter',
          priority: r.isCritical ? 'urgent' : 'normal',
          title: '动态心电图报告',
          patientName: r.patientName,
          patientId: r.patientId,
          dept: r.dept,
          description: `监测时长${r.duration}小时，平均心率${r.avgHeartRate}bpm，总心搏${r.totalBeats}次`,
          createTime: r.reportTime,
          assignedTo: r.doctor,
          status: 'pending',
          sourceId: r.id,
        })
      }
      if (r.status === '待审核') {
        items.push({
          id: `holter-review-${r.id}`,
          type: 'review',
          priority: r.isCritical ? 'urgent' : 'high',
          title: '动态心电图审核',
          patientName: r.patientName,
          patientId: r.patientId,
          dept: r.dept,
          description: `诊断：${r.diagnosis}，会诊意见：${r.stChanges ? 'ST段改变' : '未见明显异常'}`,
          createTime: r.reportTime,
          status: 'pending',
          sourceId: r.id,
        })
      }
    })

    // 运动平板待办
    exerciseRecords.forEach(r => {
      if (r.status === '待报告') {
        items.push({
          id: `exercise-report-${r.id}`,
          type: 'exercise',
          priority: r.isCritical ? 'urgent' : 'normal',
          title: '运动平板试验报告',
          patientName: r.patientName,
          patientId: r.patientId,
          dept: r.dept,
          description: `方案：${r.protocol}，最大心率${r.achievedHR}bpm，结论：${r.diagnosis}`,
          createTime: r.reportTime,
          assignedTo: r.doctor,
          status: 'pending',
          sourceId: r.id,
        })
      }
    })

    // 危急值待办
    criticalECGRecords.forEach(r => {
      if (r.status !== '已处理') {
        items.push({
          id: `critical-${r.id}`,
          type: 'critical',
          priority: 'urgent',
          title: `危急值通知 - ${r.criticalType}`,
          patientName: r.patientName,
          patientId: r.patientId,
          dept: r.dept,
          description: `${r.examType}检查，${r.description}，数值：${r.value}`,
          createTime: r.reportedTime,
          status: r.status === '已通知' ? 'processing' : 'pending',
          sourceId: r.id,
        })
      }
    })

    // 区域心电待办
    regionalECGRequests.forEach(r => {
      if (r.status !== '已完成') {
        items.push({
          id: `regional-${r.id}`,
          type: 'regional',
          priority: 'normal',
          title: '区域心电会诊',
          patientName: r.patientName,
          patientId: '-',
          dept: r.requestingHospital,
          description: `会诊问题：${r.consultationQuestion}，原诊断：${r.originalDiagnosis}`,
          createTime: r.submitTime,
          assignedTo: r.assignedExpert || '待分配',
          status: r.status === '待分配' ? 'pending' : r.status === '阅图中' ? 'processing' : 'completed',
          sourceId: r.id,
        })
      }
    })

    return items.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }, [])

  // 筛选后的待办事项
  const filteredItems = useMemo(() => {
    return todoItems.filter(item => {
      if (filter.type !== 'all' && item.type !== filter.type) return false
      if (filter.priority !== 'all' && item.priority !== filter.priority) return false
      if (filter.status !== 'all' && item.status !== filter.status) return false
      if (filter.dept !== 'all' && item.dept !== filter.dept) return false
      if (filter.searchText) {
        const search = filter.searchText.toLowerCase()
        return (
          item.patientName.toLowerCase().includes(search) ||
          item.title.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          item.dept.toLowerCase().includes(search)
        )
      }
      return true
    })
  }, [todoItems, filter])

  // 统计信息
  const stats = useMemo(() => ({
    total: todoItems.length,
    pending: todoItems.filter(i => i.status === 'pending').length,
    processing: todoItems.filter(i => i.status === 'processing').length,
    urgent: todoItems.filter(i => i.priority === 'urgent').length,
    critical: todoItems.filter(i => i.type === 'critical').length,
    overdue: todoItems.filter(i => i.deadline && new Date(i.deadline) < new Date()).length,
  }), [todoItems])

  // 切换展开
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // 切换选择
  const toggleSelect = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredItems.map(i => i.id)))
    }
  }

  // 批量处理确认弹窗状态
  const [batchModal, setBatchModal] = useState<{ action: 'complete' | 'cancel' } | null>(null)

  // 批量处理
  const batchProcess = (action: 'complete' | 'cancel') => {
    if (selectedItems.size === 0) return
    setBatchModal({ action })
  }

  const confirmBatch = () => {
    if (!batchModal) return
    setSelectedItems(new Set())
    setBatchModal(null)
  }

  // 获取类型图标和颜色
  const getTypeStyle = (type: TodoItem['type']) => {
    switch (type) {
      case 'ecg12': return { icon: Heart, color: '#1e40af', bg: '#eff6ff', label: '12导联' }
      case 'holter': return { icon: Activity, color: '#0891b2', bg: '#ecfeff', label: '动态心电' }
      case 'exercise': return { icon: Dumbbell, color: '#059669', bg: '#ecfdf5', label: '运动平板' }
      case 'critical': return { icon: AlertTriangle, color: '#dc2626', bg: '#fef2f2', label: '危急值' }
      case 'regional': return { icon: Users, color: '#7c3aed', bg: '#f5f3ff', label: '区域协作' }
      case 'review': return { icon: FileText, color: '#d97706', bg: '#fffbeb', label: '报告审核' }
    }
  }

  // 获取优先级颜色
  const getPriorityColor = (priority: TodoItem['priority']) => {
    switch (priority) {
      case 'urgent': return '#dc2626'
      case 'high': return '#d97706'
      case 'normal': return '#1e40af'
      case 'low': return '#64748b'
    }
  }

  // 获取状态颜色
  const getStatusStyle = (status: TodoItem['status']) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', color: '#d97706', label: '待处理' }
      case 'processing': return { bg: '#dbeafe', color: '#1e40af', label: '处理中' }
      case 'completed': return { bg: '#dcfce7', color: '#16a34a', label: '已完成' }
      case 'cancelled': return { bg: '#f1f5f9', color: '#64748b', label: '已取消' }
    }
  }

  // 获取所有科室
  const allDepts = useMemo(() => {
    const depts = new Set<string>()
    todoItems.forEach(i => depts.add(i.dept))
    return Array.from(depts).sort()
  }, [todoItems])

  return (
    <div style={{ fontSize: 16 }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>待办工作中心</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>统一管理所有待处理工作事项</p>
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
            <RefreshCw size={14} />
            刷新
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              background: showFilters ? '#1e40af' : '#f8fafc',
              border: '1px solid',
              borderColor: showFilters ? '#1e40af' : '#e2e8f0',
              borderRadius: 6,
              fontSize: 14,
              color: showFilters ? '#fff' : '#64748b',
              cursor: 'pointer',
            }}
          >
            <FilterIcon size={14} />
            筛选
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="全部待办" value={stats.total} color="#1e40af" icon={FileText} />
        <StatCard label="待处理" value={stats.pending} color="#d97706" icon={Clock} />
        <StatCard label="处理中" value={stats.processing} color="#1e40af" icon={RefreshCw} />
        <StatCard label="紧急" value={stats.urgent} color="#dc2626" icon={AlertTriangle} />
        <StatCard label="危急值" value={stats.critical} color="#dc2626" icon={Bell} />
        <StatCard label="已逾期" value={stats.overdue} color="#dc2626" icon={Clock} />
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <div style={{ 
          background: '#fff', 
          borderRadius: 8, 
          padding: 20, 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: 24,
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>事项类型</label>
              <select
                value={filter.type}
                onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 14,
                  outline: 'none',
                }}
              >
                <option value="all">全部类型</option>
                <option value="ecg12">12导联心电图</option>
                <option value="holter">动态心电图</option>
                <option value="exercise">运动平板试验</option>
                <option value="critical">危急值</option>
                <option value="regional">区域协作</option>
                <option value="review">报告审核</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>优先级</label>
              <select
                value={filter.priority}
                onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 14,
                  outline: 'none',
                }}
              >
                <option value="all">全部优先级</option>
                <option value="urgent">紧急</option>
                <option value="high">高</option>
                <option value="normal">普通</option>
                <option value="low">低</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>状态</label>
              <select
                value={filter.status}
                onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 14,
                  outline: 'none',
                }}
              >
                <option value="all">全部状态</option>
                <option value="pending">待处理</option>
                <option value="processing">处理中</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>科室/部门</label>
              <select
                value={filter.dept}
                onChange={e => setFilter(f => ({ ...f, dept: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 14,
                  outline: 'none',
                }}
              >
                <option value="all">全部科室</option>
                {allDepts.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>搜索</label>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="搜索患者姓名/描述"
                  value={filter.searchText}
                  onChange={e => setFilter(f => ({ ...f, searchText: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 32px',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              共找到 <strong style={{ color: '#1e40af' }}>{filteredItems.length}</strong> 项待办
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setFilter({ type: 'all', priority: 'all', status: 'all', dept: 'all', searchText: '' })}
                style={{
                  padding: '6px 12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                重置筛选
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 批量操作栏 */}
      {selectedItems.size > 0 && (
        <div style={{
          background: '#1e40af',
          borderRadius: 8,
          padding: '12px 20px',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff',
        }}>
          <span style={{ fontSize: 14 }}>
            已选择 <strong>{selectedItems.size}</strong> 项
          </span>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => batchProcess('complete')}
              style={{
                padding: '6px 12px',
                background: '#4ade80',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              批量完成
            </button>
            <button
              onClick={() => batchProcess('cancel')}
              style={{
                padding: '6px 12px',
                background: '#64748b',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              批量取消
            </button>
            <button
              onClick={() => setSelectedItems(new Set())}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 6,
                fontSize: 13,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              取消选择
            </button>
          </div>
        </div>
      )}

      {/* 待办列表 */}
      <div style={{ 
        background: '#fff', 
        borderRadius: 8, 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
      }}>
        {/* 表头 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '40px 120px 1fr 150px 100px 100px 50px',
          gap: 12,
          padding: '12px 20px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontSize: 13,
          fontWeight: 600,
          color: '#64748b',
        }}>
          <div>
            <input
              type="checkbox"
              checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
              onChange={toggleSelectAll}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
          </div>
          <div>类型</div>
          <div>待办内容</div>
          <div>患者/来源</div>
          <div>优先级</div>
          <div>状态</div>
          <div>操作</div>
        </div>

        {/* 列表项 */}
        {filteredItems.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
            <CheckCircle size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
            <div style={{ fontSize: 16, marginBottom: 8 }}>暂无待办事项</div>
            <div style={{ fontSize: 13 }}>所有工作都已处理完成，继续保持！</div>
          </div>
        ) : (
          filteredItems.map(item => {
            const typeStyle = getTypeStyle(item.type)
            const statusStyle = getStatusStyle(item.status)
            const TypeIcon = typeStyle.icon
            const isExpanded = expandedItems.has(item.id)
            const isSelected = selectedItems.has(item.id)

            return (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 120px 1fr 150px 100px 100px 50px',
                  gap: 12,
                  padding: '16px 20px',
                  borderBottom: '1px solid #f1f5f9',
                  background: isSelected ? '#eff6ff' : 'transparent',
                  transition: 'background 0.15s',
                  alignItems: 'center',
                }}
              >
                <div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(item.id)}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    background: typeStyle.bg,
                    borderRadius: 6,
                    fontSize: 12,
                    color: typeStyle.color,
                  }}>
                    <TypeIcon size={12} />
                    {typeStyle.label}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 500, color: '#1e293b', marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={12} />
                    {item.createTime}
                    {item.assignedTo && (
                      <>
                        <span>·</span>
                        <User size={12} />
                        {item.assignedTo}
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 500, color: '#1e293b' }}>{item.patientName}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{item.dept}</div>
                </div>
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    background: item.priority === 'urgent' ? '#fef2f2' : item.priority === 'high' ? '#fff7ed' : '#f8fafc',
                    color: getPriorityColor(item.priority),
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                  }}>
                    {item.priority === 'urgent' ? '紧急' : item.priority === 'high' ? '高' : item.priority === 'normal' ? '普通' : '低'}
                  </span>
                </div>
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    borderRadius: 4,
                    fontSize: 12,
                  }}>
                    {statusStyle.label}
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    style={{
                      padding: 4,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94a3b8',
                    }}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 分页 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
        <span style={{ fontSize: 13, color: '#64748b' }}>
          显示 {filteredItems.length} 项中的 1-{filteredItems.length} 项
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {['1'].map(page => (
            <button
              key={page}
              style={{
                padding: '6px 12px',
                background: '#1e40af',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* 批量处理确认弹窗 */}
      {batchModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', borderRadius: 12, width: 400, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{batchModal.action === 'complete' ? '✅' : '❌'}</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#1e293b' }}>
                确认{batchModal.action === 'complete' ? '完成' : '取消'} {selectedItems.size} 项待办？
              </div>
              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
                {batchModal.action === 'complete' ? '选中的待办事项将被标记为已完成' : '选中的待办事项将被取消'}
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={() => setBatchModal(null)} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', fontSize: 14, cursor: 'pointer' }}>取消</button>
                <button onClick={confirmBatch} style={{ padding: '8px 24px', background: batchModal.action === 'complete' ? '#10b981' : '#6b7280', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>确认</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 统计卡片组件
function StatCard({ label, value, color, icon: Icon }: {
  label: string
  value: number | string
  color: string
  icon: React.ElementType
}) {
  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: 8, 
      padding: 16, 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Icon size={16} color={color} />
        <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>{value}</div>
    </div>
  )
}
