

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface MetricCardProps {
  icon: string;
  iconColor: string;
  value: string;
  label: string;
  change: string;
  changeType: 'positive' | 'negative';
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  iconColor,
  value,
  label,
  change,
  changeType,
}) => {
  const handlePress = () => {
    console.log(`Metric card pressed: ${label}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}33` }]}>
          <FontAwesome6 name={icon} size={16} color={iconColor} />
        </View>
        <Text style={[styles.change, { color: changeType === 'positive' ? '#10B981' : '#EF4444' }]}>
          {change}
        </Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default MetricCard;

