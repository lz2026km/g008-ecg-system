import { Activity, Heart, AlertTriangle, Users, Clock, CheckCircle } from 'lucide-react'
import { ecg12Records, holterRecords, criticalECGRecords, regionalECGHospitals, regionalECGRequests } from '../data/initialData'

const today = '2025-05-02'
const todayECG = ecg12Records.filter(r => r.reportTime.startsWith(today))
const todayCritical = criticalECGRecords.filter(r => r.reportedTime.startsWith(today))
const pendingRegional = regionalECGRequests.filter(r => r.status !== '已完成')

export default function HomePage() {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>全院心电信息系统</h2>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Activity size={20} color="#1e40af" />
            <span style={{ color: '#666', fontSize: 13 }}>今日12导联</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#1e40af' }}>{todayECG.length}</div>
          <div style={{ color: '#16a34a', fontSize: 12, marginTop: 4 }}>已审核 {todayECG.filter(r => r.status === '已审核').length} 例</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Heart size={20} color="#0891b2" />
            <span style={{ color: '#666', fontSize: 13 }}>动态心电</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#0891b2' }}>{holterRecords.length}</div>
          <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>监测中 {holterRecords.filter(r => r.status === '监测中').length} 例</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={20} color="#dc2626" />
            <span style={{ color: '#666', fontSize: 13 }}>今日危急值</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#dc2626' }}>{todayCritical.length}</div>
          <div style={{ color: '#16a34a', fontSize: 12, marginTop: 4 }}>已处理 {todayCritical.filter(r => r.status === '已处理').length} 例</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Users size={20} color="#7c3aed" />
            <span style={{ color: '#666', fontSize: 13 }}>区域协作</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#7c3aed' }}>{regionalECGHospitals.length}</div>
          <div style={{ color: '#d97706', fontSize: 12, marginTop: 4 }}>待处理 {pendingRegional.length} 例</div>
        </div>
      </div>

      {/* 快捷入口 */}
      <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>快捷功能</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {[
            { icon: Heart, label: '12导联心电图', path: '/g008/ecg12', color: '#1e40af' },
            { icon: Activity, label: '动态心电图', path: '/g008/holter', color: '#0891b2' },
            { icon: Clock, label: '运动平板', path: '/g008/exercise', color: '#059669' },
            { icon: AlertTriangle, label: '心电危急值', path: '/g008/critical-value', color: '#dc2626' },
            { icon: Users, label: '区域心电', path: '/g008/regional', color: '#7c3aed' },
            { icon: CheckCircle, label: '统计分析', path: '/g008/statistics', color: '#d97706' },
          ].map(({ icon: Icon, label, path, color }) => (
            <a key={path} href={path} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: '16px 12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <Icon size={24} color={color} style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 12, color: '#475569' }}>{label}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* 今日12导联记录 */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>今日12导联</h3>
            <a href="/g008/ecg12" style={{ fontSize: 13, color: '#1e40af' }}>查看全部 →</a>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                {['患者', '科室', '诊断', '状态'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 6px', color: '#94a3b8', fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {todayECG.slice(0, 6).map(r => {
                const sc = r.status === '已审核' ? { bg: '#dcfce7', color: '#166534' } : r.status === '待审核' ? { bg: '#fef3c7', color: '#d97706' } : { bg: '#f1f5f9', color: '#64748b' }
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '8px 6px', fontSize: 13 }}>{r.patientName}</td>
                    <td style={{ padding: '8px 6px', fontSize: 12, color: '#64748b' }}>{r.dept}</td>
                    <td style={{ padding: '8px 6px', fontSize: 12, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.diagnosis}</td>
                    <td style={{ padding: '8px 6px', fontSize: 12 }}><span style={{ padding: '2px 6px', borderRadius: 8, fontSize: 11, background: sc.bg, color: sc.color }}>{r.status}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* 危急值通知 */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>心电危急值</h3>
            <a href="/g008/critical-value" style={{ fontSize: 13, color: '#dc2626' }}>查看全部 →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {criticalECGRecords.filter(r => r.status !== '已处理').slice(0, 5).map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#fef2f2', borderRadius: 6, borderLeft: '3px solid #dc2626' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.patientName} · {r.criticalType}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{r.dept} · {r.examType} · {r.reportedTime}</div>
                </div>
                <span style={{ fontSize: 11, padding: '2px 8px', background: r.status === '已通知' ? '#fef3c7' : '#fee2e2', color: r.status === '已通知' ? '#d97706' : '#dc2626', borderRadius: 8 }}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
