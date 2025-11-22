

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import OrderInfoCard from './components/OrderInfoCard';
import FollowUpStep from './components/FollowUpStep';
import DocumentItem from './components/DocumentItem';

interface OrderDetails {
  orderNumber: string;
  customerName: string;
  orderAmount: string;
  deliveryDate: string;
  paymentTerms: string;
  productDescription: string;
  status: string;
}

interface FollowUpStepData {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'pending';
  responsiblePerson: string;
  completionTime?: string;
  startTime?: string;
  stepNumber: number;
}

interface DocumentData {
  id: string;
  title: string;
  documentNumber: string;
  uploadTime: string;
  status: string;
  iconName: string;
  iconColor: string;
  statusColor: string;
}

const FollowUpDetailScreen: React.FC = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    orderNumber: 'PO-2024001',
    customerName: 'ABC贸易公司',
    orderAmount: '¥1,250,000',
    deliveryDate: '2024年2月28日',
    paymentTerms: '信用证 (L/C)',
    productDescription: '电子产品出口',
    status: '进行中'
  });

  const [followUpSteps] = useState<FollowUpStepData[]>([
    {
      id: 'step-license',
      title: '进出口许可办理',
      status: 'completed',
      responsiblePerson: '张经理',
      completionTime: '1月10日',
      stepNumber: 1
    },
    {
      id: 'step-logistics',
      title: '海运物流安排',
      status: 'completed',
      responsiblePerson: '李主管',
      completionTime: '1月12日',
      stepNumber: 2
    },
    {
      id: 'step-draft',
      title: '商业汇票管理',
      status: 'completed',
      responsiblePerson: '王会计',
      completionTime: '1月13日',
      stepNumber: 3
    },
    {
      id: 'step-customs',
      title: '报关单管理',
      status: 'current',
      responsiblePerson: '张经理',
      startTime: '1月14日',
      stepNumber: 4
    },
    {
      id: 'step-inspection',
      title: '商检证书管理',
      status: 'pending',
      responsiblePerson: '待分配',
      stepNumber: 5
    },
    {
      id: 'step-insurance',
      title: '货物保险办理',
      status: 'pending',
      responsiblePerson: '待分配',
      stepNumber: 6
    },
    {
      id: 'step-origin',
      title: '产地证管理',
      status: 'pending',
      responsiblePerson: '待分配',
      stepNumber: 7
    },
    {
      id: 'step-advice',
      title: '装运通知管理',
      status: 'pending',
      responsiblePerson: '待分配',
      stepNumber: 8
    }
  ]);

  const [documents] = useState<DocumentData[]>([
    {
      id: 'doc-license',
      title: '进出口许可证',
      documentNumber: 'LIC-2024001',
      uploadTime: '1月10日',
      status: '已生效',
      iconName: 'file-lines',
      iconColor: '#10B981',
      statusColor: '#10B981'
    },
    {
      id: 'doc-bill',
      title: '商业发票',
      documentNumber: 'INV-2024001',
      uploadTime: '1月11日',
      status: '已生效',
      iconName: 'file-invoice',
      iconColor: '#3B82F6',
      statusColor: '#10B981'
    },
    {
      id: 'doc-bill-of-lading',
      title: '提单',
      documentNumber: 'BOL-2024001',
      uploadTime: '1月12日',
      status: '已生效',
      iconName: 'ship',
      iconColor: '#8B5CF6',
      statusColor: '#10B981'
    },
    {
      id: 'doc-draft',
      title: '商业汇票',
      documentNumber: 'DFT-2024001',
      uploadTime: '1月13日',
      status: '已承兑',
      iconName: 'money-check',
      iconColor: '#06B6D4',
      statusColor: '#10B981'
    },
    {
      id: 'doc-customs',
      title: '报关单',
      documentNumber: 'CUS-2024001',
      uploadTime: '1月14日',
      status: '审核中',
      iconName: 'file-contract',
      iconColor: '#F59E0B',
      statusColor: '#F59E0B'
    }
  ]);

  const progressPercentage = 75;

  useEffect(() => {
    if (orderId) {
      loadOrderDetails(orderId);
    }
  }, [orderId]);

  const loadOrderDetails = async (orderId: string) => {
    setIsLoading(true);
    try {
      // 模拟API调用
      const mockOrders: Record<string, OrderDetails> = {
        'PO-2024001': {
          orderNumber: 'PO-2024001',
          customerName: 'ABC贸易公司',
          orderAmount: '¥1,250,000',
          deliveryDate: '2024年2月28日',
          paymentTerms: '信用证 (L/C)',
          productDescription: '电子产品出口',
          status: '进行中'
        },
        'PO-2024002': {
          orderNumber: 'PO-2024002',
          customerName: 'DEF制造有限公司',
          orderAmount: '¥850,000',
          deliveryDate: '2024年3月15日',
          paymentTerms: '电汇 (T/T)',
          productDescription: '机械零件',
          status: '许可证申请'
        }
      };
      
      const order = mockOrders[orderId] || mockOrders['PO-2024001'];
      setOrderDetails(order);
    } catch (error) {
      console.error('加载订单详情失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (orderId) {
        await loadOrderDetails(orderId);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleProcessStep = (stepId: string) => {
    const stepMap: Record<string, string> = {
      'step-customs': '/p-customs_declaration',
      'step-inspection': '/p-commodity_inspection',
      'step-insurance': '/p-goods_insurance',
      'step-origin': '/p-certificate_of_origin',
      'step-advice': '/p-shipping_advice'
    };

    const targetRoute = stepMap[stepId];
    if (targetRoute) {
      router.push(`${targetRoute}?orderId=${orderDetails.orderNumber}&stepId=${stepId}`);
    }
  };

  const handleViewDocuments = (type: string) => {
    router.push(`/p-doc_manage?orderId=${orderDetails.orderNumber}&type=${type}`);
  };

  const handleUploadDocument = () => {
    router.push(`/p-doc_generation?orderId=${orderDetails.orderNumber}`);
  };

  const handleDocumentPress = (documentId: string) => {
    router.push(`/p-doc_detail?documentId=${documentId}`);
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#FFFFFF"
            />
          }
        >
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
                  <Text style={styles.pageTitle}>跟单详情</Text>
                  <Text style={styles.orderNumber}>订单号: {orderDetails.orderNumber}</Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{orderDetails.status}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 订单基本信息 */}
          <OrderInfoCard orderDetails={orderDetails} />

          {/* 跟单流程步骤 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>跟单流程</Text>
              <Text style={styles.progressText}>进度: {progressPercentage}%</Text>
            </View>
            <View style={styles.stepsContainer}>
              {followUpSteps.map((step, index) => (
                <FollowUpStep
                  key={step.id}
                  step={step}
                  isLast={index === followUpSteps.length - 1}
                  onProcessStep={handleProcessStep}
                  onViewDocuments={handleViewDocuments}
                />
              ))}
            </View>
          </View>

          {/* 关联单证 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>关联单证</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUploadDocument}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="plus" size={12} color="#3B82F6" />
                <Text style={styles.uploadButtonText}>上传单证</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.documentsContainer}>
              {documents.map((document) => (
                <DocumentItem
                  key={document.id}
                  document={document}
                  onPress={handleDocumentPress}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FollowUpDetailScreen;

