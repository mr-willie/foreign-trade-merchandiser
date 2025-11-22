

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Linking, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface CustomerData {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  remark: string;
}

interface OrderItem {
  id: string;
  title: string;
  amount: string;
  status: string;
  statusColor: string;
  date: string;
  progress?: string;
  completionDate?: string;
}

interface CommunicationRecord {
  id: string;
  type: 'phone' | 'email' | 'meeting' | 'wechat';
  typeName: string;
  content: string;
  time: string;
  duration?: string;
  result?: string;
  attachment?: string;
  participants?: string;
}

const CustomerDetailScreen: React.FC = () => {
  const router = useRouter();
  const { customerId } = useLocalSearchParams<{ customerId: string }>();
  
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: 'ABC贸易公司',
    contactPerson: '张三',
    phone: '+86 138 0013 8000',
    email: 'zhang.san@abc-trading.com',
    address: '广东省深圳市南山区科技园南区粤海街道深圳湾科技生态园10栋A座1501室',
    remark: '优质客户，合作多年，付款及时，主要采购电子产品和机械设备。'
  });

  const [isAddRecordModalVisible, setIsAddRecordModalVisible] = useState(false);
  const [communicationType, setCommunicationType] = useState('phone');
  const [communicationContent, setCommunicationContent] = useState('');
  const [communicationRecords, setCommunicationRecords] = useState<CommunicationRecord[]>([
    {
      id: 'record-1',
      type: 'phone',
      typeName: '电话沟通',
      content: '与张三确认PO-2024001订单的交货期，客户要求提前一周交货，已协调生产部门调整计划。',
      time: '2024-01-15 14:30',
      duration: '15分钟',
      result: '已确认'
    },
    {
      id: 'record-2',
      type: 'email',
      typeName: '邮件往来',
      content: '发送形式发票给客户，确认产品规格和价格。客户回复确认无误，等待最终合同签署。',
      time: '2024-01-14 16:45',
      attachment: '形式发票.pdf',
      result: '已回复'
    },
    {
      id: 'record-3',
      type: 'meeting',
      typeName: '视频会议',
      content: '与客户技术团队进行视频会议，讨论产品技术细节和质量标准，达成一致意见。',
      time: '2024-01-13 10:00',
      participants: '5人',
      duration: '45分钟'
    }
  ]);

  const ordersData: OrderItem[] = [
    {
      id: 'PO-2024001',
      title: '电子产品出口订单',
      amount: '¥1,250,000',
      status: '报关中',
      statusColor: '#3B82F6',
      date: '2024-01-10',
      progress: '75%'
    },
    {
      id: 'PO-20231201',
      title: '机械零件进口订单',
      amount: '¥850,000',
      status: '已完成',
      statusColor: '#10B981',
      date: '2023-12-01',
      completionDate: '2023-12-28'
    },
    {
      id: 'PO-20231115',
      title: '电子元器件订单',
      amount: '¥620,000',
      status: '已完成',
      statusColor: '#10B981',
      date: '2023-11-15',
      completionDate: '2023-12-10'
    }
  ];

  useEffect(() => {
    // 模拟根据customerId加载客户数据
    if (customerId) {
      const mockCustomers: Record<string, CustomerData> = {
        'CUST001': {
          name: 'ABC贸易公司',
          contactPerson: '张三',
          phone: '+86 138 0013 8000',
          email: 'zhang.san@abc-trading.com',
          address: '广东省深圳市南山区科技园南区粤海街道深圳湾科技生态园10栋A座1501室',
          remark: '优质客户，合作多年，付款及时，主要采购电子产品和机械设备。'
        },
        'CUST002': {
          name: 'DEF制造有限公司',
          contactPerson: '李四',
          phone: '+86 139 0013 9000',
          email: 'li.si@def-manufacturing.com',
          address: '上海市浦东新区张江高科技园区博云路2号浦软大厦1101室',
          remark: '新客户，对价格敏感，主要采购机械零件。'
        }
      };

      const customer = mockCustomers[customerId];
      if (customer) {
        setCustomerData(customer);
      }
    }
  }, [customerId]);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleEditPress = () => {
    router.push(`/p-edit_customer?customerId=${customerId || 'CUST001'}`);
  };

  const handleCallPress = async () => {
    const phoneUrl = `tel:${customerData.phone}`;
    try {
      const supported = await Linking.canOpenURL(phoneUrl);
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('错误', '无法拨打电话');
      }
    } catch (error) {
      Alert.alert('错误', '拨打电话失败');
    }
  };

  const handleEmailPress = async () => {
    const emailUrl = `mailto:${customerData.email}`;
    try {
      const supported = await Linking.canOpenURL(emailUrl);
      if (supported) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert('错误', '无法打开邮件应用');
      }
    } catch (error) {
      Alert.alert('错误', '打开邮件失败');
    }
  };

  const handleOrderPress = (orderId: string) => {
    router.push(`/p-follow_up_detail?orderId=${orderId}`);
  };

  const handleAddRecordPress = () => {
    setIsAddRecordModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsAddRecordModalVisible(false);
    setCommunicationType('phone');
    setCommunicationContent('');
  };

  const handleSubmitRecord = () => {
    if (!communicationContent.trim()) {
      Alert.alert('提示', '请输入沟通内容');
      return;
    }

    const typeNames: Record<string, string> = {
      'phone': '电话沟通',
      'email': '邮件往来',
      'meeting': '视频会议',
      'wechat': '微信沟通'
    };

    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newRecord: CommunicationRecord = {
      id: `record-${Date.now()}`,
      type: communicationType as 'phone' | 'email' | 'meeting' | 'wechat',
      typeName: typeNames[communicationType],
      content: communicationContent,
      time: timeString
    };

    setCommunicationRecords(prev => [newRecord, ...prev]);
    handleCloseModal();
    Alert.alert('成功', '沟通记录添加成功');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return { name: 'phone', color: '#3B82F6' };
      case 'email':
        return { name: 'envelope', color: '#8B5CF6' };
      case 'meeting':
        return { name: 'comments', color: '#10B981' };
      case 'wechat':
        return { name: 'weixin', color: '#10B981' };
      default:
        return { name: 'phone', color: '#3B82F6' };
    }
  };

  const renderInfoItem = (
    icon: string,
    iconColor: string,
    title: string,
    value: string,
    showAction?: boolean,
    actionIcon?: string,
    actionColor?: string,
    onPressAction?: () => void
  ) => (
    <View style={styles.infoItem}>
      <View style={styles.infoItemContent}>
        <View style={styles.infoItemLeft}>
          <View style={[styles.infoIconContainer, { backgroundColor: `${iconColor}20` }]}>
            <FontAwesome6 name={icon} size={16} color={iconColor} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>{title}</Text>
            <Text style={styles.infoValue}>{value}</Text>
          </View>
        </View>
        {showAction && (
          <TouchableOpacity style={styles.actionButton} onPress={onPressAction}>
            <FontAwesome6 name={actionIcon!} size={14} color={actionColor!} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderOrderItem = (order: OrderItem) => (
    <TouchableOpacity
      key={order.id}
      style={styles.orderItem}
      onPress={() => handleOrderPress(order.id)}
    >
      <View style={styles.orderItemHeader}>
        <View style={styles.orderItemLeft}>
          <View style={[styles.orderIconContainer, { backgroundColor: order.status === '已完成' ? '#10B98120' : '#3B82F620' }]}>
            <FontAwesome6 
              name={order.status === '已完成' ? 'check-circle' : 'shopping-cart'} 
              size={16} 
              color={order.status === '已完成' ? '#10B981' : '#3B82F6'} 
            />
          </View>
          <View style={styles.orderTextContainer}>
            <Text style={styles.orderTitle}>{order.id}</Text>
            <Text style={styles.orderSubtitle}>{order.title}</Text>
          </View>
        </View>
        <View style={styles.orderItemRight}>
          <Text style={styles.orderAmount}>{order.amount}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${order.statusColor}20` }]}>
            <Text style={[styles.statusText, { color: order.statusColor }]}>{order.status}</Text>
          </View>
        </View>
      </View>
      <View style={styles.orderItemFooter}>
        <Text style={styles.orderDate}>{order.date}</Text>
        <Text style={styles.orderProgress}>
          {order.progress ? `进度: ${order.progress}` : `完成时间: ${order.completionDate}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCommunicationRecord = (record: CommunicationRecord) => {
    const typeIcon = getTypeIcon(record.type);
    
    return (
      <View key={record.id} style={styles.recordItem}>
        <View style={styles.recordItemContent}>
          <View style={[styles.recordIconContainer, { backgroundColor: `${typeIcon.color}20` }]}>
            <FontAwesome6 name={typeIcon.name} size={14} color={typeIcon.color} />
          </View>
          <View style={styles.recordTextContainer}>
            <View style={styles.recordHeader}>
              <Text style={styles.recordTitle}>{record.typeName}</Text>
              <Text style={styles.recordTime}>{record.time}</Text>
            </View>
            <Text style={styles.recordContent}>{record.content}</Text>
            <View style={styles.recordMeta}>
              {record.duration && <Text style={styles.recordMetaText}>通话时长: {record.duration}</Text>}
              {record.result && <Text style={styles.recordMetaText}>结果: {record.result}</Text>}
              {record.attachment && <Text style={styles.recordMetaText}>附件: {record.attachment}</Text>}
              {record.participants && <Text style={styles.recordMetaText}>参与人员: {record.participants}</Text>}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部导航区域 */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <FontAwesome6 name="arrow-left" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.customerName}>{customerData.name}</Text>
                <Text style={styles.customerStatus}>合作客户</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
              <FontAwesome6 name="pen" size={14} color="#FFFFFF" />
              <Text style={styles.editButtonText}>编辑</Text>
            </TouchableOpacity>
          </View>

          {/* 客户基本信息 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>基本信息</Text>
            <View style={styles.infoGrid}>
              {renderInfoItem('user', '#3B82F6', '联系人', customerData.contactPerson)}
              {renderInfoItem('phone', '#10B981', '联系电话', customerData.phone, true, 'phone', '#10B981', handleCallPress)}
              {renderInfoItem('envelope', '#8B5CF6', '邮箱', customerData.email, true, 'envelope', '#8B5CF6', handleEmailPress)}
              {renderInfoItem('location-dot', '#06B6D4', '公司地址', customerData.address)}
              {renderInfoItem('note-sticky', '#F59E0B', '备注', customerData.remark)}
            </View>
          </View>

          {/* 关联订单 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>关联订单</Text>
              <Text style={styles.sectionCount}>共{ordersData.length}个订单</Text>
            </View>
            <View style={styles.ordersList}>
              {ordersData.map(renderOrderItem)}
            </View>
          </View>

          {/* 沟通记录 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>沟通记录</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddRecordPress}>
                <FontAwesome6 name="plus" size={12} color="#FFFFFF" />
                <Text style={styles.addButtonText}>添加</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recordsList}>
              {communicationRecords.map(renderCommunicationRecord)}
            </View>
          </View>
        </ScrollView>

        {/* 添加沟通记录弹窗 */}
        <Modal
          visible={isAddRecordModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>添加沟通记录</Text>
                <TouchableOpacity onPress={handleCloseModal}>
                  <FontAwesome6 name="xmark" size={18} color="rgba(255, 255, 255, 0.6)" />
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>沟通方式</Text>
                  <View style={styles.selectContainer}>
                    <TouchableOpacity style={styles.selectButton}>
                      <Text style={styles.selectText}>电话沟通</Text>
                      <FontAwesome6 name="chevron-down" size={12} color="rgba(255, 255, 255, 0.6)" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>沟通内容</Text>
                  <TextInput
                    style={styles.textArea}
                    value={communicationContent}
                    onChangeText={setCommunicationContent}
                    placeholder="请输入沟通内容..."
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                    <Text style={styles.cancelButtonText}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRecord}>
                    <Text style={styles.submitButtonText}>保存</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CustomerDetailScreen;

