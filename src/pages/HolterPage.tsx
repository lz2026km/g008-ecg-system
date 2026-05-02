import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { holterRecords, HolterRecord } from '../data/initialData'

type StatusType = '监测中' | '待报告' | '待审核' | '已完成'

const STATUS_COLORS: Record<StatusType, { bg: string; color: string }> = {
  '监测中': { bg: '#e0f2fe', color: '#0369a1' },
  '待报告': { bg: '#fef3c7', color: '#b45309' },
  '待审核': { bg: '#ede9fe', color: '#7c3aed' },
  '已完成': { bg: '#dcfce7', color: '#15803d' },
}

const STAT_COLORS: Record<string, string> = {
  '监测中': '#0891b2',
  '待报告': '#d97706',
  '待审核': '#7c3aed',
  '已完成': '#16a34a',
}

export default function HolterPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusType | ''>('')
  const [selectedRecord, setSelectedRecord] = useState<HolterRecord | null>(null)

  const filtered = useMemo(() => {
    return holterRecords.filter(r => {
      const matchSearch =
        !search ||
        r.examId.toLowerCase().includes(search.toLowerCase()) ||
        r.patientName.toLowerCase().includes(search.toLowerCase()) ||
        r.diagnosis.toLowerCase().includes(search.toLowerCase())
      const matchStatus = !statusFilter || r.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  const stats = useMemo(() => ({
    monitoring: holterRecords.filter(r => r.status === '监测中').length,
    pendingReport: holterRecords.filter(r => r.status === '待报告').length,
    pendingReview: holterRecords.filter(r => r.status === '待审核').length,
    completed: holterRecords.filter(r => r.status === '已完成').length,
  }), [])

  const handleDetail = (record: HolterRecord) => {
    setSelectedRecord(record)
  }

  const handleCloseModal = () => {
    setSelectedRecord(null)
  }

  return (
    <div>
      {/* 标题 */}
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24, color: '#0891b2' }}>
        动态心电图
      </h2>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {([
          { label: '监测中', key: 'monitoring' },
          { label: '待报告', key: 'pendingReport' },
          { label: '待审核', key: 'pendingReview' },
          { label: '已完成', key: 'completed' },
        ] as const).map(({ label, key }) => (
          <div
            key={key}
            style={{
              background: '#fff',
              borderRadius: 8,
              padding: 20,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderTop: `3px solid ${STAT_COLORS[label]}`,
            }}
          >
            <div style={{ color: '#64748b', fontSize: 13, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: STAT_COLORS[label] }}>
              {stats[key]}
            </div>
          </div>
        ))}
      </div>

      {/* 搜索和筛选 */}
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          padding: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: 16,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="搜索检查号 / 患者姓名 / 诊断"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              fontSize: 13,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
              }}
            >
              <X size={14} color="#94a3b8" />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusType | '')}
          style={{
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            fontSize: 13,
            color: '#334155',
            outline: 'none',
            cursor: 'pointer',
            background: '#fff',
          }}
        >
          <option value="">全部状态</option>
          <option value="监测中">监测中</option>
          <option value="待报告">待报告</option>
          <option value="待审核">待审核</option>
          <option value="已完成">已完成</option>
        </select>
      </div>

      {/* 表格 */}
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {[
                '检查号',
                '患者',
                '监测时间',
                '时长(h)',
                '平均/最慢/最快',
                '总心搏/室早/室上早',
                '停搏',
                '诊断',
                '报告医生',
                '状态',
                '操作',
              ].map(h => (
                <th
                  key={h}
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: 500,
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                  暂无数据
                </td>
              </tr>
            ) : (
              filtered.map(r => {
                const sc = STATUS_COLORS[r.status]
                return (
                  <tr
                    key={r.id}
                    style={{ borderBottom: '1px solid #f1f5f9',  }}
                  >
                    <td style={{ padding: '10px 8px', color: '#0891b2', fontWeight: 500 }}>{r.examId}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ fontWeight: 500 }}>{r.patientName}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>
                        {r.gender} {r.age}岁 {r.dept}
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                      <div>{r.startTime}</div>
                      <div>至 {r.endTime}</div>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>{r.duration}</td>
                    <td style={{ padding: '10px 8px', fontSize: 12 }}>
                      <div style={{ color: '#16a34a' }}>{r.avgHeartRate} bpm</div>
                      <div style={{ color: '#0369a1' }}>↓{r.minHeartRate}</div>
                      <div style={{ color: '#dc2626' }}>↑{r.maxHeartRate}</div>
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: 12 }}>
                      <div>{r.totalBeats.toLocaleString()}</div>
                      <div style={{ color: '#d97706' }}>室早 {r.totalArrhythmias}</div>
                      <div style={{ color: '#7c3aed' }}>室上早 {r.supraArrhythmias}</div>
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: 12 }}>
                      <div>{r.pauses} 次</div>
                      {r.longestPause > 0 && (
                        <div style={{ color: r.longestPause >= 2000 ? '#dc2626' : '#d97706' }}>
                          最长{r.longestPause}ms
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: 12, maxWidth: 180 }}>
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 180,
                        }}
                        title={r.diagnosis}
                      >
                        {r.isCritical && (
                          <span
                            style={{
                              color: '#dc2626',
                              fontWeight: 600,
                              marginRight: 4,
                            }}
                          >
                            ⚠
                          </span>
                        )}
                        {r.diagnosis}
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: 12, color: '#64748b' }}>{r.doctor}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 8,
                          fontSize: 11,
                          background: sc.bg,
                          color: sc.color,
                          fontWeight: 500,
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <button
                        onClick={() => handleDetail(r)}
                        style={{
                          padding: '4px 12px',
                          background: '#0891b2',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', color: '#94a3b8', fontSize: 12 }}>
          共 {filtered.length} 条记录
        </div>
      </div>

      {/* 详情弹窗 */}
      {selectedRecord && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              width: '100%',
              maxWidth: 720,
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                background: '#fff',
                zIndex: 1,
              }}
            >
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Holter详情</h3>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  {selectedRecord.examId} · {selectedRecord.patientName}
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                }}
              >
                <X size={20} color="#64748b" />
              </button>
            </div>

            <div style={{ padding: 20 }}>
              {/* 危急值标注 */}
              {selectedRecord.isCritical && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    padding: '10px 14px',
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 16 }}>⚠️</span>
                  <span style={{ color: '#dc2626', fontWeight: 600, fontSize: 13 }}>
                    危急值：{selectedRecord.diagnosis}
                  </span>
                </div>
              )}

              {/* 基本信息 */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#334155' }}>
                  基本信息
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                  }}
                >
                  {([
                    ['患者姓名', selectedRecord.patientName],
                    ['性别/年龄', `${selectedRecord.gender} / ${selectedRecord.age}岁`],
                    ['科室', selectedRecord.dept],
                    ['设备编号', selectedRecord.device],
                    ['监测开始', selectedRecord.startTime],
                    ['监测结束', selectedRecord.endTime],
                    ['监测时长', `${selectedRecord.duration} 小时`],
                    ['报告医生', selectedRecord.doctor],
                    ['报告时间', selectedRecord.reportTime],
                  ] as const).map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        background: '#f8fafc',
                        borderRadius: 6,
                        padding: '8px 12px',
                      }}
                    >
                      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#334155' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 心率统计 */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#334155' }}>
                  心率统计
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['平均心率', '最慢心率', '最快心率', '总心搏数'].map(h => (
                        <th
                          key={h}
                          style={{
                            padding: '8px 12px',
                            textAlign: 'center',
                            fontWeight: 500,
                            color: '#64748b',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {[
                        [`${selectedRecord.avgHeartRate} bpm`, '#16a34a'],
                        [`${selectedRecord.minHeartRate} bpm`, '#0369a1'],
                        [`${selectedRecord.maxHeartRate} bpm`, '#dc2626'],
                        [selectedRecord.totalBeats.toLocaleString(), '#334155'],
                      ].map(([val, color], i) => (
                        <td
                          key={i}
                          style={{
                            padding: '10px 12px',
                            textAlign: 'center',
                            color: color as string,
                            fontWeight: 600,
                          }}
                        >
                          {val as string}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 节律统计 */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#334155' }}>
                  节律统计
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  {([
                    ['室性早搏', selectedRecord.totalArrhythmias, '#d97706'],
                    ['室上性早搏', selectedRecord.supraArrhythmias, '#7c3aed'],
                    ['停搏次数', selectedRecord.pauses, selectedRecord.pauses > 0 ? '#dc2626' : '#64748b'],
                    ['最长停搏', `${selectedRecord.longestPause}ms`, selectedRecord.longestPause >= 2000 ? '#dc2626' : '#64748b'],
                  ] as const).map(([label, value, color]) => (
                    <div
                      key={label as string}
                      style={{
                        background: '#f8fafc',
                        borderRadius: 6,
                        padding: '10px 12px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: color as string }}>{value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    ['ST段改变', selectedRecord.stChanges],
                    ['T波改变', selectedRecord.tWaveChanges],
                  ].map(([label, val]) => (
                    <div
                      key={label as string}
                      style={{
                        flex: 1,
                        background: val ? '#fef3c7' : '#f8fafc',
                        borderRadius: 6,
                        padding: '8px 12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 13, color: '#334155' }}>{label}</span>
                      <span
                        style={{
                          fontSize: 12,
                          color: val ? '#d97706' : '#16a34a',
                          fontWeight: 600,
                        }}
                      >
                        {val ? '有' : '无'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 诊断结论 */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#334155' }}>
                  诊断结论
                </h4>
                <div
                  style={{
                    background: selectedRecord.isCritical ? '#fff7ed' : '#f8fafc',
                    border: `1px solid ${selectedRecord.isCritical ? '#fed7aa' : '#e2e8f0'}`,
                    borderRadius: 8,
                    padding: '12px 16px',
                    fontSize: 13,
                    color: '#334155',
                    lineHeight: 1.6,
                  }}
                >
                  {selectedRecord.diagnosis}
                </div>
              </div>

              {/* 状态 */}
              <div style={{ marginTop: 16 }}>
                {(() => {
                  const sc = STATUS_COLORS[selectedRecord.status]
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#64748b' }}>状态：</span>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: 8,
                          fontSize: 12,
                          background: sc.bg,
                          color: sc.color,
                          fontWeight: 600,
                        }}
                      >
                        {selectedRecord.status}
                      </span>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
