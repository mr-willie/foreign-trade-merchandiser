

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import TaskItem from './components/TaskItem';
import FilterTab from './components/FilterTab';

interface Task {
  id: string;
  title: string;
  description: string;
  relatedInfo: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low' | 'overdue';
  type: 'document' | 'process';
  isCompleted: boolean;
}

type FilterType = 'all' | 'high' | 'medium' | 'low' | 'expiring' | 'overdue';

const TaskReminderScreen = () => {
  const router = useRouter();
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      title: '商检证书即将到期',
      description: '证书编号: CI-2024001，商品: 电子产品',
      relatedInfo: '关联订单: PO-2024001',
      deadline: '今天 18:00 到期',
      priority: 'high',
      type: 'document',
      isCompleted: false,
    },
    {
      id: 'task-2',
      title: '完成ABC公司订单的报关单',
      description: '订单号: PO-2024001，客户: ABC贸易公司',
      relatedInfo: '当前环节: 报关单管理',
      deadline: '今天 18:00 截止',
      priority: 'high',
      type: 'process',
      isCompleted: false,
    },
    {
      id: 'task-3',
      title: '申请出口许可证',
      description: '订单号: PO-2024002，商品: 机械零件',
      relatedInfo: '当前环节: 进出口许可办理',
      deadline: '明天 10:00 截止',
      priority: 'medium',
      type: 'process',
      isCompleted: false,
    },
    {
      id: 'task-4',
      title: '信用证即将到期',
      description: '信用证号: LC-2024001，金额: $50,000',
      relatedInfo: '关联订单: PO-2024003',
      deadline: '1月20日 到期',
      priority: 'medium',
      type: 'document',
      isCompleted: false,
    },
    {
      id: 'task-5',
      title: '更新海运订舱信息',
      description: '订单号: PO-2024003，目的港: 汉堡',
      relatedInfo: '当前环节: 海运物流安排',
      deadline: '1月17日 截止',
      priority: 'low',
      type: 'process',
      isCompleted: false,
    },
    {
      id: 'task-6',
      title: '产地证已逾期',
      description: '证书编号: CO-2024001，商品: 纺织品',
      relatedInfo: '关联订单: PO-2024004',
      deadline: '已于1月14日 到期',
      priority: 'overdue',
      type: 'document',
      isCompleted: false,
    },
    {
      id: 'task-7',
      title: '办理货物保险',
      description: '订单号: PO-2024005，保险金额: $80,000',
      relatedInfo: '当前环节: 货物保险办理',
      deadline: '1月18日 截止',
      priority: 'medium',
      type: 'process',
      isCompleted: false,
    },
    {
      id: 'task-8',
      title: '发送装运通知',
      description: '订单号: PO-2024006，船名: MSC GLOBAL',
      relatedInfo: '当前环节: 装运通知管理',
      deadline: '1月19日 截止',
      priority: 'low',
      type: 'process',
      isCompleted: false,
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filterTabs = [
    { key: 'all' as FilterType, label: '全部' },
    { key: 'high' as FilterType, label: '高优先级' },
    { key: 'medium' as FilterType, label: '中优先级' },
    { key: 'low' as FilterType, label: '低优先级' },
    { key: 'expiring' as FilterType, label: '单证到期' },
    { key: 'overdue' as FilterType, label: '逾期预警' },
  ];

  const filteredTasks = tasks.filter(task => {
    if (task.isCompleted) return false;
    
    switch (activeFilter) {
      case 'all':
        return true;
      case 'high':
        return task.priority === 'high';
      case 'medium':
        return task.priority === 'medium';
      case 'low':
        return task.priority === 'low';
      case 'expiring':
        return task.type === 'document';
      case 'overdue':
        return task.priority === 'overdue';
      default:
        return true;
    }
  });

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setIsRefreshing(false);
      Alert.alert('提示', '数据已刷新');
    }, 1000);
  }, []);

  const handleFilterPress = useCallback((filterType: FilterType) => {
    setActiveFilter(filterType);
  }, []);

  const handleTaskPress = useCallback((task: Task) => {
    if (task.type === 'document') {
      router.push(`/p-doc_detail?documentId=${task.id}`);
    } else {
      router.push(`/p-follow_up_detail?orderId=${task.id}`);
    }
  }, [router]);

  const handleMarkAsCompleted = useCallback((taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: true } : task
      )
    );
    Alert.alert('提示', '任务已标记为已处理');
  }, []);

  const renderTaskItem = useCallback(({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onPress={() => handleTaskPress(item)}
      onMarkAsCompleted={() => handleMarkAsCompleted(item.id)}
    />
  ), [handleTaskPress, handleMarkAsCompleted]);

  const renderFilterTab = useCallback(({ item }: { item: typeof filterTabs[0] }) => (
    <FilterTab
      label={item.label}
      isActive={activeFilter === item.key}
      onPress={() => handleFilterPress(item.key)}
    />
  ), [activeFilter, handleFilterPress]);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIcon}>
        <FontAwesome5 name="tasks" size={32} color="rgba(255, 255, 255, 0.6)" />
      </View>
      <Text style={styles.emptyStateTitle}>暂无待处理任务</Text>
      <Text style={styles.emptyStateDescription}>当前筛选条件下没有找到相关任务</Text>
    </View>
  );

  const renderListHeader = () => (
    <View>
      {/* 顶部导航区域 */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.pageTitle}>任务提醒</Text>
              <Text style={styles.taskCount}>共 {filteredTasks.length} 个待处理任务</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <FontAwesome5 
              name="sync-alt" 
              size={18} 
              color="#FFFFFF" 
              style={isRefreshing ? styles.refreshIconRotating : undefined}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 筛选标签 */}
      <View style={styles.filterSection}>
        <FlatList
          data={filterTabs}
          renderItem={renderFilterTab}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContainer}
        />
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContainer}
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

export default TaskReminderScreen;

