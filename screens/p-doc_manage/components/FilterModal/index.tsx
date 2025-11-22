

import React, { useState, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView, } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
  const [documentTypeFilters, setDocumentTypeFilters] = useState({
    all: true,
    invoice: false,
    bill: false,
    customs: false,
    certificate: false,
  });

  const [statusFilters, setStatusFilters] = useState({
    all: true,
    draft: false,
    active: false,
    expiring: false,
    expired: false,
  });

  const handleDocumentTypeChange = useCallback((type: string) => {
    setDocumentTypeFilters(prev => {
      const newFilters = { ...prev };
      if (type === 'all') {
        Object.keys(newFilters).forEach(key => {
          newFilters[key as keyof typeof newFilters] = key === 'all';
        });
      } else {
        newFilters.all = false;
        newFilters[type as keyof typeof newFilters] = !newFilters[type as keyof typeof newFilters];
      }
      return newFilters;
    });
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setStatusFilters(prev => {
      const newFilters = { ...prev };
      if (status === 'all') {
        Object.keys(newFilters).forEach(key => {
          newFilters[key as keyof typeof newFilters] = key === 'all';
        });
      } else {
        newFilters.all = false;
        newFilters[status as keyof typeof newFilters] = !newFilters[status as keyof typeof newFilters];
      }
      return newFilters;
    });
  }, []);

  const handleReset = useCallback(() => {
    setDocumentTypeFilters({
      all: true,
      invoice: false,
      bill: false,
      customs: false,
      certificate: false,
    });
    
    setStatusFilters({
      all: true,
      draft: false,
      active: false,
      expiring: false,
      expired: false,
    });
  }, []);

  const handleApply = useCallback(() => {
    const filters = {
      documentTypes: documentTypeFilters,
      statuses: statusFilters,
    };
    onApply(filters);
  }, [documentTypeFilters, statusFilters, onApply]);

  const documentTypeOptions = [
    { key: 'all', label: '全部' },
    { key: 'invoice', label: '商业发票' },
    { key: 'bill', label: '提单' },
    { key: 'customs', label: '报关单' },
    { key: 'certificate', label: '商检证书' },
  ];

  const statusOptions = [
    { key: 'all', label: '全部' },
    { key: 'draft', label: '草稿' },
    { key: 'active', label: '已生效' },
    { key: 'expiring', label: '即将到期' },
    { key: 'expired', label: '已过期' },
  ];

  const renderCheckbox = useCallback((checked: boolean) => (
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && (
        <FontAwesome6 name="check" size={12} color="#FFFFFF" />
      )}
    </View>
  ), []);

  const renderFilterSection = useCallback((
    title: string,
    options: Array<{ key: string; label: string }>,
    values: any,
    onValueChange: (key: string) => void
  ) => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={styles.optionRow}
            onPress={() => onValueChange(option.key)}
            activeOpacity={0.7}
          >
            {renderCheckbox(values[option.key])}
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  ), [renderCheckbox]);

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
                <Text style={styles.modalTitle}>筛选条件</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <FontAwesome6 name="xmark" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderFilterSection(
                  '单证类型',
                  documentTypeOptions,
                  documentTypeFilters,
                  handleDocumentTypeChange
                )}

                {renderFilterSection(
                  '状态',
                  statusOptions,
                  statusFilters,
                  handleStatusChange
                )}
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleReset}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resetButtonText}>重置</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApply}
                  activeOpacity={0.7}
                >
                  <Text style={styles.applyButtonText}>应用筛选</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FilterModal;

