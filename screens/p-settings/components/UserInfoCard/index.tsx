

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface UserInfoCardProps {
  onEditProfile: () => void;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ onEditProfile }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <FontAwesome6 name="user" size={24} color="#3B82F6" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>张经理</Text>
            <Text style={styles.userEmail}>zhang@company.com</Text>
            <Text style={styles.userRole}>跟单员</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
            <FontAwesome6 name="pen" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserInfoCard;

