

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface ShippingAdviceForm {
  notificationObject: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  departureDate: string;
  vesselName: string;
  billOfLading: string;
  contentSummary: string;
}

interface DocumentItem {
  id: string;
  name: string;
  fileName: string;
  type: 'pdf' | 'word';
  uploadDate: string;
  status: 'uploaded' | 'pending';
}

type NotificationStatus = 'pending' | 'sending' | 'sent' | 'error';

const ShippingAdviceScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = (params.orderId as string) || 'PO-2024001';

  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatus>('pending');
  const [sendTime, setSendTime] = useState<string>('-');
  const [isLoading, setIsLoading] = useState(false);

  const [shippingAdviceForm, setShippingAdviceForm] = useState<ShippingAdviceForm>({
    notificationObject: 'ABC贸易公司',
    contactPerson: '李先生',
    contactEmail: 'li@abc-trade.com',
    contactPhone: '+86 138 0013 8000',
    departureDate: '2024-01-20',
    vesselName: '中远海运 001',
    billOfLading: 'BL-2024001',
    contentSummary: '货物已按合同约定完成装船，预计于2024年1月20日启航，提单号BL-2024001。请贵公司做好接货准备。',
  });

  const [documentsList, setDocumentsList] = useState<DocumentItem[]>([
    {
      id: 'doc1',
      name: '提单副本',
      fileName: 'BL-2024001.pdf',
      type: 'pdf',
      uploadDate: '2024-01-15',
      status: 'uploaded',
    },
    {
      id: 'doc2',
      name: '商业发票',
      fileName: 'INV-2024001.docx',
      type: 'word',
      uploadDate: '2024-01-14',
      status: 'uploaded',
    },
  ]);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleMoreOptionsPress = () => {
    Alert.alert('更多选项', '功能开发中...');
  };

  const handleGenerateAdvicePress = () => {
    router.push(`/p-doc_generation?orderId=${orderId}&documentType=装运通知`);
  };

  const handleUploadDocumentPress = () => {
    router.push(`/p-doc_generation?orderId=${orderId}&documentType=其他单证`);
  };

  const handleDocumentItemPress = (documentId: string) => {
    router.push(`/p-doc_detail?documentId=${documentId}`);
  };

  const handleUpdateStatusPress = () => {
    setIsStatusModalVisible(true);
  };

  const handleStatusSelect = (status: NotificationStatus) => {
    setNotificationStatus(status);
    setIsStatusModalVisible(false);
  };

  const handleSendNotificationPress = async () => {
    if (notificationStatus === 'pending') {
      setNotificationStatus('sending');
      setIsLoading(true);
      
      try {
        // 模拟发送过程
        await new Promise(resolve => setTimeout(resolve, 2000));
        setNotificationStatus('sent');
        setSendTime(new Date().toLocaleString());
        showToast('通知发送成功');
      } catch (error) {
        setNotificationStatus('error');
        showToast('发送失败，请重试');
      } finally {
        setIsLoading(false);
      }
    } else {
      showToast('通知已发送或正在发送中');
    }
  };

  const showToast = (message: string) => {
    Alert.alert('提示', message);
  };

  const getStatusBadgeStyle = () => {
    switch (notificationStatus) {
      case 'pending':
      case 'sending':
        return styles.statusPending;
      case 'sent':
        return styles.statusSent;
      case 'error':
        return styles.statusError;
      default:
        return styles.statusPending;
    }
  };

  const getStatusText = () => {
    switch (notificationStatus) {
      case 'pending':
        return '待发送';
      case 'sending':
        return '发送中';
      case 'sent':
        return '已发送';
      case 'error':
        return '发送失败';
      default:
        return '待发送';
    }
  };

  const getProgressText = () => {
    switch (notificationStatus) {
      case 'pending':
        return '请先填写装运通知信息，然后生成并发送通知';
      case 'sending':
        return '正在发送装运通知，请稍候...';
      case 'sent':
        return '装运通知已成功发送，通知对象已收到';
      case 'error':
        return '发送失败，请检查通知信息并重新发送';
      default:
        return '请先填写装运通知信息，然后生成并发送通知';
    }
  };

  const renderDocumentItem = (item: DocumentItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.documentItem}
      onPress={() => handleDocumentItemPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.documentItemContent}>
        <View style={styles.documentItemLeft}>
          <View style={[styles.documentIcon, item.type === 'pdf' ? styles.pdfIcon : styles.wordIcon]}>
            <FontAwesome6
              name={item.type === 'pdf' ? 'file-pdf' : 'file-word'}
              size={16}
              color={item.type === 'pdf' ? '#3B82F6' : '#8B5CF6'}
            />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentName}>{item.name}</Text>
            <Text style={styles.documentFileName}>{item.fileName}</Text>
          </View>
        </View>
        <View style={styles.documentItemRight}>
          <Text style={styles.documentUploadDate}>{item.uploadDate}</Text>
          <Text style={styles.documentStatus}>已上传</Text>
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
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackPress}
                  activeOpacity={0.7}
                >
                  <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                  <Text style={styles.pageTitle}>装运通知管理</Text>
                  <Text style={styles.orderInfo}>订单号: {orderId}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.moreOptionsButton}
                onPress={handleMoreOptionsPress}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="ellipsis-vertical" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 装运通知状态卡片 */}
          <View style={styles.statusSection}>
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Text style={styles.statusTitle}>通知状态</Text>
                <View style={[styles.statusBadge, getStatusBadgeStyle()]}>
                  <Text style={styles.statusBadgeText}>{getStatusText()}</Text>
                </View>
              </View>

              <View style={styles.statusInfo}>
                <View style={styles.statusInfoItem}>
                  <Text style={styles.statusInfoValue}>张经理</Text>
                  <Text style={styles.statusInfoLabel}>负责人</Text>
                </View>
                <View style={styles.statusInfoItem}>
                  <Text style={styles.statusInfoValue}>{sendTime}</Text>
                  <Text style={styles.statusInfoLabel}>发送时间</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <FontAwesome6 name="circle-info" size={16} color="#3B82F6" />
                  <Text style={styles.progressHeaderText}>当前进度</Text>
                </View>
                <Text style={styles.progressText}>{getProgressText()}</Text>
              </View>
            </View>
          </View>

          {/* 装运通知信息 */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>装运通知信息</Text>
            <View style={styles.infoCard}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>通知对象</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="请输入通知对象"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={shippingAdviceForm.notificationObject}
                  onChangeText={(text) =>
                    setShippingAdviceForm(prev => ({ ...prev, notificationObject: text }))
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>联系人</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="请输入联系人"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={shippingAdviceForm.contactPerson}
                  onChangeText={(text) =>
                    setShippingAdviceForm(prev => ({ ...prev, contactPerson: text }))
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>联系邮箱</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="请输入联系邮箱"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={shippingAdviceForm.contactEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(text) =>
                    setShippingAdviceForm(prev => ({ ...prev, contactEmail: text }))
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>联系电话</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="请输入联系电话"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={shippingAdviceForm.contactPhone}
                  keyboardType="phone-pad"
                  onChangeText={(text) =>
                    setShippingAdviceForm(prev => ({ ...prev, contactPhone: text }))
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>预计开船日期</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={shippingAdviceForm.departureDate}
                  onChangeText={(text) =>
                    setShippingAdviceForm(prev => ({ ...prev, departureDate: text }))
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>船名航次</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="请输入船名航次"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={shippingAdviceForm.vesselName}
                  onChangeText={(text) =>
                    setShippingAdviceForm(prev => ({ ...prev, vesselName: text }))
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>提单号</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="请输入提单号"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={shippingAdviceForm.billOfLading}
                  onChangeText={(text) =>
                    setShippingAdviceForm(prev => ({ ...prev, billOfLading: text }))
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>内容摘要</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  placeholder="请输入装运通知内容摘要"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={shippingAdviceForm.contentSummary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  onChangeText={(text) =>
                    setShippingAdviceForm(prev => ({ ...prev, contentSummary: text }))
                  }
                />
              </View>
            </View>
          </View>

          {/* 关联单证 */}
          <View style={styles.documentsSection}>
            <View style={styles.documentsHeader}>
              <Text style={styles.sectionTitle}>关联单证</Text>
              <TouchableOpacity
                style={styles.uploadDocumentButton}
                onPress={handleUploadDocumentPress}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="plus" size={14} color="#FFFFFF" />
                <Text style={styles.uploadDocumentButtonText}>上传单证</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.documentsCard}>
              {documentsList.length > 0 ? (
                <View style={styles.documentsList}>
                  {documentsList.map(renderDocumentItem)}
                </View>
              ) : (
                <View style={styles.noDocumentsContainer}>
                  <FontAwesome6 name="folder-open" size={48} color="rgba(255, 255, 255, 0.4)" />
                  <Text style={styles.noDocumentsText}>暂无关联单证</Text>
                </View>
              )}
            </View>
          </View>

          {/* 操作按钮 */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.generateAdviceButton}
              onPress={handleGenerateAdvicePress}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="file-lines" size={16} color="#FFFFFF" />
              <Text style={styles.generateAdviceButtonText}>生成装运通知</Text>
            </TouchableOpacity>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleUpdateStatusPress}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="arrows-rotate" size={14} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>更新状态</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
                onPress={handleSendNotificationPress}
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <FontAwesome6 name="paper-plane" size={14} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>发送通知</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* 状态选择器模态框 */}
        <Modal
          visible={isStatusModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsStatusModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>更新状态</Text>
              <View style={styles.statusOptionsContainer}>
                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusSelect('pending')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statusOptionText}>待发送</Text>
                  <FontAwesome6 name="circle" size={12} color="#F59E0B" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusSelect('sending')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statusOptionText}>发送中</Text>
                  <FontAwesome6 name="circle" size={12} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusSelect('sent')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statusOptionText}>已发送</Text>
                  <FontAwesome6 name="circle" size={12} color="#10B981" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusSelect('error')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statusOptionText}>发送失败</Text>
                  <FontAwesome6 name="circle" size={12} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsStatusModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ShippingAdviceScreen;

