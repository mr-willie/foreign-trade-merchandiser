

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from './styles';

interface FilterDropdownProps {
  onApply: (status: string, customer: string) => void;
  onReset: () => void;
  currentStatus: string;
  currentCustomer: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  onApply,
  onReset,
  currentStatus,
  currentCustomer,
}) => {
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [localCustomer, setLocalCustomer] = useState(currentCustomer);

  useEffect(() => {
    setLocalStatus(currentStatus);
    setLocalCustomer(currentCustomer);
  }, [currentStatus, currentCustomer]);

  const statusOptions = [
    { label: '全部状态', value: '' },
    { label: '进行中', value: '进行中' },
    { label: '已完成', value: '已完成' },
    { label: '已取消', value: '已取消' },
    { label: '逾期', value: '逾期' },
  ];

  const customerOptions = [
    { label: '全部客户', value: '' },
    { label: 'ABC贸易公司', value: 'ABC贸易公司' },
    { label: 'DEF制造有限公司', value: 'DEF制造有限公司' },
    { label: 'GHI进出口公司', value: 'GHI进出口公司' },
    { label: 'JKL国际集团', value: 'JKL国际集团' },
  ];

  const handleApply = () => {
    onApply(localStatus, localCustomer);
  };

  const handleReset = () => {
    setLocalStatus('');
    setLocalCustomer('');
    onReset();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>筛选条件</Text>
      
      <View style={styles.filterSection}>
        <Text style={styles.label}>状态</Text>
        <View style={styles.optionsContainer}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                localStatus === option.value && styles.selectedOption,
              ]}
              onPress={() => setLocalStatus(option.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  localStatus === option.value && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.label}>客户</Text>
        <View style={styles.optionsContainer}>
          {customerOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                localCustomer === option.value && styles.selectedOption,
              ]}
              onPress={() => setLocalCustomer(option.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  localCustomer === option.value && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>应用筛选</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.8}
        >
          <Text style={styles.resetButtonText}>重置</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterDropdown;

