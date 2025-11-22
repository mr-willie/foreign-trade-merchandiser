

import React, { useState, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (sortType: string) => void;
}

const SortModal: React.FC<SortModalProps> = ({ visible, onClose, onApply }) => {
  const [selectedSortType, setSelectedSortType] = useState('upload_time_desc');

  const sortOptions = [
    {
      value: 'upload_time_desc',
      label: '按上传时间（最新）',
    },
    {
      value: 'upload_time_asc',
      label: '按上传时间（最早）',
    },
    {
      value: 'document_type',
      label: '按单证类型',
    },
    {
      value: 'status',
      label: '按状态',
    },
  ];

  const handleSortTypeChange = useCallback((value: string) => {
    setSelectedSortType(value);
  }, []);

  const handleApply = useCallback(() => {
    onApply(selectedSortType);
  }, [selectedSortType, onApply]);

  const renderRadioButton = useCallback((checked: boolean) => (
    <View style={[styles.radioButton, checked && styles.radioButtonChecked]}>
      {checked && <View style={styles.radioButtonInner} />}
    </View>
  ), []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.modalTitle}>排序方式</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <FontAwesome6 name="xmark" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsContainer}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.optionRow}
                    onPress={() => handleSortTypeChange(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    {renderRadioButton(selectedSortType === option.value)}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApply}
                  activeOpacity={0.7}
                >
                  <Text style={styles.applyButtonText}>确定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SortModal;

