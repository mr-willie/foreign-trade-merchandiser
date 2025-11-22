

import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

interface ProgressItem {
  label: string;
  percentage: number;
  color: string;
}

interface ProgressChartProps {
  data: ProgressItem[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.progressItem}>
          <View style={styles.labelContainer}>
            <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
            <Text style={styles.label}>{item.label}</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { backgroundColor: item.color, width: `${item.percentage}%` }]} />
            </View>
            <Text style={styles.percentage}>{item.percentage}%</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ProgressChart;

