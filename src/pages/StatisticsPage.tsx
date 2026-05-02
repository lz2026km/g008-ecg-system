import { useState } from 'react'
import { BarChart3, PieChart, TrendingUp, Heart } from 'lucide-react'
import { ecg12Records, holterRecords, exerciseRecords, criticalECGRecords } from '../data/initialData'

export default function StatisticsPage() {
  const [month, setMonth] = useState('2025-05')

  const ecgByDept = [
    { dept: '心内科', count: 38 },
    { dept: '急诊科', count: 22 },
    { dept: 'ICU', count: 15 },
    { dept: '老年病科', count: 18 },
    { dept: '体检中心', count: 28 },
    { dept: '产科', count: 12 },
    { dept: '内分泌科', count: 10 },
    { dept: '其他', count: 17 },
  ]

  const ecgByDiagnosis = [
    { label: '正常/大致正常', count: 45, color: '#22c55e' },
    { label: 'ST-T改变', count: 28, color: '#f59e0b' },
    { label: '心律失常', count: 35, color: '#ef4444' },
    { label: '心室肥厚', count: 18, color: '#8b5cf6' },
    { label: '其他异常', count: 24, color: '#64748b' },
  ]

  const criticalStats = [
    { label: 'STEMI', count: 12, color: '#dc2626' },
    { label: '恶性心律失常', count: 8, color: '#f97316' },
    { label: '长间歇', count: 6, color: '#eab308' },
    { label: '运动试验阳性', count: 4, color: '#ec4899' },
  ]

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>统计分析</h2>

      {/* 月份选择 */}
      <div style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BarChart3 size={18} color="#1e40af" />
          <span style={{ fontSize: 14, color: '#475569' }}>选择月份：</span>
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
          />
        </div>
      </div>

      {/* 全院心电概览 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #1e40af' }}>
          <div style={{ color: '#64748b', fontSize: 13 }}>12导联总数</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#1e40af' }}>{ecg12Records.length}</div>
          <div style={{ color: '#16a34a', fontSize: 12, marginTop: 4 }}>本月新增 {ecg12Records.length} 例</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #0891b2' }}>
          <div style={{ color: '#64748b', fontSize: 13 }}>动态心电总数</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#0891b2' }}>{holterRecords.length}</div>
          <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>完成 {holterRecords.filter(h => h.status === '已完成').length} 例</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #059669' }}>
          <div style={{ color: '#64748b', fontSize: 13 }}>运动平板总数</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#059669' }}>{exerciseRecords.length}</div>
          <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>阳性 {exerciseRecords.filter(e => e.isPositive).length} 例</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #dc2626' }}>
          <div style={{ color: '#64748b', fontSize: 13 }}>危急值总数</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#dc2626' }}>{criticalECGRecords.length}</div>
          <div style={{ color: '#16a34a', fontSize: 12, marginTop: 4 }}>已处理 {criticalECGRecords.filter(c => c.status === '已处理').length} 例</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* 12导联按科室分布 */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <PieChart size={18} color="#1e40af" />
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>12导联 — 按科室分布</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ecgByDept.map(d => {
              const max = Math.max(...ecgByDept.map(x => x.count))
              const pct = (d.count / max) * 100
              return (
                <div key={d.dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span>{d.dept}</span>
                    <span style={{ fontWeight: 600, color: '#1e40af' }}>{d.count}</span>
                  </div>
                  <div style={{ background: '#e2e8f0', borderRadius: 4, height: 8 }}>
                    <div style={{ width: `${pct}%`, background: '#1e40af', borderRadius: 4, height: 8 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 心电图诊断分布 */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <TrendingUp size={18} color="#0891b2" />
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>12导联 — 诊断类型分布</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ecgByDiagnosis.map(d => {
              const total = ecgByDiagnosis.reduce((s, x) => s + x.count, 0)
              const pct = Math.round((d.count / total) * 100)
              return (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 3 }}>
                      <span>{d.label}</span>
                      <span style={{ fontWeight: 600 }}>{d.count} ({pct}%)</span>
                    </div>
                    <div style={{ background: '#f1f5f9', borderRadius: 3, height: 6 }}>
                      <div style={{ width: `${pct}%`, background: d.color, borderRadius: 3, height: 6 }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 危急值类型分布 */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Heart size={18} color="#dc2626" />
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>危急值 — 类型分布</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {criticalStats.map(d => {
              const total = criticalStats.reduce((s, x) => s + x.count, 0)
              const pct = Math.round((d.count / total) * 100)
              return (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 3 }}>
                      <span>{d.label}</span>
                      <span style={{ fontWeight: 600, color: d.color }}>{d.count} ({pct}%)</span>
                    </div>
                    <div style={{ background: '#f1f5f9', borderRadius: 3, height: 6 }}>
                      <div style={{ width: `${pct}%`, background: d.color, borderRadius: 3, height: 6 }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 阳性率统计 */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <TrendingUp size={18} color="#059669" />
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>运动平板 — 结果统计</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              { label: '阳性', value: exerciseRecords.filter(e => e.isPositive).length, color: '#dc2626' },
              { label: '可疑阳性', value: exerciseRecords.filter(e => e.isSuspicious).length, color: '#d97706' },
              { label: '阴性', value: exerciseRecords.filter(e => e.isNegative).length, color: '#16a34a' },
            ].map(s => (
              <div key={s.label} style={{ background: '#f8fafc', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
            阳性率：{Math.round((exerciseRecords.filter(e => e.isPositive).length / exerciseRecords.length) * 100)}%<br />
            可疑阳性率：{Math.round((exerciseRecords.filter(e => e.isSuspicious).length / exerciseRecords.length) * 100)}%<br />
            阴性率：{Math.round((exerciseRecords.filter(e => e.isNegative).length / exerciseRecords.length) * 100)}%
          </div>
        </div>
      </div>
    </div>
  )
}
