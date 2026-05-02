// ============================================================
// 全院心电信息系统 - 初始数据
// 虚构数据，禁止映射真实医院/患者/医生
// ============================================================

// 12导联静息心电图记录
export interface ECG12Record {
  id: string
  examId: string      // EG202605020001
  patientId: string
  patientName: string
  gender: '男' | '女'
  age: number
  dept: string        // 申请科室
  bedNo?: string
  specimenSource: string  // 采集部位
  examType: '常规' | '复查' | '加急'
  heartRate: number   // 心率 bpm
  PRInterval: number  // PR间期 ms
  QRSInterval: number // QRS时限 ms
  QTInterval: number  // QT间期 ms
  QTc: number         // QTc校正 ms
  axis: string        // 心电轴
  diagnosis: string   // 心电图诊断
  rhythm: string      // 心律
  hasSTChange: boolean  // ST段改变
  hasTChange: boolean   // T波改变
  isSTEMI: boolean    // ST抬高型心梗
  isCritical: boolean // 危急值
  device: string      // 设备编号
  technician: string  // 技师
  doctor: string      // 报告医生
  reportTime: string  // 报告时间
  status: '待报告' | '待审核' | '已审核' | '已打印'
}

// 动态心电图记录
export interface HolterRecord {
  id: string
  examId: string      // HD202605020001
  patientId: string
  patientName: string
  gender: '男' | '女'
  age: number
  dept: string
  startTime: string
  endTime: string
  duration: number     // 监测时长(小时)
  avgHeartRate: number
  minHeartRate: number
  maxHeartRate: number
  totalBeats: number
  totalArrhythmias: number  // 室性早搏总数
  supraArrhythmias: number  // 室上性早搏总数
  pauses: number           // 停搏次数
  longestPause: number     // 最长停搏(ms)
  stChanges: boolean        // ST段改变
  tWaveChanges: boolean    // T波改变
  diagnosis: string
  isCritical: boolean
  device: string
  doctor: string
  reportTime: string
  status: '监测中' | '待报告' | '待审核' | '已完成'
}

// 运动平板试验记录
export interface ExerciseRecord {
  id: string
  examId: string      // EX202605020001
  patientId: string
  patientName: string
  gender: '男' | '女'
  age: number
  dept: string
  protocol: string    // Bruce/次极量/亚极量
  targetHR: number    // 目标心率
  achievedHR: number  // 实际最大心率
  maxSBP: number      // 最大收缩压
  maxDBP: number      // 最大舒张压
  exerciseTime: number // 运动时间(分钟)
  reasonForStop: string // 终止原因
  stDepression: number  // ST段压低(mm)
  stElevation: number   // ST段抬高(mm)
  arrhythmias: string   // 运动中心律失常
  diagnosis: string     // 诊断结论
  isPositive: boolean   // 阳性
  isSuspicious: boolean // 可疑阳性
  isNegative: boolean   // 阴性
  isCritical: boolean
  doctor: string
  reportTime: string
  status: '待报告' | '已完成'
}

// 心电危急值记录
export interface CriticalECGRecord {
  id: string
  examId: string
  patientId: string
  patientName: string
  gender: '男' | '女'
  age: number
  dept: string
  examType: '12导联' | '动态心电' | '运动平板'
  criticalType: string  // 危急值类型
  description: string   // 描述
  value: string          // 具体数值
  reportedBy: string     // 报告人
  reportedTime: string   // 报告时间
  receivedBy: string     // 接收人(临床)
  receivedTime: string   // 接收时间
  handleTime?: string    // 处理时间
  outcome: string        // 转归
  status: '待通知' | '已通知' | '已处理' | '已记录'
}

// 区域心电协作医院
export interface RegionalECGHospital {
  id: string
  name: string           // 虚构医院名
  level: string          // 医院等级
  address: string
  dept: string           // 科别
  ecgSubmitted: number   // 累计提交数
  ecgCompleted: number   // 累计完成数
  pendingCount: number   // 待处理
  avgTurnaroundHours: number
  online: boolean
  lastSubmitTime?: string
}

// 区域心电会诊请求
export interface RegionalECGRequest {
  id: string
  requestingHospital: string
  requestingDoctor: string
  patientName: string
  gender: '男' | '女'
  age: number
  ecgType: '12导联' | '动态心电' | '运动平板'
  clinicalHistory: string
  originalDiagnosis: string
  consultationQuestion: string
  ecgFindings: string
  submittedImages: number
  status: '待分配' | '阅图中' | '已完成'
  assignedExpert?: string
  turnaroundHours?: number
  expertOpinion?: string
  submitTime: string
  completeTime?: string
}

// ============ 数据 ============

export const ecg12Records: ECG12Record[] = [
  { id: 'E001', examId: 'EG202605020001', patientId: 'P001', patientName: '张明华', gender: '男', age: 62, dept: '心内科', bedNo: '3-12', specimenSource: '标准12导联', examType: '常规', heartRate: 78, PRInterval: 156, QRSInterval: 92, QTInterval: 386, QTc: 422, axis: '正常', diagnosis: '窦性心律，心电图大致正常', rhythm: '窦性', hasSTChange: false, hasTChange: false, isSTEMI: false, isCritical: false, device: 'ECG-1200-01', technician: '李晓红', doctor: '王志刚', reportTime: '2025-05-02 08:30', status: '已审核' },
  { id: 'E002', examId: 'EG202605020002', patientId: 'P002', patientName: '李秀兰', gender: '女', age: 55, dept: '老年病科', bedNo: '5-08', specimenSource: '标准12导联', examType: '加急', heartRate: 52, PRInterval: 182, QRSInterval: 86, QTInterval: 412, QTc: 418, axis: '左偏', diagnosis: '窦性心动过缓，左心室高电压', rhythm: '窦性心动过缓', hasSTChange: false, hasTChange: true, isSTEMI: false, isCritical: false, device: 'ECG-1200-02', technician: '张丽华', doctor: '刘建国', reportTime: '2025-05-02 09:15', status: '已审核' },
  { id: 'E003', examId: 'EG202605020003', patientId: 'P003', patientName: '王大军', gender: '男', age: 68, dept: '急诊科', specimenSource: '标准12导联', examType: '加急', heartRate: 112, PRInterval: 142, QRSInterval: 108, QTInterval: 342, QTc: 392, axis: '右偏', diagnosis: '窦性心动过速，异常Q波，ST段弓背向上抬高', rhythm: '窦性', hasSTChange: true, hasTChange: false, isSTEMI: true, isCritical: true, device: 'ECG-1200-01', technician: '李晓红', doctor: '急诊值班', reportTime: '2025-05-02 10:05', status: '已审核' },
  { id: 'E004', examId: 'EG202605020004', patientId: 'P004', patientName: '陈美丽', gender: '女', age: 45, dept: '体检中心', specimenSource: '标准12导联', examType: '常规', heartRate: 72, PRInterval: 162, QRSInterval: 88, QTInterval: 378, QTc: 412, axis: '正常', diagnosis: '窦性心律，心电图正常范围', rhythm: '窦性', hasSTChange: false, hasTChange: false, isSTEMI: false, isCritical: false, device: 'ECG-1200-03', technician: '赵晓燕', doctor: '孙伟', reportTime: '2025-05-02 10:45', status: '已审核' },
  { id: 'E005', examId: 'EG202605020005', patientId: 'P005', patientName: '刘国强', gender: '男', age: 73, dept: '心内科', bedNo: '7-03', specimenSource: '标准12导联', examType: '复查', heartRate: 88, PRInterval: 168, QRSInterval: 128, QTInterval: 396, QTc: 446, axis: '左偏', diagnosis: '心房颤动，室性早搏，ST-T改变', rhythm: '心房颤动', hasSTChange: true, hasTChange: true, isSTEMI: false, isCritical: true, device: 'ECG-1200-02', technician: '张丽华', doctor: '王志刚', reportTime: '2025-05-02 11:20', status: '待审核' },
  { id: 'E006', examId: 'EG202605020006', patientId: 'P006', patientName: '周小红', gender: '女', age: 38, dept: '产科', bedNo: '2-15', specimenSource: '标准12导联', examType: '常规', heartRate: 82, PRInterval: 152, QRSInterval: 84, QTInterval: 362, QTc: 416, axis: '正常', diagnosis: '窦性心律，正常心电图', rhythm: '窦性', hasSTChange: false, hasTChange: false, isSTEMI: false, isCritical: false, device: 'ECG-1200-01', technician: '李晓红', doctor: '李敏', reportTime: '2025-05-02 11:50', status: '已审核' },
  { id: 'E007', examId: 'EG202605020007', patientId: 'P007', patientName: '吴志强', gender: '男', age: 58, dept: 'ICU', bedNo: 'ICU-06', specimenSource: '标准12导联', examType: '加急', heartRate: 136, PRInterval: 0, QRSInterval: 142, QTInterval: 328, QTc: 398, axis: '右偏', diagnosis: '心房颤动伴快速心室率，ST段压低', rhythm: '心房颤动', hasSTChange: true, hasTChange: false, isSTEMI: false, isCritical: true, device: 'ECG-1200-02', technician: '张丽华', doctor: 'ICU值班', reportTime: '2025-05-02 12:10', status: '已审核' },
  { id: 'E008', examId: 'EG202605020008', patientId: 'P008', patientName: '郑丽娟', gender: '女', age: 50, dept: '内分泌科', specimenSource: '标准12导联', examType: '常规', heartRate: 76, PRInterval: 158, QRSInterval: 86, QTInterval: 374, QTc: 418, axis: '正常', diagnosis: '窦性心律，T波改变（肢体导联低平）', rhythm: '窦性', hasSTChange: false, hasTChange: true, isSTEMI: false, isCritical: false, device: 'ECG-1200-03', technician: '赵晓燕', doctor: '张华', reportTime: '2025-05-02 13:30', status: '已审核' },
  { id: 'E009', examId: 'EG202605020009', patientId: 'P009', patientName: '黄建国', gender: '男', age: 65, dept: '心内科', bedNo: '4-20', specimenSource: '标准12导联', examType: '复查', heartRate: 64, PRInterval: 198, QRSInterval: 96, QTInterval: 402, QTc: 428, axis: '左偏', diagnosis: '窦性心动过缓，左心室肥厚劳损', rhythm: '窦性', hasSTChange: false, hasTChange: true, isSTEMI: false, isCritical: false, device: 'ECG-1200-01', technician: '李晓红', doctor: '王志刚', reportTime: '2025-05-02 14:00', status: '待审核' },
  { id: 'E010', examId: 'EG202605020010', patientId: 'P010', patientName: '孙伟东', gender: '男', age: 48, dept: '体检中心', specimenSource: '标准12导联', examType: '常规', heartRate: 75, PRInterval: 156, QRSInterval: 90, QTInterval: 380, QTc: 416, axis: '正常', diagnosis: '窦性心律，心电图正常', rhythm: '窦性', hasSTChange: false, hasTChange: false, isSTEMI: false, isCritical: false, device: 'ECG-1200-03', technician: '赵晓燕', doctor: '孙伟', reportTime: '2025-05-02 14:30', status: '已审核' },
  { id: 'E011', examId: 'EG202605020011', patientId: 'P011', patientName: '马秀英', gender: '女', age: 71, dept: '急诊科', specimenSource: '标准12导联', examType: '加急', heartRate: 168, PRInterval: 0, QRSInterval: 76, QTInterval: 312, QTc: 412, axis: '正常', diagnosis: '阵发性室上性心动过速', rhythm: '室上性心动过速', hasSTChange: false, hasTChange: false, isSTEMI: false, isCritical: true, device: 'ECG-1200-01', technician: '李晓红', doctor: '急诊值班', reportTime: '2025-05-02 14:50', status: '已审核' },
  { id: 'E012', examId: 'EG202605020012', patientId: 'P012', patientName: '赵志刚', gender: '男', age: 56, dept: '心内科', bedNo: '6-11', specimenSource: '标准12导联', examType: '常规', heartRate: 58, PRInterval: 186, QRSInterval: 88, QTInterval: 408, QTc: 426, axis: '左偏', diagnosis: '窦性心动过缓，左心室高电压', rhythm: '窦性', hasSTChange: false, hasTChange: false, isSTEMI: false, isCritical: false, device: 'ECG-1200-02', technician: '张丽华', doctor: '王志刚', reportTime: '2025-05-02 15:15', status: '已审核' },
]

export const holterRecords: HolterRecord[] = [
  { id: 'H001', examId: 'HD202605020001', patientId: 'P005', patientName: '刘国强', gender: '男', age: 73, dept: '心内科', startTime: '2025-05-01 08:00', endTime: '2025-05-02 08:00', duration: 24, avgHeartRate: 72, minHeartRate: 38, maxHeartRate: 168, totalBeats: 96420, totalArrhythmias: 2847, supraArrhythmias: 1203, pauses: 8, longestPause: 2100, stChanges: true, tWaveChanges: true, diagnosis: '心房颤动伴长R-R间期，最长停搏2.1秒，ST-T改变', isCritical: true, device: 'HOLTER-24-01', doctor: '王志刚', reportTime: '2025-05-02 10:00', status: '已完成' },
  { id: 'H002', examId: 'HD202605020002', patientId: 'P003', patientName: '王大军', gender: '男', age: 68, dept: '心内科', startTime: '2025-05-01 09:00', endTime: '2025-05-02 09:00', duration: 24, avgHeartRate: 82, minHeartRate: 52, maxHeartRate: 142, totalBeats: 112480, totalArrhythmias: 45, supraArrhythmias: 38, pauses: 1, longestPause: 1520, stChanges: false, tWaveChanges: false, diagnosis: '窦性心律，偶发室性早搏，24小时心率波动在正常范围', isCritical: false, device: 'HOLTER-24-02', doctor: '刘建国', reportTime: '2025-05-02 11:00', status: '已完成' },
  { id: 'H003', examId: 'HD202605020003', patientId: 'P007', patientName: '吴志强', gender: '男', age: 58, dept: 'ICU', startTime: '2025-05-02 08:00', endTime: '2025-05-03 08:00', duration: 24, avgHeartRate: 98, minHeartRate: 44, maxHeartRate: 186, totalBeats: 134560, totalArrhythmias: 5620, supraArrhythmias: 3200, pauses: 12, longestPause: 3200, stChanges: true, tWaveChanges: false, diagnosis: '心房颤动伴快速心室率，夜间长间歇最长达3.2秒，提示病态窦房结综合征可能', isCritical: true, device: 'HOLTER-24-01', doctor: 'ICU值班', reportTime: '2025-05-03 09:00', status: '已完成' },
  { id: 'H004', examId: 'HD202605020004', patientId: 'P009', patientName: '黄建国', gender: '男', age: 65, dept: '心内科', startTime: '2025-05-02 08:00', endTime: '2025-05-03 08:00', duration: 24, avgHeartRate: 60, minHeartRate: 42, maxHeartRate: 98, totalBeats: 86400, totalArrhythmias: 12, supraArrhythmias: 8, pauses: 2, longestPause: 1680, stChanges: false, tWaveChanges: true, diagnosis: '窦性心动过缓伴不齐，最长R-R间期1.68秒，ST段轻度压低', isCritical: false, device: 'HOLTER-24-02', doctor: '王志刚', reportTime: '2025-05-03 10:00', status: '已完成' },
  { id: 'H005', examId: 'HD202605020005', patientId: 'P012', patientName: '赵志刚', gender: '男', age: 56, dept: '心内科', startTime: '2025-05-02 09:00', endTime: '2025-05-03 09:00', duration: 24, avgHeartRate: 58, minHeartRate: 40, maxHeartRate: 102, totalBeats: 83520, totalArrhythmias: 5, supraArrhythmias: 3, pauses: 1, longestPause: 1900, stChanges: false, tWaveChanges: false, diagnosis: '窦性心动过缓，24小时平均心率偏慢，请结合临床', isCritical: false, device: 'HOLTER-24-01', doctor: '刘建国', reportTime: '2025-05-03 11:00', status: '待审核' },
  { id: 'H006', examId: 'HD202605020006', patientId: 'P014', patientName: '周建国', gender: '男', age: 60, dept: '老年病科', startTime: '2025-05-02 08:30', endTime: '2025-05-03 08:30', duration: 24, avgHeartRate: 78, minHeartRate: 50, maxHeartRate: 148, totalBeats: 104400, totalArrhythmias: 128, supraArrhythmias: 95, pauses: 0, longestPause: 0, stChanges: false, tWaveChanges: false, diagnosis: '窦性心律，偶发室上性早搏（95次），偶发室性早搏（33次），未见明显ST段改变', isCritical: false, device: 'HOLTER-24-02', doctor: '张华', reportTime: '2025-05-03 10:30', status: '已完成' },
]

export const exerciseRecords: ExerciseRecord[] = [
  { id: 'X001', examId: 'EX202605020001', patientId: 'P002', patientName: '李秀兰', gender: '女', age: 55, dept: '心内科', protocol: 'Bruce', targetHR: 143, achievedHR: 138, maxSBP: 198, maxDBP: 95, exerciseTime: 8.5, reasonForStop: '达到目标心率', stDepression: 0, stElevation: 0, arrhythmias: '偶发室性早搏', diagnosis: '运动试验阴性', isPositive: false, isSuspicious: false, isNegative: true, isCritical: false, doctor: '王志刚', reportTime: '2025-05-02 10:00', status: '已完成' },
  { id: 'X002', examId: 'EX202605020002', patientId: 'P008', patientName: '郑丽娟', gender: '女', age: 50, dept: '体检中心', protocol: 'Bruce', targetHR: 144, achievedHR: 152, maxSBP: 186, maxDBP: 88, exerciseTime: 9.0, reasonForStop: '体力不支', stDepression: 1.5, stElevation: 0, arrhythmias: '无', diagnosis: '运动试验阳性：运动中ST段水平型压低≥1.5mm，持续3分钟', isPositive: true, isSuspicious: false, isNegative: false, isCritical: true, doctor: '刘建国', reportTime: '2025-05-02 11:30', status: '已完成' },
  { id: 'X003', examId: 'EX202605020003', patientId: 'P010', patientName: '孙伟东', gender: '男', age: 48, dept: '心内科', protocol: 'Bruce', targetHR: 145, achievedHR: 140, maxSBP: 210, maxDBP: 100, exerciseTime: 9.0, reasonForStop: '达到目标心率', stDepression: 0.5, stElevation: 0, arrhythmias: '偶发室上性早搏', diagnosis: '运动试验可疑阳性：运动后ST段压低不足1mm', isPositive: false, isSuspicious: true, isNegative: false, isCritical: false, doctor: '王志刚', reportTime: '2025-05-02 14:00', status: '已完成' },
  { id: 'X004', examId: 'EX202605020004', patientId: 'P003', patientName: '王大军', gender: '男', age: 68, dept: '心内科', protocol: '次极量', targetHR: 124, achievedHR: 118, maxSBP: 225, maxDBP: 108, exerciseTime: 6.0, reasonForStop: '胸闷不适', stDepression: 2.0, stElevation: 0, arrhythmias: '多发室性早搏', diagnosis: '运动试验阳性：ST段水平型压低≥2mm，提示心肌缺血', isPositive: true, isSuspicious: false, isNegative: false, isCritical: true, doctor: '刘建国', reportTime: '2025-05-02 15:30', status: '已完成' },
]

export const criticalECGRecords: CriticalECGRecord[] = [
  { id: 'CV001', examId: 'EG202605020003', patientId: 'P003', patientName: '王大军', gender: '男', age: 68, dept: '急诊科', examType: '12导联', criticalType: 'ST段抬高型心肌梗死(STEMI)', description: 'II、III、aVF导联ST段弓背向上抬高≥0.2mV，对应导联ST段压低', value: 'ST↑≥0.2mV', reportedBy: '李晓红', reportedTime: '2025-05-02 10:05', receivedBy: '张值班', receivedTime: '2025-05-02 10:07', handleTime: '2025-05-02 10:15', outcome: '激活胸痛中心，急诊PCI', status: '已处理' },
  { id: 'CV002', examId: 'EG202605020005', patientId: 'P005', patientName: '刘国强', gender: '男', age: 73, dept: '心内科', examType: '12导联', criticalType: '心房颤动伴快速心室率', description: '心房颤动，心室率136bpm，ST段压低', value: 'AF+VR 136bpm', reportedBy: '张丽华', reportedTime: '2025-05-02 11:20', receivedBy: '王志刚', receivedTime: '2025-05-02 11:22', handleTime: '2025-05-02 11:35', outcome: '抗凝、控制室率', status: '已处理' },
  { id: 'CV003', examId: 'EG202605020007', patientId: 'P007', patientName: '吴志强', gender: '男', age: 58, dept: 'ICU', examType: '12导联', criticalType: '心房颤动伴长间歇', description: '心房颤动，最长R-R间期3.2秒', value: '最长停搏3.2s', reportedBy: '张丽华', reportedTime: '2025-05-02 12:10', receivedBy: 'ICU值班', receivedTime: '2025-05-02 12:12', handleTime: '2025-05-02 12:25', outcome: '安装临时起搏器', status: '已处理' },
  { id: 'CV004', examId: 'EG202605020011', patientId: 'P011', patientName: '马秀英', gender: '女', age: 71, dept: '急诊科', examType: '12导联', criticalType: '阵发性室上性心动过速', description: '心率168bpm，窄QRS波群，律齐', value: 'PSVT 168bpm', reportedBy: '李晓红', reportedTime: '2025-05-02 14:50', receivedBy: '急诊值班', receivedTime: '2025-05-02 14:51', handleTime: '2025-05-02 14:58', outcome: '刺激迷走神经后转复', status: '已处理' },
  { id: 'CV005', examId: 'HD202605020003', patientId: 'P007', patientName: '吴志强', gender: '男', age: 58, dept: 'ICU', examType: '动态心电', criticalType: '心房颤动伴长间歇', description: '24小时Holter监测，最长停搏3.2秒', value: '最长停搏3.2s', reportedBy: '王志刚', reportedTime: '2025-05-03 09:00', receivedBy: 'ICU值班', receivedTime: '2025-05-03 09:05', handleTime: '2025-05-03 09:30', outcome: '建议永久起搏器植入', status: '已记录' },
  { id: 'CV006', examId: 'HD202605020001', patientId: 'P005', patientName: '刘国强', gender: '男', age: 73, dept: '心内科', examType: '动态心电', criticalType: '心房颤动伴长R-R间期', description: 'Holter示最长停搏2.1秒', value: '最长停搏2.1s', reportedBy: '王志刚', reportedTime: '2025-05-02 10:00', receivedBy: '王志刚', receivedTime: '2025-05-02 10:05', handleTime: '2025-05-02 10:30', outcome: '调整抗凝方案', status: '已处理' },
  { id: 'CV007', examId: 'EX202605020004', patientId: 'P003', patientName: '王大军', gender: '男', age: 68, dept: '心内科', examType: '运动平板', criticalType: '运动试验阳性', description: 'Bruce方案运动9分钟，ST段水平型压低≥2mm', value: 'ST↓≥2mm', reportedBy: '刘建国', reportedTime: '2025-05-02 15:30', receivedBy: '王志刚', receivedTime: '2025-05-02 15:32', handleTime: '2025-05-02 16:00', outcome: '安排冠脉造影', status: '已处理' },
  { id: 'CV008', examId: 'EX202605020002', patientId: 'P008', patientName: '郑丽娟', gender: '女', age: 50, dept: '体检中心', examType: '运动平板', criticalType: '运动试验阳性', description: '运动中ST段水平型压低1.5mm，持续3分钟', value: 'ST↓1.5mm/3min', reportedBy: '刘建国', reportedTime: '2025-05-02 11:30', receivedBy: '张华', receivedTime: '2025-05-02 11:35', outcome: '进一步评估', status: '待通知' },
]

export const regionalECGHospitals: RegionalECGHospital[] = [
  { id: 'RH001', name: '云海县人民医院', level: '二甲', address: '云海市云海县人民路88号', dept: '心电图室', ecgSubmitted: 3256, ecgCompleted: 3230, pendingCount: 8, avgTurnaroundHours: 2.5, online: true, lastSubmitTime: '2025-05-02 16:30' },
  { id: 'RH002', name: '峰峰矿区医院', level: '二乙', address: '峰峰市峰峰矿区矿工路12号', dept: '内科', ecgSubmitted: 1842, ecgCompleted: 1830, pendingCount: 5, avgTurnaroundHours: 3.2, online: true, lastSubmitTime: '2025-05-02 15:00' },
  { id: 'RH003', name: '临河市第一医院', level: '三乙', address: '临河市临河区健康路200号', dept: '心内科', ecgSubmitted: 5680, ecgCompleted: 5668, pendingCount: 6, avgTurnaroundHours: 1.8, online: true, lastSubmitTime: '2025-05-02 17:00' },
  { id: 'RH004', name: '山区县中医院', level: '二甲', address: '山区市山区县中医路66号', dept: '门诊', ecgSubmitted: 1230, ecgCompleted: 1215, pendingCount: 7, avgTurnaroundHours: 4.5, online: true, lastSubmitTime: '2025-05-02 14:00' },
  { id: 'RH005', name: '龙潭区中心医院', level: '二甲', address: '龙潭市龙潭区中心路150号', dept: '急诊科', ecgSubmitted: 2890, ecgCompleted: 2878, pendingCount: 4, avgTurnaroundHours: 2.0, online: true, lastSubmitTime: '2025-05-02 16:45' },
  { id: 'RH006', name: '滨海县第二医院', level: '二乙', address: '滨海市滨海县海港路99号', dept: '内科', ecgSubmitted: 980, ecgCompleted: 960, pendingCount: 10, avgTurnaroundHours: 5.8, online: false },
  { id: 'RH007', name: '翠屏山区医院', level: '二乙', address: '翠屏市翠屏山区山路88号', dept: '门诊', ecgSubmitted: 756, ecgCompleted: 745, pendingCount: 4, avgTurnaroundHours: 4.2, online: true, lastSubmitTime: '2025-05-02 12:00' },
  { id: 'RH008', name: '清溪县人民医院', level: '二甲', address: '清溪市清溪县清河路55号', dept: '心电图室', ecgSubmitted: 2130, ecgCompleted: 2115, pendingCount: 7, avgTurnaroundHours: 3.0, online: true, lastSubmitTime: '2025-05-02 15:30' },
  { id: 'RH009', name: '金阳县医院', level: '二甲', address: '金阳市金阳县金山路188号', dept: '内科', ecgSubmitted: 1650, ecgCompleted: 1635, pendingCount: 8, avgTurnaroundHours: 3.5, online: true, lastSubmitTime: '2025-05-02 13:00' },
  { id: 'RH010', name: '银海区中心医院', level: '三乙', address: '银海市银海区海韵大道500号', dept: '心内科', ecgSubmitted: 4200, ecgCompleted: 4188, pendingCount: 5, avgTurnaroundHours: 1.5, online: true, lastSubmitTime: '2025-05-02 17:15' },
]

export const regionalECGRequests: RegionalECGRequest[] = [
  { id: 'RC001', requestingHospital: '云海县人民医院', requestingDoctor: '陈志明', patientName: '钱文华', gender: '女', age: 62, ecgType: '12导联', clinicalHistory: '反复胸闷心悸1年，加重1周', originalDiagnosis: '心律失常待查', consultationQuestion: '请确认心律失常类型及进一步检查建议', ecgFindings: '可见频发室性早搏，部分呈二联律，ST-T改变', submittedImages: 6, status: '已完成', assignedExpert: '王志刚', turnaroundHours: 2, expertOpinion: '符合频发室性早搏（二联律），建议行动态心电图及心肌标志物检查，必要时射频消融治疗。', submitTime: '2025-05-02 08:00', completeTime: '2025-05-02 10:00' },
  { id: 'RC002', requestingHospital: '峰峰矿区医院', requestingDoctor: '周丽华', patientName: '孙志刚', gender: '男', age: 58, ecgType: '12导联', clinicalHistory: '活动后胸闷3月，休息可缓解', originalDiagnosis: '冠心病？', consultationQuestion: '请确认心电图表现及运动平板建议', ecgFindings: '窦性心律，II、III、aVF导联T波低平', submittedImages: 4, status: '阅图中', assignedExpert: '刘建国', submitTime: '2025-05-02 09:30' },
  { id: 'RC003', requestingHospital: '临河市第一医院', requestingDoctor: '吴晓东', patientName: '郑美丽', gender: '女', age: 48, ecgType: '动态心电', clinicalHistory: '反复心悸半年，Holter示可疑心律失常', originalDiagnosis: '心律失常', consultationQuestion: '请明确心律失常性质及治疗方案', ecgFindings: '可见多形性室性早搏，疑有短阵室性心动过速', submittedImages: 8, status: '待分配', submitTime: '2025-05-02 10:00' },
  { id: 'RC004', requestingHospital: '山区县中医院', requestingDoctor: '黄志强', patientName: '周大海', gender: '男', age: 72, ecgType: '12导联', clinicalHistory: '胸痛30分钟伴大汗', originalDiagnosis: '急性冠脉综合征？', consultationQuestion: '请确认是否为STEMI', ecgFindings: 'V1-V4导联ST段弓背向上抬高，对应导联ST段压低', submittedImages: 5, status: '已完成', assignedExpert: '王志刚', turnaroundHours: 1, expertOpinion: '明确STEMI诊断，建议立即转运行PCI治疗。', submitTime: '2025-05-02 10:30', completeTime: '2025-05-02 11:30' },
  { id: 'RC005', requestingHospital: '龙潭区中心医院', requestingDoctor: '马立军', patientName: '刘秀英', gender: '女', age: 55, ecgType: '运动平板', clinicalHistory: '常规体检，运动平板初筛', originalDiagnosis: '健康体检', consultationQuestion: '请评估运动平板结果', ecgFindings: '运动中ST段水平型压低1mm，持续2分钟', submittedImages: 6, status: '已完成', assignedExpert: '刘建国', turnaroundHours: 3, expertOpinion: '运动试验可疑阳性，建议进一步评估或行冠脉CTA检查。', submitTime: '2025-05-01 14:00', completeTime: '2025-05-01 17:00' },
  { id: 'RC006', requestingHospital: '清溪县人民医院', requestingDoctor: '徐志远', patientName: '杨大海', gender: '男', age: 65, ecgType: '12导联', clinicalHistory: '高血压病史10年，心电图异常', originalDiagnosis: '高血压心脏病', consultationQuestion: '请评估心脏情况', ecgFindings: '窦性心律，左心室肥厚劳损', submittedImages: 4, status: '已完成', assignedExpert: '王志刚', turnaroundHours: 4, expertOpinion: '符合高血压性心脏病表现，左室肥厚，建议复查心脏超声，长期降压治疗。', submitTime: '2025-05-01 11:00', completeTime: '2025-05-01 15:00' },
  { id: 'RC007', requestingHospital: '银海区中心医院', requestingDoctor: '张志伟', patientName: '曹雪梅', gender: '女', age: 42, ecgType: '12导联', clinicalHistory: '焦虑症病史，心悸查因', originalDiagnosis: '焦虑相关心悸', consultationQuestion: '请排除心脏器质性疾病', ecgFindings: '窦性心律，心电图大致正常', submittedImages: 3, status: '已完成', assignedExpert: '刘建国', turnaroundHours: 2, expertOpinion: '心电图无明显异常，考虑焦虑相关症状，建议心理科随访。', submitTime: '2025-05-02 08:30', completeTime: '2025-05-02 10:30' },
  { id: 'RC008', requestingHospital: '金阳县医院', requestingDoctor: '赵志刚', patientName: '田华', gender: '男', age: 68, ecgType: '动态心电', clinicalHistory: '晕厥查因，Holter监测中', originalDiagnosis: '晕厥待查', consultationQuestion: '请分析Holter结果与晕厥关系', ecgFindings: '可见多次长R-R间期，最长4.2秒，考虑窦性停搏', submittedImages: 10, status: '阅图中', assignedExpert: '王志刚', submitTime: '2025-05-02 14:00' },
]
