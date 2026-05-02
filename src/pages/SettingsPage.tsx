import { useState } from 'react'
import { Settings, Bell, Users, Database } from 'lucide-react'

type Tab = 'basic' | 'report' | 'notification' | 'permission'

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('basic')
  const [saved, setSaved] = useState(false)

  const [basicForm, setBasicForm] = useState({
    hospitalName: '国家医学中心',
    deptName: '心电图室',
    address: '云海市云海区健康路100号',
    contact: '0571-88008800',
    director: '王志刚',
    techCount: '8',
    doctorCount: '12',
  })

  const [notifForm, setNotifForm] = useState({
    stemiAlert: true,
    arrhythmiaAlert: true,
    longPause: true,
    smsNotify: false,
    smsPhone: '',
    emailNotify: true,
    emailAddr: 'ecg@hospital.com',
    criticalInterval: '10',
  })

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'basic', label: '基本信息', icon: '🏥' },
    { key: 'report', label: '报告模板', icon: '📋' },
    { key: 'notification', label: '通知设置', icon: '🔔' },
    { key: 'permission', label: '权限设置', icon: '👥' },
  ]

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>系统设置</h2>

      {/* Tab切换 */}
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '14px 24px',
                border: 'none',
                background: tab === t.key ? '#fff' : 'transparent',
                color: tab === t.key ? '#1e40af' : '#64748b',
                fontSize: 14,
                fontWeight: tab === t.key ? 600 : 400,
                cursor: 'pointer',
                borderBottom: tab === t.key ? '2px solid #1e40af' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {/* 基本信息 */}
          {tab === 'basic' && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: '#374151' }}>基本信息</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: '医院名称', key: 'hospitalName' },
                  { label: '科室名称', key: 'deptName' },
                  { label: '地址', key: 'address' },
                  { label: '联系电话', key: 'contact' },
                  { label: '科室主任', key: 'director' },
                  { label: '技师数量', key: 'techCount' },
                  { label: '医生数量', key: 'doctorCount' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 4 }}>{f.label}</label>
                    <input
                      value={basicForm[f.key as keyof typeof basicForm]}
                      onChange={e => setBasicForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 报告模板 */}
          {tab === 'report' && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: '#374151' }}>报告模板设置</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['启用自动诊断建议', '启用正常值范围标注', '启用危急值自动标记', '启用签名电子化', '报告强制二级审核'].map(item => (
                  <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#f8fafc', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
                    {item}
                  </label>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 4 }}>默认报告签名医生</label>
                <input defaultValue="王志刚" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }} />
              </div>
            </div>
          )}

          {/* 通知设置 */}
          {tab === 'notification' && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: '#374151' }}>危急值通知设置</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'STEMI自动通知', key: 'stemiAlert' },
                  { label: '恶性心律失常通知', key: 'arrhythmiaAlert' },
                  { label: '长间歇通知(≥2.0s)', key: 'longPause' },
                ].map(f => (
                  <label key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#f8fafc', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notifForm[f.key as keyof typeof notifForm] as boolean}
                      onChange={e => setNotifForm(prev => ({ ...prev, [f.key]: e.target.checked }))}
                      style={{ width: 16, height: 16 }}
                    />
                    {f.label}
                  </label>
                ))}
              </div>
              <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 4 }}>短信通知手机号</label>
                  <input
                    value={notifForm.smsPhone}
                    onChange={e => setNotifForm(prev => ({ ...prev, smsPhone: e.target.value }))}
                    placeholder="138xxxx"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 4 }}>通知响应时限(分钟)</label>
                  <input
                    value={notifForm.criticalInterval}
                    onChange={e => setNotifForm(prev => ({ ...prev, criticalInterval: e.target.value }))}
                    type="number"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 权限设置 */}
          {tab === 'permission' && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: '#374151' }}>权限设置</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { role: '心电图室主任', desc: '全权限：报告审核、设备管理、统计查看', level: 'admin' },
                  { role: '心内科医生', desc: '报告书写、报告审核、统计查看', level: 'doctor' },
                  { role: '心电图技师', desc: '数据采集、报告书写、查看本科室数据', level: 'tech' },
                  { role: '区域协作医院', desc: '提交会诊请求、查看本科室报告', level: 'regional' },
                ].map(r => (
                  <div key={r.role} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: 6 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{r.role}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{r.desc}</div>
                    </div>
                    <button style={{ padding: '6px 16px', background: '#fff', color: '#1e40af', border: '1px solid #1e40af', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>编辑</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 保存按钮 */}
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={handleSave}
              style={{ padding: '10px 28px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}
            >
              {saved ? '✓ 已保存' : '保存设置'}
            </button>
            {saved && <span style={{ color: '#16a34a', fontSize: 13 }}>设置已保存</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
