

import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

const BarChart: React.FC = () => {
  const chartData = [
    { month: '1月', height: 60 },
    { month: '2月', height: 80 },
    { month: '3月', height: 45 },
    { month: '4月', height: 90 },
    { month: '5月', height: 70 },
    { month: '6月', height: 95 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={[styles.bar, { height: `${item.height}%` }]} />
            <Text style={styles.monthLabel}>{item.month}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default BarChart;

