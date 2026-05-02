import React, { useState, useMemo } from 'react'
import { regionalECGHospitals, regionalECGRequests, RegionalECGHospital, RegionalECGRequest } from '../data/initialData'

const PRIMARY = '#7c3aed'
const PRIMARY_LIGHT = '#a78bfa'
const PRIMARY_BG = '#f5f3ff'
const BORDER_COLOR = '#e5e7eb'
const TEXT_SECONDARY = '#6b7280'
const BG_GRAY = '#f9fafb'

interface ModalProps {
  visible: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ visible, onClose, title, children }) => {
  if (!visible) return null
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#fff', borderRadius: 12, width: 680, maxHeight: '85vh',
        overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${BORDER_COLOR}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: '#1f2937' }}>{title}</span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 24, cursor: 'pointer',
            color: TEXT_SECONDARY, lineHeight: 1
          }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}

const StatusBadge: React.FC<{ online: boolean }> = ({ online }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 10px', borderRadius: 9999, fontSize: 13,
    backgroundColor: online ? '#d1fae5' : '#fee2e2',
    color: online ? '#065f46' : '#991b1b'
  }}>
    <span style={{
      width: 8, height: 8, borderRadius: '50%',
      backgroundColor: online ? '#10b981' : '#ef4444'
    }} />
    {online ? '在线' : '离线'}
  </span>
)

const RequestStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, { bg: string; color: string }> = {
    '待分配': { bg: '#fef3c7', color: '#92400e' },
    '阅图中': { bg: '#dbeafe', color: '#1e40af' },
    '已完成': { bg: '#d1fae5', color: '#065f46' }
  }
  const c = config[status] || { bg: '#f3f4f6', color: '#374151' }
  return (
    <span style={{
      padding: '4px 10px', borderRadius: 9999, fontSize: 13,
      backgroundColor: c.bg, color: c.color
    }}>{status}</span>
  )
}

const StatCard: React.FC<{ label: string; value: string | number; icon: string }> = ({ label, value, icon }) => (
  <div style={{
    backgroundColor: '#fff', borderRadius: 12, padding: '20px 24px',
    border: `1px solid ${BORDER_COLOR}`, display: 'flex', alignItems: 'center', gap: 16
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12, backgroundColor: PRIMARY_BG,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#1f2937' }}>{value}</div>
      <div style={{ fontSize: 14, color: TEXT_SECONDARY, marginTop: 2 }}>{label}</div>
    </div>
  </div>
)

interface TableProps {
  columns: string[]
  renderRow: (item: any, idx: number) => React.ReactNode
  data: any[]
}

const Table: React.FC<TableProps> = ({ columns, renderRow, data }) => (
  <div style={{ border: `1px solid ${BORDER_COLOR}`, borderRadius: 12, overflow: 'hidden' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr style={{ backgroundColor: BG_GRAY }}>
          {columns.map((col, i) => (
            <th key={i} style={{
              padding: '12px 16px', textAlign: 'left', fontWeight: 600,
              color: '#374151', borderBottom: `1px solid ${BORDER_COLOR}`
            }}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => renderRow(item, idx))}
      </tbody>
    </table>
  </div>
)

const RegionalECGPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hospitals' | 'requests'>('hospitals')
  const [selectedHospital, setSelectedHospital] = useState<RegionalECGHospital | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<RegionalECGRequest | null>(null)
  const [hospitalModalVisible, setHospitalModalVisible] = useState(false)
  const [requestModalVisible, setRequestModalVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('全部')

  // Hospital stats
  const hospitalStats = useMemo(() => {
    const total = regionalECGHospitals.length
    const online = regionalECGHospitals.filter(h => h.online).length
    const pending = regionalECGHospitals.reduce((sum, h) => sum + h.pendingCount, 0)
    const avgResponse = (regionalECGHospitals.reduce((sum, h) => sum + h.avgTurnaroundHours, 0) / total).toFixed(1)
    return { total, online, pending, avgResponse }
  }, [])

  // Request stats
  const requestStats = useMemo(() => ({
    toAssign: regionalECGRequests.filter(r => r.status === '待分配').length,
    reading: regionalECGRequests.filter(r => r.status === '阅图中').length,
    completed: regionalECGRequests.filter(r => r.status === '已完成').length
  }), [])

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return regionalECGRequests.filter(r => {
      const matchSearch = searchText === '' ||
        r.patientName.includes(searchText) ||
        r.requestingHospital.includes(searchText) ||
        r.requestingDoctor.includes(searchText)
      const matchStatus = statusFilter === '全部' || r.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [searchText, statusFilter])

  const handleViewHospital = (hospital: RegionalECGHospital) => {
    setSelectedHospital(hospital)
    setHospitalModalVisible(true)
  }

  const handleViewRequest = (request: RegionalECGRequest) => {
    setSelectedRequest(request)
    setRequestModalVisible(true)
  }

  return (
    <div style={{ padding: '24px', backgroundColor: BG_GRAY, minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>区域心电协作管理</h1>
        <p style={{ fontSize: 14, color: TEXT_SECONDARY }}>管理协作医院会诊请求与数据统计</p>
      </div>

      {/* Tab Switcher */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 24,
        backgroundColor: '#fff', padding: 6, borderRadius: 12, width: 'fit-content',
        border: `1px solid ${BORDER_COLOR}`
      }}>
        <button onClick={() => setActiveTab('hospitals')} style={{
          padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
          backgroundColor: activeTab === 'hospitals' ? PRIMARY : 'transparent',
          color: activeTab === 'hospitals' ? '#fff' : TEXT_SECONDARY
        }}>协作医院</button>
        <button onClick={() => setActiveTab('requests')} style={{
          padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
          backgroundColor: activeTab === 'requests' ? PRIMARY : 'transparent',
          color: activeTab === 'requests' ? '#fff' : TEXT_SECONDARY
        }}>会诊请求</button>
      </div>

      {/* Left Tab: Hospitals */}
      {activeTab === 'hospitals' && (
        <div>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <StatCard label="总医院数" value={hospitalStats.total} icon="🏥" />
            <StatCard label="在线医院" value={hospitalStats.online} icon="🟢" />
            <StatCard label="待处理" value={hospitalStats.pending} icon="⏳" />
            <StatCard label="平均响应(h)" value={hospitalStats.avgResponse} icon="⚡" />
          </div>

          {/* Hospital Table */}
          <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, border: `1px solid ${BORDER_COLOR}` }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1f2937' }}>医院列表</h3>
            </div>
            <Table
              columns={['医院名称', '等级', '地址', '累计提交', '累计完成', '待处理', '平均响应(h)', '状态', '操作']}
              data={regionalECGHospitals}
              renderRow={(hospital) => (
                <tr key={hospital.id}>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}` }}>
                    <div style={{ fontWeight: 500, color: '#1f2937' }}>{hospital.name}</div>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}` }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 4, fontSize: 12,
                      backgroundColor: PRIMARY_BG, color: PRIMARY
                    }}>{hospital.level}</span>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, color: TEXT_SECONDARY, fontSize: 13 }}>{hospital.address}</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, textAlign: 'center' }}>{hospital.ecgSubmitted}</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, textAlign: 'center' }}>{hospital.ecgCompleted}</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 4, fontSize: 12,
                      backgroundColor: hospital.pendingCount > 5 ? '#fef3c7' : '#d1fae5',
                      color: hospital.pendingCount > 5 ? '#92400e' : '#065f46'
                    }}>{hospital.pendingCount}</span>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, textAlign: 'center', fontSize: 13 }}>{hospital.avgTurnaroundHours}h</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}` }}>
                    <StatusBadge online={hospital.online} />
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}` }}>
                    <button onClick={() => handleViewHospital(hospital)} style={{
                      padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                      fontSize: 13, backgroundColor: PRIMARY, color: '#fff',
                      transition: 'background-color 0.2s'
                    }}>查看详情</button>
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      )}

      {/* Right Tab: Requests */}
      {activeTab === 'requests' && (
        <div>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            <StatCard label="待分配" value={requestStats.toAssign} icon="📋" />
            <StatCard label="阅图中" value={requestStats.reading} icon="👁️" />
            <StatCard label="已完成" value={requestStats.completed} icon="✅" />
          </div>

          {/* Search and Filter */}
          <div style={{
            backgroundColor: '#fff', borderRadius: 12, padding: 20,
            border: `1px solid ${BORDER_COLOR}`, marginBottom: 16, display: 'flex', gap: 12
          }}>
            <input
              type="text"
              placeholder="搜索患者姓名/医院/医生..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 8, border: `1px solid ${BORDER_COLOR}`,
                fontSize: 14, outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = PRIMARY}
              onBlur={e => e.target.style.borderColor = BORDER_COLOR}
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 16px', borderRadius: 8, border: `1px solid ${BORDER_COLOR}`,
                fontSize: 14, outline: 'none', cursor: 'pointer', minWidth: 140,
                backgroundColor: '#fff'
              }}
            >
              <option value="全部">全部状态</option>
              <option value="待分配">待分配</option>
              <option value="阅图中">阅图中</option>
              <option value="已完成">已完成</option>
            </select>
          </div>

          {/* Request Table */}
          <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, border: `1px solid ${BORDER_COLOR}` }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1f2937' }}>会诊列表</h3>
            </div>
            <Table
              columns={['申请医院', '患者', '性别', '年龄', '检查类型', '临床病史', '原诊断', '会诊问题', '图片数', '状态', '专家', '耗时', '操作']}
              data={filteredRequests}
              renderRow={(req) => (
                <tr key={req.id}>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, fontSize: 13 }}>{req.requestingHospital}</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, fontWeight: 500 }}>{req.patientName}</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, fontSize: 13 }}>{req.gender}</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, fontSize: 13, textAlign: 'center' }}>{req.age}</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, fontSize: 13 }}>
                    <span style={{ padding: '2px 6px', backgroundColor: PRIMARY_BG, color: PRIMARY, borderRadius: 4, fontSize: 12 }}>{req.ecgType}</span>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, fontSize: 12, color: TEXT_SECONDARY, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.clinicalHistory}</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, fontSize: 12, color: TEXT_SECONDARY }}>{req.originalDiagnosis}</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, fontSize: 12, color: TEXT_SECONDARY, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.consultationQuestion}</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, fontSize: 13, textAlign: 'center' }}>{req.submittedImages}</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}` }}>
                    <RequestStatusBadge status={req.status} />
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, fontSize: 13 }}>{req.assignedExpert || '-'}</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}`, fontSize: 13 }}>{req.turnaroundHours ? `${req.turnaroundHours}h` : '-'}</td>
                  <td style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER_COLOR}` }}>
                    <button onClick={() => handleViewRequest(req)} style={{
                      padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                      fontSize: 13, backgroundColor: PRIMARY, color: '#fff'
                    }}>详情</button>
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      )}

      {/* Hospital Detail Modal */}
      <Modal
        visible={hospitalModalVisible}
        onClose={() => setHospitalModalVisible(false)}
        title="医院详情"
      >
        {selectedHospital && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>基本信息</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 16, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 4 }}>医院名称</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#1f2937' }}>{selectedHospital.name}</div>
                </div>
                <div style={{ padding: 16, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 4 }}>医院等级</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#1f2937' }}>{selectedHospital.level}</div>
                </div>
                <div style={{ padding: 16, backgroundColor: BG_GRAY, borderRadius: 8, gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 4 }}>地址</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#1f2937' }}>{selectedHospital.address}</div>
                </div>
                <div style={{ padding: 16, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 4 }}>科别</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#1f2937' }}>{selectedHospital.dept}</div>
                </div>
                <div style={{ padding: 16, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 4 }}>状态</div>
                  <div style={{ marginTop: 4 }}><StatusBadge online={selectedHospital.online} /></div>
                </div>
                {selectedHospital.lastSubmitTime && (
                  <div style={{ padding: 16, backgroundColor: BG_GRAY, borderRadius: 8, gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 4 }}>最后提交时间</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#1f2937' }}>{selectedHospital.lastSubmitTime}</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>统计数据</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <div style={{ padding: 16, backgroundColor: PRIMARY_BG, borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: PRIMARY }}>{selectedHospital.ecgSubmitted}</div>
                  <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginTop: 4 }}>累计提交</div>
                </div>
                <div style={{ padding: 16, backgroundColor: '#d1fae5', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#065f46' }}>{selectedHospital.ecgCompleted}</div>
                  <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginTop: 4 }}>累计完成</div>
                </div>
                <div style={{ padding: 16, backgroundColor: '#fef3c7', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#92400e' }}>{selectedHospital.pendingCount}</div>
                  <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginTop: 4 }}>待处理</div>
                </div>
                <div style={{ padding: 16, backgroundColor: '#dbeafe', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1e40af' }}>{selectedHospital.avgTurnaroundHours}h</div>
                  <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginTop: 4 }}>平均响应</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setHospitalModalVisible(false)} style={{
                padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 14, backgroundColor: '#e5e7eb', color: '#374151', fontWeight: 500
              }}>关闭</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Request Detail Modal */}
      <Modal
        visible={requestModalVisible}
        onClose={() => setRequestModalVisible(false)}
        title="会诊详情"
      >
        {selectedRequest && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>患者信息</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>患者姓名</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.patientName}</div>
                </div>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>性别</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.gender}</div>
                </div>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>年龄</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.age}岁</div>
                </div>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>检查类型</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.ecgType}</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>会诊信息</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>申请医院</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.requestingHospital}</div>
                </div>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>申请医生</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.requestingDoctor}</div>
                </div>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>提交时间</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.submitTime}</div>
                </div>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>图片数量</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.submittedImages}张</div>
                </div>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8, gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>临床病史</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.clinicalHistory}</div>
                </div>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8, gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>原诊断</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.originalDiagnosis}</div>
                </div>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8, gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>会诊问题</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.consultationQuestion}</div>
                </div>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8, gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>心电图所见</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.ecgFindings}</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>处理状态</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>状态</div>
                  <div style={{ marginTop: 4 }}><RequestStatusBadge status={selectedRequest.status} /></div>
                </div>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>分配专家</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.assignedExpert || '未分配'}</div>
                </div>
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>耗时</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.turnaroundHours ? `${selectedRequest.turnaroundHours}小时` : '-'}</div>
                </div>
              </div>
              {selectedRequest.completeTime && (
                <div style={{ padding: 14, backgroundColor: BG_GRAY, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 3 }}>完成时间</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{selectedRequest.completeTime}</div>
                </div>
              )}
            </div>

            {selectedRequest.expertOpinion && (
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>专家意见</h4>
                <div style={{
                  padding: 16, backgroundColor: PRIMARY_BG, borderRadius: 8,
                  borderLeft: `4px solid ${PRIMARY}`
                }}>
                  <div style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.7 }}>{selectedRequest.expertOpinion}</div>
                </div>
              </div>
            )}

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setRequestModalVisible(false)} style={{
                padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 14, backgroundColor: '#e5e7eb', color: '#374151', fontWeight: 500
              }}>关闭</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default RegionalECGPage
