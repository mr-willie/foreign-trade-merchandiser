

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './styles';

interface FilterTabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const FilterTab: React.FC<FilterTabProps> = ({
  label,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.filterTabContainer,
        isActive && styles.filterTabActive,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.filterTabText,
        isActive && styles.filterTabTextActive,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default FilterTab;

