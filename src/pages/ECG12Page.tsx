import React, { useState, useMemo } from 'react';
import { ECG12Record } from '../data/initialData';
import { ecg12Records } from '../data/initialData';

type StatusType = '待报告' | '待审核' | '已审核' | '已打印';
type ExamTypeEnum = '常规' | '复查' | '加急';

interface ECGDetailModalProps {
  record: ECG12Record | null;
  visible: boolean;
  onClose: () => void;
}

const ECGDetailModal: React.FC<ECGDetailModalProps> = ({ record, visible, onClose }) => {
  if (!visible || !record) return null;

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '700px',
    maxHeight: '85vh',
    overflow: 'auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  };

  const modalHeaderStyle: React.CSSProperties = {
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    color: '#fff',
  };

  const modalBodyStyle: React.CSSProperties = {
    padding: '20px',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '16px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e40af',
    marginBottom: '8px',
    paddingBottom: '4px',
    borderBottom: '2px solid #1e40af',
  };

  const infoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  };

  const infoItemStyle: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: '#f8fafc',
    borderRadius: '4px',
  };

  const infoLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '2px',
  };

  const infoValueStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#1e293b',
  };

  const diagnosisStyle: React.CSSProperties = {
    padding: '12px 16px',
    backgroundColor: record.isCritical ? '#fef3c7' : '#f0fdf4',
    borderRadius: '6px',
    border: `2px solid ${record.isCritical ? '#f59e0b' : '#22c55e'}`,
    marginTop: '12px',
  };

  const diagnosisTitleStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#92400e',
    marginBottom: '6px',
  };

  const diagnosisTextStyle: React.CSSProperties = {
    fontSize: '15px',
    color: '#1c1917',
    lineHeight: 1.5,
  };

  const stemiTagStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '2px 8px',
    backgroundColor: '#dc2626',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    marginLeft: '8px',
  };

  const criticalTagStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '2px 8px',
    backgroundColor: '#f59e0b',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    marginLeft: '8px',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0',
    lineHeight: 1,
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <span style={{ fontSize: '16px', fontWeight: 600 }}>心电图详情 - {record.examId}</span>
          <button style={closeButtonStyle} onClick={onClose}>×</button>
        </div>
        <div style={modalBodyStyle}>
          {/* 基本信息 */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>患者基本信息</div>
            <div style={infoGridStyle}>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>姓名</div>
                <div style={infoValueStyle}>{record.patientName}</div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>性别</div>
                <div style={infoValueStyle}>{record.gender}</div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>年龄</div>
                <div style={infoValueStyle}>{record.age}岁</div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>科室</div>
                <div style={infoValueStyle}>{record.dept}</div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>床号</div>
                <div style={infoValueStyle}>{record.bedNo || '-'}</div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>患者ID</div>
                <div style={infoValueStyle}>{record.patientId}</div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>标本来源</div>
                <div style={infoValueStyle}>{record.specimenSource || '-'}</div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>检查类型</div>
                <div style={infoValueStyle}>{record.examType}</div>
              </div>
            </div>
          </div>

          {/* 心电图参数 */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>心电图参数</div>
            <div style={infoGridStyle}>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>心率</div>
                <div style={{ ...infoValueStyle, fontSize: '18px', color: '#1e40af' }}>
                  {record.heartRate} <span style={{ fontSize: '12px', color: '#64748b' }}>bpm</span>
                </div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>PR间期</div>
                <div style={infoValueStyle}>{record.PRInterval} <span style={{ fontSize: '12px', color: '#64748b' }}>ms</span></div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>QRS波群</div>
                <div style={infoValueStyle}>{record.QRSInterval} <span style={{ fontSize: '12px', color: '#64748b' }}>ms</span></div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>QT间期</div>
                <div style={infoValueStyle}>{record.QTInterval} <span style={{ fontSize: '12px', color: '#64748b' }}>ms</span></div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>QTc</div>
                <div style={infoValueStyle}>{record.QTc} <span style={{ fontSize: '12px', color: '#64748b' }}>ms</span></div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>心电轴</div>
                <div style={infoValueStyle}>{record.axis}</div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>心律</div>
                <div style={infoValueStyle}>{record.rhythm}</div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>设备</div>
                <div style={infoValueStyle}>{record.device}</div>
              </div>
            </div>
          </div>

          {/* ST/T改变标记 */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>心电图异常标记</div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{
                ...infoItemStyle,
                backgroundColor: record.hasSTChange ? '#fef3c7' : '#f0fdf4',
                border: `1px solid ${record.hasSTChange ? '#f59e0b' : '#d1d5db'}`,
              }}>
                <div style={infoLabelStyle}>ST段改变</div>
                <div style={{ ...infoValueStyle, color: record.hasSTChange ? '#d97706' : '#22c55e' }}>
                  {record.hasSTChange ? '有' : '无'}
                </div>
              </div>
              <div style={{
                ...infoItemStyle,
                backgroundColor: record.hasTChange ? '#fef3c7' : '#f0fdf4',
                border: `1px solid ${record.hasTChange ? '#f59e0b' : '#d1d5db'}`,
              }}>
                <div style={infoLabelStyle}>T波改变</div>
                <div style={{ ...infoValueStyle, color: record.hasTChange ? '#d97706' : '#22c55e' }}>
                  {record.hasTChange ? '有' : '无'}
                </div>
              </div>
              <div style={{
                ...infoItemStyle,
                backgroundColor: record.isSTEMI ? '#fee2e2' : '#f0fdf4',
                border: `1px solid ${record.isSTEMI ? '#dc2626' : '#d1d5db'}`,
              }}>
                <div style={infoLabelStyle}>STEMI</div>
                <div style={{ ...infoValueStyle, color: record.isSTEMI ? '#dc2626' : '#22c55e' }}>
                  {record.isSTEMI ? '是' : '否'}
                </div>
              </div>
              <div style={{
                ...infoItemStyle,
                backgroundColor: record.isCritical ? '#fef3c7' : '#f0fdf4',
                border: `1px solid ${record.isCritical ? '#f59e0b' : '#d1d5db'}`,
              }}>
                <div style={infoLabelStyle}>危急值</div>
                <div style={{ ...infoValueStyle, color: record.isCritical ? '#d97706' : '#22c55e' }}>
                  {record.isCritical ? '是' : '否'}
                </div>
              </div>
            </div>
          </div>

          {/* 诊断结果 */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>诊断结果</div>
            <div style={diagnosisStyle}>
              <div style={diagnosisTitleStyle}>
                诊断
                {record.isSTEMI && <span style={stemiTagStyle}>STEMI</span>}
                {record.isCritical && <span style={criticalTagStyle}>危急值</span>}
              </div>
              <div style={diagnosisTextStyle}>{record.diagnosis}</div>
            </div>
          </div>

          {/* 报告信息 */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>报告信息</div>
            <div style={infoGridStyle}>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>技师</div>
                <div style={infoValueStyle}>{record.technician}</div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>审核医生</div>
                <div style={infoValueStyle}>{record.doctor || '-'}</div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>报告时间</div>
                <div style={infoValueStyle}>{record.reportTime}</div>
              </div>
              <div style={infoItemStyle}>
                <div style={infoLabelStyle}>状态</div>
                <div style={{ ...infoValueStyle, color: getStatusColor(record.status) }}>{record.status}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status: StatusType): string => {
  switch (status) {
    case '待报告': return '#f59e0b';
    case '待审核': return '#3b82f6';
    case '已审核': return '#22c55e';
    case '已打印': return '#8b5cf6';
    default: return '#64748b';
  }
};

const getStatusBgColor = (status: StatusType): string => {
  switch (status) {
    case '待报告': return '#fef3c7';
    case '待审核': return '#dbeafe';
    case '已审核': return '#dcfce7';
    case '已打印': return '#ede9fe';
    default: return '#f1f5f9';
  }
};

const ECG12Page: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [examTypeFilter, setExamTypeFilter] = useState<string>('全部');
  const [selectedRecord, setSelectedRecord] = useState<ECG12Record | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 统计数据
  const stats = useMemo(() => {
    const total = ecg12Records.length;
    const pendingReport = ecg12Records.filter(r => r.status === '待报告').length;
    const pendingAudit = ecg12Records.filter(r => r.status === '待审核').length;
    const audited = ecg12Records.filter(r => r.status === '已审核').length;
    return { total, pendingReport, pendingAudit, audited };
  }, []);

  // 筛选后的数据
  const filteredData = useMemo(() => {
    return ecg12Records.filter(record => {
      // 搜索过滤
      const searchLower = searchText.toLowerCase();
      const matchesSearch = !searchText ||
        record.examId.toLowerCase().includes(searchLower) ||
        record.patientName.toLowerCase().includes(searchLower) ||
        record.diagnosis.toLowerCase().includes(searchLower);

      // 状态下拉过滤
      const matchesStatus = statusFilter === '全部' || record.status === statusFilter;

      // 紧急类型过滤
      const matchesExamType = examTypeFilter === '全部' ||
        (examTypeFilter === '普通' && record.examType === '常规') ||
        (examTypeFilter === '加急' && record.examType === '加急');

      return matchesSearch && matchesStatus && matchesExamType;
    });
  }, [searchText, statusFilter, examTypeFilter]);

  const handleDetail = (record: ECG12Record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

  const handleWriteReport = (record: ECG12Record) => {
    alert(`书写报告: ${record.examId}`);
  };

  const handleAudit = (record: ECG12Record) => {
    alert(`审核报告: ${record.examId}`);
  };

  const handlePrint = (record: ECG12Record) => {
    alert(`打印报告: ${record.examId}`);
  };

  const getActionButton = (record: ECG12Record) => {
    switch (record.status) {
      case '待报告':
        return (
          <button
            onClick={() => handleWriteReport(record)}
            style={{
              padding: '4px 12px',
              backgroundColor: '#1e40af',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            书写报告
          </button>
        );
      case '待审核':
        return (
          <button
            onClick={() => handleAudit(record)}
            style={{
              padding: '4px 12px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            审核
          </button>
        );
      case '已审核':
        return (
          <button
            onClick={() => handlePrint(record)}
            style={{
              padding: '4px 12px',
              backgroundColor: '#8b5cf6',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            打印
          </button>
        );
      default:
        return null;
    }
  };

  // 样式定义
  const containerStyle: React.CSSProperties = {
    padding: '24px',
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '24px',
  };

  const statsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  };

  const statCardStyle = (color: string, bgColor: string): React.CSSProperties => ({
    backgroundColor: bgColor,
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  });

  const statNumberStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1e293b',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px',
  };

  const filterContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  };

  const searchInputStyle: React.CSSProperties = {
    padding: '10px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    width: '280px',
    outline: 'none',
  };

  const selectStyle: React.CSSProperties = {
    padding: '10px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fff',
    minWidth: '120px',
  };

  const tableContainerStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'auto',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  };

  const thStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
    fontWeight: 600,
    color: '#475569',
    whiteSpace: 'nowrap',
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    color: '#1e293b',
  };

  const detailButtonStyle: React.CSSProperties = {
    padding: '4px 12px',
    backgroundColor: '#fff',
    color: '#1e40af',
    border: '1px solid #1e40af',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    marginRight: '8px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>12导联心电图</h1>

      {/* 统计卡片 */}
      <div style={statsContainerStyle}>
        <div style={statCardStyle('#1e40af', '#eff6ff')}>
          <div style={statNumberStyle}>{stats.total}</div>
          <div style={statLabelStyle}>总数</div>
        </div>
        <div style={statCardStyle('#f59e0b', '#fef3c7')}>
          <div style={statNumberStyle}>{stats.pendingReport}</div>
          <div style={statLabelStyle}>待报告</div>
        </div>
        <div style={statCardStyle('#3b82f6', '#dbeafe')}>
          <div style={statNumberStyle}>{stats.pendingAudit}</div>
          <div style={statLabelStyle}>待审核</div>
        </div>
        <div style={statCardStyle('#22c55e', '#dcfce7')}>
          <div style={statNumberStyle}>{stats.audited}</div>
          <div style={statLabelStyle}>已审核</div>
        </div>
      </div>

      {/* 筛选区域 */}
      <div style={filterContainerStyle}>
        <input
          type="text"
          placeholder="搜索检查ID/患者姓名/诊断..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={searchInputStyle}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="全部">全部状态</option>
          <option value="待报告">待报告</option>
          <option value="待审核">待审核</option>
          <option value="已审核">已审核</option>
          <option value="已打印">已打印</option>
        </select>
        <select
          value={examTypeFilter}
          onChange={(e) => setExamTypeFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="全部">全部类型</option>
          <option value="普通">普通</option>
          <option value="加急">加急</option>
        </select>
      </div>

      {/* 数据表格 */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>检查ID</th>
              <th style={thStyle}>患者</th>
              <th style={thStyle}>科室/床位</th>
              <th style={thStyle}>心率/PR/QRS/QTc</th>
              <th style={thStyle}>诊断</th>
              <th style={thStyle}>技师</th>
              <th style={thStyle}>报告时间</th>
              <th style={thStyle}>状态</th>
              <th style={thStyle}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record) => (
              <tr key={record.id}>
                <td style={tdStyle}>
                  <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{record.examId}</span>
                  {record.examType === '加急' && (
                    <span style={{
                      marginLeft: '6px',
                      padding: '1px 6px',
                      backgroundColor: '#dc2626',
                      color: '#fff',
                      borderRadius: '3px',
                      fontSize: '10px',
                    }}>急</span>
                  )}
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 500 }}>{record.patientName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {record.gender} / {record.age}岁
                  </div>
                </td>
                <td style={tdStyle}>
                  <div>{record.dept}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{record.bedNo || '-'}</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontFamily: 'monospace' }}>
                    {record.heartRate}/{record.PRInterval}/{record.QRSInterval}/{record.QTc}
                  </div>
                </td>
                <td style={{ ...tdStyle, maxWidth: '200px' }}>
                  <div style={{
                    fontSize: '13px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: record.isCritical ? '#d97706' : 'inherit',
                  }} title={record.diagnosis}>
                    {record.diagnosis}
                    {record.isSTEMI && (
                      <span style={{
                        marginLeft: '4px',
                        padding: '0 4px',
                        backgroundColor: '#dc2626',
                        color: '#fff',
                        borderRadius: '2px',
                        fontSize: '10px',
                      }}>STEMI</span>
                    )}
                  </div>
                </td>
                <td style={tdStyle}>{record.technician}</td>
                <td style={tdStyle}>
                  <div style={{ fontSize: '13px' }}>{record.reportTime}</div>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: getStatusBgColor(record.status),
                    color: getStatusColor(record.status),
                  }}>
                    {record.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDetail(record)}
                    style={detailButtonStyle}
                  >
                    详情
                  </button>
                  {getActionButton(record)}
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={9} style={{ ...tdStyle, textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 详情弹窗 */}
      <ECGDetailModal
        record={selectedRecord}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ECG12Page;
