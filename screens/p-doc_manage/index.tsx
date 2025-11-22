

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert, RefreshControl, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './styles';
import DocumentItem from './components/DocumentItem';
import FilterModal from './components/FilterModal';
import SortModal from './components/SortModal';

interface Document {
  id: string;
  name: string;
  number: string;
  orderNumber: string;
  type: string;
  status: 'draft' | 'active' | 'expiring' | 'expired' | 'applying';
  uploadTime: string;
  uploadedBy: string;
  icon: string;
  iconColor: string;
}

const DocumentManagePage: React.FC = () => {
  const router = useRouter();
  
  const [searchText, setSearchText] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'DOC-001',
      name: '商业发票',
      number: 'INV-2024001',
      orderNumber: 'PO-2024001',
      type: 'invoice',
      status: 'active',
      uploadTime: '2024-01-15 14:30',
      uploadedBy: '张经理',
      icon: 'file-invoice',
      iconColor: '#3B82F6',
    },
    {
      id: 'DOC-002',
      name: '提单',
      number: 'BOL-2024001',
      orderNumber: 'PO-2024001',
      type: 'bill',
      status: 'draft',
      uploadTime: '2024-01-15 10:15',
      uploadedBy: '李助理',
      icon: 'ship',
      iconColor: '#8B5CF6',
    },
    {
      id: 'DOC-003',
      name: '商检证书',
      number: 'CI-2024001',
      orderNumber: 'PO-2024002',
      type: 'certificate',
      status: 'expiring',
      uploadTime: '2024-01-14 16:45',
      uploadedBy: '张经理',
      icon: 'certificate',
      iconColor: '#06B6D4',
    },
    {
      id: 'DOC-004',
      name: '报关单',
      number: 'CUS-2024001',
      orderNumber: 'PO-2024003',
      type: 'customs',
      status: 'active',
      uploadTime: '2024-01-14 09:20',
      uploadedBy: '王专员',
      icon: 'file-lines',
      iconColor: '#3B82F6',
    },
    {
      id: 'DOC-005',
      name: '保险单',
      number: 'INS-2024001',
      orderNumber: 'PO-2024004',
      type: 'insurance',
      status: 'active',
      uploadTime: '2024-01-13 15:30',
      uploadedBy: '李助理',
      icon: 'shield-halved',
      iconColor: '#F59E0B',
    },
    {
      id: 'DOC-006',
      name: '产地证',
      number: 'COO-2024001',
      orderNumber: 'PO-2024005',
      type: 'origin',
      status: 'applying',
      uploadTime: '2024-01-13 11:15',
      uploadedBy: '张经理',
      icon: 'id-card',
      iconColor: '#3B82F6',
    },
  ]);

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchText.toLowerCase()) ||
    doc.number.toLowerCase().includes(searchText.toLowerCase()) ||
    doc.orderNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDocumentPress = useCallback((documentId: string) => {
    router.push(`/p-doc_detail?documentId=${documentId}`);
  }, [router]);

  const handleFilterPress = useCallback(() => {
    setIsFilterModalVisible(true);
  }, []);

  const handleSortPress = useCallback(() => {
    setIsSortModalVisible(true);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 模拟刷新数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('刷新数据');
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      // 模拟加载更多数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('加载更多数据');
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

  const handleCloseFilterModal = useCallback(() => {
    setIsFilterModalVisible(false);
  }, []);

  const handleCloseSortModal = useCallback(() => {
    setIsSortModalVisible(false);
  }, []);

  const handleApplyFilter = useCallback((filters: any) => {
    setIsFilterModalVisible(false);
    console.log('应用筛选条件:', filters);
  }, []);

  const handleApplySort = useCallback((sortType: string) => {
    setIsSortModalVisible(false);
    console.log('应用排序:', sortType);
  }, []);

  const renderDocumentItem = useCallback(({ item }: { item: Document }) => (
    <DocumentItem
      document={item}
      onPress={() => handleDocumentPress(item.id)}
    />
  ), [handleDocumentPress]);

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>单证管理</Text>
        <Text style={styles.documentCount}>共 {documents.length} 个单证</Text>
      </View>
      
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleFilterPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="filter" size={16} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSortPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="sort" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <FontAwesome6 name="magnifying-glass" size={16} color="rgba(255, 255, 255, 0.6)" />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索单证名称、编号、订单号..."
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
    </View>
  ), [documents.length, searchText, handleFilterPress, handleSortPress]);

  const renderFooter = useCallback(() => (
    <View style={styles.loadMoreContainer}>
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={handleLoadMore}
        activeOpacity={0.7}
        disabled={isLoadingMore}
      >
        <FontAwesome6 
          name="chevron-down" 
          size={14} 
          color="#FFFFFF" 
          style={styles.loadMoreIcon} 
        />
        <Text style={styles.loadMoreText}>
          {isLoadingMore ? '加载中...' : '加载更多'}
        </Text>
      </TouchableOpacity>
    </View>
  ), [handleLoadMore, isLoadingMore]);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={filteredDocuments}
          renderItem={renderDocumentItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          }
        />

        <FilterModal
          visible={isFilterModalVisible}
          onClose={handleCloseFilterModal}
          onApply={handleApplyFilter}
        />

        <SortModal
          visible={isSortModalVisible}
          onClose={handleCloseSortModal}
          onApply={handleApplySort}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default DocumentManagePage;

