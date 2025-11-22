

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface CertificateData {
  certificateNumber: string;
  productName: string;
  originStandard: string;
  certificateType: string;
  issueDate: string;
  expiryDate: string;
  productDescription: string;
}

interface DocumentItem {
  id: string;
  title: string;
  uploadDate: string;
  status: string;
  icon: string;
  iconColor: string;
}

type StatusType = 'pending' | 'applying' | 'approved' | 'issued' | 'completed' | 'cancelled';

const CertificateOfOriginScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<StatusType>('applying');
  const [selectedStatus, setSelectedStatus] = useState<StatusType>('applying');
  
  const [certificateData, setCertificateData] = useState<CertificateData>({
    certificateNumber: 'CO-2024001',
    productName: '电子产品',
    originStandard: 'wholly',
    certificateType: 'form-a',
    issueDate: '2024-01-15',
    expiryDate: '2024-07-15',
    productDescription: '电子产品，包括智能手机、平板电脑等，符合相关质量标准',
  });

  const [documentsList] = useState<DocumentItem[]>([
    {
      id: 'DOC-001',
      title: '原产地证书申请表',
      uploadDate: '2024-01-10 上传',
      status: '已上传',
      icon: 'file-pdf',
      iconColor: '#3B82F6',
    },
    {
      id: 'DOC-002',
      title: '产品成分证明',
      uploadDate: '2024-01-12 上传',
      status: '已上传',
      icon: 'file-lines',
      iconColor: '#F59E0B',
    },
  ]);

  const statusOptions = [
    { value: 'pending', label: '待申请' },
    { value: 'applying', label: '申请中' },
    { value: 'approved', label: '已审批' },
    { value: 'issued', label: '已领取' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' },
  ];

  const originStandardOptions = [
    { value: 'wholly', label: '完全原产' },
    { value: 'substantial', label: '实质性改变' },
    { value: 'percentage', label: '百分比标准' },
  ];

  const certificateTypeOptions = [
    { value: 'form-a', label: '普惠制产地证(FORM A)' },
    { value: 'form-e', label: '东盟自贸区产地证(FORM E)' },
    { value: 'form-f', label: '中国-智利自贸区产地证(FORM F)' },
    { value: 'form-rcep', label: 'RCEP产地证' },
    { value: 'general', label: '一般原产地证' },
  ];

  const getStatusInfo = (status: StatusType) => {
    switch (status) {
      case 'pending':
        return { text: '待申请', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.2)', progress: 0 };
      case 'applying':
        return { text: '申请中', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.2)', progress: 60 };
      case 'approved':
        return { text: '已审批', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.2)', progress: 80 };
      case 'issued':
        return { text: '已领取', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.2)', progress: 90 };
      case 'completed':
        return { text: '已完成', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.2)', progress: 100 };
      case 'cancelled':
        return { text: '已取消', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.2)', progress: 0 };
      default:
        return { text: '申请中', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.2)', progress: 60 };
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleGenerateCertificate = () => {
    const orderId = params.orderId || 'PO-2024001';
    router.push(`/p-doc_generation?orderId=${orderId}&documentType=产地证`);
  };

  const handleAddDocument = () => {
    const orderId = params.orderId || 'PO-2024001';
    router.push(`/p-doc_generation?orderId=${orderId}&documentType=产地证相关`);
  };

  const handleDocumentPress = (documentId: string) => {
    router.push(`/p-doc_detail?documentId=${documentId}`);
  };

  const handleUpdateStatus = () => {
    setSelectedStatus(currentStatus);
    setIsStatusModalVisible(true);
  };

  const handleConfirmStatus = () => {
    setCurrentStatus(selectedStatus);
    setIsStatusModalVisible(false);
    showToast('状态更新成功');
  };

  const showToast = (message: string) => {
    Alert.alert('提示', message);
  };

  const handleInputChange = (field: keyof CertificateData, value: string) => {
    setCertificateData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const statusInfo = getStatusInfo(currentStatus);
  const orderInfo = params.orderId ? `订单号: ${params.orderId}` : '订单号: PO-2024001';

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部导航 */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.pageTitle}>产地证管理</Text>
              <Text style={styles.orderInfo}>{orderInfo}</Text>
            </View>
          </View>

          {/* 产地证状态卡片 */}
          <View style={styles.statusSection}>
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <View style={styles.statusIconContainer}>
                  <View style={styles.statusIconWrapper}>
                    <FontAwesome6 name="certificate" size={20} color="#8B5CF6" />
                  </View>
                  <View style={styles.statusTitleContainer}>
                    <Text style={styles.statusTitle}>产地证办理状态</Text>
                    <Text style={styles.responsiblePerson}>负责人: 张经理</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
                  <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
                    {statusInfo.text}
                  </Text>
                </View>
              </View>

              <View style={styles.statusDetails}>
                <View style={styles.statusDetailRow}>
                  <Text style={styles.statusDetailLabel}>开始日期</Text>
                  <Text style={styles.statusDetailValue}>2024-01-10</Text>
                </View>
                <View style={styles.statusDetailRow}>
                  <Text style={styles.statusDetailLabel}>预计完成日期</Text>
                  <Text style={styles.statusDetailValue}>2024-01-20</Text>
                </View>
                <View style={styles.statusDetailRow}>
                  <Text style={styles.statusDetailLabel}>办理进度</Text>
                  <Text style={styles.statusDetailValue}>{statusInfo.progress}%</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${statusInfo.progress}%`,
                        backgroundColor: '#8B5CF6'
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>

          {/* 产地证信息 */}
          <View style={styles.certificateInfoSection}>
            <Text style={styles.sectionTitle}>产地证信息</Text>
            <View style={styles.certificateInfoCard}>
              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>证书编号</Text>
                  <TextInput
                    style={styles.textInput}
                    value={certificateData.certificateNumber}
                    onChangeText={(value) => handleInputChange('certificateNumber', value)}
                    placeholder="请输入证书编号"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>商品名称</Text>
                  <TextInput
                    style={styles.textInput}
                    value={certificateData.productName}
                    onChangeText={(value) => handleInputChange('productName', value)}
                    placeholder="请输入商品名称"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>原产地标准</Text>
                  <TouchableOpacity style={styles.selectInput}>
                    <Text style={styles.selectInputText}>
                      {originStandardOptions.find(opt => opt.value === certificateData.originStandard)?.label}
                    </Text>
                    <FontAwesome6 name="chevron-down" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>证书类型</Text>
                  <TouchableOpacity style={styles.selectInput}>
                    <Text style={styles.selectInputText}>
                      {certificateTypeOptions.find(opt => opt.value === certificateData.certificateType)?.label}
                    </Text>
                    <FontAwesome6 name="chevron-down" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>签发日期</Text>
                  <TextInput
                    style={styles.textInput}
                    value={certificateData.issueDate}
                    onChangeText={(value) => handleInputChange('issueDate', value)}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>有效期至</Text>
                  <TextInput
                    style={styles.textInput}
                    value={certificateData.expiryDate}
                    onChangeText={(value) => handleInputChange('expiryDate', value)}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  />
                </View>
              </View>

              <View style={styles.formFieldFull}>
                <Text style={styles.fieldLabel}>商品描述</Text>
                <TextInput
                  style={styles.textArea}
                  value={certificateData.productDescription}
                  onChangeText={(value) => handleInputChange('productDescription', value)}
                  placeholder="请输入商品描述"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* 关联单证 */}
          <View style={styles.relatedDocumentsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>关联单证</Text>
              <TouchableOpacity style={styles.addDocumentButton} onPress={handleAddDocument}>
                <FontAwesome6 name="plus" size={12} color="#8B5CF6" />
                <Text style={styles.addDocumentText}>添加单证</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.documentsList}>
              {documentsList.map((document) => (
                <TouchableOpacity
                  key={document.id}
                  style={styles.documentItem}
                  onPress={() => handleDocumentPress(document.id)}
                >
                  <View style={styles.documentContent}>
                    <View style={styles.documentIconContainer}>
                      <View style={[styles.documentIconWrapper, { backgroundColor: `${document.iconColor}33` }]}>
                        <FontAwesome6 name={document.icon} size={16} color={document.iconColor} />
                      </View>
                      <View style={styles.documentInfo}>
                        <Text style={styles.documentTitle}>{document.title}</Text>
                        <Text style={styles.documentDate}>{document.uploadDate}</Text>
                      </View>
                    </View>
                    <View style={styles.documentStatusBadge}>
                      <Text style={styles.documentStatusText}>{document.status}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 操作按钮 */}
          <View style={styles.actionButtonsSection}>
            <TouchableOpacity style={styles.generateButton} onPress={handleGenerateCertificate}>
              <FontAwesome6 name="file-lines" size={16} color="#FFFFFF" />
              <Text style={styles.generateButtonText}>生成产地证</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateStatus}>
              <FontAwesome6 name="arrows-rotate" size={16} color="#FFFFFF" />
              <Text style={styles.updateButtonText}>更新状态</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 状态更新模态框 */}
        <Modal
          visible={isStatusModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsStatusModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>更新产地证状态</Text>
              <View style={styles.statusOptionsContainer}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.statusOption,
                      selectedStatus === option.value && styles.statusOptionSelected
                    ]}
                    onPress={() => setSelectedStatus(option.value as StatusType)}
                  >
                    <Text style={[
                      styles.statusOptionText,
                      selectedStatus === option.value && styles.statusOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                    {selectedStatus === option.value && (
                      <FontAwesome6 name="check" size={14} color="#3B82F6" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setIsStatusModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleConfirmStatus}
                >
                  <Text style={styles.modalConfirmText}>确认</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CertificateOfOriginScreen;

