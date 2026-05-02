import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Heart, Activity, Dumbbell, AlertTriangle, Building2, BarChart3, Settings } from 'lucide-react'

const navItems = [
  { path: '/g008', label: '首页', icon: Home },
  { path: '/g008/ecg12', label: '12导联心电图', icon: Heart },
  { path: '/g008/holter', label: '动态心电图', icon: Activity },
  { path: '/g008/exercise', label: '运动平板试验', icon: Dumbbell },
  { path: '/g008/critical-value', label: '心电危急值', icon: AlertTriangle },
  { path: '/g008/regional', label: '区域心电', icon: Building2 },
  { path: '/g008/statistics', label: '统计分析', icon: BarChart3 },
  { path: '/g008/settings', label: '系统设置', icon: Settings },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, background: '#1e3a5f', color: '#fff', padding: '16px 0', position: 'fixed', height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 16 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600 }}>全院心电系统</h1>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>G008 · v0.1.0</div>
        </div>
        <nav>
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || (item.path !== '/g008' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 20px',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                  background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: 14,
                  borderLeft: isActive ? '3px solid #60a5fa' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
      <main style={{ marginLeft: 220, flex: 1, background: '#f1f5f9', minHeight: '100vh', padding: 24 }}>
        <Outlet />
      </main>
    </div>
  )
}
