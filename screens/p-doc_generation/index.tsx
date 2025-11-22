

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface TemplateField {
  name: string;
  type: 'text' | 'date' | 'select' | 'textarea';
  value: string;
  required: boolean;
  options?: string[];
}

interface Template {
  name: string;
  fields: TemplateField[];
}

const DocGenerationScreen = () => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'template-selection' | 'form-editing'>('template-selection');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const templates: Record<string, Template> = {
    license: {
      name: '进出口许可证申请单',
      fields: [
        { name: '申请单位', type: 'text', value: '贸通智跟科技有限公司', required: true },
        { name: '申请日期', type: 'date', value: new Date().toISOString().split('T')[0], required: true },
        { name: '联系人', type: 'text', value: '李经理', required: true },
        { name: '联系电话', type: 'text', value: '021-87654321', required: true },
        { name: '商品名称', type: 'text', value: '', required: true },
        { name: '规格型号', type: 'text', value: '', required: true },
        { name: '数量', type: 'text', value: '', required: true },
        { name: '单位', type: 'text', value: '台', required: true },
        { name: '单价', type: 'text', value: '', required: true },
        { name: '总值', type: 'text', value: '', required: true },
        { name: '贸易方式', type: 'select', options: ['一般贸易', '加工贸易', '易货贸易'], value: '一般贸易', required: true },
        { name: '出口国家/地区', type: 'text', value: '美国', required: true },
        { name: '运输方式', type: 'select', options: ['海运', '空运', '陆运'], value: '海运', required: true },
        { name: '预计出口日期', type: 'date', value: '', required: true },
        { name: '备注', type: 'textarea', value: '', required: false },
      ],
    },
    invoice: {
      name: '商业发票',
      fields: [
        { name: '发票号码', type: 'text', value: 'INV-2024001', required: true },
        { name: '发票日期', type: 'date', value: new Date().toISOString().split('T')[0], required: true },
        { name: '卖方名称', type: 'text', value: '贸通智跟科技有限公司', required: true },
        { name: '卖方地址', type: 'text', value: '上海市浦东新区张江路1000号', required: true },
        { name: '买方名称', type: 'text', value: '', required: true },
        { name: '买方地址', type: 'text', value: '', required: true },
        { name: '订单号码', type: 'text', value: '', required: true },
        { name: '付款条件', type: 'text', value: '', required: true },
        { name: '起运港', type: 'text', value: '', required: true },
        { name: '目的港', type: 'text', value: '', required: true },
        { name: '商品名称', type: 'text', value: '', required: true },
        { name: '规格型号', type: 'text', value: '', required: true },
        { name: '数量', type: 'text', value: '', required: true },
        { name: '单位', type: 'text', value: '台', required: true },
        { name: '单价', type: 'text', value: '', required: true },
        { name: '金额', type: 'text', value: '', required: true },
        { name: '总金额', type: 'text', value: '', required: true },
        { name: '备注', type: 'textarea', value: '', required: false },
      ],
    },
    packing: {
      name: '装箱单',
      fields: [
        { name: '装箱单号码', type: 'text', value: 'PKG-2024001', required: true },
        { name: '日期', type: 'date', value: new Date().toISOString().split('T')[0], required: true },
        { name: '出口商', type: 'text', value: '贸通智跟科技有限公司', required: true },
        { name: '进口商', type: 'text', value: '', required: true },
        { name: '商品名称', type: 'text', value: '', required: true },
        { name: '规格型号', type: 'text', value: '', required: true },
        { name: '数量', type: 'text', value: '', required: true },
        { name: '单位', type: 'text', value: '台', required: true },
        { name: '毛重', type: 'text', value: '', required: true },
        { name: '净重', type: 'text', value: '', required: true },
        { name: '包装件数', type: 'text', value: '', required: true },
        { name: '包装类型', type: 'select', options: ['纸箱', '木箱', '托盘'], value: '纸箱', required: true },
        { name: '唛头', type: 'text', value: '', required: false },
        { name: '备注', type: 'textarea', value: '', required: false },
      ],
    },
    bill: {
      name: '提单',
      fields: [
        { name: '提单号码', type: 'text', value: 'BOL-2024001', required: true },
        { name: '船名航次', type: 'text', value: '', required: true },
        { name: '装货港', type: 'text', value: '', required: true },
        { name: '卸货港', type: 'text', value: '', required: true },
        { name: '交货港', type: 'text', value: '', required: true },
        { name: '发货人', type: 'text', value: '贸通智跟科技有限公司', required: true },
        { name: '收货人', type: 'text', value: '', required: true },
        { name: '通知人', type: 'text', value: '', required: true },
        { name: '商品名称', type: 'text', value: '', required: true },
        { name: '数量', type: 'text', value: '', required: true },
        { name: '包装件数', type: 'text', value: '', required: true },
        { name: '毛重', type: 'text', value: '', required: true },
        { name: '体积', type: 'text', value: '', required: true },
        { name: '运费支付方式', type: 'select', options: ['预付', '到付'], value: '预付', required: true },
        { name: '提单类型', type: 'select', options: ['正本', '电放'], value: '正本', required: true },
        { name: '备注', type: 'textarea', value: '', required: false },
      ],
    },
    declaration: {
      name: '报关单',
      fields: [
        { name: '报关单号', type: 'text', value: 'CUS-2024001', required: true },
        { name: '申报日期', type: 'date', value: new Date().toISOString().split('T')[0], required: true },
        { name: '经营单位', type: 'text', value: '贸通智跟科技有限公司', required: true },
        { name: '收货单位', type: 'text', value: '', required: true },
        { name: '运输方式', type: 'select', options: ['海运', '空运', '陆运'], value: '海运', required: true },
        { name: '运输工具名称', type: 'text', value: '', required: true },
        { name: '提运单号', type: 'text', value: '', required: true },
        { name: '贸易方式', type: 'select', options: ['一般贸易', '加工贸易', '易货贸易'], value: '一般贸易', required: true },
        { name: '商品名称', type: 'text', value: '', required: true },
        { name: '规格型号', type: 'text', value: '', required: true },
        { name: '数量', type: 'text', value: '', required: true },
        { name: '单位', type: 'text', value: '台', required: true },
        { name: '单价', type: 'text', value: '', required: true },
        { name: '总价', type: 'text', value: '', required: true },
        { name: '原产国', type: 'text', value: '', required: true },
        { name: '备注', type: 'textarea', value: '', required: false },
      ],
    },
    inspection: {
      name: '商检证书',
      fields: [
        { name: '证书编号', type: 'text', value: 'INS-2024001', required: true },
        { name: '申请日期', type: 'date', value: new Date().toISOString().split('T')[0], required: true },
        { name: '申请人', type: 'text', value: '贸通智跟科技有限公司', required: true },
        { name: '商品名称', type: 'text', value: '', required: true },
        { name: '规格型号', type: 'text', value: '', required: true },
        { name: '数量', type: 'text', value: '', required: true },
        { name: '单位', type: 'text', value: '台', required: true },
        { name: '生产厂家', type: 'text', value: '', required: true },
        { name: '检验依据', type: 'text', value: '', required: true },
        { name: '检验项目', type: 'text', value: '', required: true },
        { name: '检验结果', type: 'select', options: ['合格', '不合格'], value: '合格', required: true },
        { name: '备注', type: 'textarea', value: '', required: false },
      ],
    },
    insurance: {
      name: '货物保险单',
      fields: [
        { name: '保单号码', type: 'text', value: 'INS-2024001', required: true },
        { name: '投保日期', type: 'date', value: new Date().toISOString().split('T')[0], required: true },
        { name: '被保险人', type: 'text', value: '贸通智跟科技有限公司', required: true },
        { name: '保险人', type: 'text', value: '', required: true },
        { name: '保险金额', type: 'text', value: '', required: true },
        { name: '保险费率', type: 'text', value: '', required: true },
        { name: '保险费', type: 'text', value: '', required: true },
        { name: '商品名称', type: 'text', value: '', required: true },
        { name: '数量', type: 'text', value: '', required: true },
        { name: '运输工具', type: 'text', value: '', required: true },
        { name: '起运港', type: 'text', value: '', required: true },
        { name: '目的港', type: 'text', value: '', required: true },
        { name: '保险险别', type: 'select', options: ['平安险', '水渍险', '一切险'], value: '一切险', required: true },
        { name: '备注', type: 'textarea', value: '', required: false },
      ],
    },
    origin: {
      name: '产地证',
      fields: [
        { name: '证书编号', type: 'text', value: 'C/O-2024001', required: true },
        { name: '申请日期', type: 'date', value: new Date().toISOString().split('T')[0], required: true },
        { name: '出口商', type: 'text', value: '贸通智跟科技有限公司', required: true },
        { name: '生产商', type: 'text', value: '', required: true },
        { name: '进口商', type: 'text', value: '', required: true },
        { name: '商品名称', type: 'text', value: '', required: true },
        { name: 'HS编码', type: 'text', value: '', required: true },
        { name: '数量', type: 'text', value: '', required: true },
        { name: '单位', type: 'text', value: '台', required: true },
        { name: '原产地标准', type: 'text', value: '', required: true },
        { name: '包装件数', type: 'text', value: '', required: true },
        { name: '运输方式', type: 'select', options: ['海运', '空运', '陆运'], value: '海运', required: true },
        { name: '目的国', type: 'text', value: '', required: true },
        { name: '备注', type: 'textarea', value: '', required: false },
      ],
    },
    draft: {
      name: '商业汇票',
      fields: [
        { name: '汇票号码', type: 'text', value: 'DRAFT-2024001', required: true },
        { name: '出票日期', type: 'date', value: new Date().toISOString().split('T')[0], required: true },
        { name: '出票人', type: 'text', value: '贸通智跟科技有限公司', required: true },
        { name: '付款人', type: 'text', value: '', required: true },
        { name: '收款人', type: 'text', value: '', required: true },
        { name: '金额', type: 'text', value: '', required: true },
        { name: '货币', type: 'text', value: 'USD', required: true },
        { name: '付款期限', type: 'text', value: '', required: true },
        { name: '出票条款', type: 'text', value: '', required: true },
        { name: '备注', type: 'textarea', value: '', required: false },
      ],
    },
    advice: {
      name: '装运通知',
      fields: [
        { name: '通知号码', type: 'text', value: 'ADV-2024001', required: true },
        { name: '通知日期', type: 'date', value: new Date().toISOString().split('T')[0], required: true },
        { name: '发件人', type: 'text', value: '贸通智跟科技有限公司', required: true },
        { name: '收件人', type: 'text', value: '', required: true },
        { name: '订单号码', type: 'text', value: '', required: true },
        { name: '商品名称', type: 'text', value: '', required: true },
        { name: '数量', type: 'text', value: '', required: true },
        { name: '船名航次', type: 'text', value: '', required: true },
        { name: '装货港', type: 'text', value: '', required: true },
        { name: '目的港', type: 'text', value: '', required: true },
        { name: '预计开航日期', type: 'date', value: '', required: true },
        { name: '预计到达日期', type: 'date', value: '', required: true },
        { name: '提单号码', type: 'text', value: '', required: true },
        { name: '备注', type: 'textarea', value: '', required: false },
      ],
    },
  };

  const templateList = [
    { key: 'license', icon: 'certificate', color: '#3B82F6', name: '进出口许可证申请单', description: '用于申请进出口许可证的标准表单' },
    { key: 'invoice', icon: 'file-invoice', color: '#8B5CF6', name: '商业发票', description: '国际贸易中的正式发票文件' },
    { key: 'packing', icon: 'boxes-stacked', color: '#06B6D4', name: '装箱单', description: '详细列出货物包装信息的单据' },
    { key: 'bill', icon: 'ship', color: '#F59E0B', name: '提单', description: '海运货物的物权凭证' },
    { key: 'declaration', icon: 'file-lines', color: '#3B82F6', name: '报关单', description: '向海关申报货物的正式文件' },
    { key: 'inspection', icon: 'vial', color: '#10B981', name: '商检证书', description: '商品检验合格的证明文件' },
    { key: 'insurance', icon: 'shield-halved', color: '#EF4444', name: '货物保险单', description: '货物运输保险的正式保单' },
    { key: 'origin', icon: 'globe', color: '#3B82F6', name: '产地证', description: '证明货物原产地的官方文件' },
    { key: 'draft', icon: 'money-check', color: '#8B5CF6', name: '商业汇票', description: '国际贸易中的支付工具' },
    { key: 'advice', icon: 'envelope', color: '#06B6D4', name: '装运通知', description: '通知买方货物已装运的文件' },
  ];

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleTemplateSelect = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    setCurrentView('form-editing');
    
    // 初始化表单数据
    const template = templates[templateKey];
    const initialFormData: Record<string, string> = {};
    template.fields.forEach(field => {
      initialFormData[field.name] = field.value;
    });
    setFormData(initialFormData);
  };

  const handleBackToTemplates = () => {
    setCurrentView('template-selection');
    setSelectedTemplate(null);
    setFormData({});
  };

  const handleFormDataChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handlePreview = () => {
    setIsPreviewModalVisible(true);
  };

  const handleGenerate = async () => {
    // 验证必填字段
    if (!selectedTemplate) return;
    
    const template = templates[selectedTemplate];
    const missingFields = template.fields
      .filter(field => field.required && (!formData[field.name] || formData[field.name].trim() === ''))
      .map(field => field.name);
    
    if (missingFields.length > 0) {
      Alert.alert('提示', `请填写以下必填字段：\n${missingFields.join('\n')}`);
      return;
    }

    setIsGenerating(true);
    try {
      // 模拟生成过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert('成功', '单证生成成功！', [
        {
          text: '确定',
          onPress: () => {
            const documentId = 'DOC-' + Date.now();
            router.push(`/p-doc_detail?documentId=${documentId}`);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderTemplateItem = (item: typeof templateList[0]) => (
    <TouchableOpacity
      key={item.key}
      style={styles.templateItem}
      onPress={() => handleTemplateSelect(item.key)}
      activeOpacity={0.7}
    >
      <View style={styles.templateItemContent}>
        <View style={[styles.templateIconContainer, { backgroundColor: `${item.color}20` }]}>
          <FontAwesome6 name={item.icon} size={20} color={item.color} />
        </View>
        <View style={styles.templateTextContainer}>
          <Text style={styles.templateTitle}>{item.name}</Text>
          <Text style={styles.templateDescription}>{item.description}</Text>
        </View>
        <FontAwesome6 name="chevron-right" size={16} color="rgba(255, 255, 255, 0.6)" />
      </View>
    </TouchableOpacity>
  );

  const renderFormField = (field: TemplateField) => {
    const fieldValue = formData[field.name] || '';
    
    return (
      <View key={field.name} style={styles.formFieldContainer}>
        <Text style={styles.formLabel}>
          {field.name}{field.required ? ' *' : ''}
        </Text>
        
        {field.type === 'text' && (
          <TextInput
            style={styles.formInput}
            value={fieldValue}
            onChangeText={(value) => handleFormDataChange(field.name, value)}
            placeholder={field.name}
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
          />
        )}
        
        {field.type === 'date' && (
          <TextInput
            style={styles.formInput}
            value={fieldValue}
            onChangeText={(value) => handleFormDataChange(field.name, value)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
          />
        )}
        
        {field.type === 'textarea' && (
          <TextInput
            style={[styles.formInput, styles.formTextArea]}
            value={fieldValue}
            onChangeText={(value) => handleFormDataChange(field.name, value)}
            placeholder={field.name}
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        )}
      </View>
    );
  };

  const renderPreviewContent = () => {
    if (!selectedTemplate) return null;
    
    const template = templates[selectedTemplate];
    const nonEmptyFields = template.fields.filter(field => formData[field.name] && formData[field.name].trim() !== '');
    
    return (
      <View style={styles.previewContentContainer}>
        <Text style={styles.previewTitle}>{template.name}</Text>
        {nonEmptyFields.map(field => (
          <View key={field.name} style={styles.previewFieldRow}>
            <Text style={styles.previewFieldLabel}>{field.name}:</Text>
            <Text style={styles.previewFieldValue}>{formData[field.name]}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>生成单证</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 模板选择区域 */}
          {currentView === 'template-selection' && (
            <View style={styles.templateSelectionContainer}>
              <Text style={styles.sectionTitle}>选择单证模板</Text>
              <View style={styles.templateList}>
                {templateList.map(renderTemplateItem)}
              </View>
            </View>
          )}

          {/* 表单编辑区域 */}
          {currentView === 'form-editing' && selectedTemplate && (
            <View style={styles.formEditingContainer}>
              <View style={styles.formHeader}>
                <TouchableOpacity
                  style={styles.backToTemplatesButton}
                  onPress={handleBackToTemplates}
                  activeOpacity={0.7}
                >
                  <FontAwesome6 name="arrow-left" size={14} color="rgba(255, 255, 255, 0.7)" />
                  <Text style={styles.backToTemplatesText}>返回选择</Text>
                </TouchableOpacity>
                <Text style={styles.formTitle}>{templates[selectedTemplate].name}</Text>
              </View>

              <View style={styles.formContainer}>
                {templates[selectedTemplate].fields.map(renderFormField)}
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.previewButton}
                  onPress={handlePreview}
                  activeOpacity={0.7}
                >
                  <FontAwesome6 name="eye" size={16} color="#FFFFFF" />
                  <Text style={styles.previewButtonText}>预览</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
                  onPress={handleGenerate}
                  activeOpacity={0.7}
                  disabled={isGenerating}
                >
                  <FontAwesome6 name="download" size={16} color="#FFFFFF" />
                  <Text style={styles.generateButtonText}>
                    {isGenerating ? '生成中...' : '生成单证'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* 预览弹窗 */}
        <Modal
          visible={isPreviewModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsPreviewModalVisible(false)}
        >
          <View style={styles.previewModalOverlay}>
            <View style={styles.previewModalContainer}>
              <View style={styles.previewModalHeader}>
                <Text style={styles.previewModalTitle}>单证预览</Text>
                <TouchableOpacity
                  style={styles.closePreviewButton}
                  onPress={() => setIsPreviewModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <FontAwesome6 name="xmark" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.previewModalContent} showsVerticalScrollIndicator={false}>
                {renderPreviewContent()}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default DocGenerationScreen;

