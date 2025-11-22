

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface LogisticsStep {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'pending';
  description: string;
  date: string;
  details: string;
}

interface LogisticsDocument {
  id: string;
  title: string;
  documentNumber: string;
  uploadDate: string;
  status: 'completed' | 'processing';
}

const ShippingLogisticsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedStep, setSelectedStep] = useState('loading');
  const [selectedStatus, setSelectedStatus] = useState('processing');

  const orderId = params.orderId || 'PO-2024001';

  const logisticsSteps: LogisticsStep[] = [
    {
      id: 'booking',
      title: '订舱',
      status: 'completed',
      description: '已完成 • 1月10日',
      date: '1月10日',
      details: '船公司: 中远海运 • 订舱号: BKG2024001',
    },
    {
      id: 'pickup',
      title: '提箱',
      status: 'completed',
      description: '已完成 • 1月12日',
      date: '1月12日',
      details: '集装箱号: ABCU1234567 • 堆场: 上海港',
    },
    {
      id: 'loading',
      title: '装箱',
      status: 'completed',
      description: '已完成 • 1月13日',
      date: '1月13日',
      details: '装箱地点: 工厂仓库 • 毛重: 25.5吨',
    },
    {
      id: 'customs',
      title: '报关',
      status: 'current',
      description: '进行中 • 预计1月16日完成',
      date: '预计1月16日完成',
      details: '报关行: 上海报关行 • 报关单号: 310020240001',
    },
    {
      id: 'shipping',
      title: '装船',
      status: 'pending',
      description: '待开始 • 预计1月17日',
      date: '预计1月17日',
      details: '船名航次: 中远厦门 V.123 • 预计开船: 1月18日',
    },
  ];

  const logisticsDocuments: LogisticsDocument[] = [
    {
      id: 'booking',
      title: '订舱确认单',
      documentNumber: 'BKG2024001',
      uploadDate: '1月10日上传',
      status: 'completed',
    },
    {
      id: 'container',
      title: '集装箱交接单',
      documentNumber: 'EIR2024001',
      uploadDate: '1月12日上传',
      status: 'completed',
    },
    {
      id: 'packing',
      title: '装箱单',
      documentNumber: 'PL2024001',
      uploadDate: '1月13日上传',
      status: 'completed',
    },
    {
      id: 'customs',
      title: '报关单',
      documentNumber: '310020240001',
      uploadDate: '审核中',
      status: 'processing',
    },
  ];

  const calculateProgress = () => {
    const totalSteps = logisticsSteps.length;
    const completedSteps = logisticsSteps.filter(step => step.status === 'completed').length;
    const currentStep = logisticsSteps.find(step => step.status === 'current') ? 1 : 0;
    return Math.round(((completedSteps + currentStep * 0.5) / totalSteps) * 100);
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleUpdateStatusPress = () => {
    setIsStatusModalVisible(true);
  };

  const handleGenerateBillPress = () => {
    router.push(`/p-doc_generation?orderId=${orderId}&documentType=提单`);
  };

  const handleUploadDocumentPress = () => {
    router.push(`/p-doc_generation?orderId=${orderId}`);
  };

  const handleQueryLogisticsPress = () => {
    Alert.alert('提示', '物流查询功能需要第三方API支持');
  };

  const handleDocumentPress = (documentId: string) => {
    router.push(`/p-doc_detail?documentId=${documentId}`);
  };

  const handleConfirmStatusUpdate = () => {
    setIsStatusModalVisible(false);
    Alert.alert('成功', '物流状态更新成功');
  };

  const handleCancelStatusUpdate = () => {
    setIsStatusModalVisible(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'check';
      case 'current':
        return 'clock';
      default:
        return 'circle';
    }
  };

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'current':
        return '#3B82F6';
      default:
        return 'rgba(255, 255, 255, 0.4)';
    }
  };

  const getStatusBadgeText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'current':
        return '报关中';
      default:
        return '待开始';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return styles.statusBadgeCompleted;
      case 'current':
        return styles.statusBadgeCurrent;
      default:
        return styles.statusBadgePending;
    }
  };

  const getStepStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return styles.stepCompleted;
      case 'current':
        return styles.stepCurrent;
      default:
        return styles.stepPending;
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
                  <FontAwesome6 name="arrow-left" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                  <Text style={styles.pageTitle}>海运物流安排</Text>
                  <Text style={styles.orderInfo}>订单号: {orderId}</Text>
                </View>
              </View>
              <View style={styles.statusButton}>
                <Text style={styles.statusButtonText}>报关中</Text>
              </View>
            </View>
          </View>

          {/* 物流进度概览 */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.sectionTitle}>物流进度</Text>
              <Text style={styles.progressPercentage}>{calculateProgress()}%</Text>
            </View>

            {/* 进度条 */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBar, { width: `${calculateProgress()}%` }]} />
              </View>
            </View>

            {/* 物流环节步骤 */}
            <View style={styles.stepsContainer}>
              {logisticsSteps.map((step) => (
                <View key={step.id} style={[styles.step, getStepStyle(step.status)]}>
                  <View style={styles.stepHeader}>
                    <View style={styles.stepLeft}>
                      <View style={[styles.stepIcon, { backgroundColor: `${getStatusIconColor(step.status)}20` }]}>
                        <FontAwesome6 
                          name={getStatusIcon(step.status)} 
                          size={14} 
                          color={getStatusIconColor(step.status)} 
                        />
                      </View>
                      <View style={styles.stepInfo}>
                        <Text style={styles.stepTitle}>{step.title}</Text>
                        <Text style={styles.stepDescription}>{step.description}</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, getStatusBadgeStyle(step.status)]}>
                      <Text style={styles.statusBadgeText}>{getStatusBadgeText(step.status)}</Text>
                    </View>
                  </View>
                  <Text style={styles.stepDetails}>{step.details}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 物流信息详情 */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>物流信息</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>船名航次</Text>
                  <Text style={styles.detailValue}>中远厦门 V.123</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>提单号</Text>
                  <Text style={styles.detailValue}>BL2024001</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>预计开船</Text>
                  <Text style={styles.detailValue}>2024-01-18</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>目的港</Text>
                  <Text style={styles.detailValue}>鹿特丹港</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>集装箱号</Text>
                  <Text style={styles.detailValue}>ABCU1234567</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>箱型</Text>
                  <Text style={styles.detailValue}>40尺高柜</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.updateStatusButton} onPress={handleUpdateStatusPress}>
                <FontAwesome5 name="edit" size={14} color="#FFFFFF" style={styles.updateStatusIcon} />
                <Text style={styles.updateStatusText}>更新物流状态</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 关联单证 */}
          <View style={styles.documentsSection}>
            <View style={styles.documentsHeader}>
              <Text style={styles.sectionTitle}>关联单证</Text>
              <TouchableOpacity style={styles.generateBillButton} onPress={handleGenerateBillPress}>
                <FontAwesome6 name="plus" size={12} color="#FFFFFF" style={styles.generateBillIcon} />
                <Text style={styles.generateBillText}>生成提单</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.documentsList}>
              {logisticsDocuments.map((doc) => (
                <TouchableOpacity 
                  key={doc.id} 
                  style={styles.documentItem} 
                  onPress={() => handleDocumentPress(doc.id)}
                >
                  <View style={styles.documentLeft}>
                    <View style={[styles.documentIcon, { backgroundColor: doc.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)' }]}>
                      <FontAwesome6 
                        name="file-lines" 
                        size={16} 
                        color={doc.status === 'completed' ? '#10B981' : '#3B82F6'} 
                      />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentTitle}>{doc.title}</Text>
                      <Text style={styles.documentDescription}>{doc.documentNumber} • {doc.uploadDate}</Text>
                    </View>
                  </View>
                  <View style={[styles.documentStatusBadge, { backgroundColor: doc.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)' }]}>
                    <Text style={[styles.documentStatusText, { color: doc.status === 'completed' ? '#10B981' : '#3B82F6' }]}>
                      {doc.status === 'completed' ? '已上传' : '审核中'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 操作按钮 */}
          <View style={styles.actionButtonsSection}>
            <View style={styles.actionButtonsGrid}>
              <TouchableOpacity style={styles.actionButton} onPress={handleQueryLogisticsPress}>
                <FontAwesome6 name="magnifying-glass" size={14} color="#FFFFFF" style={styles.actionButtonIcon} />
                <Text style={styles.actionButtonText}>查询物流状态</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleUploadDocumentPress}>
                <FontAwesome6 name="upload" size={14} color="#FFFFFF" style={styles.actionButtonIcon} />
                <Text style={styles.actionButtonText}>上传单证</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* 状态选择器模态框 */}
        <Modal
          visible={isStatusModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelStatusUpdate}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>更新物流状态</Text>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>当前环节</Text>
                <View style={styles.selectContainer}>
                  <Text style={styles.selectText}>装箱</Text>
                </View>
                <Text style={styles.modalLabel}>状态</Text>
                <View style={styles.selectContainer}>
                  <Text style={styles.selectText}>进行中</Text>
                </View>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelStatusUpdate}>
                  <Text style={styles.modalCancelText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirmButton} onPress={handleConfirmStatusUpdate}>
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

export default ShippingLogisticsScreen;

