

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface FollowUpStepData {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'pending';
  responsiblePerson: string;
  completionTime?: string;
  startTime?: string;
  stepNumber: number;
}

interface FollowUpStepProps {
  step: FollowUpStepData;
  isLast: boolean;
  onProcessStep: (stepId: string) => void;
  onViewDocuments: (type: string) => void;
}

const FollowUpStep: React.FC<FollowUpStepProps> = ({
  step,
  isLast,
  onProcessStep,
  onViewDocuments,
}) => {
  const getStatusConfig = () => {
    switch (step.status) {
      case 'completed':
        return {
          icon: 'check',
          iconColor: '#10B981',
          iconBgColor: 'rgba(16, 185, 129, 0.2)',
          statusText: '已完成',
          statusColor: '#10B981',
          statusBgColor: 'rgba(16, 185, 129, 0.2)',
          titleColor: '#FFFFFF',
          subtitleColor: 'rgba(255, 255, 255, 0.7)',
          buttonColor: '#10B981',
          buttonBgColor: 'rgba(16, 185, 129, 0.1)',
        };
      case 'current':
        return {
          icon: 'play',
          iconColor: '#3B82F6',
          iconBgColor: 'rgba(59, 130, 246, 0.2)',
          statusText: '进行中',
          statusColor: '#3B82F6',
          statusBgColor: 'rgba(59, 130, 246, 0.2)',
          titleColor: '#FFFFFF',
          subtitleColor: 'rgba(255, 255, 255, 0.7)',
          buttonColor: '#3B82F6',
          buttonBgColor: 'rgba(59, 130, 246, 0.1)',
        };
      case 'pending':
        return {
          icon: step.stepNumber.toString(),
          iconColor: 'rgba(255, 255, 255, 0.6)',
          iconBgColor: 'rgba(255, 255, 255, 0.1)',
          statusText: '待处理',
          statusColor: 'rgba(255, 255, 255, 0.6)',
          statusBgColor: 'rgba(255, 255, 255, 0.1)',
          titleColor: 'rgba(255, 255, 255, 0.8)',
          subtitleColor: 'rgba(255, 255, 255, 0.5)',
          buttonColor: 'rgba(255, 255, 255, 0.6)',
          buttonBgColor: 'rgba(255, 255, 255, 0.1)',
        };
      default:
        return {
          icon: step.stepNumber.toString(),
          iconColor: 'rgba(255, 255, 255, 0.6)',
          iconBgColor: 'rgba(255, 255, 255, 0.1)',
          statusText: '待处理',
          statusColor: 'rgba(255, 255, 255, 0.6)',
          statusBgColor: 'rgba(255, 255, 255, 0.1)',
          titleColor: 'rgba(255, 255, 255, 0.8)',
          subtitleColor: 'rgba(255, 255, 255, 0.5)',
          buttonColor: 'rgba(255, 255, 255, 0.6)',
          buttonBgColor: 'rgba(255, 255, 255, 0.1)',
        };
    }
  };

  const statusConfig = getStatusConfig();

  const getSubtitle = () => {
    if (step.status === 'completed' && step.completionTime) {
      return `负责人: ${step.responsiblePerson} | 完成时间: ${step.completionTime}`;
    }
    if (step.status === 'current' && step.startTime) {
      return `负责人: ${step.responsiblePerson} | 开始时间: ${step.startTime}`;
    }
    return `负责人: ${step.responsiblePerson}`;
  };

  const getActionButtons = () => {
    if (step.status === 'completed') {
      return (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: statusConfig.buttonBgColor }]}
          onPress={() => onViewDocuments(step.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionButtonText, { color: statusConfig.buttonColor }]}>
            查看单证
          </Text>
        </TouchableOpacity>
      );
    }
    if (step.status === 'current') {
      return (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: statusConfig.buttonBgColor }]}
            onPress={() => onProcessStep(step.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionButtonText, { color: statusConfig.buttonColor }]}>
              继续办理
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => onViewDocuments(step.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>查看单证</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (step.status === 'pending') {
      return (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: statusConfig.buttonBgColor }]}
          onPress={() => onProcessStep(step.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionButtonText, { color: statusConfig.buttonColor }]}>
            开始办理
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={[styles.stepContainer, !isLast && styles.progressLine]}>
      <View style={styles.stepContent}>
        <View style={[styles.iconContainer, { backgroundColor: statusConfig.iconBgColor }]}>
          {typeof statusConfig.icon === 'string' && statusConfig.icon.length === 1 ? (
            <Text style={[styles.iconText, { color: statusConfig.iconColor }]}>
              {statusConfig.icon}
            </Text>
          ) : (
            <FontAwesome6
              name={statusConfig.icon as any}
              size={16}
              color={statusConfig.iconColor}
            />
          )}
        </View>
        <View style={styles.stepDetails}>
          <View style={styles.stepHeader}>
            <Text style={[styles.stepTitle, { color: statusConfig.titleColor }]}>
              {step.title}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.statusBgColor }]}>
              <Text style={[styles.statusText, { color: statusConfig.statusColor }]}>
                {statusConfig.statusText}
              </Text>
            </View>
          </View>
          <Text style={[styles.stepSubtitle, { color: statusConfig.subtitleColor }]}>
            {getSubtitle()}
          </Text>
          <View style={styles.actionContainer}>
            {getActionButtons()}
          </View>
        </View>
      </View>
    </View>
  );
};

export default FollowUpStep;

