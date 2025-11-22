

import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface ProcessTimeItemProps {
  icon: string;
  iconColor: string;
  label: string;
  time: string;
}

const ProcessTimeItem: React.FC<ProcessTimeItemProps> = ({
  icon,
  iconColor,
  label,
  time,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}33` }]}>
          <FontAwesome6 name={icon} size={14} color={iconColor} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

export default ProcessTimeItem;

