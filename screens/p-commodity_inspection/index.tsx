

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface CertificateInfo {
  certificateNumber: string;
  inspectionDate: string;
  productName: string;
  inspectionResult: string;
  validFrom: string;
  validTo: string;
  inspectionAgency: string;
  remarks: string;
}

interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  uploadTime: string;
  icon: string;
  iconColor: string;
  status: string;
}

type StatusType = 'pending' | 'processing' | 'completed' | 'expired';

interface StatusInfo {
  text: string;
  class: StatusType;
  progress: number;
}

const CommodityInspectionScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<StatusType>('processing');
  const [progressValue, setProgressValue] = useState(60);
  
  const [certificateInfo, setCertificateInfo] = useState<CertificateInfo>({
    certificateNumber: 'CI-2024001',
    inspectionDate: '2024-01-15',
    productName: '电子产品 - 智能手机',
    inspectionResult: '合格',
    validFrom: '2024-01-16',
    validTo: '2024-07-16',
    inspectionAgency: '中国出入境检验检疫局',
    remarks: '检验合格，符合出口标准',
  });

  const documentList: DocumentItem[] = [
    {
      id: '1',
      title: '商检证书正本',
      fileName: 'CI-2024001.pdf',
      uploadTime: '2024-01-15 14:30',
      icon: 'file-pdf',
      iconColor: '#10B981',
      status: '已上传',
    },
    {
      id: '2',
      title: '商品检验报告',
      fileName: 'Inspection-Report-001.jpg',
      uploadTime: '2024-01-14 16:45',
      icon: 'file-image',
      iconColor: '#3B82F6',
      status: '已上传',
    },
    {
      id: '3',
      title: '检验申请单',
      fileName: 'Application-Form.docx',
      uploadTime: '2024-01-10 09:20',
      icon: 'file-lines',
      iconColor: '#F59E0B',
      status: '已上传',
    },
  ];

  const statusOptions: Record<StatusType, StatusInfo> = {
    pending: { text: '待申请', class: 'pending', progress: 0 },
    processing: { text: '办理中', class: 'processing', progress: 60 },
    completed: { text: '已完成', class: 'completed', progress: 100 },
    expired: { text: '已过期', class: 'expired', progress: 0 },
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleGenerateCertificate = () => {
    const orderId = params.orderId || 'PO-2024001';
    router.push(`/p-doc_generation?orderId=${orderId}&documentType=商检证书`);
  };

  const handleUploadDocument = () => {
    const orderId = params.orderId || 'PO-2024001';
    router.push(`/p-doc_generation?orderId=${orderId}&documentType=商检相关`);
  };

  const handleDocumentPress = (documentId: string) => {
    router.push(`/p-doc_detail?documentId=DOC-${documentId}`);
  };

  const handleUpdateStatus = () => {
    setIsStatusModalVisible(true);
  };

  const handleStatusSelect = (status: StatusType) => {
    const statusInfo = statusOptions[status];
    setCurrentStatus(status);
    setProgressValue(statusInfo.progress);
    setIsStatusModalVisible(false);
    showToast('状态更新成功');
  };

  const handleSaveInfo = () => {
    console.log('保存商检证书信息:', certificateInfo);
    showToast('信息保存成功');
  };

  const showToast = (message: string) => {
    Alert.alert('提示', message);
  };

  const getStatusBadgeStyle = (status: StatusType) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'processing':
        return styles.statusProcessing;
      case 'completed':
        return styles.statusCompleted;
      case 'expired':
        return styles.statusExpired;
      default:
        return styles.statusProcessing;
    }
  };

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case 'pending':
        return 'circle';
      case 'processing':
        return 'circle';
      case 'completed':
        return 'check-circle';
      case 'expired':
        return 'exclamation-circle';
      default:
        return 'circle';
    }
  };

  const getStatusIconColor = (status: StatusType) => {
    switch (status) {
      case 'pending':
        return 'rgba(255, 255, 255, 0.3)';
      case 'processing':
        return '#3B82F6';
      case 'completed':
        return '#10B981';
      case 'expired':
        return '#EF4444';
      default:
        return '#3B82F6';
    }
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部导航区域 */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                  <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.pageTitle}>商检证书管理</Text>
                  <Text style={styles.orderInfo}>
                    订单号: {params.orderId || 'PO-2024001'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 商检证书状态卡片 */}
          <View style={styles.statusSection}>
            <View style={styles.statusCard}>
              <View style={styles.statusCardHeader}>
                <View style={styles.statusCardLeft}>
                  <View style={styles.statusIconContainer}>
                    <FontAwesome6 name="certificate" size={20} color="#3B82F6" />
                  </View>
                  <View style={styles.statusCardTextContainer}>
                    <Text style={styles.statusCardTitle}>商检证书办理状态</Text>
                    <Text style={styles.statusCardSubtitle}>当前进度</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, getStatusBadgeStyle(currentStatus)]}>
                  <Text style={styles.statusBadgeText}>
                    {statusOptions[currentStatus].text}
                  </Text>
                </View>
              </View>

              <View style={styles.statusDetails}>
                <View style={styles.statusDetailRow}>
                  <Text style={styles.statusDetailLabel}>负责人</Text>
                  <Text style={styles.statusDetailValue}>张经理</Text>
                </View>
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
                  <Text style={styles.statusDetailValue}>{progressValue}%</Text>
                </View>
              </View>

              {/* 进度条 */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${progressValue}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>

          {/* 商检证书信息 */}
          <View style={styles.certificateInfoSection}>
            <Text style={styles.sectionTitle}>商检证书信息</Text>
            <View style={styles.certificateFormCard}>
              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>证书编号</Text>
                  <TextInput
                    style={[styles.formInput, styles.readonlyInput]}
                    value={certificateInfo.certificateNumber}
                    editable={false}
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>检验日期</Text>
                  <TextInput
                    style={styles.formInput}
                    value={certificateInfo.inspectionDate}
                    onChangeText={(text) => 
                      setCertificateInfo(prev => ({ ...prev, inspectionDate: text }))
                    }
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>商品名称</Text>
                <TextInput
                  style={[styles.formInput, styles.readonlyInput]}
                  value={certificateInfo.productName}
                  editable={false}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>检验结果</Text>
                <View style={styles.selectContainer}>
                  <TextInput
                    style={styles.formInput}
                    value={certificateInfo.inspectionResult}
                    onChangeText={(text) => 
                      setCertificateInfo(prev => ({ ...prev, inspectionResult: text }))
                    }
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>有效期从</Text>
                  <TextInput
                    style={styles.formInput}
                    value={certificateInfo.validFrom}
                    onChangeText={(text) => 
                      setCertificateInfo(prev => ({ ...prev, validFrom: text }))
                    }
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>有效期至</Text>
                  <TextInput
                    style={styles.formInput}
                    value={certificateInfo.validTo}
                    onChangeText={(text) => 
                      setCertificateInfo(prev => ({ ...prev, validTo: text }))
                    }
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>检验机构</Text>
                <TextInput
                  style={styles.formInput}
                  value={certificateInfo.inspectionAgency}
                  onChangeText={(text) => 
                    setCertificateInfo(prev => ({ ...prev, inspectionAgency: text }))
                  }
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>备注</Text>
                <TextInput
                  style={[styles.formInput, styles.textAreaInput]}
                  value={certificateInfo.remarks}
                  onChangeText={(text) => 
                    setCertificateInfo(prev => ({ ...prev, remarks: text }))
                  }
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* 关联单证列表 */}
          <View style={styles.relatedDocumentsSection}>
            <View style={styles.relatedDocumentsHeader}>
              <Text style={styles.sectionTitle}>关联单证</Text>
              <TouchableOpacity 
                style={styles.uploadButton} 
                onPress={handleUploadDocument}
              >
                <FontAwesome6 name="plus" size={12} color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>上传单证</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.documentsList}>
              {documentList.map((document) => (
                <TouchableOpacity
                  key={document.id}
                  style={styles.documentItem}
                  onPress={() => handleDocumentPress(document.id)}
                >
                  <View style={styles.documentItemContent}>
                    <View style={styles.documentItemLeft}>
                      <View style={[styles.documentIconContainer, { backgroundColor: `${document.iconColor}33` }]}>
                        <FontAwesome6 
                          name={document.icon as any} 
                          size={16} 
                          color={document.iconColor} 
                        />
                      </View>
                      <View style={styles.documentTextContainer}>
                        <Text style={styles.documentTitle}>{document.title}</Text>
                        <Text style={styles.documentFileName}>{document.fileName}</Text>
                        <Text style={styles.documentUploadTime}>上传时间: {document.uploadTime}</Text>
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

          {/* 操作按钮区域 */}
          <View style={styles.actionButtonsSection}>
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleGenerateCertificate}
              >
                <FontAwesome6 name="file-lines" size={16} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>生成商检证书</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleUpdateStatus}
              >
                <FontAwesome6 name="arrows-rotate" size={16} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>更新状态</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSaveInfo}
            >
              <FontAwesome6 name="floppy-disk" size={16} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>保存信息</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 状态选择器模态框 */}
        <Modal
          visible={isStatusModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsStatusModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsStatusModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity activeOpacity={1}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>更新商检证书状态</Text>
                  <View style={styles.statusOptionsList}>
                    {(Object.keys(statusOptions) as StatusType[]).map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={styles.statusOption}
                        onPress={() => handleStatusSelect(status)}
                      >
                        <View style={styles.statusOptionContent}>
                          <Text style={styles.statusOptionText}>
                            {statusOptions[status].text}
                          </Text>
                          <FontAwesome6
                            name={getStatusIcon(status) as any}
                            size={16}
                            color={getStatusIconColor(status)}
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setIsStatusModalVisible(false)}
                  >
                    <Text style={styles.modalCancelButtonText}>取消</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CommodityInspectionScreen;

