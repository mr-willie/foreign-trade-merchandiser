

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './styles';

interface TaskItem {
  id: string;
  title: string;
  orderNumber: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  priorityColor: string;
  priorityLabel: string;
}

interface FollowupItem {
  id: string;
  orderNumber: string;
  customerName: string;
  product: string;
  status: string;
  statusColor: string;
  progress: number;
  icon: string;
}

interface ReminderItem {
  id: string;
  title: string;
  description: string;
  action: string;
  type: 'warning' | 'info';
  icon: string;
}

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [greetingText, setGreetingText] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // 模拟数据
  const [pendingTasks] = useState<TaskItem[]>([
    {
      id: 'task-001',
      title: '完成ABC公司订单的报关单',
      orderNumber: 'PO-2024001',
      deadline: '今天 18:00 截止',
      priority: 'high',
      priorityColor: '#EF4444',
      priorityLabel: '高优先级',
    },
    {
      id: 'task-002',
      title: '申请出口许可证',
      orderNumber: 'PO-2024002',
      deadline: '明天 10:00 截止',
      priority: 'medium',
      priorityColor: '#F59E0B',
      priorityLabel: '中优先级',
    },
    {
      id: 'task-003',
      title: '更新海运订舱信息',
      orderNumber: 'PO-2024003',
      deadline: '1月17日 截止',
      priority: 'low',
      priorityColor: '#3B82F6',
      priorityLabel: '低优先级',
    },
  ]);

  const [ongoingFollowups] = useState<FollowupItem[]>([
    {
      id: 'followup-001',
      orderNumber: 'PO-2024001',
      customerName: 'ABC贸易公司',
      product: '电子产品出口',
      status: '报关中',
      statusColor: '#3B82F6',
      progress: 75,
      icon: 'ship',
    },
    {
      id: 'followup-002',
      orderNumber: 'PO-2024002',
      customerName: 'DEF制造有限公司',
      product: '机械零件',
      status: '许可证申请',
      statusColor: '#8B5CF6',
      progress: 45,
      icon: 'boxes-stacked',
    },
  ]);

  const [importantReminders] = useState<ReminderItem[]>([
    {
      id: 'reminder-001',
      title: '商检证书即将到期',
      description: '证书编号: CI-2024001，有效期至1月18日',
      action: '请及时更新',
      type: 'warning',
      icon: 'triangle-exclamation',
    },
    {
      id: 'reminder-002',
      title: '信用证即将到期',
      description: '信用证号: LC-2024001，有效期至1月20日',
      action: '请关注付款进度',
      type: 'info',
      icon: 'clock',
    },
  ]);

  useEffect(() => {
    setGreeting();
    setCurrentDateText();
  }, []);

  const setGreeting = () => {
    const hour = new Date().getHours();
    let greeting = '早上好';
    if (hour >= 12 && hour < 18) {
      greeting = '下午好';
    } else if (hour >= 18) {
      greeting = '晚上好';
    }
    setGreetingText(`${greeting}，张经理`);
  };

  const setCurrentDateText = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    setCurrentDate(`${year}年${month}月${day}日 ${weekday}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // 模拟数据刷新
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGreeting();
      setCurrentDateText();
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearchPress = () => {
    console.log('跳转到全局搜索页面');
    // 注：全局搜索页面P-SEARCH在PRD中未明确定义，此处仅做日志记录
  };

  const handleNotificationPress = () => {
    console.log('跳转到消息中心页面');
    // 注：消息中心页面P-MESSAGE_CENTER在PRD中未明确定义，此处仅做日志记录
  };

  const handleSearchInputPress = () => {
    console.log('进入搜索模式');
    // 注：全局搜索页面P-SEARCH在PRD中未明确定义，此处仅做日志记录
  };

  const handlePendingTasksCardPress = () => {
    router.push('/p-task_reminder');
  };

  const handleOngoingOrdersCardPress = () => {
    router.push('/p-follow_up_list');
  };

  const handleExpiringDocsCardPress = () => {
    router.push('/p-task_reminder?filter=expiring');
  };

  const handleCompletedOrdersCardPress = () => {
    router.push('/p-data_analytics');
  };

  const handleViewAllTasksPress = () => {
    router.push('/p-task_reminder');
  };

  const handleViewAllFollowupsPress = () => {
    router.push('/p-follow_up_list');
  };

  const handleViewAllRemindersPress = () => {
    router.push('/p-task_reminder?filter=reminders');
  };

  const handleTaskItemPress = (taskId: string) => {
    console.log('跳转到任务详情页面，任务ID:', taskId);
    // 注：任务详情页面P-TASK_DETAIL在PRD中未明确定义，此处仅做日志记录
  };

  const handleFollowupItemPress = (orderId: string) => {
    router.push(`/p-follow_up_detail?orderId=${orderId}`);
  };

  const handleReminderItemPress = (reminderId: string) => {
    console.log('跳转到提醒详情页面，提醒ID:', reminderId);
    // 注：提醒详情页面P-REMINDER_DETAIL在PRD中未明确定义，此处仅做日志记录
  };

  const handleImportContractPress = () => {
    router.push('/p-import_contract');
  };

  const handleCreateTaskPress = () => {
    console.log('跳转到新建任务页面');
    // 注：新建任务页面P-CREATE_TASK在PRD中未明确定义，此处仅做日志记录
  };

  const handleGenerateDocPress = () => {
    router.push('/p-doc_generation');
  };

  const handleScanDocPress = () => {
    console.log('需要调用第三方接口实现相机扫描功能');
    // 注：此功能需要调用设备相机API，在原型阶段仅做UI展示
  };

  const renderOverviewCard = (
    icon: string,
    iconColor: string,
    label: string,
    value: string,
    description: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.overviewCard} onPress={onPress}>
      <View style={styles.overviewCardHeader}>
        <View style={[styles.overviewCardIcon, { backgroundColor: `${iconColor}33` }]}>
          <FontAwesome6 name={icon} size={16} color={iconColor} />
        </View>
        <Text style={styles.overviewCardLabel}>{label}</Text>
      </View>
      <Text style={styles.overviewCardValue}>{value}</Text>
      <Text style={styles.overviewCardDescription}>{description}</Text>
    </TouchableOpacity>
  );

  const renderTaskItem = (task: TaskItem) => (
    <TouchableOpacity
      key={task.id}
      style={styles.taskItem}
      onPress={() => handleTaskItemPress(task.id)}
    >
      <View style={styles.taskItemContent}>
        <View style={[styles.taskItemIndicator, { backgroundColor: task.priorityColor }]} />
        <View style={styles.taskItemDetails}>
          <Text style={styles.taskItemTitle}>{task.title}</Text>
          <Text style={styles.taskItemOrderNumber}>订单号: {task.orderNumber}</Text>
          <View style={styles.taskItemFooter}>
            <Text style={[styles.taskItemDeadline, { color: task.priorityColor }]}>
              {task.deadline}
            </Text>
            <View style={[styles.taskItemPriorityBadge, { backgroundColor: `${task.priorityColor}33` }]}>
              <Text style={[styles.taskItemPriorityText, { color: task.priorityColor }]}>
                {task.priorityLabel}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFollowupItem = (followup: FollowupItem) => (
    <TouchableOpacity
      key={followup.id}
      style={styles.followupItem}
      onPress={() => handleFollowupItemPress(followup.orderNumber)}
    >
      <View style={styles.followupItemHeader}>
        <View style={styles.followupItemInfo}>
          <View style={[styles.followupItemIcon, { backgroundColor: `${followup.statusColor}33` }]}>
            <FontAwesome6 name={followup.icon} size={16} color={followup.statusColor} />
          </View>
          <View style={styles.followupItemDetails}>
            <Text style={styles.followupItemTitle}>
              {followup.customerName} - {followup.product}
            </Text>
            <Text style={styles.followupItemOrderNumber}>订单号: {followup.orderNumber}</Text>
          </View>
        </View>
        <View style={[styles.followupItemStatusBadge, { backgroundColor: `${followup.statusColor}33` }]}>
          <Text style={[styles.followupItemStatusText, { color: followup.statusColor }]}>
            {followup.status}
          </Text>
        </View>
      </View>
      <View style={styles.followupItemProgress}>
        <Text style={styles.followupItemProgressText}>进度: {followup.progress}%</Text>
        <View style={styles.followupItemProgressBar}>
          <View
            style={[
              styles.followupItemProgressFill,
              {
                width: `${followup.progress}%`,
                backgroundColor: followup.statusColor,
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderReminderItem = (reminder: ReminderItem) => (
    <TouchableOpacity
      key={reminder.id}
      style={styles.reminderItem}
      onPress={() => handleReminderItemPress(reminder.id)}
    >
      <View style={styles.reminderItemContent}>
        <View
          style={[
            styles.reminderItemIcon,
            {
              backgroundColor: reminder.type === 'warning' ? '#EF444433' : '#F59E0B33',
            },
          ]}
        >
          <FontAwesome6
            name={reminder.icon}
            size={14}
            color={reminder.type === 'warning' ? '#EF4444' : '#F59E0B'}
          />
        </View>
        <View style={styles.reminderItemDetails}>
          <Text style={styles.reminderItemTitle}>{reminder.title}</Text>
          <Text style={styles.reminderItemDescription}>{reminder.description}</Text>
          <Text
            style={[
              styles.reminderItemAction,
              {
                color: reminder.type === 'warning' ? '#EF4444' : '#F59E0B',
              },
            ]}
          >
            {reminder.action}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderQuickActionButton = (
    icon: string,
    iconColor: string,
    title: string,
    description: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: `${iconColor}33` }]}>
        <FontAwesome6 name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionDescription}>{description}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        >
          {/* 顶部导航区域 */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.greetingSection}>
                <Text style={styles.greetingText}>{greetingText}</Text>
                <Text style={styles.dateText}>{currentDate}</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerActionButton} onPress={handleSearchPress}>
                  <FontAwesome6 name="magnifying-glass" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerActionButton} onPress={handleNotificationPress}>
                  <FontAwesome6 name="bell" size={16} color="#FFFFFF" />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>3</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerActionButton}>
                  <FontAwesome6 name="comment-dots" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* 搜索框 */}
            <TouchableOpacity style={styles.searchContainer} onPress={handleSearchInputPress}>
              <FontAwesome6 name="magnifying-glass" size={16} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.searchPlaceholder}>搜索订单、客户、单证...</Text>
            </TouchableOpacity>
          </View>

          {/* 数据概览卡片 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>今日概览</Text>
            <View style={styles.overviewGrid}>
              {renderOverviewCard(
                'list-check',
                '#F59E0B',
                '待办',
                '12',
                '待处理任务',
                handlePendingTasksCardPress
              )}
              {renderOverviewCard(
                'cart-shopping',
                '#3B82F6',
                '进行中',
                '8',
                '进行中订单',
                handleOngoingOrdersCardPress
              )}
              {renderOverviewCard(
                'file-lines',
                '#EF4444',
                '即将到期',
                '5',
                '即将到期单证',
                handleExpiringDocsCardPress
              )}
              {renderOverviewCard(
                'circle-check',
                '#10B981',
                '本月',
                '23',
                '已完成订单',
                handleCompletedOrdersCardPress
              )}
            </View>
          </View>

          {/* 待办任务 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>待办任务</Text>
              <TouchableOpacity onPress={handleViewAllTasksPress}>
                <Text style={styles.viewAllText}>查看全部</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tasksList}>
              {pendingTasks.map(renderTaskItem)}
            </View>
          </View>

          {/* 进行中跟单 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>进行中跟单</Text>
              <TouchableOpacity onPress={handleViewAllFollowupsPress}>
                <Text style={styles.viewAllText}>查看全部</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.followupsList}>
              {ongoingFollowups.map(renderFollowupItem)}
            </View>
          </View>

          {/* 重要提醒 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>重要提醒</Text>
              <TouchableOpacity onPress={handleViewAllRemindersPress}>
                <Text style={styles.viewAllText}>查看全部</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.remindersList}>
              {importantReminders.map(renderReminderItem)}
            </View>
          </View>

          {/* 快速操作 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>快速操作</Text>
            <View style={styles.quickActionsGrid}>
              {renderQuickActionButton(
                'file-import',
                '#3B82F6',
                '导入合同',
                '快速导入新合同',
                handleImportContractPress
              )}
              {renderQuickActionButton(
                'plus',
                '#10B981',
                '新建任务',
                '创建跟单任务',
                handleCreateTaskPress
              )}
              {renderQuickActionButton(
                'file-lines',
                '#8B5CF6',
                '生成单证',
                '制作外贸单证',
                handleGenerateDocPress
              )}
              {renderQuickActionButton(
                'camera',
                '#06B6D4',
                '扫描上传',
                '扫描纸质单证',
                handleScanDocPress
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;

