

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

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

interface FollowUpItemProps {
  task: FollowUpTask;
  onPress: () => void;
}

const FollowUpItem: React.FC<FollowUpItemProps> = ({ task, onPress }) => {
  const formatAmount = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const getProgressColor = () => {
    if (task.status === '已完成') return '#10B981';
    if (task.status === '逾期') return '#EF4444';
    return task.statusColor;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: `${task.iconColor}33` }]}>
            <FontAwesome6 
              name={task.iconName as any} 
              size={16} 
              color={task.iconColor} 
            />
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.title}>
              {task.customerName} - {task.productName}
            </Text>
            <Text style={styles.orderNo}>订单号: {task.orderNo}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${task.statusColor}33` }]}>
          <Text style={[styles.statusText, { color: task.statusColor }]}>
            {task.status}
          </Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>金额: {formatAmount(task.amount)}</Text>
        <Text style={styles.detailText}>客户: {task.customerName}</Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.detailText}>
          {task.status === '已完成' && task.completedTime 
            ? `完成时间: ${task.completedTime}` 
            : `最近更新: ${task.lastUpdated}`
          }
        </Text>
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>进度: {task.progress}%</Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${task.progress}%`,
                  backgroundColor: getProgressColor(),
                }
              ]} 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FollowUpItem;

