

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface InsuranceData {
  policyNumber: string;
  insuranceCompany: string;
  insuranceAmount: string;
  insuranceType: string;
  insuredGoods: string;
  departurePort: string;
  destinationPort: string;
}

interface DocumentItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'pdf' | 'doc';
  status: string;
  date: string;
}

type InsuranceStatus = 'pending' | 'processing' | 'insured' | 'expired';

const GoodsInsuranceScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [insuranceData, setInsuranceData] = useState<InsuranceData>({
    policyNumber: 'INS-2024001',
    insuranceCompany: '中国平安保险',
    insuranceAmount: 'USD 50,000',
    insuranceType: '一切险',
    insuredGoods: '电子产品一批',
    departurePort: '上海港',
    destinationPort: '洛杉矶港',
  });

  const [currentStatus, setCurrentStatus] = useState<InsuranceStatus>('insured');
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<InsuranceStatus | null>(null);
  const [reminderDays, setReminderDays] = useState('7');
  const [isAppNotificationEnabled, setIsAppNotificationEnabled] = useState(true);
  const [isPushNotificationEnabled, setIsPushNotificationEnabled] = useState(true);
  const [isSmsNotificationEnabled, setIsSmsNotificationEnabled] = useState(false);

  const documentList: DocumentItem[] = [
    {
      id: 'INS-2024001',
      title: '货物运输保险单',
      subtitle: '保单号: INS-2024001',
      type: 'pdf',
      status: '已生效',
      date: '2024-01-10',
    },
    {
      id: 'APP-2024001',
      title: '投保申请书',
      subtitle: '申请号: APP-2024001',
      type: 'doc',
      status: '已审核',
      date: '2024-01-09',
    },
  ];

  const statusOptions = [
    { key: 'pending' as InsuranceStatus, label: '待投保', color: '#F59E0B' },
    { key: 'processing' as InsuranceStatus, label: '投保中', color: '#3B82F6' },
    { key: 'insured' as InsuranceStatus, label: '已投保', color: '#10B981' },
    { key: 'expired' as InsuranceStatus, label: '已过期', color: '#EF4444' },
  ];

  const getStatusText = (status: InsuranceStatus): string => {
    const option = statusOptions.find(opt => opt.key === status);
    return option?.label || '未知';
  };

  const getStatusColor = (status: InsuranceStatus): string => {
    const option = statusOptions.find(opt => opt.key === status);
    return option?.color || '#10B981';
  };

  const getProgressPercentage = (status: InsuranceStatus): number => {
    switch (status) {
      case 'insured':
        return 100;
      case 'processing':
        return 50;
      case 'pending':
        return 20;
      case 'expired':
        return 100;
      default:
        return 0;
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleGeneratePolicyPress = () => {
    const orderId = params.orderId || 'PO-2024001';
    router.push(`/p-doc_generation?orderId=${orderId}&documentType=保单`);
  };

  const handleAddDocumentPress = () => {
    const orderId = params.orderId || 'PO-2024001';
    router.push(`/p-doc_generation?orderId=${orderId}&documentType=保险相关`);
  };

  const handleDocumentPress = (documentId: string) => {
    router.push(`/p-doc_detail?documentId=${documentId}`);
  };

  const handleUpdateStatusPress = () => {
    setIsStatusModalVisible(true);
  };

  const handleSetReminderPress = () => {
    setIsReminderModalVisible(true);
  };

  const handleStatusOptionPress = (status: InsuranceStatus) => {
    setSelectedStatus(status);
  };

  const handleConfirmStatusPress = () => {
    if (selectedStatus) {
      setCurrentStatus(selectedStatus);
      setIsStatusModalVisible(false);
      setSelectedStatus(null);
      Alert.alert('成功', '状态更新成功');
    }
  };

  const handleCancelStatusPress = () => {
    setIsStatusModalVisible(false);
    setSelectedStatus(null);
  };

  const handleConfirmReminderPress = () => {
    setIsReminderModalVisible(false);
    Alert.alert('成功', '提醒设置成功');
  };

  const handleCancelReminderPress = () => {
    setIsReminderModalVisible(false);
  };

  const renderDocumentItem = (item: DocumentItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.documentItem}
      onPress={() => handleDocumentPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.documentItemContent}>
        <View style={styles.documentItemLeft}>
          <View style={[styles.documentIcon, item.type === 'pdf' ? styles.pdfIcon : styles.docIcon]}>
            <FontAwesome6
              name={item.type === 'pdf' ? 'file-pdf' : 'file-alt'}
              size={16}
              color={item.type === 'pdf' ? '#3B82F6' : '#8B5CF6'}
            />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentTitle}>{item.title}</Text>
            <Text style={styles.documentSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        <View style={styles.documentItemRight}>
          <View style={styles.documentStatusBadge}>
            <Text style={styles.documentStatusText}>{item.status}</Text>
          </View>
          <Text style={styles.documentDate}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStatusOption = (option: typeof statusOptions[0]) => (
    <TouchableOpacity
      key={option.key}
      style={[
        styles.statusOption,
        selectedStatus === option.key && styles.statusOptionSelected,
      ]}
      onPress={() => handleStatusOptionPress(option.key)}
      activeOpacity={0.7}
    >
      <View style={styles.statusOptionContent}>
        <Text style={styles.statusOptionText}>{option.label}</Text>
        <FontAwesome6
          name="circle"
          size={12}
          color={option.color}
          solid={false}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.pageTitle}>货物保险办理</Text>
              <Text style={styles.orderInfo}>
                订单号: {params.orderId || 'PO-2024001'}
              </Text>
            </View>
          </View>

          {/* Insurance Status Card */}
          <View style={styles.section}>
            <View style={styles.statusCard}>
              <View style={styles.statusCardHeader}>
                <View style={styles.statusCardLeft}>
                  <View style={styles.statusIconContainer}>
                    <FontAwesome5 name="shield-alt" size={20} color="#10B981" />
                  </View>
                  <View style={styles.statusCardInfo}>
                    <Text style={styles.statusCardTitle}>保险状态</Text>
                    <Text style={styles.statusCardSubtitle}>当前进度</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { borderColor: getStatusColor(currentStatus) }]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(currentStatus) }]}>
                    {getStatusText(currentStatus)}
                  </Text>
                </View>
              </View>

              <View style={styles.statusDetails}>
                <View style={styles.statusDetailRow}>
                  <Text style={styles.statusDetailLabel}>负责人</Text>
                  <Text style={styles.statusDetailValue}>张经理</Text>
                </View>
                <View style={styles.statusDetailRow}>
                  <Text style={styles.statusDetailLabel}>投保日期</Text>
                  <Text style={styles.statusDetailValue}>2024-01-10</Text>
                </View>
                <View style={styles.statusDetailRow}>
                  <Text style={styles.statusDetailLabel}>保险有效期</Text>
                  <Text style={styles.statusDetailValue}>2024-01-10 至 2024-02-10</Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>进度</Text>
                  <Text style={styles.progressValue}>{getProgressPercentage(currentStatus)}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${getProgressPercentage(currentStatus)}%`,
                        backgroundColor: getStatusColor(currentStatus),
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Insurance Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>保险信息</Text>
            <View style={styles.infoCard}>
              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>保单号</Text>
                  <TextInput
                    style={styles.formInput}
                    value={insuranceData.policyNumber}
                    onChangeText={(text) =>
                      setInsuranceData({ ...insuranceData, policyNumber: text })
                    }
                    placeholder="请输入保单号"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>保险公司</Text>
                  <TextInput
                    style={styles.formInput}
                    value={insuranceData.insuranceCompany}
                    onChangeText={(text) =>
                      setInsuranceData({ ...insuranceData, insuranceCompany: text })
                    }
                    placeholder="请输入保险公司"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>保险金额</Text>
                  <TextInput
                    style={styles.formInput}
                    value={insuranceData.insuranceAmount}
                    onChangeText={(text) =>
                      setInsuranceData({ ...insuranceData, insuranceAmount: text })
                    }
                    placeholder="请输入保险金额"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>险别</Text>
                  <TextInput
                    style={styles.formInput}
                    value={insuranceData.insuranceType}
                    onChangeText={(text) =>
                      setInsuranceData({ ...insuranceData, insuranceType: text })
                    }
                    placeholder="请输入险别"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  />
                </View>
              </View>

              <View style={styles.formFieldFull}>
                <Text style={styles.formLabel}>保险货物</Text>
                <TextInput
                  style={styles.formInput}
                  value={insuranceData.insuredGoods}
                  onChangeText={(text) =>
                    setInsuranceData({ ...insuranceData, insuredGoods: text })
                  }
                  placeholder="请输入保险货物"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
              </View>

              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>启运港</Text>
                  <TextInput
                    style={styles.formInput}
                    value={insuranceData.departurePort}
                    onChangeText={(text) =>
                      setInsuranceData({ ...insuranceData, departurePort: text })
                    }
                    placeholder="请输入启运港"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>目的港</Text>
                  <TextInput
                    style={styles.formInput}
                    value={insuranceData.destinationPort}
                    onChangeText={(text) =>
                      setInsuranceData({ ...insuranceData, destinationPort: text })
                    }
                    placeholder="请输入目的港"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Related Documents */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>关联单证</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddDocumentPress}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="plus" size={12} color="rgba(255, 255, 255, 0.7)" />
                <Text style={styles.addButtonText}>添加</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.documentsList}>
              {documentList.map(renderDocumentItem)}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGeneratePolicyPress}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="file-alt" size={16} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>生成保单</Text>
            </TouchableOpacity>

            <View style={styles.secondaryButtonsRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleUpdateStatusPress}
                activeOpacity={0.8}
              >
                <FontAwesome5 name="sync-alt" size={14} color="#FFFFFF" />
                <Text style={styles.secondaryButtonText}>更新状态</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleSetReminderPress}
                activeOpacity={0.8}
              >
                <FontAwesome6 name="bell" size={14} color="#FFFFFF" />
                <Text style={styles.secondaryButtonText}>设置提醒</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Status Modal */}
        <Modal
          visible={isStatusModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelStatusPress}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>更新保险状态</Text>
              <View style={styles.statusOptionsContainer}>
                {statusOptions.map(renderStatusOption)}
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={handleCancelStatusPress}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleConfirmStatusPress}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalConfirmButtonText}>确认</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Reminder Modal */}
        <Modal
          visible={isReminderModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelReminderPress}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>设置到期提醒</Text>
              <View style={styles.reminderContent}>
                <View style={styles.reminderField}>
                  <Text style={styles.reminderLabel}>提醒时间</Text>
                  <View style={styles.reminderSelect}>
                    <Text style={styles.reminderSelectText}>
                      到期前{reminderDays}天
                    </Text>
                    <FontAwesome6 name="chevron-down" size={12} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.reminderField}>
                  <Text style={styles.reminderLabel}>提醒方式</Text>
                  <View style={styles.reminderOptions}>
                    <TouchableOpacity
                      style={styles.reminderOption}
                      onPress={() => setIsAppNotificationEnabled(!isAppNotificationEnabled)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.checkboxContainer}>
                        <View style={[styles.checkbox, isAppNotificationEnabled && styles.checkboxChecked]}>
                          {isAppNotificationEnabled && (
                            <FontAwesome6 name="check" size={10} color="#FFFFFF" />
                          )}
                        </View>
                        <Text style={styles.reminderOptionText}>应用内通知</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.reminderOption}
                      onPress={() => setIsPushNotificationEnabled(!isPushNotificationEnabled)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.checkboxContainer}>
                        <View style={[styles.checkbox, isPushNotificationEnabled && styles.checkboxChecked]}>
                          {isPushNotificationEnabled && (
                            <FontAwesome6 name="check" size={10} color="#FFFFFF" />
                          )}
                        </View>
                        <Text style={styles.reminderOptionText}>推送通知</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.reminderOption}
                      onPress={() => setIsSmsNotificationEnabled(!isSmsNotificationEnabled)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.checkboxContainer}>
                        <View style={[styles.checkbox, isSmsNotificationEnabled && styles.checkboxChecked]}>
                          {isSmsNotificationEnabled && (
                            <FontAwesome6 name="check" size={10} color="#FFFFFF" />
                          )}
                        </View>
                        <Text style={styles.reminderOptionText}>短信通知</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={handleCancelReminderPress}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleConfirmReminderPress}
                  activeOpacity={0.8}
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

export default GoodsInsuranceScreen;

