import React, { useState, useMemo } from 'react'
import { criticalECGRecords, CriticalECGRecord } from '../data/initialData'

const STATUS_CONFIG = {
  '待通知': { color: '#f59e0b', bg: '#fef3c7', label: '待通知' },
  '已通知': { color: '#3b82f6', bg: '#dbeafe', label: '已通知' },
  '已处理': { color: '#10b981', bg: '#d1fae5', label: '已处理' },
  '已记录': { color: '#6b7280', bg: '#f3f4f6', label: '已记录' },
} as const

const EXAM_TYPE_OPTIONS = ['全部', '12导联', '动态心电', '运动平板'] as const
const STATUS_OPTIONS = ['全部', '待通知', '已通知', '已处理', '已记录'] as const

type ExamType = typeof EXAM_TYPE_OPTIONS[number]
type StatusType = typeof STATUS_OPTIONS[number]

const CriticalValuePage: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusType>('全部')
  const [examTypeFilter, setExamTypeFilter] = useState<ExamType>('全部')
  const [selectedRecord, setSelectedRecord] = useState<CriticalECGRecord | null>(null)
  const [showModal, setShowModal] = useState(false)
  // 通知弹窗状态
  const [notifyModal, setNotifyModal] = useState(false)
  const [notifyRecord, setNotifyRecord] = useState<CriticalECGRecord | null>(null)
  const [notifyPhone, setNotifyPhone] = useState('')
  const [notifyNote, setNotifyNote] = useState('')
  // 处理弹窗状态
  const [processModal, setProcessModal] = useState(false)
  const [processRecord, setProcessRecord] = useState<CriticalECGRecord | null>(null)
  const [processResult, setProcessResult] = useState('')

  // 统计数据
  const stats = useMemo(() => {
    const counts = { 待通知: 0, 已通知: 0, 已处理: 0, 已记录: 0 }
    criticalECGRecords.forEach(r => { counts[r.status]++ })
    return counts
  }, [])

  // 筛选数据
  const filteredRecords = useMemo(() => {
    return criticalECGRecords.filter(record => {
      const matchSearch = searchText === '' ||
        record.patientName.includes(searchText) ||
        record.examId.includes(searchText) ||
        record.dept.includes(searchText)
      const matchStatus = statusFilter === '全部' || record.status === statusFilter
      const matchExamType = examTypeFilter === '全部' || record.examType === examTypeFilter
      return matchSearch && matchStatus && matchExamType
    })
  }, [searchText, statusFilter, examTypeFilter])

  // 操作处理
  const handleNotify = (e: React.MouseEvent, record: CriticalECGRecord) => {
    e.stopPropagation()
    setNotifyRecord(record)
    setNotifyPhone('')
    setNotifyNote('')
    setNotifyModal(true)
  }

  const handleProcess = (e: React.MouseEvent, record: CriticalECGRecord) => {
    e.stopPropagation()
    setProcessRecord(record)
    setProcessResult('')
    setProcessModal(true)
  }

  const submitNotify = () => {
    if (!notifyRecord) return
    const idx = criticalECGRecords.findIndex(r => r.id === notifyRecord.id)
    if (idx !== -1) criticalECGRecords[idx] = { ...criticalECGRecords[idx], status: '已通知' }
    setNotifyModal(false)
    setTimeout(() => window.location.reload(), 300)
  }

  const submitProcess = () => {
    if (!processRecord) return
    const idx = criticalECGRecords.findIndex(r => r.id === processRecord.id)
    if (idx !== -1) criticalECGRecords[idx] = { ...criticalECGRecords[idx], status: '已处理', handleTime: new Date().toLocaleString() }
    setProcessModal(false)
    setTimeout(() => window.location.reload(), 300)
  }

  const handleDetail = (record: CriticalECGRecord) => {
    setSelectedRecord(record)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRecord(null)
  }

  // 时间线数据
  const getTimeline = (record: CriticalECGRecord) => {
    const steps = [
      { label: '报告', time: record.reportedTime, person: record.reportedBy, completed: true },
      { label: '通知', time: record.receivedTime, person: record.receivedBy, completed: record.status !== '待通知' },
      { label: '接收', time: record.receivedTime, person: record.receivedBy, completed: record.status === '已通知' || record.status === '已处理' || record.status === '已记录' },
      { label: '处理', time: record.handleTime, person: '', completed: record.status === '已处理' || record.status === '已记录' },
    ]
    return steps
  }

  const getStatusStep = (status: string) => {
    switch (status) {
      case '待通知': return 1
      case '已通知': return 2
      case '已处理': return 3
      case '已记录': return 4
      default: return 0
    }
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>
          ⚠️ 心电危急值管理
        </h1>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {(Object.keys(STATUS_CONFIG) as Array<keyof typeof STATUS_CONFIG>).map(status => (
          <div
            key={status}
            style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '20px',
              borderLeft: `4px solid ${STATUS_CONFIG[status].color}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              {STATUS_CONFIG[status].label}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: STATUS_CONFIG[status].color }}>
              {stats[status]}
            </div>
          </div>
        ))}
      </div>

      {/* 筛选区域 */}
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
      }}>
        <input
          type="text"
          placeholder="搜索患者姓名/检查ID/科室..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusType)}
          style={{
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            minWidth: '120px',
          }}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <select
          value={examTypeFilter}
          onChange={e => setExamTypeFilter(e.target.value as ExamType)}
          style={{
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            minWidth: '120px',
          }}
        >
          {EXAM_TYPE_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* 表格 */}
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>检查ID</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>患者</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>性别/年龄/科室</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>检查类型</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>危急值类型</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>具体数值</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>报告人/时间</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>接收人/时间</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>处理时间</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>状态</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr
                key={record.id}
                style={{
                  borderBottom: index < filteredRecords.length - 1 ? '1px solid #e5e7eb' : 'none',
                  cursor: 'pointer',
                }}
                onClick={() => handleDetail(record)}
              >
                <td style={{ padding: '12px 16px', color: '#3b82f6' }}>{record.examId}</td>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{record.patientName}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                  {record.gender}/{record.age}岁/{record.dept}
                </td>
                <td style={{ padding: '12px 16px' }}>{record.examType}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: '#fef2f2',
                    color: '#dc2626',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                    border: '1px solid #fecaca',
                  }}>
                    {record.criticalType}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#dc2626', fontWeight: 500 }}>{record.value}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                  <div>{record.reportedBy}</div>
                  <div style={{ fontSize: '12px' }}>{record.reportedTime}</div>
                </td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                  <div>{record.receivedBy}</div>
                  <div style={{ fontSize: '12px' }}>{record.receivedTime}</div>
                </td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                  {record.handleTime || '-'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: STATUS_CONFIG[record.status].bg,
                    color: STATUS_CONFIG[record.status].color,
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}>
                    {record.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleDetail(record)}
                      style={{
                        padding: '6px 12px',
                        background: '#fff',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: '#374151',
                      }}
                    >
                      详情
                    </button>
                    {record.status === '待通知' && (
                      <button
                        onClick={e => handleNotify(e, record)}
                        style={{
                          padding: '6px 12px',
                          background: '#dc2626',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          color: '#fff',
                        }}
                      >
                        通知
                      </button>
                    )}
                    {(record.status === '已通知' || record.status === '已处理') && (
                      <button
                        onClick={e => handleProcess(e, record)}
                        style={{
                          padding: '6px 12px',
                          background: '#10b981',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          color: '#fff',
                        }}
                      >
                        处理
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRecords.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            暂无数据
          </div>
        )}
      </div>

      {/* 详情弹窗 */}
      {showModal && selectedRecord && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={closeModal}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '700px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            {/* 弹窗头部 */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>
                ⚠️ 危急值详情
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                }}
              >
                ×
              </button>
            </div>

            {/* 患者信息 */}
            <div style={{ padding: '24px' }}>
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedRecord.patientName}</span>
                  <span style={{ color: '#6b7280' }}>{selectedRecord.gender} / {selectedRecord.age}岁</span>
                  <span style={{ background: '#dc2626', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {selectedRecord.criticalType}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                  <div>检查ID：{selectedRecord.examId}</div>
                  <div>科室：{selectedRecord.dept}</div>
                  <div>检查类型：{selectedRecord.examType}</div>
                  <div>具体数值：<span style={{ color: '#dc2626', fontWeight: 'bold' }}>{selectedRecord.value}</span></div>
                </div>
              </div>

              {/* 描述 */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>危急值描述</h3>
                <p style={{ padding: '12px', background: '#f9fafb', borderRadius: '6px', fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  {selectedRecord.description}
                </p>
              </div>

              {/* 时间线 */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '16px' }}>处理流程</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {getTimeline(selectedRecord).map((step, index) => {
                    const currentStep = getStatusStep(selectedRecord.status)
                    const isCompleted = index < currentStep
                    const isCurrent = index === currentStep - 1 || (currentStep === 0 && index === 0)
                    return (
                      <div key={index} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isCompleted ? '#10b981' : isCurrent ? '#dc2626' : '#e5e7eb',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          position: 'relative',
                          zIndex: 1,
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: isCompleted || isCurrent ? '#374151' : '#9ca3af' }}>
                          {step.label}
                        </div>
                        {step.time && (
                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{step.time}</div>
                        )}
                        {step.person && (
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{step.person}</div>
                        )}
                        {index < 3 && (
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            left: '50%',
                            width: '100%',
                            height: '2px',
                            background: index < currentStep - 1 ? '#10b981' : '#e5e7eb',
                            zIndex: 0,
                          }} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 处理结果 */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>处理结果/转归</h3>
                <div style={{
                  padding: '16px',
                  background: '#d1fae5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#065f46',
                }}>
                  {selectedRecord.outcome}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 通知弹窗 */}
      {notifyModal && notifyRecord && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={() => setNotifyModal(false)}>
          <div style={{ background: '#fff', borderRadius: 12, width: 480, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '2px solid #dc2626', background: '#dc2626', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>📞 通知临床医生</span>
              <button onClick={() => setNotifyModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 16, padding: 12, background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca' }}>
                <div style={{ fontSize: 14, color: '#991b1b' }}>
                  <strong>{notifyRecord.patientName}</strong> · {notifyRecord.criticalType}<br/>
                  科室：{notifyRecord.dept} · 数值：<strong>{notifyRecord.value}</strong>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>通知电话</label>
                <input value={notifyPhone} onChange={e => setNotifyPhone(e.target.value)} placeholder="请输入接收人电话..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>备注</label>
                <textarea value={notifyNote} onChange={e => setNotifyNote(e.target.value)} placeholder="记录通知情况..." style={{ width: '100%', minHeight: 80, padding: 10, border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, resize: 'vertical', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={() => setNotifyModal(false)} style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', fontSize: 14, cursor: 'pointer' }}>取消</button>
                <button onClick={submitNotify} style={{ padding: '8px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>确认通知</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 处理弹窗 */}
      {processModal && processRecord && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={() => setProcessModal(false)}>
          <div style={{ background: '#fff', borderRadius: 12, width: 480, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '2px solid #10b981', background: '#10b981', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>✅ 处理危急值</span>
              <button onClick={() => setProcessModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 16, padding: 12, background: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: 14, color: '#065f46' }}>
                  <strong>{processRecord.patientName}</strong> · {processRecord.criticalType}<br/>
                  检查ID：{processRecord.examId} · 科室：{processRecord.dept}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>处理结果</label>
                <textarea value={processResult} onChange={e => setProcessResult(e.target.value)} placeholder="请输入处理结果..." style={{ width: '100%', minHeight: 100, padding: 10, border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, resize: 'vertical', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={() => setProcessModal(false)} style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', fontSize: 14, cursor: 'pointer' }}>取消</button>
                <button onClick={submitProcess} style={{ padding: '8px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>确认处理</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CriticalValuePage
