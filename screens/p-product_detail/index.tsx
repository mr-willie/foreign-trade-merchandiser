

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface ProductData {
  name: string;
  hsCode: string;
  specification: string;
  unitPrice: string;
  stockQuantity: string;
  status: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  customer: string;
  status: string;
  statusColor: string;
  quantity: string;
  amount: string;
  date: string;
  icon: string;
}

const ProductDetailScreen: React.FC = () => {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [productData, setProductData] = useState<ProductData>({
    name: '智能手机 X1 Pro',
    hsCode: '8517121000',
    specification: 'X1 Pro 128GB',
    unitPrice: '¥2,999',
    stockQuantity: '1,250 台',
    status: '在售',
    description: '智能手机 X1 Pro 是一款高端旗舰机型，配备6.7英寸AMOLED显示屏，搭载最新处理器，支持5G网络。拥有128GB存储空间，4800万像素主摄像头，支持快充技术。产品符合国际质量标准，通过CE、FCC等认证，适用于全球市场销售。',
    image: 'https://s.coze.cn/image/bZQJ0VSXWhs/',
    imageAlt: '智能手机 X1 Pro 图片'
  });

  const [relatedOrders] = useState<OrderData[]>([
    {
      id: 'PO-2024001',
      orderNumber: 'PO-2024001',
      customer: 'ABC贸易公司',
      status: '进行中',
      statusColor: '#3B82F6',
      quantity: '50 台',
      amount: '¥149,950',
      date: '1月15日',
      icon: 'shopping-cart'
    },
    {
      id: 'PO-2024003',
      orderNumber: 'PO-2024003',
      customer: 'DEF制造有限公司',
      status: '已完成',
      statusColor: '#10B981',
      quantity: '25 台',
      amount: '¥74,975',
      date: '1月10日',
      icon: 'check-circle'
    },
    {
      id: 'PO-2024005',
      orderNumber: 'PO-2024005',
      customer: 'GHI进出口公司',
      status: '待处理',
      statusColor: '#F59E0B',
      quantity: '100 台',
      amount: '¥299,900',
      date: '1月18日',
      icon: 'clock'
    }
  ]);

  useEffect(() => {
    loadProductDetails();
  }, [productId]);

  const loadProductDetails = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 根据productId加载不同数据
      const mockProducts: Record<string, ProductData> = {
        'prod1': {
          name: '智能手机 X1 Pro',
          hsCode: '8517121000',
          specification: 'X1 Pro 128GB',
          unitPrice: '¥2,999',
          stockQuantity: '1,250 台',
          status: '在售',
          description: '智能手机 X1 Pro 是一款高端旗舰机型，配备6.7英寸AMOLED显示屏，搭载最新处理器，支持5G网络。拥有128GB存储空间，4800万像素主摄像头，支持快充技术。产品符合国际质量标准，通过CE、FCC等认证，适用于全球市场销售。',
          image: 'https://s.coze.cn/image/CUni1txXG-4/',
          imageAlt: '智能手机 X1 Pro 图片'
        },
        'prod2': {
          name: '笔记本电脑 ProBook',
          hsCode: '8471300000',
          specification: '15英寸 i7 16GB',
          unitPrice: '¥8,999',
          stockQuantity: '320 台',
          status: '在售',
          description: 'ProBook系列笔记本电脑，15英寸高清显示屏，搭载Intel i7处理器，16GB内存，512GB SSD存储。适合商务办公和专业设计使用，预装正版操作系统，提供全球联保服务。',
          image: 'https://s.coze.cn/image/WXikwDzhaLk/',
          imageAlt: '笔记本电脑 ProBook 图片'
        },
        'prod3': {
          name: '蓝牙耳机 AirPods',
          hsCode: '8518300000',
          specification: 'Pro 主动降噪',
          unitPrice: '¥1,899',
          stockQuantity: '2,500 台',
          status: '在售',
          description: 'AirPods Pro 主动降噪蓝牙耳机，支持空间音频，防水防汗设计。配备无线充电盒，单次续航可达4.5小时，总续航24小时。兼容iOS和Android系统。',
          image: 'https://s.coze.cn/image/wN2lVLREJ-4/',
          imageAlt: '蓝牙耳机 AirPods 图片'
        }
      };

      const selectedProduct = mockProducts[productId || 'prod1'] || mockProducts['prod1'];
      setProductData(selectedProduct);
    } catch (error) {
      console.error('加载产品详情失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProductDetails();
    setIsRefreshing(false);
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/p-product_manage');
    }
  };

  const handleEditPress = () => {
    router.push(`/p-edit_product?productId=${productId || 'prod1'}`);
  };

  const handleOrderPress = (orderId: string) => {
    router.push(`/p-follow_up_detail?orderId=${orderId}`);
  };

  const renderInfoItem = (label: string, value: string, isStatus?: boolean) => (
    <View style={styles.infoItem}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        {isStatus ? (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{value}</Text>
          </View>
        ) : (
          <Text style={styles.infoValue}>{value}</Text>
        )}
      </View>
    </View>
  );

  const renderOrderItem = (order: OrderData) => (
    <TouchableOpacity
      key={order.id}
      style={styles.orderItem}
      onPress={() => handleOrderPress(order.id)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderLeft}>
          <View style={[styles.orderIcon, { backgroundColor: `${order.statusColor}20` }]}>
            <FontAwesome6 name={order.icon} size={16} color={order.statusColor} />
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <Text style={styles.orderCustomer}>{order.customer}</Text>
          </View>
        </View>
        <View style={[styles.orderStatusBadge, { backgroundColor: `${order.statusColor}20` }]}>
          <Text style={[styles.orderStatusText, { color: order.statusColor }]}>{order.status}</Text>
        </View>
      </View>
      <View style={styles.orderDetails}>
        <View style={styles.orderMetrics}>
          <Text style={styles.orderMetric}>数量: {order.quantity}</Text>
          <Text style={styles.orderMetric}>金额: {order.amount}</Text>
        </View>
        <Text style={styles.orderDate}>{order.date}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>加载中...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#FFFFFF"
              colors={['#3B82F6']}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* 顶部导航 */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.pageTitle}>产品详情</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPress}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="pen" size={14} color="#FFFFFF" />
              <Text style={styles.editButtonText}>编辑</Text>
            </TouchableOpacity>
          </View>

          {/* 产品基本信息 */}
          <View style={styles.productSection}>
            {/* 产品图片 */}
            <View style={styles.productImageContainer}>
              <Image
                source={{ uri: productData.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>

            {/* 产品基本信息卡片 */}
            <View style={styles.basicInfoCard}>
              <Text style={styles.productName}>{productData.name}</Text>
              
              <View style={styles.productDetails}>
                {renderInfoItem('HS编码', productData.hsCode)}
                {renderInfoItem('规格型号', productData.specification)}
                {renderInfoItem('单价', productData.unitPrice)}
                {renderInfoItem('库存数量', productData.stockQuantity)}
                {renderInfoItem('产品状态', productData.status, true)}
              </View>
            </View>

            {/* 产品描述 */}
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionTitle}>产品描述</Text>
              <Text style={styles.descriptionText}>{productData.description}</Text>
            </View>
          </View>

          {/* 关联订单 */}
          <View style={styles.ordersSection}>
            <View style={styles.ordersHeader}>
              <Text style={styles.sectionTitle}>关联订单</Text>
              <Text style={styles.ordersCount}>共{relatedOrders.length}个订单</Text>
            </View>
            <View style={styles.ordersList}>
              {relatedOrders.map(renderOrderItem)}
            </View>
          </View>

          {/* 销售统计 */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>销售统计</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>175</Text>
                <Text style={styles.statLabel}>总销量(台)</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>¥524,825</Text>
                <Text style={styles.statLabel}>总销售额</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProductDetailScreen;

