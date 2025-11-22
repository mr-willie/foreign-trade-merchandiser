

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface Document {
  id: string;
  name: string;
  number: string;
  orderNumber: string;
  type: string;
  status: 'draft' | 'active' | 'expiring' | 'expired' | 'applying';
  uploadTime: string;
  uploadedBy: string;
  icon: string;
  iconColor: string;
}

interface DocumentItemProps {
  document: Document;
  onPress: () => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, onPress }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { text: '已生效', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.2)' };
      case 'draft':
        return { text: '草稿', color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.2)' };
      case 'expiring':
        return { text: '即将到期', color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.2)' };
      case 'expired':
        return { text: '已过期', color: '#6B7280', backgroundColor: 'rgba(107, 114, 128, 0.2)' };
      case 'applying':
        return { text: '申请中', color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.2)' };
      default:
        return { text: '未知', color: '#6B7280', backgroundColor: 'rgba(107, 114, 128, 0.2)' };
    }
  };

  const statusConfig = getStatusConfig(document.status);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: `${document.iconColor}33` }]}>
            <FontAwesome6 
              name={document.icon as any} 
              size={18} 
              color={document.iconColor} 
            />
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.documentName}>{document.name}</Text>
            <Text style={styles.documentNumber}>编号: {document.number}</Text>
            <Text style={styles.orderNumber}>订单号: {document.orderNumber}</Text>
          </View>
        </View>
        
        <View style={[
          styles.statusBadge,
          { backgroundColor: statusConfig.backgroundColor }
        ]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.text}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.uploadTime}>上传时间: {document.uploadTime}</Text>
        <Text style={styles.uploadedBy}>{document.uploadedBy}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DocumentItem;

