

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface DocumentItem {
  id: string;
  name: string;
  fileName: string;
  status: 'uploaded' | 'pending';
  date: string;
}

interface OperationHistory {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'create' | 'upload' | 'update';
}

interface CommercialDraftData {
  orderId: string;
  draftNumber: string;
  amount: string;
  drawee: string;
  payee: string;
  issueDate: string;
  maturityDate: string;
  status: 'issued' | 'accepted' | 'discounted' | 'matured' | 'overdue';
  statusText: string;
  remarks: string;
  documents: DocumentItem[];
  operationHistory: OperationHistory[];
}

const CommercialDraftScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [draftData, setDraftData] = useState<CommercialDraftData>({
    orderId: 'PO-2024001',
    draftNumber: 'BD-2024001',
    amount: 'USD 50,000.00',
    drawee: 'ABC贸易公司',
    payee: 'DEF制造有限公司',
    issueDate: '2024-01-10',
    maturityDate: '2024-04-10',
    status: 'issued',
    statusText: '已开具',
    remarks: '即期汇票，通过中国银行结算',
    documents: [
      { id: 'doc1', name: '商业汇票正本', fileName: 'BD-2024001.pdf', status: 'uploaded', date: '2024-01-10' },
      { id: 'doc2', name: '汇票申请书', fileName: 'BD-2024001-application.pdf', status: 'uploaded', date: '2024-01-10' },
      { id: 'doc3', name: '银行承兑通知', fileName: 'BD-2024001-acceptance.pdf', status: 'pending', date: '待处理' }
    ],
    operationHistory: [
      {
        id: '1',
        user: '张经理',
        action: '创建了汇票',
        details: '汇票号码: BD-2024001，金额: USD 50,000.00',
        timestamp: '2024-01-10 14:30',
        type: 'create'
      },
      {
        id: '2',
        user: '张经理',
        action: '上传了商业汇票正本',
        details: '文件: BD-2024001.pdf',
        timestamp: '2024-01-10 15:45',
        type: 'upload'
      },
      {
        id: '3',
        user: '张经理',
        action: '更新了汇票状态为"已开具"',
        details: '从"草稿"状态变更',
        timestamp: '2024-01-10 16:20',
        type: 'update'
      }
    ]
  });

  const statusOptions = [
    { value: 'issued', label: '已开具', description: '汇票已开具完成' },
    { value: 'accepted', label: '已承兑', description: '银行已承兑汇票' },
    { value: 'discounted', label: '已贴现', description: '汇票已办理贴现' },
    { value: 'matured', label: '已到期', description: '汇票已到期兑付' }
  ];

  useEffect(() => {
    loadDraftData();
  }, [params.orderId]);

  const loadDraftData = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      // 这里可以根据params.orderId加载不同的数据
    } catch (error) {
      Alert.alert('错误', '加载数据失败，请重试');
    } finally {
      setIsLoading(false);
    }
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
      const selectedOption = statusOptions.find(option => option.value === selectedStatus);
      if (selectedOption) {
        setDraftData(prevData => ({
          ...prevData,
          status: selectedStatus as any,
          statusText: selectedOption.label
        }));
        
        // 添加操作历史
        const newHistory: OperationHistory = {
          id: Date.now().toString(),
          user: '当前用户',
          action: `更新了汇票状态为"${selectedOption.label}"`,
          details: `从"${draftData.statusText}"状态变更`,
          timestamp: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          type: 'update'
        };
        
        setDraftData(prevData => ({
          ...prevData,
          operationHistory: [...prevData.operationHistory, newHistory]
        }));
        
        Alert.alert('成功', '状态更新成功');
      }
    }
    setIsStatusModalVisible(false);
    setSelectedStatus('');
  };

  const handleCancelStatus = () => {
    setIsStatusModalVisible(false);
    setSelectedStatus('');
  };

  const handleGenerateDraftPress = () => {
    router.push(`/p-doc_generation?orderId=${draftData.orderId}&documentType=商业汇票`);
  };

  const handleDocumentPress = (documentId: string) => {
    router.push(`/p-doc_detail?documentId=${documentId}`);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'issued':
        return styles.statusIssued;
      case 'accepted':
        return styles.statusAccepted;
      case 'discounted':
        return styles.statusDiscounted;
      case 'matured':
        return styles.statusMatured;
      case 'overdue':
        return styles.statusOverdue;
      default:
        return styles.statusIssued;
    }
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'create':
        return 'plus';
      case 'upload':
        return 'upload';
      case 'update':
        return 'edit';
      default:
        return 'info';
    }
  };

  const getOperationIconColor = (type: string) => {
    switch (type) {
      case 'create':
        return '#10B981';
      case 'upload':
        return '#3B82F6';
      case 'update':
        return '#F59E0B';
      default:
        return '#6B7280';
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
                <View style={styles.titleContainer}>
                  <Text style={styles.pageTitle}>商业汇票管理</Text>
                  <Text style={styles.orderInfo}>订单号: {draftData.orderId}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.updateStatusButton} onPress={handleUpdateStatusPress}>
                <Text style={styles.updateStatusButtonText}>更新状态</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 汇票状态卡片 */}
          <View style={styles.statusCard}>
            <View style={styles.statusCardHeader}>
              <View style={styles.statusCardLeft}>
                <View style={styles.statusIconContainer}>
                  <FontAwesome6 name="file-invoice-dollar" size={20} color="#F59E0B" />
                </View>
                <View style={styles.statusCardTitleContainer}>
                  <Text style={styles.statusCardTitle}>汇票状态</Text>
                  <Text style={styles.statusCardSubtitle}>当前进度</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, getStatusBadgeStyle(draftData.status)]}>
                <Text style={styles.statusBadgeText}>{draftData.statusText}</Text>
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
                <Text style={styles.statusDetailValue}>2024-02-10</Text>
              </View>
            </View>
          </View>

          {/* 汇票信息填写区域 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>汇票信息</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>汇票号码</Text>
                  <TextInput style={styles.infoInput} value={draftData.draftNumber} editable={false} />
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>汇票金额</Text>
                  <TextInput style={styles.infoInput} value={draftData.amount} editable={false} />
                </View>
              </View>
              
              <View style={styles.infoFullItem}>
                <Text style={styles.infoLabel}>付款人</Text>
                <TextInput style={styles.infoInput} value={draftData.drawee} editable={false} />
              </View>
              
              <View style={styles.infoFullItem}>
                <Text style={styles.infoLabel}>收款人</Text>
                <TextInput style={styles.infoInput} value={draftData.payee} editable={false} />
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>出票日期</Text>
                  <TextInput style={styles.infoInput} value={draftData.issueDate} editable={false} />
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>到期日</Text>
                  <TextInput style={styles.infoInput} value={draftData.maturityDate} editable={false} />
                </View>
              </View>
              
              <View style={styles.infoFullItem}>
                <Text style={styles.infoLabel}>备注</Text>
                <TextInput 
                  style={[styles.infoInput, styles.remarksInput]} 
                  value={draftData.remarks} 
                  editable={false}
                  multiline
                />
              </View>
            </View>
          </View>

          {/* 关联单证列表 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>关联单证</Text>
              <TouchableOpacity style={styles.generateButton} onPress={handleGenerateDraftPress}>
                <FontAwesome6 name="plus" size={14} color="#FFFFFF" style={styles.generateButtonIcon} />
                <Text style={styles.generateButtonText}>生成汇票</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.documentsList}>
              {draftData.documents.map((doc) => (
                <TouchableOpacity 
                  key={doc.id} 
                  style={styles.documentItem} 
                  onPress={() => handleDocumentPress(doc.id)}
                >
                  <View style={styles.documentItemLeft}>
                    <View style={styles.documentIconContainer}>
                      <FontAwesome6 name="file-pdf" size={16} color="#3B82F6" />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName}>{doc.name}</Text>
                      <Text style={styles.documentFileName}>{doc.fileName}</Text>
                    </View>
                  </View>
                  <View style={styles.documentItemRight}>
                    <View style={[
                      styles.documentStatusBadge, 
                      doc.status === 'uploaded' ? styles.documentStatusUploaded : styles.documentStatusPending
                    ]}>
                      <Text style={[
                        styles.documentStatusText,
                        doc.status === 'uploaded' ? styles.documentStatusUploadedText : styles.documentStatusPendingText
                      ]}>
                        {doc.status === 'uploaded' ? '已上传' : '待上传'}
                      </Text>
                    </View>
                    <Text style={styles.documentDate}>{doc.date}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 操作历史 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>操作历史</Text>
            <View style={styles.historyCard}>
              {draftData.operationHistory.map((history) => (
                <View key={history.id} style={styles.historyItem}>
                  <View style={[styles.historyIconContainer, { backgroundColor: `${getOperationIconColor(history.type)}20` }]}>
                    <FontAwesome6 
                      name={getOperationIcon(history.type)} 
                      size={14} 
                      color={getOperationIconColor(history.type)} 
                    />
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyAction}>{history.user} {history.action}</Text>
                    <Text style={styles.historyDetails}>{history.details}</Text>
                    <Text style={styles.historyTimestamp}>{history.timestamp}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* 状态选择弹窗 */}
        <Modal
          visible={isStatusModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancelStatus}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>更新汇票状态</Text>
              <View style={styles.statusOptions}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.statusOption}
                    onPress={() => handleStatusOptionPress(option.value)}
                  >
                    <View style={styles.statusOptionHeader}>
                      <Text style={styles.statusOptionLabel}>{option.label}</Text>
                      {selectedStatus === option.value && (
                        <FontAwesome6 name="check" size={16} color="#10B981" />
                      )}
                    </View>
                    <Text style={styles.statusOptionDescription}>{option.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelStatus}>
                  <Text style={styles.modalCancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirmButton} onPress={handleConfirmStatus}>
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

export default CommercialDraftScreen;

