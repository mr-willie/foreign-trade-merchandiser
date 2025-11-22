

import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

interface StaffEfficiencyItemProps {
  rank: number;
  name: string;
  rate: string;
  rankColor: string;
}

const StaffEfficiencyItem: React.FC<StaffEfficiencyItemProps> = ({
  rank,
  name,
  rate,
  rankColor,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[styles.rankContainer, { backgroundColor: `${rankColor}33` }]}>
          <Text style={[styles.rankText, { color: rankColor }]}>{rank}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.rate}>{rate}</Text>
        <Text style={styles.rateLabel}>完成率</Text>
      </View>
    </View>
  );
};

export default StaffEfficiencyItem;

