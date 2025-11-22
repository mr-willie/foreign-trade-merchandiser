

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import styles from './styles';

interface ContractFormData {
  contractNo: string;
  customerName: string;
  totalAmount: string;
  currency: string;
  deliveryDate: string;
  paymentTerms: string;
  productDescription: string;
  contractRemarks: string;
}

interface UploadProgress {
  visible: boolean;
  percentage: number;
  text: string;
}

interface ParseStatus {
  visible: boolean;
  success: boolean;
  message: string;
}

const ImportContractScreen: React.FC = () => {
  const router = useRouter();
  
  // 表单数据状态
  const [contractFormData, setContractFormData] = useState<ContractFormData>({
    contractNo: '',
    customerName: '',
    totalAmount: '',
    currency: 'USD',
    deliveryDate: '',
    paymentTerms: '',
    productDescription: '',
    contractRemarks: '',
  });

  // 上传相关状态
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    visible: false,
    percentage: 0,
    text: '上传中...',
  });

  const [parseStatus, setParseStatus] = useState<ParseStatus>({
    visible: false,
    success: false,
    message: '',
  });

  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  // 进度定时器引用
  const progressIntervalRef = useRef<number | null>(null);

  // 初始化页面
  React.useEffect(() => {
    initializePage();
  }, []);

  const initializePage = () => {
    // 设置默认日期为今天往后30天
    const today = new Date();
    today.setDate(today.getDate() + 30);
    const defaultDate = today.toISOString().split('T')[0];
    setContractFormData(prev => ({ ...prev, deliveryDate: defaultDate }));
  };

  // 返回按钮处理
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  // 选择文件
  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        handleFileUpload(file);
      }
    } catch (error) {
      Alert.alert('错误', '选择文件时出现错误');
    }
  };

  // 拍照上传
  const handleCameraPress = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限不足', '需要相机权限才能拍照');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        handleFileUpload(file);
      }
    } catch (error) {
      Alert.alert('错误', '拍照时出现错误');
    }
  };

  // 文件上传处理
  const handleFileUpload = (file: DocumentPicker.DocumentPickerAsset | ImagePicker.ImagePickerAsset) => {
    // 验证文件大小（10MB）
    if (file.size && file.size > 10 * 1024 * 1024) {
      Alert.alert('文件过大', '文件大小不能超过 10MB');
      return;
    }

    setSelectedFileName(file.name || '未知文件');
    showUploadProgress();
    simulateUploadProgress();
    
    // 模拟文件解析
    setTimeout(() => {
      hideUploadProgress();
      simulateFileParsing();
    }, 2000);
  };

  // 显示上传进度
  const showUploadProgress = () => {
    setUploadProgress({
      visible: true,
      percentage: 0,
      text: '上传中...',
    });
  };

  // 隐藏上传进度
  const hideUploadProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setUploadProgress(prev => ({ ...prev, visible: false }));
  };

  // 模拟上传进度
  const simulateUploadProgress = () => {
    let progress = 0;
    progressIntervalRef.current = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
      setUploadProgress(prev => ({
        ...prev,
        percentage: progress,
        text: `上传中... ${Math.round(progress)}%`,
      }));
    }, 200) as unknown as number;
  };

  // 模拟文件解析
  const simulateFileParsing = () => {
    // 模拟80%的成功率
    const success = Math.random() > 0.2;
    
    setParseStatus({
      visible: true,
      success,
      message: success ? '已自动填充合同信息，请确认并补充' : '请手动填写合同信息',
    });
    
    if (success) {
      fillFormWithMockData();
    }
  };

  // 填充模拟数据
  const fillFormWithMockData = () => {
    const mockData: ContractFormData = {
      contractNo: 'CONTRACT-2024-001',
      customerName: 'ABC贸易有限公司',
      totalAmount: '58000.00',
      currency: 'USD',
      deliveryDate: '2024-03-15',
      paymentTerms: 'L/C',
      productDescription: '电子产品一批，包括智能手机1000台，平板电脑500台',
      contractRemarks: '要求使用海运，目的港为纽约港',
    };

    setContractFormData(mockData);
  };

  // 表单字段更新
  const updateFormField = (field: keyof ContractFormData, value: string) => {
    setContractFormData(prev => ({ ...prev, [field]: value }));
  };

  // 表单验证
  const validateForm = (): boolean => {
    const requiredFields: (keyof ContractFormData)[] = ['contractNo', 'customerName', 'totalAmount', 'deliveryDate'];
    
    return requiredFields.every(field => {
      const value = contractFormData[field];
      return value && value.trim() !== '';
    });
  };

  // 确认导入
  const handleConfirmImport = async () => {
    if (!validateForm()) {
      Alert.alert('提示', '请填写必填字段');
      return;
    }

    setIsConfirmLoading(true);

    try {
      // 模拟导入过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 生成模拟订单ID
      const orderId = 'ORDER-' + Date.now();
      
      Alert.alert('成功', '合同导入成功！', [
        {
          text: '确定',
          onPress: () => {
            router.push(`/p-follow_up_detail?orderId=${orderId}`);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '导入失败，请重试');
    } finally {
      setIsConfirmLoading(false);
    }
  };

  // 重置表单
  const handleResetForm = () => {
    Alert.alert(
      '确认重置',
      '确定要重置表单吗？所有已填写的信息将被清空。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => {
            initializePage();
            setContractFormData({
              contractNo: '',
              customerName: '',
              totalAmount: '',
              currency: 'USD',
              deliveryDate: '',
              paymentTerms: '',
              productDescription: '',
              contractRemarks: '',
            });
            setParseStatus({ visible: false, success: false, message: '' });
            setSelectedFileName('');
          },
        },
      ]
    );
  };

  // 渲染货币选择器
  const renderCurrencySelector = () => {
    const currencies = [
      { label: 'USD', value: 'USD' },
      { label: 'CNY', value: 'CNY' },
      { label: 'EUR', value: 'EUR' },
      { label: 'GBP', value: 'GBP' },
    ];

    return (
      <View style={styles.currencySelector}>
        {currencies.map((currency) => (
          <TouchableOpacity
            key={currency.value}
            style={[
              styles.currencyOption,
              contractFormData.currency === currency.value && styles.currencyOptionSelected,
            ]}
            onPress={() => updateFormField('currency', currency.value)}
          >
            <Text
              style={[
                styles.currencyOptionText,
                contractFormData.currency === currency.value && styles.currencyOptionTextSelected,
              ]}
            >
              {currency.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // 渲染付款方式选择器
  const renderPaymentTermsSelector = () => {
    const paymentTerms = [
      { label: '请选择付款方式', value: '' },
      { label: '电汇 (T/T)', value: 'T/T' },
      { label: '信用证 (L/C)', value: 'L/C' },
      { label: '付款交单 (D/P)', value: 'D/P' },
      { label: '承兑交单 (D/A)', value: 'D/A' },
      { label: '赊销 (O/A)', value: 'O/A' },
    ];

    return (
      <View style={styles.paymentTermsSelector}>
        {paymentTerms.map((term) => (
          <TouchableOpacity
            key={term.value}
            style={[
              styles.paymentTermOption,
              contractFormData.paymentTerms === term.value && styles.paymentTermOptionSelected,
            ]}
            onPress={() => updateFormField('paymentTerms', term.value)}
          >
            <Text
              style={[
                styles.paymentTermOptionText,
                contractFormData.paymentTerms === term.value && styles.paymentTermOptionTextSelected,
              ]}
            >
              {term.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部导航 */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.pageTitle}>导入合同</Text>
              <Text style={styles.pageSubtitle}>快速导入新合同并创建跟单任务</Text>
            </View>
          </View>

          {/* 文件上传区域 */}
          <View style={styles.uploadSection}>
            <TouchableOpacity style={styles.uploadArea} onPress={handleSelectFile}>
              <View style={styles.uploadIcon}>
                <FontAwesome6 name="cloud-arrow-up" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.uploadTitle}>点击上传合同文件</Text>
              <Text style={styles.uploadDescription}>支持 PDF、图片格式，文件大小不超过 10MB</Text>
              {selectedFileName ? (
                <Text style={styles.selectedFileName}>已选择：{selectedFileName}</Text>
              ) : null}
              <View style={styles.uploadOptions}>
                <TouchableOpacity style={styles.uploadButton} onPress={handleSelectFile}>
                  <FontAwesome6 name="folder-open" size={16} color="#FFFFFF" />
                  <Text style={styles.uploadButtonText}>选择文件</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadButton} onPress={handleCameraPress}>
                  <FontAwesome6 name="camera" size={16} color="#FFFFFF" />
                  <Text style={styles.uploadButtonText}>拍照上传</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* 上传进度 */}
            {uploadProgress.visible && (
              <View style={styles.uploadProgressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${uploadProgress.percentage}%` }]} />
                </View>
                <Text style={styles.progressText}>{uploadProgress.text}</Text>
              </View>
            )}
          </View>

          {/* 解析状态 */}
          {parseStatus.visible && (
            <View style={styles.parseStatusSection}>
              <View style={[styles.parseStatusCard, parseStatus.success ? styles.parseSuccessCard : styles.parseFailedCard]}>
                <View style={[styles.parseStatusIcon, parseStatus.success ? styles.parseSuccessIcon : styles.parseFailedIcon]}>
                  <FontAwesome6 
                    name={parseStatus.success ? "check" : "triangle-exclamation"} 
                    size={16} 
                    color={parseStatus.success ? "#10B981" : "#EF4444"} 
                  />
                </View>
                <View style={styles.parseStatusTextContainer}>
                  <Text style={styles.parseStatusTitle}>
                    {parseStatus.success ? '解析成功' : '解析失败'}
                  </Text>
                  <Text style={styles.parseStatusMessage}>{parseStatus.message}</Text>
                </View>
              </View>
            </View>
          )}

          {/* 合同信息表单 */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>合同信息</Text>
            
            {/* 合同号 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>合同号 *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="请输入合同号"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={contractFormData.contractNo}
                onChangeText={(value) => updateFormField('contractNo', value)}
              />
            </View>

            {/* 客户名称 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>客户名称 *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="请输入客户名称"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={contractFormData.customerName}
                onChangeText={(value) => updateFormField('customerName', value)}
              />
            </View>

            {/* 合同金额 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>合同金额 *</Text>
              <View style={styles.amountInputContainer}>
                <TextInput
                  style={styles.amountInput}
                  placeholder="请输入合同金额"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={contractFormData.totalAmount}
                  onChangeText={(value) => updateFormField('totalAmount', value)}
                  keyboardType="numeric"
                />
                {renderCurrencySelector()}
              </View>
            </View>

            {/* 交货日期 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>交货日期 *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={contractFormData.deliveryDate}
                onChangeText={(value) => updateFormField('deliveryDate', value)}
              />
            </View>

            {/* 付款方式 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>付款方式</Text>
              {renderPaymentTermsSelector()}
            </View>

            {/* 商品描述 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>商品描述</Text>
              <TextInput
                style={[styles.formInput, styles.textAreaInput]}
                placeholder="请输入商品描述"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={contractFormData.productDescription}
                onChangeText={(value) => updateFormField('productDescription', value)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* 备注信息 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>备注信息</Text>
              <TextInput
                style={[styles.formInput, styles.textAreaInput]}
                placeholder="请输入备注信息"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={contractFormData.contractRemarks}
                onChangeText={(value) => updateFormField('contractRemarks', value)}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* 底部操作按钮 */}
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={[styles.confirmButton, !validateForm() && styles.confirmButtonDisabled]}
              onPress={handleConfirmImport}
              disabled={!validateForm() || isConfirmLoading}
            >
              <FontAwesome6 
                name={isConfirmLoading ? "spinner" : "check"} 
                size={16} 
                color="#FFFFFF" 
                style={isConfirmLoading ? styles.spinningIcon : undefined}
              />
              <Text style={styles.confirmButtonText}>
                {isConfirmLoading ? '导入中...' : '确认导入'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={handleResetForm}>
              <FontAwesome6 name="arrow-rotate-left" size={16} color="#FFFFFF" />
              <Text style={styles.resetButtonText}>重置表单</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ImportContractScreen;

