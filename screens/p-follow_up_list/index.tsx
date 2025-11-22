

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './styles';
import FollowUpItem from './components/FollowUpItem';
import FilterDropdown from './components/FilterDropdown';
import SortDropdown from './components/SortDropdown';

interface FollowUpTask {
  id: string;
  orderNo: string;
  customerName: string;
  productName: string;
  amount: number;
  status: string;
  statusColor: string;
  iconName: string;
  iconColor: string;
  progress: number;
  lastUpdated: string;
  completedTime?: string;
}

const FollowUpListScreen = () => {
  const router = useRouter();
  
  // 搜索和筛选状态
  const [searchText, setSearchText] = useState('');
  const [isFilterDropdownVisible, setIsFilterDropdownVisible] = useState(false);
  const [isSortDropdownVisible, setIsSortDropdownVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [sortOption, setSortOption] = useState('updated_desc');
  
  // 加载状态
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // 模拟数据
  const [followUpTasks, setFollowUpTasks] = useState<FollowUpTask[]>([
    {
      id: '1',
      orderNo: 'PO-2024001',
      customerName: 'ABC贸易公司',
      productName: '电子产品出口',
      amount: 1250000,
      status: '报关中',
      statusColor: '#3B82F6',
      iconName: 'ship',
      iconColor: '#3B82F6',
      progress: 75,
      lastUpdated: '2024-01-15 14:30',
    },
    {
      id: '2',
      orderNo: 'PO-2024002',
      customerName: 'DEF制造有限公司',
      productName: '机械零件',
      amount: 890000,
      status: '许可证申请',
      statusColor: '#8B5CF6',
      iconName: 'boxes-stacked',
      iconColor: '#8B5CF6',
      progress: 45,
      lastUpdated: '2024-01-15 11:20',
    },
    {
      id: '3',
      orderNo: 'PO-2024003',
      customerName: 'GHI进出口公司',
      productName: '纺织品',
      amount: 620000,
      status: '已完成',
      statusColor: '#10B981',
      iconName: 'circle-check',
      iconColor: '#10B981',
      progress: 100,
      lastUpdated: '2024-01-14 16:45',
      completedTime: '2024-01-14 16:45',
    },
    {
      id: '4',
      orderNo: 'PO-2024004',
      customerName: 'JKL国际集团',
      productName: '化工产品',
      amount: 2100000,
      status: '逾期',
      statusColor: '#EF4444',
      iconName: 'triangle-exclamation',
      iconColor: '#F59E0B',
      progress: 30,
      lastUpdated: '2024-01-13 09:15',
    },
    {
      id: '5',
      orderNo: 'PO-2024005',
      customerName: 'MNO贸易公司',
      productName: '医疗器械',
      amount: 1450000,
      status: '海运安排',
      statusColor: '#06B6D4',
      iconName: 'gear',
      iconColor: '#06B6D4',
      progress: 60,
      lastUpdated: '2024-01-15 16:20',
    },
  ]);

  // 筛选和搜索逻辑
  const filteredTasks = followUpTasks.filter(task => {
    const matchesSearch = searchText === '' || 
      task.orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
      task.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      task.productName.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === '' || task.status === statusFilter;
    const matchesCustomer = customerFilter === '' || task.customerName === customerFilter;
    
    return matchesSearch && matchesStatus && matchesCustomer;
  });

  // 排序逻辑
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortOption) {
      case 'updated_desc':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'updated_asc':
        return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
      case 'order_no_desc':
        return b.orderNo.localeCompare(a.orderNo);
      case 'order_no_asc':
        return a.orderNo.localeCompare(b.orderNo);
      case 'amount_desc':
        return b.amount - a.amount;
      case 'amount_asc':
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  // 事件处理函数
  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchText('');
  }, []);

  const handleFilterButtonPress = useCallback(() => {
    setIsFilterDropdownVisible(!isFilterDropdownVisible);
    setIsSortDropdownVisible(false);
  }, [isFilterDropdownVisible]);

  const handleSortButtonPress = useCallback(() => {
    setIsSortDropdownVisible(!isSortDropdownVisible);
    setIsFilterDropdownVisible(false);
  }, [isSortDropdownVisible]);

  const handleApplyFilter = useCallback((status: string, customer: string) => {
    setStatusFilter(status);
    setCustomerFilter(customer);
    setIsFilterDropdownVisible(false);
  }, []);

  const handleResetFilter = useCallback(() => {
    setStatusFilter('');
    setCustomerFilter('');
  }, []);

  const handleSortOptionChange = useCallback((option: string) => {
    setSortOption(option);
    setIsSortDropdownVisible(false);
  }, []);

  const handleFollowUpItemPress = useCallback((orderNo: string) => {
    router.push(`/p-follow_up_detail?orderId=${orderNo}`);
  }, [router]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    // 模拟加载更多数据
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 1500);
  }, [isLoadingMore]);

  const renderFollowUpItem = useCallback(({ item }: { item: FollowUpTask }) => (
    <FollowUpItem
      task={item}
      onPress={() => handleFollowUpItemPress(item.orderNo)}
    />
  ), [handleFollowUpItemPress]);

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      {/* 顶部导航区域 */}
      <View style={styles.topHeader}>
        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>跟单管理</Text>
            <Text style={styles.followupCount}>共 {sortedTasks.length} 个跟单任务</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleFilterButtonPress}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="filter" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSortButtonPress}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="sort" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* 搜索框 */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <FontAwesome6 name="magnifying-glass" size={16} color="rgba(255, 255, 255, 0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="搜索订单号、客户名称..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={searchText}
              onChangeText={handleSearchTextChange}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={handleClearSearch}
                style={styles.clearSearchButton}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="xmark" size={14} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* 筛选下拉菜单 */}
      {isFilterDropdownVisible && (
        <FilterDropdown
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
          currentStatus={statusFilter}
          currentCustomer={customerFilter}
        />
      )}

      {/* 排序下拉菜单 */}
      {isSortDropdownVisible && (
        <SortDropdown
          onSortChange={handleSortOptionChange}
          currentSort={sortOption}
        />
      )}
    </View>
  ), [
    searchText,
    sortedTasks.length,
    isFilterDropdownVisible,
    isSortDropdownVisible,
    statusFilter,
    customerFilter,
    sortOption,
    handleSearchTextChange,
    handleClearSearch,
    handleFilterButtonPress,
    handleSortButtonPress,
    handleApplyFilter,
    handleResetFilter,
    handleSortOptionChange,
  ]);

  const renderFooter = useCallback(() => {
    if (sortedTasks.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <View style={styles.noDataIcon}>
            <FontAwesome6 name="magnifying-glass" size={24} color="rgba(255, 255, 255, 0.6)" />
          </View>
          <Text style={styles.noDataText}>暂无匹配的跟单任务</Text>
        </View>
      );
    }

    return (
      <View style={styles.loadMoreContainer}>
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
          disabled={isLoadingMore}
          activeOpacity={0.7}
        >
          <Text style={styles.loadMoreText}>
            {isLoadingMore ? '加载中...' : '加载更多'}
          </Text>
          {isLoadingMore && (
            <View style={styles.loadingSpinner} />
          )}
        </TouchableOpacity>
      </View>
    );
  }, [sortedTasks.length, isLoadingMore, handleLoadMore]);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={sortedTasks}
          renderItem={renderFollowUpItem}
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
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FollowUpListScreen;

