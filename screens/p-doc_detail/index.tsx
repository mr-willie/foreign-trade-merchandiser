

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface DocumentData {
  title: string;
  type: string;
  docNo: string;
  orderNo: string;
  uploader: string;
  uploadDate: string;
  expiryDate: string;
  status: string;
}

interface VersionItem {
  id: string;
  version: string;
  date: string;
  modifier: string;
  time: string;
  isActive: boolean;
}

interface ShareItem {
  id: string;
  name: string;
  permission: string;
  date: string;
  type: 'user' | 'company';
}

const DocDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [documentData, setDocumentData] = useState<DocumentData>({
    title: '商业发票',
    type: '发票类单证',
    docNo: 'INV-2024001',
    orderNo: 'PO-2024001',
    uploader: '张经理',
    uploadDate: '2024年1月10日 14:30',
    expiryDate: '2024年7月10日',
    status: '已生效'
  });

  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState('version-3');
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('view');

  const versionHistory: VersionItem[] = [
    {
      id: 'version-3',
      version: 'v3.0',
      date: '2024年1月10日',
      modifier: '张经理',
      time: '14:30',
      isActive: true
    },
    {
      id: 'version-2',
      version: 'v2.0',
      date: '2024年1月10日',
      modifier: '李助理',
      time: '11:20',
      isActive: false
    },
    {
      id: 'version-1',
      version: 'v1.0',
      date: '2024年1月9日',
      modifier: '张经理',
      time: '16:45',
      isActive: false
    }
  ];

  const shareList: ShareItem[] = [
    {
      id: 'share-1',
      name: '李助理',
      permission: '查看权限',
      date: '2024年1月10日',
      type: 'user'
    },
    {
      id: 'share-2',
      name: 'ABC贸易公司',
      permission: '查看权限',
      date: '2024年1月9日',
      type: 'company'
    }
  ];

  useEffect(() => {
    // 模拟文档加载
    const loadDocumentTimer = setTimeout(() => {
      setIsDocumentLoaded(true);
    }, 1000);

    return () => clearTimeout(loadDocumentTimer);
  }, []);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleEditPress = () => {
    const documentId = params.documentId || 'doc1';
    router.push(`/p-doc_edit?documentId=${documentId}`);
  };

  const handleDownloadPress = () => {
    Alert.alert('下载', '开始下载...');
  };

  const handleSharePress = () => {
    setIsShareModalVisible(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalVisible(false);
    setShareEmail('');
    setSharePermission('view');
  };

  const handleConfirmShare = () => {
    if (!shareEmail.trim()) {
      Alert.alert('错误', '请输入邮箱或用户名');
      return;
    }
    
    Alert.alert('成功', '分享成功');
    handleCloseShareModal();
  };

  const handleVersionPress = (versionId: string) => {
    setSelectedVersionId(versionId);
  };

  const handleSetReminderPress = () => {
    const documentId = params.documentId || 'doc1';
    router.push(`/p-reminder_setting?documentId=${documentId}`);
  };

  const handleAddSharePress = () => {
    setIsShareModalVisible(true);
  };

  const handleMorePress = () => {
    Alert.alert('更多操作', '功能开发中...');
  };

  const handleZoomIn = () => {
    console.log('放大预览');
  };

  const handleZoomOut = () => {
    console.log('缩小预览');
  };

  const handleFullscreen = () => {
    console.log('全屏预览');
  };

  const renderVersionItem = (item: VersionItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.versionItem,
        selectedVersionId === item.id && styles.versionItemActive
      ]}
      onPress={() => handleVersionPress(item.id)}
    >
      <View style={styles.versionItemHeader}>
        <View style={styles.versionItemLeft}>
          {selectedVersionId === item.id && (
            <View style={styles.currentVersionBadge}>
              <Text style={styles.currentVersionText}>当前版本</Text>
            </View>
          )}
          <Text style={styles.versionNumber}>{item.version}</Text>
        </View>
        <Text style={styles.versionDate}>{item.date}</Text>
      </View>
      <View style={styles.versionItemFooter}>
        <Text style={styles.versionModifier}>修改人: {item.modifier}</Text>
        <Text style={styles.versionTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderShareItem = (item: ShareItem) => (
    <View key={item.id} style={styles.shareItem}>
      <View style={styles.shareItemContent}>
        <View style={[
          styles.shareItemIcon,
          item.type === 'user' ? styles.shareUserIcon : styles.shareCompanyIcon
        ]}>
          <FontAwesome6
            name={item.type === 'user' ? 'user' : 'building'}
            size={16}
            color={item.type === 'user' ? '#3B82F6' : '#8B5CF6'}
          />
        </View>
        <View style={styles.shareItemInfo}>
          <Text style={styles.shareItemName}>{item.name}</Text>
          <Text style={styles.shareItemPermission}>{item.permission}</Text>
        </View>
      </View>
      <Text style={styles.shareItemDate}>{item.date}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部导航 */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>{documentData.title}</Text>
                <Text style={styles.headerSubtitle}>{documentData.type}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerButton} onPress={handleSharePress}>
                <FontAwesome6 name="share-nodes" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleMorePress}>
                <FontAwesome6 name="ellipsis-vertical" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 单证预览区域 */}
          <View style={styles.previewSection}>
            <View style={styles.previewContainer}>
              <View style={styles.previewHeader}>
                <Text style={styles.sectionTitle}>单证预览</Text>
                <View style={styles.previewControls}>
                  <TouchableOpacity style={styles.previewControlButton} onPress={handleZoomOut}>
                    <FontAwesome6 name="magnifying-glass-minus" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.previewControlButton} onPress={handleZoomIn}>
                    <FontAwesome6 name="magnifying-glass-plus" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.previewControlButton} onPress={handleFullscreen}>
                    <FontAwesome6 name="expand" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.previewContent}>
                {!isDocumentLoaded ? (
                  <View style={styles.loadingContainer}>
                    <FontAwesome6 name="file-pdf" size={60} color="#EF4444" />
                    <Text style={styles.loadingText}>正在加载文档...</Text>
                  </View>
                ) : (
                  <View style={styles.documentContent}>
                    <View style={styles.documentHeader}>
                      <FontAwesome6 name="file-pdf" size={40} color="#EF4444" />
                      <Text style={styles.documentHeaderText}>商业发票 - 预览模式</Text>
                    </View>
                    <View style={styles.documentDetails}>
                      <View style={styles.documentDetailRow}>
                        <Text style={styles.documentDetailLabel}>发票号码:</Text>
                        <Text style={styles.documentDetailValue}>INV-2024001</Text>
                      </View>
                      <View style={styles.documentDetailRow}>
                        <Text style={styles.documentDetailLabel}>客户名称:</Text>
                        <Text style={styles.documentDetailValue}>ABC贸易公司</Text>
                      </View>
                      <View style={styles.documentDetailRow}>
                        <Text style={styles.documentDetailLabel}>商品名称:</Text>
                        <Text style={styles.documentDetailValue}>电子产品一批</Text>
                      </View>
                      <View style={styles.documentDetailRow}>
                        <Text style={styles.documentDetailLabel}>数量:</Text>
                        <Text style={styles.documentDetailValue}>1000件</Text>
                      </View>
                      <View style={styles.documentDetailRow}>
                        <Text style={styles.documentDetailLabel}>总金额:</Text>
                        <Text style={styles.documentDetailValue}>USD 50,000.00</Text>
                      </View>
                      <View style={styles.documentDetailRow}>
                        <Text style={styles.documentDetailLabel}>发票日期:</Text>
                        <Text style={styles.documentDetailValue}>2024年1月10日</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* 单证基本信息 */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>基本信息</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>单证编号</Text>
                <Text style={styles.infoValue}>{documentData.docNo}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>关联订单</Text>
                <Text style={styles.infoValue}>{documentData.orderNo}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>上传人</Text>
                <Text style={styles.infoValue}>{documentData.uploader}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>上传时间</Text>
                <Text style={styles.infoValue}>{documentData.uploadDate}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>有效期至</Text>
                <Text style={styles.infoValueExpiry}>{documentData.expiryDate}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>状态</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{documentData.status}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 版本历史 */}
          <View style={styles.versionSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>版本历史</Text>
              <Text style={styles.sectionSubtitle}>共3个版本</Text>
            </View>
            <View style={styles.versionList}>
              {versionHistory.map(renderVersionItem)}
            </View>
          </View>

          {/* 共享协作 */}
          <View style={styles.shareSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>共享协作</Text>
              <TouchableOpacity style={styles.addShareButton} onPress={handleAddSharePress}>
                <FontAwesome6 name="plus" size={12} color="#FFFFFF" />
                <Text style={styles.addShareButtonText}>添加共享</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.shareList}>
              {shareList.map(renderShareItem)}
            </View>
          </View>

          {/* 到期提醒设置 */}
          <View style={styles.reminderSection}>
            <Text style={styles.sectionTitle}>到期提醒</Text>
            <View style={styles.reminderCard}>
              <View style={styles.reminderRow}>
                <Text style={styles.reminderLabel}>当前设置</Text>
                <Text style={styles.reminderValue}>提前7天提醒</Text>
              </View>
              <View style={styles.reminderRow}>
                <Text style={styles.reminderLabel}>下次提醒时间</Text>
                <Text style={styles.reminderValueWarning}>2024年7月3日</Text>
              </View>
              <TouchableOpacity style={styles.setReminderButton} onPress={handleSetReminderPress}>
                <FontAwesome6 name="bell" size={16} color="#FFFFFF" />
                <Text style={styles.setReminderButtonText}>设置提醒</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 操作按钮 */}
          <View style={styles.actionSection}>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionButton} onPress={handleEditPress}>
                <View style={styles.actionButtonIcon}>
                  <FontAwesome6 name="pen-to-square" size={20} color="#3B82F6" />
                </View>
                <Text style={styles.actionButtonTitle}>编辑单证</Text>
                <Text style={styles.actionButtonSubtitle}>修改单证内容</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleDownloadPress}>
                <View style={styles.actionButtonIconSuccess}>
                  <FontAwesome6 name="download" size={20} color="#10B981" />
                </View>
                <Text style={styles.actionButtonTitle}>下载单证</Text>
                <Text style={styles.actionButtonSubtitle}>保存到本地</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* 分享弹窗 */}
        <Modal
          visible={isShareModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCloseShareModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>分享单证</Text>
                <TouchableOpacity onPress={handleCloseShareModal}>
                  <FontAwesome6 name="xmark" size={20} color="rgba(255, 255, 255, 0.7)" />
                </TouchableOpacity>
              </View>
              <View style={styles.modalContent}>
                <View style={styles.shareInputContainer}>
                  <View style={styles.shareInputIcon}>
                    <FontAwesome6 name="user" size={16} color="#3B82F6" />
                  </View>
                  <TextInput
                    style={styles.shareInput}
                    placeholder="输入邮箱或用户名"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={shareEmail}
                    onChangeText={setShareEmail}
                  />
                </View>
                <View style={styles.permissionSection}>
                  <Text style={styles.permissionLabel}>权限设置</Text>
                  <View style={styles.permissionOptions}>
                    <TouchableOpacity
                      style={styles.permissionOption}
                      onPress={() => setSharePermission('view')}
                    >
                      <View style={[
                        styles.radioButton,
                        sharePermission === 'view' && styles.radioButtonSelected
                      ]}>
                        {sharePermission === 'view' && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <Text style={styles.permissionOptionText}>查看权限</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.permissionOption}
                      onPress={() => setSharePermission('edit')}
                    >
                      <View style={[
                        styles.radioButton,
                        sharePermission === 'edit' && styles.radioButtonSelected
                      ]}>
                        {sharePermission === 'edit' && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <Text style={styles.permissionOptionText}>编辑权限</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={styles.confirmShareButton} onPress={handleConfirmShare}>
                  <Text style={styles.confirmShareButtonText}>确认分享</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default DocDetailScreen;

