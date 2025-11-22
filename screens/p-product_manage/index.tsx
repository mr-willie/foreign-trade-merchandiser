

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert, RefreshControl, Dimensions, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface Product {
  id: string;
  name: string;
  hsCode: string;
  specification: string;
  price: number;
  icon: string;
  iconColor: string;
}

interface FilterState {
  productTypes: string[];
}

interface SortOption {
  value: string;
  label: string;
}

const ProductManagePage: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    productTypes: ['电子产品'],
  });
  const [selectedSortOption, setSelectedSortOption] = useState('name-asc');

  const longPressTimerRef = useRef<number | null>(null);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 'prod001',
      name: '智能手机主板',
      hsCode: '8517121000',
      specification: '适用于iPhone 14系列',
      price: 285.00,
      icon: 'microchip',
      iconColor: '#3B82F6',
    },
    {
      id: 'prod002',
      name: '笔记本电脑',
      hsCode: '8471300000',
      specification: '15.6英寸，i7处理器',
      price: 6899.00,
      icon: 'laptop',
      iconColor: '#8B5CF6',
    },
    {
      id: 'prod003',
      name: '数码摄像头',
      hsCode: '8525803000',
      specification: '4K高清，USB接口',
      price: 156.00,
      icon: 'camera',
      iconColor: '#06B6D4',
    },
    {
      id: 'prod004',
      name: '无线蓝牙耳机',
      hsCode: '8518300000',
      specification: '降噪版，续航20小时',
      price: 299.00,
      icon: 'headphones',
      iconColor: '#10B981',
    },
    {
      id: 'prod005',
      name: '平板电脑',
      hsCode: '8471300000',
      specification: '10.2英寸，64GB存储',
      price: 2399.00,
      icon: 'tablet-screen-button',
      iconColor: '#F59E0B',
    },
    {
      id: 'prod006',
      name: '激光打印机',
      hsCode: '8443120000',
      specification: 'A4幅面，黑白打印',
      price: 1299.00,
      icon: 'printer',
      iconColor: '#3B82F6',
    },
  ]);

  const sortOptions: SortOption[] = [
    { value: 'name-asc', label: '产品名称 A-Z' },
    { value: 'name-desc', label: '产品名称 Z-A' },
    { value: 'price-asc', label: '价格从低到高' },
    { value: 'price-desc', label: '价格从高到低' },
    { value: 'recent', label: '最近添加' },
  ];

  const productTypes = ['电子产品', '机械设备', '消费品'];

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const handleAddProductPress = () => {
    // 跳转到新建产品页面
    console.log('跳转到新建产品页面');
  };

  const handleProductPress = (productId: string) => {
    if (isContextMenuVisible) {
      setIsContextMenuVisible(false);
      return;
    }
    router.push(`/p-product_detail?productId=${productId}`);
  };

  const handleProductLongPress = (productId: string, x: number, y: number) => {
    setSelectedProductId(productId);
    setContextMenuPosition({ x, y });
    setIsContextMenuVisible(true);
  };

  const handleEditProduct = () => {
    setIsContextMenuVisible(false);
    console.log('编辑产品，产品ID:', selectedProductId);
  };

  const handleDeleteProduct = () => {
    setIsContextMenuVisible(false);
    Alert.alert(
      '确认删除',
      '确定要删除这个产品吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            setProducts(prevProducts => 
              prevProducts.filter(product => product.id !== selectedProductId)
            );
          },
        },
      ]
    );
  };

  const handleFilterPress = () => {
    setIsFilterModalVisible(true);
  };

  const handleSortPress = () => {
    setIsSortModalVisible(true);
  };

  const handleApplyFilter = () => {
    setIsFilterModalVisible(false);
    console.log('应用筛选条件:', filterState);
  };

  const handleResetFilter = () => {
    setFilterState({ productTypes: [] });
  };

  const handleSortOptionPress = (value: string) => {
    setSelectedSortOption(value);
    setIsSortModalVisible(false);
    console.log('排序方式:', value);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    // 模拟加载更多数据
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 1000);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleProductPress(item.id)}
      onLongPress={(event) => {
        const { pageX, pageY } = event.nativeEvent;
        handleProductLongPress(item.id, pageX, pageY);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.productItemContent}>
        <View style={styles.productItemLeft}>
          <View style={[styles.productIconContainer, { backgroundColor: `${item.iconColor}20` }]}>
            <FontAwesome6 name={item.icon} size={20} color={item.iconColor} />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productHsCode}>HS编码: {item.hsCode}</Text>
            <Text style={styles.productSpecification}>规格: {item.specification}</Text>
          </View>
        </View>
        <View style={styles.productPriceContainer}>
          <Text style={styles.productPrice}>¥{item.price.toLocaleString()}</Text>
          <Text style={styles.productPriceLabel}>单价</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={isFilterModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsFilterModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.filterModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>筛选条件</Text>
            <TouchableOpacity
              onPress={() => setIsFilterModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <FontAwesome6 name="xmark" size={20} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>产品类型</Text>
            <View style={styles.filterOptionsContainer}>
              {productTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.filterOption}
                  onPress={() => {
                    setFilterState(prev => ({
                      productTypes: prev.productTypes.includes(type)
                        ? prev.productTypes.filter(t => t !== type)
                        : [...prev.productTypes, type]
                    }));
                  }}
                >
                  <View style={styles.checkboxContainer}>
                    <View style={[
                      styles.checkbox,
                      filterState.productTypes.includes(type) && styles.checkboxChecked
                    ]}>
                      {filterState.productTypes.includes(type) && (
                        <FontAwesome6 name="check" size={12} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.filterOptionText}>{type}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetFilter}
            >
              <Text style={styles.resetButtonText}>重置</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilter}
            >
              <Text style={styles.applyButtonText}>应用筛选</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderSortModal = () => (
    <Modal
      visible={isSortModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsSortModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setIsSortModalVisible(false)}
      >
        <View style={styles.sortModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>排序方式</Text>
            <TouchableOpacity
              onPress={() => setIsSortModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <FontAwesome6 name="xmark" size={20} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>
          </View>

          <View style={styles.sortOptionsContainer}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.sortOption}
                onPress={() => handleSortOptionPress(option.value)}
              >
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radio,
                    selectedSortOption === option.value && styles.radioSelected
                  ]}>
                    {selectedSortOption === option.value && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text style={styles.sortOptionText}>{option.label}</Text>
                </View>
                {selectedSortOption === option.value && (
                  <FontAwesome6 name="check" size={16} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderContextMenu = () => {
    if (!isContextMenuVisible) return null;

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const menuWidth = 160;
    const menuHeight = 100;

    let { x, y } = contextMenuPosition;

    // 确保菜单不超出屏幕
    if (x + menuWidth > screenWidth) {
      x = x - menuWidth;
    }
    if (y + menuHeight > screenHeight) {
      y = y - menuHeight;
    }

    return (
      <View style={[styles.contextMenu, { left: x, top: y }]}>
        <TouchableOpacity
          style={styles.contextMenuItem}
          onPress={handleEditProduct}
        >
          <FontAwesome6 name="pen-to-square" size={14} color="#FFFFFF" style={styles.contextMenuIcon} />
          <Text style={styles.contextMenuText}>编辑产品</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contextMenuItem}
          onPress={handleDeleteProduct}
        >
          <FontAwesome6 name="trash" size={14} color="#FFFFFF" style={styles.contextMenuIcon} />
          <Text style={styles.contextMenuText}>删除产品</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderListHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>产品管理</Text>
        <Text style={styles.pageSubtitle}>管理公司产品信息</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddProductPress}
      >
        <FontAwesome6 name="plus" size={14} color="#FFFFFF" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>添加产品</Text>
      </TouchableOpacity>

      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <FontAwesome6 name="magnifying-glass" size={16} color="rgba(255, 255, 255, 0.6)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索产品名称、HS编码、规格..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchText}
            onChangeText={handleSearchTextChange}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={handleClearSearch}
            >
              <FontAwesome6 name="xmark" size={14} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterSortContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
          >
            <FontAwesome6 name="filter" size={14} color="rgba(255, 255, 255, 0.6)" style={styles.filterButtonIcon} />
            <Text style={styles.filterButtonText}>筛选</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={handleSortPress}
          >
            <FontAwesome6 name="sort" size={14} color="rgba(255, 255, 255, 0.6)" style={styles.sortButtonIcon} />
            <Text style={styles.sortButtonText}>排序</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.productsHeader}>
        <Text style={styles.productsTitle}>产品列表</Text>
        <Text style={styles.productsCount}>共 {products.length} 个产品</Text>
      </View>
    </View>
  );

  const renderListFooter = () => (
    <View style={styles.loadMoreContainer}>
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={handleLoadMore}
        disabled={isLoadingMore}
      >
        <FontAwesome6 
          name={isLoadingMore ? "spinner" : "chevron-down"} 
          size={14} 
          color="#FFFFFF" 
          style={[styles.loadMoreIcon, isLoadingMore && styles.spinningIcon]} 
        />
        <Text style={styles.loadMoreText}>
          {isLoadingMore ? '加载中...' : '加载更多'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          ListFooterComponent={renderListFooter}
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

        {renderFilterModal()}
        {renderSortModal()}
        {renderContextMenu()}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProductManagePage;

