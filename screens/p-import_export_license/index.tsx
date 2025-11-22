

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface LicenseInfo {
  licenseNumber: string;
  applicationDate: string;
  expiryDate: string;
  applicableGoods: string;
  applicationAmount: string;
  remark: string;
}

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  icon: string;
  iconColor: string;
}

interface RelatedDocument {
  id: string;
  title: string;
  description: string;
  status: string;
  statusColor: string;
  date: string;
  icon: string;
  iconColor: string;
}

const ImportExportLicenseScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const orderId = (params.orderId as string) || 'PO-2024001';
  
  // 状态管理
  const [currentStatus, setCurrentStatus] = useState('申请中');
  const [statusDescription, setStatusDescription] = useState('许可证申请已提交，等待审批');
  const [statusBadge, setStatusBadge] = useState('进行中');
  const [progressPercentage, setProgressPercentage] = useState(60);
  const [responsiblePerson, setResponsiblePerson] = useState('张经理');
  const [startDate, setStartDate] = useState('2024-01-10');
  const [expectedDate, setExpectedDate] = useState('2024-01-20');
  const [updateTime, setUpdateTime] = useState('2024-01-15 14:30');
  
  // 许可证信息
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo>({
    licenseNumber: '',
    applicationDate: '2024-01-10',
    expiryDate: '',
    applicableGoods: '电子产品',
    applicationAmount: 'USD 150,000',
    remark: '常规电子产品出口许可申请',
  });
  
  // 弹窗状态
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('reviewing');
  const [statusNote, setStatusNote] = useState('');
  
  // 流程步骤数据
  const [processSteps] = useState<ProcessStep[]>([
    {
      id: 'step-1',
      title: '准备申请材料',
      description: '已完成 - 2024-01-10',
      status: 'completed',
      icon: 'check',
      iconColor: '#10B981',
    },
    {
      id: 'step-2',
      title: '填写申请表格',
      description: '已完成 - 2024-01-11',
      status: 'completed',
      icon: 'check',
      iconColor: '#10B981',
    },
    {
      id: 'step-3',
      title: '提交审批',
      description: '进行中 - 预计2024-01-18完成',
      status: 'current',
      icon: 'clock',
      iconColor: '#3B82F6',
    },
    {
      id: 'step-4',
      title: '领取许可证',
      description: '待开始',
      status: 'pending',
      icon: '4',
      iconColor: 'rgba(255, 255, 255, 0.6)',
    },
  ]);
  
  // 关联单证数据
  const [relatedDocuments] = useState<RelatedDocument[]>([
    {
      id: 'doc-1',
      title: '许可证申请表格',
      description: '申请单号: APP-2024001',
      status: '已提交',
      statusColor: '#10B981',
      date: '2024-01-11',
      icon: 'file-lines',
      iconColor: '#3B82F6',
    },
    {
      id: 'doc-2',
      title: '营业执照副本',
      description: '扫描件',
      status: '已上传',
      statusColor: '#10B981',
      date: '2024-01-10',
      icon: 'file-pdf',
      iconColor: '#8B5CF6',
    },
    {
      id: 'doc-3',
      title: '产品说明书',
      description: '电子产品详细说明',
      status: '已上传',
      statusColor: '#10B981',
      date: '2024-01-10',
      icon: 'file-lines',
      iconColor: '#06B6D4',
    },
  ]);
  
  // 状态选项
  const statusOptions = [
    { value: 'pending', label: '待处理' },
    { value: 'preparing', label: '准备材料中' },
    { value: 'submitted', label: '已提交申请' },
    { value: 'reviewing', label: '审批中' },
    { value: 'approved', label: '已批准' },
    { value: 'completed', label: '已完成' },
    { value: 'rejected', label: '已驳回' },
  ];
  
  // 返回按钮处理
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };
  
  // 更新状态处理
  const handleUpdateStatusPress = () => {
    setIsStatusModalVisible(true);
  };
  
  // 确认状态更新
  const handleConfirmStatusUpdate = () => {
    const statusInfo = getStatusInfo(selectedStatus);
    setCurrentStatus(statusInfo.text);
    setStatusDescription(statusInfo.desc);
    setStatusBadge(statusInfo.text);
    setProgressPercentage(statusInfo.progress);
    
    // 更新最后更新时间
    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setUpdateTime(timeString);
    
    setIsStatusModalVisible(false);
    setStatusNote('');
    showToast('状态更新成功');
  };
  
  // 取消状态更新
  const handleCancelStatusUpdate = () => {
    setIsStatusModalVisible(false);
    setStatusNote('');
  };
  
  // 生成许可证申请单
  const handleGenerateLicensePress = () => {
    router.push(`/p-doc_generation?orderId=${orderId}&documentType=许可证申请单`);
  };
  
  // 关联单证点击
  const handleDocumentPress = (documentId: string) => {
    const docId = `DOC-${orderId}-LICENSE-${documentId}`;
    router.push(`/p-doc_detail?documentId=${docId}`);
  };
  
  // 提交申请
  const handleSubmitApplicationPress = () => {
    if (currentStatus !== '已提交申请') {
      const statusInfo = getStatusInfo('submitted');
      setCurrentStatus(statusInfo.text);
      setStatusDescription(statusInfo.desc);
      setStatusBadge(statusInfo.text);
      setProgressPercentage(statusInfo.progress);
      showToast('申请提交成功');
    } else {
      showToast('申请已提交，请勿重复提交');
    }
  };
  
  // 上传文件
  const handleUploadDocumentPress = () => {
    showToast('文件上传功能需要原生实现');
  };
  
  // 办理指南
  const handleViewGuidelinesPress = () => {
    showToast('办理指南功能开发中');
  };
  
  // 获取状态信息
  const getStatusInfo = (status: string) => {
    const statusMapping: Record<string, any> = {
      'pending': { text: '待处理', desc: '等待开始办理', progress: 0 },
      'preparing': { text: '准备材料中', desc: '正在准备申请材料', progress: 25 },
      'submitted': { text: '已提交申请', desc: '申请已提交，等待审批', progress: 50 },
      'reviewing': { text: '审批中', desc: '许可证申请已提交，等待审批', progress: 60 },
      'approved': { text: '已批准', desc: '许可证已批准，可领取', progress: 85 },
      'completed': { text: '已完成', desc: '许可证已领取，办理完成', progress: 100 },
      'rejected': { text: '已驳回', desc: '申请被驳回，请检查材料', progress: 0 },
    };
    return statusMapping[status] || statusMapping['pending'];
  };
  
  // 显示提示
  const showToast = (message: string) => {
    Alert.alert('提示', message);
  };
  
  // 渲染流程步骤
  const renderProcessStep = (step: ProcessStep) => (
    <View key={step.id} style={[styles.statusStep, styles[`statusStep${step.status.charAt(0).toUpperCase() + step.status.slice(1)}` as keyof typeof styles] as ViewStyle]}>
      <View style={styles.stepContent}>
        <View style={[styles.stepIcon, { backgroundColor: step.iconColor }]}>
          {step.icon === 'check' || step.icon === 'clock' ? (
            <FontAwesome6 name={step.icon} size={14} color="#FFFFFF" />
          ) : (
            <Text style={styles.stepNumber}>{step.icon}</Text>
          )}
        </View>
        <View style={styles.stepText}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepDescription}>{step.description}</Text>
        </View>
      </View>
    </View>
  );
  
  // 渲染关联单证
  const renderRelatedDocument = (doc: RelatedDocument) => (
    <TouchableOpacity
      key={doc.id}
      style={styles.documentItem}
      onPress={() => handleDocumentPress(doc.id)}
    >
      <View style={styles.documentContent}>
        <View style={styles.documentLeft}>
          <View style={[styles.documentIcon, { backgroundColor: `${doc.iconColor}33` }]}>
            <FontAwesome6 name={doc.icon} size={16} color={doc.iconColor} />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentTitle}>{doc.title}</Text>
            <Text style={styles.documentDescription}>{doc.description}</Text>
          </View>
        </View>
        <View style={styles.documentRight}>
          <View style={[styles.documentStatus, { backgroundColor: `${doc.statusColor}33` }]}>
            <Text style={[styles.documentStatusText, { color: doc.statusColor }]}>{doc.status}</Text>
          </View>
          <Text style={styles.documentDate}>{doc.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部导航区域 */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <FontAwesome6 name="arrow-left" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.headerTitle}>
                <Text style={styles.pageTitle}>进出口许可办理</Text>
                <Text style={styles.orderInfo}>订单号: {orderId}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateStatusPress}>
              <Text style={styles.updateButtonText}>更新状态</Text>
            </TouchableOpacity>
          </View>
          
          {/* 许可证办理状态卡片 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>办理状态</Text>
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <View style={styles.statusLeft}>
                  <View style={styles.statusIconContainer}>
                    <FontAwesome6 name="certificate" size={20} color="#3B82F6" />
                  </View>
                  <View style={styles.statusInfo}>
                    <Text style={styles.currentStatus}>{currentStatus}</Text>
                    <Text style={styles.statusDescription}>{statusDescription}</Text>
                  </View>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{statusBadge}</Text>
                </View>
              </View>
              
              {/* 进度条 */}
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>进度</Text>
                  <Text style={styles.progressText}>{progressPercentage}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
                </View>
              </View>
              
              {/* 负责人和时间 */}
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>负责人:</Text>
                  <Text style={styles.infoValue}>{responsiblePerson}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>开始时间:</Text>
                  <Text style={styles.infoValue}>{startDate}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>预计完成:</Text>
                  <Text style={styles.infoValue}>{expectedDate}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>状态更新:</Text>
                  <Text style={styles.infoValue}>{updateTime}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* 许可证信息 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>许可证信息</Text>
            <View style={styles.infoCard}>
              <View style={styles.formGrid}>
                <View style={styles.formItem}>
                  <Text style={styles.formLabel}>许可证号</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="待审批后生成"
                    value={licenseInfo.licenseNumber}
                    onChangeText={(text) => setLicenseInfo(prev => ({ ...prev, licenseNumber: text }))}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  />
                </View>
                <View style={styles.formItem}>
                  <Text style={styles.formLabel}>申请日期</Text>
                  <TextInput
                    style={styles.formInput}
                    value={licenseInfo.applicationDate}
                    onChangeText={(text) => setLicenseInfo(prev => ({ ...prev, applicationDate: text }))}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  />
                </View>
              </View>
              
              <View style={styles.formGrid}>
                <View style={styles.formItem}>
                  <Text style={styles.formLabel}>有效期至</Text>
                  <TextInput
                    style={styles.formInput}
                    value={licenseInfo.expiryDate}
                    onChangeText={(text) => setLicenseInfo(prev => ({ ...prev, expiryDate: text }))}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  />
                </View>
                <View style={styles.formItem}>
                  <Text style={styles.formLabel}>适用商品</Text>
                  <TextInput
                    style={styles.formInput}
                    value={licenseInfo.applicableGoods}
                    onChangeText={(text) => setLicenseInfo(prev => ({ ...prev, applicableGoods: text }))}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  />
                </View>
              </View>
              
              <View style={styles.formItemFull}>
                <Text style={styles.formLabel}>申请金额</Text>
                <TextInput
                  style={styles.formInput}
                  value={licenseInfo.applicationAmount}
                  onChangeText={(text) => setLicenseInfo(prev => ({ ...prev, applicationAmount: text }))}
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
              </View>
              
              <View style={styles.formItemFull}>
                <Text style={styles.formLabel}>备注</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  value={licenseInfo.remark}
                  onChangeText={(text) => setLicenseInfo(prev => ({ ...prev, remark: text }))}
                  multiline
                  numberOfLines={3}
                  placeholder="填写备注信息..."
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
              </View>
            </View>
          </View>
          
          {/* 办理流程步骤 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>办理流程</Text>
            <View style={styles.stepsContainer}>
              {processSteps.map(renderProcessStep)}
            </View>
          </View>
          
          {/* 关联单证 */}
          <View style={styles.section}>
            <View style={styles.documentsHeader}>
              <Text style={styles.sectionTitle}>关联单证</Text>
              <TouchableOpacity style={styles.generateButton} onPress={handleGenerateLicensePress}>
                <FontAwesome6 name="plus" size={12} color="#FFFFFF" />
                <Text style={styles.generateButtonText}>生成许可证申请单</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.documentsList}>
              {relatedDocuments.map(renderRelatedDocument)}
            </View>
          </View>
          
          {/* 操作按钮区域 */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitApplicationPress}>
              <FontAwesome6 name="paper-plane" size={16} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>提交申请</Text>
            </TouchableOpacity>
            
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.actionButton} onPress={handleUploadDocumentPress}>
                <FontAwesome6 name="upload" size={14} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>上传文件</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleViewGuidelinesPress}>
                <FontAwesome6 name="book" size={14} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>办理指南</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        
        {/* 状态选择弹窗 */}
        <Modal
          visible={isStatusModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancelStatusUpdate}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>更新状态</Text>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>选择新状态</Text>
                <View style={styles.statusSelector}>
                  {statusOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.statusOption,
                        selectedStatus === option.value && styles.statusOptionSelected,
                      ]}
                      onPress={() => setSelectedStatus(option.value)}
                    >
                      <Text
                        style={[
                          styles.statusOptionText,
                          selectedStatus === option.value && styles.statusOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={[styles.formInput, styles.modalTextArea]}
                  value={statusNote}
                  onChangeText={setStatusNote}
                  placeholder="添加备注信息..."
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelStatusUpdate}>
                  <Text style={styles.modalCancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirmButton} onPress={handleConfirmStatusUpdate}>
                  <Text style={styles.modalConfirmButtonText}>确认</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ImportExportLicenseScreen;

