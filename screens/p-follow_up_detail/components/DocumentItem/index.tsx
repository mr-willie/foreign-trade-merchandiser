

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface DocumentData {
  id: string;
  title: string;
  documentNumber: string;
  uploadTime: string;
  status: string;
  iconName: string;
  iconColor: string;
  statusColor: string;
}

interface DocumentItemProps {
  document: DocumentData;
  onPress: (documentId: string) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, onPress }) => {
  const getStatusBackgroundColor = (statusColor: string) => {
    // 将颜色转换为rgba并设置透明度
    const hex = statusColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };

  const handlePress = () => {
    onPress(document.id);
  };

  return (
    <TouchableOpacity
      style={styles.documentItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.documentContent}>
        <View style={[styles.iconContainer, { backgroundColor: getStatusBackgroundColor(document.iconColor) }]}>
          <FontAwesome6
            name={document.iconName as any}
            size={18}
            color={document.iconColor}
          />
        </View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentTitle}>{document.title}</Text>
          <Text style={styles.documentSubtitle}>
            {document.documentNumber} | 上传时间: {document.uploadTime}
          </Text>
        </View>
        <View style={styles.documentActions}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBackgroundColor(document.statusColor) }]}>
            <Text style={[styles.statusText, { color: document.statusColor }]}>
              {document.status}
            </Text>
          </View>
          <FontAwesome6
            name="chevron-right"
            size={14}
            color="rgba(255, 255, 255, 0.5)"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DocumentItem;

