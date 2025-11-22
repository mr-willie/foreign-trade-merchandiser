

import React from 'react';
import { View, Text, Modal } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface ToastProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const Toast: React.FC<ToastProps> = ({ visible, message, type }) => {
  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'circle-check';
      case 'error':
        return 'circle-exclamation';
      case 'warning':
        return 'triangle-exclamation';
      case 'info':
        return 'circle-info';
      default:
        return 'circle-check';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
      default:
        return '#10B981';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      pointerEvents="none"
    >
      <View style={styles.container}>
        <View style={styles.toast}>
          <View style={styles.content}>
            <FontAwesome6
              name={getIconName()}
              size={16}
              color={getIconColor()}
              style={styles.icon}
            />
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Toast;

