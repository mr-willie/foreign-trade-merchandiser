

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

interface SortDropdownProps {
  onSortChange: (sortOption: string) => void;
  currentSort: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange, currentSort }) => {
  const sortOptions = [
    { label: '最近更新 (降序)', value: 'updated_desc' },
    { label: '最近更新 (升序)', value: 'updated_asc' },
    { label: '订单号 (降序)', value: 'order_no_desc' },
    { label: '订单号 (升序)', value: 'order_no_asc' },
    { label: '金额 (降序)', value: 'amount_desc' },
    { label: '金额 (升序)', value: 'amount_asc' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>排序方式</Text>
      
      <View style={styles.optionsContainer}>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              currentSort === option.value && styles.selectedOption,
            ]}
            onPress={() => onSortChange(option.value)}
            activeOpacity={0.7}
          >
            <View style={styles.radioContainer}>
              <View
                style={[
                  styles.radio,
                  currentSort === option.value && styles.selectedRadio,
                ]}
              />
            </View>
            <Text
              style={[
                styles.optionText,
                currentSort === option.value && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SortDropdown;

