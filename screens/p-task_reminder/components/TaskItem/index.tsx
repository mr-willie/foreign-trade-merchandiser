

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

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

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onMarkAsCompleted: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onPress,
  onMarkAsCompleted,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'overdue':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#3B82F6';
      default:
        return '#3B82F6';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高优先级';
      case 'medium':
        return '中优先级';
      case 'low':
        return '低优先级';
      case 'overdue':
        return '已逾期';
      default:
        return '低优先级';
    }
  };

  const priorityColor = getPriorityColor(task.priority);
  const priorityLabel = getPriorityLabel(task.priority);

  const handleMarkAsCompletedPress = (event: any) => {
    event.stopPropagation();
    onMarkAsCompleted();
  };

  return (
    <TouchableOpacity
      style={[
        styles.taskItemContainer,
        { borderLeftColor: priorityColor },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.taskItemContent}>
        <View style={styles.taskItemLeft}>
          <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
          <View style={styles.taskItemRight}>
            <View style={styles.taskItemHeader}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor}33` }]}>
                <Text style={[styles.priorityBadgeText, { color: priorityColor }]}>
                  {priorityLabel}
                </Text>
              </View>
            </View>
            <Text style={styles.taskDescription}>{task.description}</Text>
            <Text style={styles.taskRelatedInfo}>{task.relatedInfo}</Text>
            <View style={styles.taskItemFooter}>
              <Text style={[styles.taskDeadline, { color: priorityColor }]}>
                {task.deadline}
              </Text>
              <TouchableOpacity
                style={styles.markDoneButton}
                onPress={handleMarkAsCompletedPress}
                activeOpacity={0.8}
              >
                <Text style={styles.markDoneButtonText}>标记已处理</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TaskItem;

