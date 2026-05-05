import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ECG12Record } from '../data/initialData';
import { ecg12Records } from '../data/initialData';

// ============================================================
// 类型定义
// ============================================================
type StatusType = '待报告' | '待审核' | '已审核' | '已打印';
type ExamTypeEnum = '常规' | '复查' | '加急';

interface ECGDetailModalProps {
  record: ECG12Record | null;
  visible: boolean;
  onClose: () => void;
}

// ============================================================
// SVG波形生成工具 - 使用贝塞尔曲线模拟心电图波形
// ============================================================
const generateWaveformPath = (
  width: number,
  height: number,
  heartRate: number,
  hasSTChange: boolean,
  hasTChange: boolean,
  isSTEMI: boolean,
  rhythm: string
): string => {
  const midY = height / 2;
  const scale = height / 200;
  
  // 根据心率调整波形周期
  const cycleLength = Math.round(300 / heartRate * 10);
  const numCycles = Math.floor(width / cycleLength);
  
  let path = `M 0 ${midY}`;
  
  for (let cycle = 0; cycle < numCycles; cycle++) {
    const startX = cycle * cycleLength;
    
    // P波
    const pStart = startX + 5;
    const pPeak = startX + 12;
    const pEnd = startX + 20;
    path += ` Q ${pStart + 3} ${midY - 15 * scale} ${pPeak} ${midY - 20 * scale}`;
    path += ` Q ${pPeak + 3} ${midY - 15 * scale} ${pEnd} ${midY}`;
    
    // PR段
    path += ` L ${startX + 25} ${midY}`;
    
    // Q波
    const qPoint = startX + 28;
    path += ` L ${qPoint} ${midY + 10 * scale}`;
    
    // R波 - 根据心律调整
    const rPeak = startX + 35;
    const isFast = heartRate > 100;
    const isSlow = heartRate < 60;
    const rHeight = isFast ? 70 * scale : isSlow ? 90 * scale : 80 * scale;
    
    path += ` L ${startX + 30} ${midY}`;
    path += ` L ${rPeak} ${midY - rHeight}`;
    path += ` L ${startX + 40} ${midY}`;
    
    // S波
    path += ` L ${startX + 43} ${midY + 15 * scale}`;
    path += ` L ${startX + 48} ${midY}`;
    
    // ST段 - 根据ST改变调整
    const stLevel = hasSTChange ? (isSTEMI ? -15 : 8) : 0;
    const stStart = startX + 50;
    const stEnd = startX + 70;
    path += ` L ${stStart} ${midY + stLevel * scale}`;
    path += ` L ${stEnd} ${midY + stLevel * scale}`;
    
    // T波 - 根据T波改变调整
    const tPeak = startX + 85;
    const tHeight = hasTChange ? (hasSTChange ? 25 : 15) : 20;
    const tEnd = startX + 100;
    path += ` Q ${stEnd + 5} ${midY + stLevel * scale} ${tPeak} ${midY - tHeight * scale}`;
    path += ` Q ${tPeak + 5} ${midY} ${tEnd} ${midY}`;
    
    // 基线
    path += ` L ${startX + cycleLength} ${midY}`;
  }
  
  return path;
};

// ============================================================
// 心电参数分析工具
// ============================================================
interface ECGAnalysis {
  hrStatus: string;
  hrAdvice: string;
  prStatus: string;
  prAdvice: string;
  qrsStatus: string;
  qrsAdvice: string;
  qtcStatus: string;
  qtcAdvice: string;
  axisStatus: string;
  axisAdvice: string;
  aiTips: string[];
}

const analyzeECG = (record: ECG12Record): ECGAnalysis => {
  const tips: string[] = [];
  
  // 心率分析
  let hrStatus = '正常';
  let hrAdvice = '';
  if (record.heartRate < 60) {
    hrStatus = '心动过缓';
    hrAdvice = '建议复查，排除药物影响或病态窦房结综合征';
    tips.push('⚠️ 窦性心动过缓，需关注');
  } else if (record.heartRate > 100) {
    hrStatus = '心动过速';
    hrAdvice = '结合临床症状，排除贫血、感染、甲状腺功能亢进等';
    tips.push('⚠️ 窦性心动过速，建议结合临床');
  } else {
    tips.push('✅ 心率在正常范围内');
  }
  
  // PR间期分析
  let prStatus = '正常';
  let prAdvice = '';
  if (record.PRInterval < 120) {
    prStatus = 'PR缩短';
    prAdvice = '可能与预激综合征相关';
    tips.push('⚠️ PR间期缩短，注意预激');
  } else if (record.PRInterval > 200) {
    prStatus = 'PR延长';
    prAdvice = '一度房室传导阻滞';
    tips.push('⚠️ 一度房室传导阻滞');
  } else {
    tips.push('✅ PR间期正常');
  }
  
  // QRS分析
  let qrsStatus = '正常';
  let qrsAdvice = '';
  if (record.QRSInterval < 120) {
    if (record.QRSInterval > 100) {
      qrsStatus = '偏宽';
      qrsAdvice = '建议关注室内传导情况';
      tips.push('⚠️ QRS波群略宽');
    } else {
      tips.push('✅ QRS波群时限正常');
    }
  } else {
    qrsStatus = '增宽';
    qrsAdvice = '束支传导阻滞或室内传导延迟';
    tips.push('🚨 QRS波群增宽，需排除束支阻滞');
  }
  
  // QTc分析
  let qtcStatus = '正常';
  let qtcAdvice = '';
  if (record.QTc < 350) {
    qtcStatus = '偏短';
    qtcAdvice = '可能与短QT综合征相关';
    tips.push('⚠️ QTc偏短');
  } else if (record.QTc > 450) {
    qtcStatus = '延长';
    qtcAdvice = '长QT综合征风险，警惕尖端扭转性室速';
    tips.push('🚨 QTc延长，注意电解质及药物影响');
  } else if (record.QTc > 440) {
    qtcStatus = '偏长';
    qtcAdvice = '建议复查';
    tips.push('⚠️ QTc偏长');
  } else {
    tips.push('✅ QTc在正常范围');
  }
  
  // 心电轴分析
  let axisStatus = '正常';
  let axisAdvice = '';
  if (record.axis === '左偏') {
    axisStatus = '左偏';
    axisAdvice = '可见于左前分支阻滞、左室肥大或下壁心梗';
    tips.push('⚠️ 心电轴左偏');
  } else if (record.axis === '右偏') {
    axisStatus = '右偏';
    axisAdvice = '可见于右室肥大、左后分支阻滞或侧壁心梗';
    tips.push('⚠️ 心电轴右偏');
  } else if (record.axis === '极度右偏') {
    axisStatus = '极度右偏';
    axisAdvice = '注意右室肥大或广泛前壁心梗可能';
    tips.push('🚨 心电轴极度右偏');
  }
  
  // 特殊诊断提示
  if (record.isSTEMI) {
    tips.push('🚨 STEMI - 建议立即复查并联系心内科');
  }
  if (record.isCritical) {
    tips.push('🚨 危急值 - 请立即处理');
  }
  if (record.hasSTChange && !record.isSTEMI) {
    tips.push('⚠️ 存在ST段改变，建议结合病史');
  }
  if (record.hasTChange) {
    tips.push('⚠️ T波改变，注意排除相关疾病');
  }
  
  return {
    hrStatus,
    hrAdvice,
    prStatus,
    prAdvice,
    qrsStatus,
    qrsAdvice,
    qtcStatus,
    qtcAdvice,
    axisStatus,
    axisAdvice,
    aiTips: tips,
  };
};

// ============================================================
// 导联位置示意图组件
// ============================================================
const LeadPositionDiagram: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #e2e8f0',
  };
  
  const titleStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '12px',
    textAlign: 'center',
  };
  
  const svgStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '280px',
    margin: '0 auto',
    display: 'block',
  };
  
  const labelStyle = (lead: string): React.CSSProperties => ({
    fontSize: '10px',
    fontWeight: 600,
    fill: '#1e40af',
    textAnchor: 'middle',
  });
  
  return (
    <div style={containerStyle}>
      <div style={titleStyle}>导联位置示意图</div>
      <svg viewBox="0 0 200 240" style={svgStyle}>
        {/* 胸部区域 */}
        <ellipse cx="100" cy="100" rx="55" ry="70" fill="#fee2e2" stroke="#dc2626" strokeWidth="2"/>
        
        {/* V1-V6 导联位置 */}
        <circle cx="65" cy="70" r="8" fill="#1e40af" stroke="#1e40af" strokeWidth="2"/>
        <text x="65" y="55" style={labelStyle('V1')}>V1</text>
        
        <circle cx="50" cy="95" r="8" fill="#1e40af" stroke="#1e40af" strokeWidth="2"/>
        <text x="50" y="80" style={labelStyle('V2')}>V2</text>
        
        <circle cx="45" cy="125" r="8" fill="#1e40af" stroke="#1e40af" strokeWidth="2"/>
        <text x="45" y="110" style={labelStyle('V3')}>V3</text>
        
        <circle cx="50" cy="155" r="8" fill="#1e40af" stroke="#1e40af" strokeWidth="2"/>
        <text x="50" y="175" style={labelStyle('V4')}>V4</text>
        
        <circle cx="70" cy="165" r="8" fill="#1e40af" stroke="#1e40af" strokeWidth="2"/>
        <text x="70" y="185" style={labelStyle('V5')}>V5</text>
        
        <circle cx="95" cy="170" r="8" fill="#1e40af" stroke="#1e40af" strokeWidth="2"/>
        <text x="95" y="190" style={labelStyle('V6')}>V6</text>
        
        {/* 肢体导联 */}
        <circle cx="45" cy="200" r="6" fill="#22c55e" stroke="#22c55e" strokeWidth="2"/>
        <text x="45" y="220" style={labelStyle('LA')}>LA</text>
        
        <circle cx="155" cy="200" r="6" fill="#22c55e" stroke="#22c55e" strokeWidth="2"/>
        <text x="155" y="220" style={labelStyle('RA')}>RA</text>
        
        <circle cx="100" cy="210" r="6" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2"/>
        <text x="100" y="235" style={labelStyle('LL')}>LL</text>
        
        {/* 标注线 */}
        <line x1="45" y1="200" x2="65" y2="70" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2"/>
        <line x1="155" y1="200" x2="65" y2="70" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2"/>
      </svg>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '8px', fontSize: '10px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', backgroundColor: '#1e40af', borderRadius: '50%' }}></span>
          胸前导联
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', backgroundColor: '#22c55e', borderRadius: '50%' }}></span>
          肢体导联
        </span>
      </div>
    </div>
  );
};

// ============================================================
// 12导联SVG波形组件
// ============================================================
const ECGWaveformDisplay: React.FC<{ record: ECG12Record }> = ({ record }) => {
  const leads = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
  
  const containerStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    padding: '12px',
  };
  
  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '2px solid #1e40af',
  };
  
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  };
  
  const leadContainerStyle: React.CSSProperties = {
    backgroundColor: '#f8fafc',
    borderRadius: '4px',
    padding: '4px',
    border: '1px solid #e2e8f0',
  };
  
  const leadLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 700,
    color: '#1e40af',
    marginBottom: '2px',
  };
  
  const getLeadParams = (lead: string) => {
    // 根据导联特性调整波形参数
    const baseHR = record.heartRate;
    let amplitude = 1;
    let stOffset = 0;
    
    switch (lead) {
      case 'aVR':
        amplitude = 0.8;
        stOffset = record.hasSTChange ? -5 : 0;
        break;
      case 'V1':
      case 'V2':
        amplitude = 0.9;
        stOffset = record.hasSTChange ? (record.isSTEMI ? -8 : 4) : 0;
        break;
      case 'V3':
      case 'V4':
        amplitude = 1.1;
        stOffset = record.hasSTChange ? (record.isSTEMI ? -12 : 6) : 0;
        break;
      case 'V5':
      case 'V6':
        amplitude = 1;
        stOffset = record.hasSTChange ? 4 : 0;
        break;
      default:
        amplitude = 1;
        stOffset = record.hasSTChange ? 5 : 0;
    }
    
    return { amplitude, stOffset, hasSTChange: record.hasSTChange, hasTChange: record.hasTChange, isSTEMI: record.isSTEMI };
  };
  
  const generateLeadPath = (lead: string): string => {
    const width = 200;
    const height = 60;
    const midY = height / 2;
    const { amplitude, stOffset, hasSTChange, hasTChange, isSTEMI } = getLeadParams(lead);
    const scale = (height / 200) * amplitude;
    
    const cycleLength = Math.round(300 / record.heartRate * 10);
    const numCycles = Math.floor(width / cycleLength);
    
    let path = `M 0 ${midY}`;
    
    for (let cycle = 0; cycle < numCycles; cycle++) {
      const startX = cycle * cycleLength;
      
      // P波
      const pStart = startX + 5;
      const pPeak = startX + 12;
      const pEnd = startX + 20;
      
      // aVR导联P波方向相反
      if (lead === 'aVR') {
        path += ` Q ${pStart + 3} ${midY + 15 * scale} ${pPeak} ${midY + 20 * scale}`;
        path += ` Q ${pPeak + 3} ${midY + 15 * scale} ${pEnd} ${midY}`;
      } else {
        path += ` Q ${pStart + 3} ${midY - 15 * scale} ${pPeak} ${midY - 20 * scale}`;
        path += ` Q ${pPeak + 3} ${midY - 15 * scale} ${pEnd} ${midY}`;
      }
      
      // PR段
      path += ` L ${startX + 25} ${midY}`;
      
      // Q波
      const qPoint = startX + 28;
      if (lead === 'aVR') {
        path += ` L ${qPoint} ${midY - 8 * scale}`;
      } else {
        path += ` L ${qPoint} ${midY + 10 * scale}`;
      }
      
      // R波
      const rPeak = startX + 35;
      const isFast = record.heartRate > 100;
      const isSlow = record.heartRate < 60;
      let rHeight = isFast ? 70 * scale : isSlow ? 90 * scale : 80 * scale;
      
      // V1/V2导联R波可能较高
      if (lead === 'V1' || lead === 'V2') {
        rHeight *= 1.2;
      }
      
      if (lead === 'aVR') {
        path += ` L ${startX + 30} ${midY}`;
        path += ` L ${rPeak} ${midY + rHeight}`;
        path += ` L ${startX + 40} ${midY}`;
      } else {
        path += ` L ${startX + 30} ${midY}`;
        path += ` L ${rPeak} ${midY - rHeight}`;
        path += ` L ${startX + 40} ${midY}`;
      }
      
      // S波
      const sPoint = startX + 43;
      if (lead === 'aVR') {
        path += ` L ${sPoint} ${midY - 12 * scale}`;
      } else {
        path += ` L ${sPoint} ${midY + 15 * scale}`;
      }
      path += ` L ${startX + 48} ${midY}`;
      
      // ST段
      const stStart = startX + 50;
      const stEnd = startX + 70;
      const adjustedStLevel = midY + stOffset * scale;
      path += ` L ${stStart} ${adjustedStLevel}`;
      path += ` L ${stEnd} ${adjustedStLevel}`;
      
      // T波
      const tPeak = startX + 85;
      let tHeight = hasTChange ? (hasSTChange ? 25 : 15) : 20;
      tHeight *= scale;
      const tEnd = startX + 100;
      
      if (lead === 'aVR') {
        path += ` Q ${stEnd + 5} ${adjustedStLevel} ${tPeak} ${adjustedStLevel + tHeight}`;
        path += ` Q ${tPeak + 5} ${adjustedStLevel} ${tEnd} ${midY}`;
      } else {
        path += ` Q ${stEnd + 5} ${adjustedStLevel} ${tPeak} ${midY - tHeight}`;
        path += ` Q ${tPeak + 5} ${midY} ${tEnd} ${midY}`;
      }
      
      // 基线
      path += ` L ${startX + cycleLength} ${midY}`;
    }
    
    return path;
  };
  
  return (
    <div style={containerStyle}>
      <div style={titleStyle}>📈 12导联心电图波形</div>
      <div style={gridStyle}>
        {leads.map((lead) => (
          <div key={lead} style={leadContainerStyle}>
            <div style={leadLabelStyle}>{lead}</div>
            <svg viewBox="0 0 200 60" style={{ width: '100%', height: '50px' }}>
              {/* 网格背景 */}
              <defs>
                <pattern id={`grid-${lead}`} width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="200" height="60" fill={`url(#grid-${lead})`}/>
              
              {/* 波形 */}
              <path
                d={generateLeadPath(lead)}
                fill="none"
                stroke={record.hasSTChange && (lead === 'V1' || lead === 'V2' || lead === 'V3') ? '#dc2626' : '#1e40af'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* 导联名称标签 */}
              <text x="5" y="12" fontSize="8" fill="#94a3b8">{lead}</text>
            </svg>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '12px', display: 'flex', gap: '16px', justifyContent: 'center', fontSize: '10px' }}>
        <span style={{ color: '#1e40af' }}>● 正常</span>
        <span style={{ color: '#dc2626' }}>● ST异常</span>
        <span style={{ color: '#22c55e' }}>● T波异常</span>
      </div>
    </div>
  );
};

// ============================================================
// 心电参数测量面板
// ============================================================
const ECGParameterPanel: React.FC<{ record: ECG12Record; analysis: ECGAnalysis }> = ({ record, analysis }) => {
  const containerStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    padding: '12px',
  };
  
  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '2px solid #22c55e',
  };
  
  const paramGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '8px',
    marginBottom: '12px',
  };
  
  const getParamStyle = (status: string): React.CSSProperties => {
    let bgColor = '#f0fdf4';
    let borderColor = '#22c55e';
    let textColor = '#166534';
    
    if (status === '异常' || status === '延长' || status === '增宽' || status === '偏长' || status === '心动过缓' || status === '心动过速' || status === '左偏' || status === '右偏' || status === '极度右偏') {
      bgColor = '#fef3c7';
      borderColor = '#f59e0b';
      textColor = '#92400e';
    }
    if (status === '危急' || status === '增宽' || status === '极度右偏' || status === '延长') {
      bgColor = '#fee2e2';
      borderColor = '#dc2626';
      textColor = '#991b1b';
    }
    
    return {
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '6px',
      padding: '8px',
      textAlign: 'center' as const,
    };
  };
  
  const getStatusColor = (status: string): string => {
    if (status === '正常') return '#166534';
    if (status === '偏短' || status === '缩短') return '#d97706';
    if (status === '偏长' || status === '延长' || status === '偏宽') return '#b45309';
    if (status === '增宽' || status === '左偏' || status === '右偏') return '#c2410c';
    if (status === '极度右偏') return '#dc2626';
    if (status === '心动过缓' || status === '心动过速') return '#b45309';
    return '#166534';
  };
  
  return (
    <div style={containerStyle}>
      <div style={titleStyle}>📐 心电参数测量面板</div>
      
      <div style={paramGridStyle}>
        {/* HR */}
        <div style={getParamStyle(analysis.hrStatus)}>
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>心率 HR</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>{record.heartRate}</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>bpm</div>
          <div style={{ fontSize: '10px', color: getStatusColor(analysis.hrStatus), marginTop: '2px', fontWeight: 500 }}>{analysis.hrStatus}</div>
        </div>
        
        {/* PR */}
        <div style={getParamStyle(analysis.prStatus)}>
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>PR间期</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>{record.PRInterval}</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>ms</div>
          <div style={{ fontSize: '10px', color: getStatusColor(analysis.prStatus), marginTop: '2px', fontWeight: 500 }}>{analysis.prStatus}</div>
        </div>
        
        {/* QRS */}
        <div style={getParamStyle(analysis.qrsStatus)}>
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>QRS波群</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>{record.QRSInterval}</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>ms</div>
          <div style={{ fontSize: '10px', color: getStatusColor(analysis.qrsStatus), marginTop: '2px', fontWeight: 500 }}>{analysis.qrsStatus}</div>
        </div>
        
        {/* QTc */}
        <div style={getParamStyle(analysis.qtcStatus)}>
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>QTc</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>{record.QTc}</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>ms</div>
          <div style={{ fontSize: '10px', color: getStatusColor(analysis.qtcStatus), marginTop: '2px', fontWeight: 500 }}>{analysis.qtcStatus}</div>
        </div>
        
        {/* 心电轴 */}
        <div style={getParamStyle(analysis.axisStatus)}>
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>心电轴</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>{record.axis}</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>&nbsp;</div>
          <div style={{ fontSize: '10px', color: getStatusColor(analysis.axisStatus), marginTop: '2px', fontWeight: 500 }}>{analysis.axisStatus}</div>
        </div>
      </div>
      
      {/* 详细信息 */}
      <div style={{ fontSize: '11px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
        <div>心律: {record.rhythm} | QT间期: {record.QTInterval}ms | 设备: {record.device}</div>
      </div>
    </div>
  );
};

// ============================================================
// AI辅助分析面板
// ============================================================
const AIAnalysisPanel: React.FC<{ record: ECG12Record; analysis: ECGAnalysis }> = ({ record, analysis }) => {
  const containerStyle: React.CSSProperties = {
    backgroundColor: record.isCritical ? '#fef3c7' : record.isSTEMI ? '#fee2e2' : '#eff6ff',
    borderRadius: '8px',
    border: `1px solid ${record.isCritical ? '#f59e0b' : record.isSTEMI ? '#dc2626' : '#3b82f6'}`,
    padding: '12px',
  };
  
  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: record.isCritical ? '#92400e' : record.isSTEMI ? '#991b1b' : '#1e40af',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };
  
  const tipsListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };
  
  const getTipStyle = (tip: string): React.CSSProperties => {
    if (tip.startsWith('🚨')) {
      return { color: '#dc2626', fontWeight: 600, marginBottom: '4px' };
    } else if (tip.startsWith('⚠️')) {
      return { color: '#d97706', fontWeight: 500, marginBottom: '4px' };
    } else {
      return { color: '#166534', fontWeight: 500, marginBottom: '4px' };
    }
  };
  
  return (
    <div style={containerStyle}>
      <div style={titleStyle}>
        <span>🤖</span>
        <span>AI辅助分析建议</span>
        {record.isCritical && <span style={{ fontSize: '10px', backgroundColor: '#f59e0b', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>危急值</span>}
        {record.isSTEMI && <span style={{ fontSize: '10px', backgroundColor: '#dc2626', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>STEMI</span>}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {/* 诊断结论 */}
        <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>诊断结论</div>
          <div style={{ fontSize: '13px', color: '#1e293b', lineHeight: 1.4 }}>{record.diagnosis}</div>
        </div>
        
        {/* 分析建议 */}
        <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>参数分析</div>
          <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
            {analysis.hrAdvice && <div>• {analysis.hrAdvice}</div>}
            {analysis.prAdvice && <div>• {analysis.prAdvice}</div>}
            {analysis.qrsAdvice && <div>• {analysis.qrsAdvice}</div>}
            {analysis.qtcAdvice && <div>• {analysis.qtcAdvice}</div>}
            {analysis.axisAdvice && <div>• {analysis.axisAdvice}</div>}
          </div>
        </div>
      </div>
      
      {/* AI提示列表 */}
      <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#fff', borderRadius: '6px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>AI智能提示</div>
        <ul style={tipsListStyle}>
          {analysis.aiTips.map((tip, index) => (
            <li key={index} style={getTipStyle(tip)}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ============================================================
// 打印预览组件
// ============================================================
interface PrintPreviewModalProps {
  record: ECG12Record;
  visible: boolean;
  onClose: () => void;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({ record, visible, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (visible && printRef.current) {
      // 触发打印
      const timer = setTimeout(() => {
        window.print();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);
  
  if (!visible) return null;
  
  const analysis = analyzeECG(record);
  
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
  
  const previewContainerStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    width: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  };
  
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '2px solid #1e40af',
    backgroundColor: '#1e40af',
    color: '#fff',
  };
  
  const reportStyle: React.CSSProperties = {
    padding: '24px',
    fontFamily: '"SimSun", "宋体", serif',
  };
  
  const hospitalNameStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '8px',
    color: '#1e293b',
  };
  
  const reportTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e2e8f0',
    color: '#1e40af',
  };
  
  const infoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '16px',
    fontSize: '12px',
  };
  
  const paramTableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '16px',
    fontSize: '12px',
  };
  
  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={previewContainerStyle} onClick={(e) => e.stopPropagation()} ref={printRef}>
        <div style={headerStyle}>
          <span style={{ fontSize: '16px', fontWeight: 600 }}>📋 报告打印预览</span>
          <div>
            <button
              onClick={() => window.print()}
              style={{
                padding: '6px 16px',
                backgroundColor: '#22c55e',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                marginRight: '8px',
              }}
            >
              打印
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '6px 16px',
                backgroundColor: 'transparent',
                color: '#fff',
                border: '1px solid #fff',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              关闭
            </button>
          </div>
        </div>
        
        {/* 打印内容 */}
        <div style={reportStyle} className="print-content">
          <div style={hospitalNameStyle}>全院心电信息系统</div>
          <div style={reportTitleStyle}>12导联静息心电图检查报告</div>
          
          <div style={infoGridStyle}>
            <div><strong>检查ID:</strong> {record.examId}</div>
            <div><strong>患者ID:</strong> {record.patientId}</div>
            <div><strong>姓名:</strong> {record.patientName}</div>
            <div><strong>性别:</strong> {record.gender}</div>
            <div><strong>年龄:</strong> {record.age}岁</div>
            <div><strong>科室:</strong> {record.dept}</div>
            <div><strong>床号:</strong> {record.bedNo || '-'}</div>
            <div><strong>检查类型:</strong> {record.examType}</div>
          </div>
          
          <table style={paramTableStyle} border={1} cellPadding={4}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th>心率(bpm)</th>
                <th>PR间期(ms)</th>
                <th>QRS波群(ms)</th>
                <th>QT间期(ms)</th>
                <th>QTc(ms)</th>
                <th>心电轴</th>
                <th>心律</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ textAlign: 'center' }}>
                <td>{record.heartRate}</td>
                <td>{record.PRInterval}</td>
                <td>{record.QRSInterval}</td>
                <td>{record.QTInterval}</td>
                <td>{record.QTc}</td>
                <td>{record.axis}</td>
                <td>{record.rhythm}</td>
              </tr>
            </tbody>
          </table>
          
          <div style={{ marginBottom: '8px', fontSize: '12px' }}>
            <strong>心电图异常标记:</strong>
            ST段改变: {record.hasSTChange ? '有' : '无'} | 
            T波改变: {record.hasTChange ? '有' : '无'} | 
            STEMI: {record.isSTEMI ? '是' : '否'} | 
            危急值: {record.isCritical ? '是' : '否'}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <strong>诊断结论:</strong>
            <div style={{ 
              padding: '8px', 
              backgroundColor: record.isCritical ? '#fef3c7' : '#f0fdf4',
              borderRadius: '4px',
              marginTop: '4px',
              fontSize: '13px',
            }}>
              {record.diagnosis}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', fontSize: '12px' }}>
            <div>技师: {record.technician}</div>
            <div>审核医生: {record.doctor || '________'}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '12px' }}>
            <div>报告时间: {record.reportTime}</div>
            <div>设备编号: {record.device}</div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          .print-content { padding: 0; }
          body * { visibility: hidden; }
          .print-content, .print-content * { visibility: visible; }
          .print-content { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
};

// ============================================================
// 详情弹窗组件
// ============================================================
const ECGDetailModal: React.FC<ECGDetailModalProps> = ({ record, visible, onClose }) => {
  const [printPreviewVisible, setPrintPreviewVisible] = useState(false);
  
  if (!visible || !record) return null;
  
  const analysis = analyzeECG(record);
  
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
    width: '1100px',
    maxHeight: '90vh',
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
    position: 'sticky',
    top: 0,
    zIndex: 10,
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
  
  const actionButtonStyle: React.CSSProperties = {
    padding: '6px 16px',
    backgroundColor: '#22c55e',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    marginLeft: '8px',
  };
  
  return (
    <>
      <div style={modalOverlayStyle} onClick={onClose}>
        <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
          <div style={modalHeaderStyle}>
            <span style={{ fontSize: '16px', fontWeight: 600 }}>
              心电图详情 - {record.examId}
            </span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setPrintPreviewVisible(true)}
                style={{
                  padding: '6px 16px',
                  backgroundColor: '#8b5cf6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginRight: '12px',
                }}
              >
                📋 打印预览
              </button>
              <button style={closeButtonStyle} onClick={onClose}>×</button>
            </div>
          </div>
          <div style={modalBodyStyle}>
            {/* 左侧 - 患者信息和诊断 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                {/* 患者基本信息 */}
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
              </div>
              
              {/* 右侧 - 导联图和波形 */}
              <div>
                {/* 导联位置示意图 */}
                <LeadPositionDiagram />
                
                {/* 心电参数测量面板 */}
                <div style={{ marginTop: '16px' }}>
                  <ECGParameterPanel record={record} analysis={analysis} />
                </div>
              </div>
            </div>
            
            {/* AI辅助分析 */}
            <div style={{ marginTop: '16px' }}>
              <AIAnalysisPanel record={record} analysis={analysis} />
            </div>
            
            {/* 12导联波形 */}
            <div style={{ marginTop: '16px' }}>
              <ECGWaveformDisplay record={record} />
            </div>
          </div>
        </div>
      </div>
      
      {/* 打印预览弹窗 */}
      <PrintPreviewModal
        record={record}
        visible={printPreviewVisible}
        onClose={() => setPrintPreviewVisible(false)}
      />
    </>
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

// ============================================================
// 主页面组件
// ============================================================
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
      const searchLower = searchText.toLowerCase();
      const matchesSearch = !searchText ||
        record.examId.toLowerCase().includes(searchLower) ||
        record.patientName.toLowerCase().includes(searchLower) ||
        record.diagnosis.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === '全部' || record.status === statusFilter;

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
    setSelectedRecord(record);
    setModalVisible(true);
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
