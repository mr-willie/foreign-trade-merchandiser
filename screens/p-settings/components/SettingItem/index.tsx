

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface SettingItemProps {
  icon: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  rightText?: string;
  showArrow?: boolean;
  isDanger?: boolean;
  centerContent?: boolean;
  onPress: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  iconColor,
  title,
  subtitle,
  rightText,
  showArrow = false,
  isDanger = false,
  centerContent = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isDanger && styles.dangerContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.content, centerContent && styles.centeredContent]}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}33` }]}>
            <FontAwesome6 name={icon} size={16} color={iconColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, isDanger && styles.dangerTitle]}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.rightSection}>
          {rightText && <Text style={styles.rightText}>{rightText}</Text>}
          {showArrow && (
            <FontAwesome6 name="chevron-right" size={14} color="rgba(255, 255, 255, 0.6)" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SettingItem;

