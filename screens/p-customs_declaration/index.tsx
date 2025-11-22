

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface StatusOption {
  value: string;
  label: string;
  style: string;
}

interface DocumentItem {
  id: string;
  title: string;
  documentNumber: string;
  status: string;
  statusStyle: string;
  date: string;
  icon: string;
  iconColor: string;
}

interface ProcessStep {
  id: string;
  title: string;
  status: string;
  statusDetail: string;
  date: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

const CustomsDeclarationScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState('processing');
  const [progressPercentage, setProgressPercentage] = useState(60);

  const orderId = (params.orderId as string) || 'PO-2024001';

  const statusOptions: StatusOption[] = [
    { value: 'pending', label: '待处理', style: 'status-pending' },
    { value: 'processing', label: '审核中', style: 'status-processing' },
    { value: 'completed', label: '已完成', style: 'status-completed' },
    { value: 'rejected', label: '已驳回', style: 'status-rejected' },
  ];

  const documentItems: DocumentItem[] = [
    {
      id: 'DOC-1',
      title: '报关单申请表',
      documentNumber: 'CD-2024001-001',
      status: '已上传',
      statusStyle: 'status-completed',
      date: '1月12日',
      icon: 'file-pdf',
      iconColor: '#3B82F6',
    },
    {
      id: 'DOC-2',
      title: '商业发票',
      documentNumber: 'INV-2024001',
      status: '已上传',
      statusStyle: 'status-completed',
      date: '1月11日',
      icon: 'file-lines',
      iconColor: '#8B5CF6',
    },
    {
      id: 'DOC-3',
      title: '装箱单',
      documentNumber: 'PL-2024001',
      status: '已上传',
      statusStyle: 'status-completed',
      date: '1月11日',
      icon: 'boxes-stacked',
      iconColor: '#06B6D4',
    },
    {
      id: 'DOC-4',
      title: '原产地证明',
      documentNumber: 'CO-2024001',
      status: '待上传',
      statusStyle: 'status-pending',
      date: '需要补充',
      icon: 'certificate',
      iconColor: '#F59E0B',
    },
  ];

  const processSteps: ProcessStep[] = [
    {
      id: '1',
      title: '填写报关单',
      status: '已完成',
      statusDetail: '已完成',
      date: '1月10日',
      isCompleted: true,
      isCurrent: false,
    },
    {
      id: '2',
      title: '提交报关单',
      status: '已完成',
      statusDetail: '已完成',
      date: '1月12日',
      isCompleted: true,
      isCurrent: false,
    },
    {
      id: '3',
      title: '海关审核',
      status: '进行中',
      statusDetail: '预计1月18日完成',
      date: '进行中',
      isCompleted: false,
      isCurrent: true,
    },
    {
      id: '4',
      title: '缴纳税费',
      status: '待开始',
      statusDetail: '待审核通过后进行',
      date: '待开始',
      isCompleted: false,
      isCurrent: false,
    },
    {
      id: '5',
      title: '货物放行',
      status: '待开始',
      statusDetail: '最终环节',
      date: '待开始',
      isCompleted: false,
      isCurrent: false,
    },
  ];

  const getStatusText = (status: string): string => {
    const statusMap = {
      pending: '待处理',
      processing: '审核中',
      completed: '已完成',
      rejected: '已驳回',
    };
    return statusMap[status as keyof typeof statusMap] || '审核中';
  };

  const getStatusStyle = (status: string): any => {
    const styleMap = {
      pending: styles.statusPending,
      processing: styles.statusProcessing,
      completed: styles.statusCompleted,
      rejected: styles.statusRejected,
    };
    return styleMap[status as keyof typeof styleMap] || styles.statusProcessing;
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleUpdateStatusPress = () => {
    setIsStatusModalVisible(true);
  };

  const handleStatusOptionPress = (statusValue: string) => {
    setSelectedStatus(statusValue);
  };

  const handleConfirmStatus = () => {
    if (selectedStatus) {
      setCurrentStatus(selectedStatus);
      setIsStatusModalVisible(false);
      setSelectedStatus(null);
      showToast('状态更新成功');
    }
  };

  const handleCancelStatus = () => {
    setIsStatusModalVisible(false);
    setSelectedStatus(null);
  };

  const handleGenerateDeclarationPress = () => {
    router.push(`/p-doc_generation?orderId=${orderId}&documentType=报关单`);
  };

  const handleUploadDocumentPress = () => {
    router.push(`/p-doc_generation?orderId=${orderId}`);
  };

  const handleDocumentItemPress = (documentId: string) => {
    router.push(`/p-doc_detail?documentId=${documentId}`);
  };

  const handleViewGuidelinesPress = () => {
    showToast('报关指南功能开发中');
  };

  const showToast = (message: string) => {
    Alert.alert('提示', message);
  };

  const renderStatusBadge = (status: string) => {
    return (
      <View style={[styles.statusBadge, getStatusStyle(status)]}>
        <Text style={styles.statusBadgeText}>{getStatusText(status)}</Text>
      </View>
    );
  };

  const renderProcessStep = (step: ProcessStep) => {
    return (
      <View key={step.id} style={styles.processStepContainer}>
        <View style={styles.processStepIconContainer}>
          {step.isCompleted && (
            <View style={styles.processStepCompletedIcon}>
              <FontAwesome6 name="check" size={14} color="#10B981" />
            </View>
          )}
          {step.isCurrent && !step.isCompleted && (
            <View style={styles.processStepCurrentIcon}>
              <FontAwesome6 name="clock" size={14} color="#3B82F6" />
            </View>
          )}
          {!step.isCompleted && !step.isCurrent && (
            <View style={styles.processStepPendingIcon}>
              <Text style={styles.processStepPendingText}>{step.id}</Text>
            </View>
          )}
        </View>
        <View style={styles.processStepContent}>
          <View style={styles.processStepHeader}>
            <Text style={[
              styles.processStepTitle,
              !step.isCompleted && !step.isCurrent && styles.processStepTitleDisabled
            ]}>
              {step.title}
            </Text>
            <Text style={[
              styles.processStepDate,
              !step.isCompleted && !step.isCurrent && styles.processStepDateDisabled
            ]}>
              {step.date}
            </Text>
          </View>
          <Text style={[
            styles.processStepDetail,
            !step.isCompleted && !step.isCurrent && styles.processStepDetailDisabled
          ]}>
            {step.statusDetail}
          </Text>
        </View>
      </View>
    );
  };

  const renderDocumentItem = (item: DocumentItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.documentItem}
        onPress={() => handleDocumentItemPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.documentItemContent}>
          <View style={styles.documentItemLeft}>
            <View style={[styles.documentItemIcon, { backgroundColor: `${item.iconColor}20` }]}>
              <FontAwesome6 name={item.icon as any} size={16} color={item.iconColor} />
            </View>
            <View style={styles.documentItemInfo}>
              <Text style={styles.documentItemTitle}>{item.title}</Text>
              <Text style={styles.documentItemNumber}>{item.documentNumber}</Text>
            </View>
          </View>
          <View style={styles.documentItemRight}>
            <View style={[styles.documentItemStatus, getStatusStyle(item.statusStyle.replace('status-', ''))]}>
              <Text style={styles.documentItemStatusText}>{item.status}</Text>
            </View>
            <Text style={styles.documentItemDate}>{item.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>报关单管理</Text>
                <Text style={styles.headerSubtitle}>订单号: {orderId}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.updateStatusButton}
              onPress={handleUpdateStatusPress}
              activeOpacity={0.7}
            >
              <Text style={styles.updateStatusButtonText}>更新状态</Text>
            </TouchableOpacity>
          </View>

          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusCardHeader}>
              <View style={styles.statusCardHeaderLeft}>
                <View style={styles.statusCardIcon}>
                  <FontAwesome6 name="file-invoice" size={20} color="#3B82F6" />
                </View>
                <View style={styles.statusCardTitleContainer}>
                  <Text style={styles.statusCardTitle}>报关单状态</Text>
                  <Text style={styles.statusCardSubtitle}>当前进度</Text>
                </View>
              </View>
              {renderStatusBadge(currentStatus)}
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>进度</Text>
                <Text style={styles.progressText}>{progressPercentage}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
              </View>
            </View>

            <View style={styles.statusInfoGrid}>
              <View style={styles.statusInfoItem}>
                <Text style={styles.statusInfoValue}>张经理</Text>
                <Text style={styles.statusInfoLabel}>负责人</Text>
              </View>
              <View style={styles.statusInfoItem}>
                <Text style={styles.statusInfoValue}>2024-01-10</Text>
                <Text style={styles.statusInfoLabel}>开始日期</Text>
              </View>
              <View style={styles.statusInfoItem}>
                <Text style={styles.statusInfoValue}>2024-01-20</Text>
                <Text style={styles.statusInfoLabel}>预计完成</Text>
              </View>
            </View>
          </View>

          {/* Declaration Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>报关单信息</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>报关单号</Text>
                  <Text style={styles.infoValue}>CD-2024001</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>申报日期</Text>
                  <Text style={styles.infoValue}>2024-01-12</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>商品编码</Text>
                  <Text style={styles.infoValue}>8517121000</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>贸易方式</Text>
                  <Text style={styles.infoValue}>一般贸易</Text>
                </View>
              </View>

              <View style={styles.infoFullRow}>
                <Text style={styles.infoLabel}>申报价值</Text>
                <Text style={styles.infoValue}>USD 58,500.00</Text>
              </View>

              <View style={styles.infoFullRow}>
                <Text style={styles.infoLabel}>商品名称</Text>
                <Text style={styles.infoValue}>智能手机及配件</Text>
              </View>

              <View style={styles.infoFullRow}>
                <Text style={styles.infoLabel}>数量</Text>
                <Text style={styles.infoValue}>1,000台</Text>
              </View>

              <View style={styles.infoFullRow}>
                <Text style={styles.infoLabel}>备注</Text>
                <Text style={styles.infoValue}>电子产品出口，需提供原产地证明</Text>
              </View>
            </View>
          </View>

          {/* Process Steps */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>报关流程</Text>
            <View style={styles.processCard}>
              {processSteps.map(renderProcessStep)}
            </View>
          </View>

          {/* Related Documents */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>关联单证</Text>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={handleGenerateDeclarationPress}
                activeOpacity={0.7}
              >
                <Text style={styles.generateButtonText}>生成报关单</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.documentsList}>
              {documentItems.map(renderDocumentItem)}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.section}>
            <View style={styles.actionButtonsGrid}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleUploadDocumentPress}
                activeOpacity={0.7}
              >
                <View style={styles.actionButtonIcon}>
                  <FontAwesome6 name="upload" size={20} color="#10B981" />
                </View>
                <Text style={styles.actionButtonTitle}>上传单证</Text>
                <Text style={styles.actionButtonSubtitle}>补充相关文件</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleViewGuidelinesPress}
                activeOpacity={0.7}
              >
                <View style={styles.actionButtonIcon}>
                  <FontAwesome6 name="book" size={20} color="#3B82F6" />
                </View>
                <Text style={styles.actionButtonTitle}>报关指南</Text>
                <Text style={styles.actionButtonSubtitle}>查看操作指南</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Status Modal */}
        <Modal
          visible={isStatusModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelStatus}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>更新报关状态</Text>
              <View style={styles.statusOptionsContainer}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.statusOption,
                      selectedStatus === option.value && styles.statusOptionSelected
                    ]}
                    onPress={() => handleStatusOptionPress(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.statusOptionText}>{option.label}</Text>
                    <FontAwesome6
                      name={selectedStatus === option.value ? "check-circle" : "circle"}
                      size={16}
                      color={selectedStatus === option.value ? "#3B82F6" : "rgba(255, 255, 255, 0.3)"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={handleCancelStatus}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleConfirmStatus}
                  activeOpacity={0.7}
                >
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

export default CustomsDeclarationScreen;

