import React, { useState, useMemo } from 'react';
import { exerciseRecords, ExerciseRecord } from '../data/initialData';

const ExercisePage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<ExerciseRecord | null>(null);

  const stats = useMemo(() => {
    const total = exerciseRecords.length;
    const positive = exerciseRecords.filter(r => r.isPositive).length;
    const suspicious = exerciseRecords.filter(r => r.isSuspicious).length;
    const negative = exerciseRecords.filter(r => r.isNegative).length;
    return { total, positive, suspicious, negative };
  }, []);

  const filteredRecords = useMemo(() => {
    return exerciseRecords.filter(record => {
      const matchSearch =
        record.examId.toLowerCase().includes(searchText.toLowerCase()) ||
        record.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        record.patientId.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter ? record.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [searchText, statusFilter]);

  const getResultStatus = (record: ExerciseRecord) => {
    if (record.isPositive) return '阳性';
    if (record.isSuspicious) return '可疑阳性';
    if (record.isNegative) return '阴性';
    return '未判定';
  };

  const getResultStyle = (record: ExerciseRecord) => {
    if (record.isPositive) return { color: '#dc2626', fontWeight: 700 };
    if (record.isSuspicious) return { color: '#d97706', fontWeight: 700 };
    if (record.isNegative) return { color: '#059669', fontWeight: 700 };
    return { color: '#6b7280' };
  };

  const cardStyle: React.CSSProperties = {
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '140px',
  };

  const containerStyle: React.CSSProperties = {
    padding: '24px',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '24px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#059669',
    margin: '0 0 20px 0',
  };

  const statsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  };

  const statCardStyle: React.CSSProperties = {
    ...cardStyle,
    flex: '1 1 140px',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#059669',
    marginBottom: '4px',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
  };

  const filterContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    flex: '1 1 200px',
    minWidth: '180px',
  };

  const selectStyle: React.CSSProperties = {
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    minWidth: '140px',
    backgroundColor: '#fff',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    borderCollapse: 'collapse',
  };

  const thStyle: React.CSSProperties = {
    padding: '14px 12px',
    textAlign: 'left',
    backgroundColor: '#059669',
    color: '#fff',
    fontWeight: '600',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#374151',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '6px 14px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  };

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '700px',
    width: '90%',
    maxHeight: '85vh',
    overflow: 'auto',
  };

  const modalHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  };

  const modalTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#059669',
    margin: 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: '#6b7280',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  };

  const infoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '20px',
  };

  const infoItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const infoLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500',
  };

  const infoValueStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#374151',
  };

  const resultBannerStyle = (record: ExerciseRecord): React.CSSProperties => {
    let bgColor = '#f3f4f6';
    if (record.isPositive) bgColor = '#fef2f2';
    else if (record.isSuspicious) bgColor = '#fffbeb';
    else if (record.isNegative) bgColor = '#ecfdf5';

    return {
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: bgColor,
      textAlign: 'center',
      marginBottom: '20px',
      ...getResultStyle(record),
    };
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#059669',
    marginBottom: '12px',
    marginTop: '0',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>运动平板试验</h1>
        <div style={statsContainerStyle}>
          <div style={statCardStyle}>
            <span style={statValueStyle}>{stats.total}</span>
            <span style={statLabelStyle}>总数</span>
          </div>
          <div style={statCardStyle}>
            <span style={{ ...statValueStyle, color: '#dc2626' }}>{stats.positive}</span>
            <span style={statLabelStyle}>阳性</span>
          </div>
          <div style={statCardStyle}>
            <span style={{ ...statValueStyle, color: '#d97706' }}>{stats.suspicious}</span>
            <span style={statLabelStyle}>可疑阳性</span>
          </div>
          <div style={statCardStyle}>
            <span style={{ ...statValueStyle, color: '#059669' }}>{stats.negative}</span>
            <span style={statLabelStyle}>阴性</span>
          </div>
        </div>
      </div>

      <div style={filterContainerStyle}>
        <input
          type="text"
          placeholder="搜索检查号/患者姓名/患者ID..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={inputStyle}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="">全部状态</option>
          <option value="待报告">待报告</option>
          <option value="已完成">已完成</option>
        </select>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>检查号</th>
            <th style={thStyle}>患者</th>
            <th style={thStyle}>性别/年龄</th>
            <th style={thStyle}>科室</th>
            <th style={thStyle}>方案</th>
            <th style={thStyle}>目标/实际心率</th>
            <th style={thStyle}>最大血压</th>
            <th style={thStyle}>运动时间</th>
            <th style={thStyle}>ST压低/抬高</th>
            <th style={thStyle}>诊断结论</th>
            <th style={thStyle}>报告医生</th>
            <th style={thStyle}>状态</th>
            <th style={thStyle}>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr key={record.id} style={{ backgroundColor: '#fff' }}>
              <td style={tdStyle}>{record.examId}</td>
              <td style={tdStyle}>{record.patientName}</td>
              <td style={tdStyle}>{record.gender}/{record.age}</td>
              <td style={tdStyle}>{record.dept}</td>
              <td style={tdStyle}>{record.protocol}</td>
              <td style={tdStyle}>{record.targetHR}/{record.achievedHR}</td>
              <td style={tdStyle}>{record.maxSBP}/{record.maxDBP}</td>
              <td style={tdStyle}>{record.exerciseTime}</td>
              <td style={tdStyle}>{record.stDepression}/{record.stElevation}</td>
              <td style={{ ...tdStyle, ...getResultStyle(record) }}>
                {getResultStatus(record)}
              </td>
              <td style={tdStyle}>{record.doctor}</td>
              <td style={tdStyle}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: record.status === '已完成' ? '#dcfce7' : '#fef3c7',
                  color: record.status === '已完成' ? '#166534' : '#92400e',
                }}>
                  {record.status}
                </span>
              </td>
              <td style={tdStyle}>
                <button
                  style={buttonStyle}
                  onClick={() => setSelectedRecord(record)}
                >
                  详情
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredRecords.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#6b7280',
          backgroundColor: '#fff',
          borderRadius: '8px',
        }}>
          暂无数据
        </div>
      )}

      {selectedRecord && (
        <div style={modalOverlayStyle} onClick={() => setSelectedRecord(null)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>运动平板试验详情</h2>
              <button
                style={closeButtonStyle}
                onClick={() => setSelectedRecord(null)}
              >
                关闭
              </button>
            </div>

            <div style={resultBannerStyle(selectedRecord)}>
              <span style={{ fontSize: '18px' }}>结果判定：</span>
              <span style={{ fontSize: '24px' }}>{getResultStatus(selectedRecord)}</span>
            </div>

            <h3 style={sectionTitleStyle}>基本信息</h3>
            <div style={infoGridStyle}>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>检查号</span>
                <span style={infoValueStyle}>{selectedRecord.examId}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>患者ID</span>
                <span style={infoValueStyle}>{selectedRecord.patientId}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>患者姓名</span>
                <span style={infoValueStyle}>{selectedRecord.patientName}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>性别/年龄</span>
                <span style={infoValueStyle}>{selectedRecord.gender}/{selectedRecord.age}岁</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>科室</span>
                <span style={infoValueStyle}>{selectedRecord.dept}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>报告医生</span>
                <span style={infoValueStyle}>{selectedRecord.doctor}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>报告时间</span>
                <span style={infoValueStyle}>{selectedRecord.reportTime}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>状态</span>
                <span style={infoValueStyle}>{selectedRecord.status}</span>
              </div>
            </div>

            <h3 style={sectionTitleStyle}>运动参数</h3>
            <div style={infoGridStyle}>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>运动方案</span>
                <span style={infoValueStyle}>{selectedRecord.protocol}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>目标心率</span>
                <span style={infoValueStyle}>{selectedRecord.targetHR} bpm</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>实际达到心率</span>
                <span style={infoValueStyle}>{selectedRecord.achievedHR} bpm</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>运动时间</span>
                <span style={infoValueStyle}>{selectedRecord.exerciseTime}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>最大收缩压</span>
                <span style={infoValueStyle}>{selectedRecord.maxSBP} mmHg</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>最大舒张压</span>
                <span style={infoValueStyle}>{selectedRecord.maxDBP} mmHg</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>终止原因</span>
                <span style={infoValueStyle}>{selectedRecord.reasonForStop}</span>
              </div>
            </div>

            <h3 style={sectionTitleStyle}>心电图表现</h3>
            <div style={infoGridStyle}>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>ST段压低</span>
                <span style={infoValueStyle}>{selectedRecord.stDepression}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>ST段抬高</span>
                <span style={infoValueStyle}>{selectedRecord.stElevation}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>心律失常</span>
                <span style={infoValueStyle}>{selectedRecord.arrhythmias}</span>
              </div>
            </div>

            <h3 style={sectionTitleStyle}>诊断结论</h3>
            <div style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              marginBottom: '16px',
            }}>
              <p style={{ margin: 0, lineHeight: '1.6', color: '#374151' }}>
                {selectedRecord.diagnosis}
              </p>
            </div>

            <h3 style={sectionTitleStyle}>危急值标记</h3>
            <div style={{
              padding: '12px 16px',
              backgroundColor: selectedRecord.isCritical ? '#fef2f2' : '#f9fafb',
              borderRadius: '8px',
              color: selectedRecord.isCritical ? '#dc2626' : '#6b7280',
              fontWeight: selectedRecord.isCritical ? '600' : '400',
            }}>
              {selectedRecord.isCritical ? '⚠️ 存在危急值' : '无危急值'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePage;
