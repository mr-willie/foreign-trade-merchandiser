

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert, RefreshControl, Dimensions, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  orders: number;
  totalAmount: number;
}

interface CustomerStats {
  total: number;
  active: number;
  newThisMonth: number;
}

const CustomerManagePage: React.FC = () => {
  const router = useRouter();
  
  // 模拟客户数据
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'CUST001',
      name: 'ABC贸易公司',
      contactPerson: '张三',
      phone: '13800138000',
      email: 'zhangsan@abc.com',
      address: '上海市浦东新区世纪大道100号',
      status: 'active',
      orders: 12,
      totalAmount: 156000
    },
    {
      id: 'CUST002',
      name: 'DEF制造有限公司',
      contactPerson: '李四',
      phone: '13900139000',
      email: 'lisi@def.com',
      address: '广东省深圳市南山区科技园路200号',
      status: 'active',
      orders: 8,
      totalAmount: 98000
    },
    {
      id: 'CUST003',
      name: 'GHI国际集团',
      contactPerson: '王五',
      phone: '13700137000',
      email: 'wangwu@ghi.com',
      address: '北京市朝阳区建国路88号',
      status: 'inactive',
      orders: 5,
      totalAmount: 67000
    },
    {
      id: 'CUST004',
      name: 'JKL进出口公司',
      contactPerson: '赵六',
      phone: '13600136000',
      email: 'zhaoliu@jkl.com',
      address: '浙江省杭州市西湖区文三路500号',
      status: 'active',
      orders: 15,
      totalAmount: 203000
    },
    {
      id: 'CUST005',
      name: 'MNO贸易商行',
      contactPerson: '孙七',
      phone: '13500135000',
      email: 'sunqi@mno.com',
      address: '福建省厦门市湖里区嘉禾路300号',
      status: 'active',
      orders: 6,
      totalAmount: 45000
    },
    {
      id: 'CUST006',
      name: 'PQR实业有限公司',
      contactPerson: '周八',
      phone: '13400134000',
      email: 'zhouba@pqr.com',
      address: '江苏省苏州市工业园区金鸡湖路150号',
      status: 'inactive',
      orders: 3,
      totalAmount: 28000
    }
  ]);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

  const customerStats: CustomerStats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    newThisMonth: 3
  };

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleSearch = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
    
    if (!keyword.trim()) {
      if (isFilterActive) {
        setFilteredCustomers(customers.filter(c => c.status === 'active'));
      } else {
        setFilteredCustomers(customers);
      }
    } else {
      let filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(keyword.toLowerCase()) ||
        customer.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
        customer.phone.includes(keyword) ||
        customer.email.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (isFilterActive) {
        filtered = filtered.filter(c => c.status === 'active');
      }
      
      setFilteredCustomers(filtered);
    }
  }, [customers, isFilterActive]);

  const handleAddCustomer = useCallback(() => {
    // 这里应该跳转到新建客户页面
    console.log('跳转到新建客户页面');
  }, []);

  const handleCustomerPress = useCallback((customerId: string) => {
    router.push(`/p-customer_detail?customerId=${customerId}`);
  }, [router]);

  const handleCustomerLongPress = useCallback((customerId: string, x: number, y: number) => {
    setSelectedCustomerId(customerId);
    setContextMenuPosition({ x, y });
    setIsContextMenuVisible(true);
  }, []);

  const handleEditCustomer = useCallback(() => {
    if (selectedCustomerId) {
      console.log('跳转到编辑客户页面', selectedCustomerId);
      setIsContextMenuVisible(false);
    }
  }, [selectedCustomerId]);

  const handleDeleteCustomer = useCallback(() => {
    setIsContextMenuVisible(false);
    setIsDeleteModalVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedCustomerId) {
      setCustomers(prev => prev.filter(c => c.id !== selectedCustomerId));
      setFilteredCustomers(prev => prev.filter(c => c.id !== selectedCustomerId));
      setIsDeleteModalVisible(false);
      setSelectedCustomerId(null);
      Alert.alert('成功', '客户删除成功');
    }
  }, [selectedCustomerId]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteModalVisible(false);
    setSelectedCustomerId(null);
  }, []);

  const handleSortPress = useCallback(() => {
    const sorted = [...filteredCustomers].sort((a, b) => a.name.localeCompare(b.name));
    setFilteredCustomers(sorted);
  }, [filteredCustomers]);

  const handleFilterPress = useCallback(() => {
    setIsFilterActive(prev => !prev);
    
    if (isFilterActive) {
      // 取消筛选
      if (searchKeyword.trim()) {
        handleSearch(searchKeyword);
      } else {
        setFilteredCustomers(customers);
      }
    } else {
      // 应用筛选（只显示活跃客户）
      let filtered = customers.filter(c => c.status === 'active');
      if (searchKeyword.trim()) {
        filtered = filtered.filter(customer => 
          customer.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          customer.contactPerson.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          customer.phone.includes(searchKeyword) ||
          customer.email.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }
      setFilteredCustomers(filtered);
    }
  }, [customers, searchKeyword, isFilterActive, handleSearch]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const handleLoadMore = useCallback(() => {
    console.log('加载更多客户数据');
  }, []);

  const hideContextMenu = useCallback(() => {
    setIsContextMenuVisible(false);
    setSelectedCustomerId(null);
  }, []);

  const renderCustomerItem = useCallback(({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={styles.customerItem}
      onPress={() => handleCustomerPress(item.id)}
      onLongPress={(event) => {
        const { pageX, pageY } = event.nativeEvent;
        handleCustomerLongPress(item.id, pageX, pageY);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.customerItemHeader}>
        <View style={styles.customerItemLeft}>
          <View style={styles.customerIcon}>
            <FontAwesome6 name="building" size={18} color="#3B82F6" />
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.name}</Text>
            <Text style={styles.contactPerson}>联系人: {item.contactPerson}</Text>
          </View>
        </View>
        <View style={styles.customerItemRight}>
          <Text style={[
            styles.statusText,
            item.status === 'active' ? styles.activeStatus : styles.inactiveStatus
          ]}>
            {item.status === 'active' ? '活跃' : '非活跃'}
          </Text>
          <FontAwesome6 name="chevron-right" size={12} color="rgba(255, 255, 255, 0.4)" style={styles.chevronIcon} />
        </View>
      </View>
      
      <View style={styles.customerContactInfo}>
        <View style={styles.contactInfoRow}>
          <View style={styles.contactInfoItem}>
            <FontAwesome6 name="phone" size={12} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.contactInfoText}>{item.phone}</Text>
          </View>
          <View style={styles.contactInfoItem}>
            <FontAwesome6 name="envelope" size={12} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.contactInfoText}>{item.email}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.customerStats}>
        <Text style={styles.customerStatsText}>
          订单: {item.orders}个 | 总金额: ¥{item.totalAmount.toLocaleString()}
        </Text>
        <Text style={styles.lastTransactionText}>最近交易: 2024-01-10</Text>
      </View>
    </TouchableOpacity>
  ), [handleCustomerPress, handleCustomerLongPress]);

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      {/* 顶部导航区域 */}
      <View style={styles.topHeader}>
        <View style={styles.headerContent}>
          <View style={styles.backSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <FontAwesome6 name="arrow-left" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>客户管理</Text>
          </View>
          <View style={styles.headerActions} />
        </View>
        
        {/* 搜索和添加区域 */}
        <View style={styles.searchAddContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <FontAwesome6 name="magnifying-glass" size={16} color="rgba(255, 255, 255, 0.6)" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="搜索客户名称、联系人..."
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={searchKeyword}
                onChangeText={handleSearch}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.addCustomerButton} onPress={handleAddCustomer}>
            <FontAwesome6 name="plus" size={18} color="#10B981" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 客户统计 */}
      <View style={styles.customerStatsSection}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{customerStats.total}</Text>
            <Text style={styles.statLabel}>总客户数</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, styles.activeStatNumber]}>{customerStats.active}</Text>
            <Text style={styles.statLabel}>活跃客户</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, styles.primaryStatNumber]}>{customerStats.newThisMonth}</Text>
            <Text style={styles.statLabel}>本月新增</Text>
          </View>
        </View>
      </View>

      {/* 列表头部 */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>客户列表</Text>
        <View style={styles.sortFilterContainer}>
          <TouchableOpacity style={styles.sortFilterButton} onPress={handleSortPress}>
            <FontAwesome6 name="sort" size={14} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortFilterButton} onPress={handleFilterPress}>
            <FontAwesome6 name="filter" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [
    handleBackPress,
    searchKeyword,
    handleSearch,
    handleAddCustomer,
    customerStats,
    handleSortPress,
    handleFilterPress
  ]);

  const renderFooter = useCallback(() => (
    <View style={styles.footerContainer}>
      {filteredCustomers.length === 0 ? (
        <View style={styles.noDataContainer}>
          <FontAwesome6 name="users" size={48} color="rgba(255, 255, 255, 0.4)" style={styles.noDataIcon} />
          <Text style={styles.noDataText}>暂无客户数据</Text>
          <TouchableOpacity style={styles.addFirstCustomerButton} onPress={handleAddCustomer}>
            <Text style={styles.addFirstCustomerText}>添加第一个客户</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loadMoreContainer}>
          <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
            <Text style={styles.loadMoreText}>加载更多</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  ), [filteredCustomers.length, handleAddCustomer, handleLoadMore]);

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={filteredCustomers}
          renderItem={renderCustomerItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          }
        />

        {/* 右键菜单 */}
        <Modal
          visible={isContextMenuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={hideContextMenu}
        >
          <TouchableOpacity 
            style={styles.contextMenuOverlay} 
            activeOpacity={1} 
            onPress={hideContextMenu}
          >
            <View 
              style={[
                styles.contextMenu,
                {
                  left: Math.min(contextMenuPosition.x, screenWidth - 180),
                  top: Math.min(contextMenuPosition.y, screenHeight - 120)
                }
              ]}
            >
              <TouchableOpacity style={styles.contextMenuItem} onPress={handleEditCustomer}>
                <FontAwesome6 name="pen-to-square" size={16} color="#374151" style={styles.contextMenuIcon} />
                <Text style={styles.contextMenuText}>编辑客户</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contextMenuItem} onPress={handleDeleteCustomer}>
                <FontAwesome6 name="trash" size={16} color="#374151" style={styles.contextMenuIcon} />
                <Text style={styles.contextMenuText}>删除客户</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* 删除确认对话框 */}
        <Modal
          visible={isDeleteModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelDelete}
        >
          <View style={styles.deleteModalOverlay}>
            <View style={styles.deleteModal}>
              <Text style={styles.deleteModalTitle}>确认删除</Text>
              <Text style={styles.deleteModalMessage}>确定要删除这个客户吗？删除后将无法恢复。</Text>
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelDelete}>
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmDeleteButton} onPress={handleConfirmDelete}>
                  <Text style={styles.confirmDeleteButtonText}>删除</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CustomerManagePage;

