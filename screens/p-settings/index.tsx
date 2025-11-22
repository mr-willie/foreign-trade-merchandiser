

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import UserInfoCard from './components/UserInfoCard';
import SettingItem from './components/SettingItem';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import styles from './styles';

const SettingsScreen = () => {
  const router = useRouter();
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [cacheSize, setCacheSize] = useState('128.5 MB');

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleNotificationSettings = () => {
    router.push('/p-notification_settings');
  };

  const handleAccountManagement = () => {
    router.push('/p-account_management');
  };

  const handleAboutUs = () => {
    router.push('/p-about_us');
  };

  const handlePrivacyPolicy = () => {
    router.push('/p-privacy_policy');
  };

  const handleUserAgreement = () => {
    router.push('/p-user_agreement');
  };

  const handleClearCache = () => {
    showToast('缓存清理中...', 'info');
    setTimeout(() => {
      showToast('缓存清理完成', 'success');
      setCacheSize('0 MB');
    }, 1500);
  };

  const handleLogout = () => {
    setIsConfirmModalVisible(true);
  };

  const handleConfirmLogout = () => {
    setIsConfirmModalVisible(false);
    showToast('正在退出登录...', 'info');
    setTimeout(() => {
      router.replace('/p-login_register');
    }, 1000);
  };

  const handleEditProfile = () => {
    router.push('/p-account_management');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部导航区域 */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                  <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.pageTitle}>设置</Text>
              </View>
            </View>
          </View>

          {/* 用户信息区域 */}
          <UserInfoCard onEditProfile={handleEditProfile} />

          {/* 功能设置区域 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>功能设置</Text>
            <View style={styles.settingList}>
              <SettingItem
                icon="bell"
                iconColor="#3B82F6"
                title="通知设置"
                subtitle="推送通知、提醒设置"
                onPress={handleNotificationSettings}
                showArrow
              />
              <SettingItem
                icon="user-gear"
                iconColor="#8B5CF6"
                title="账户管理"
                subtitle="修改密码、个人资料"
                onPress={handleAccountManagement}
                showArrow
              />
            </View>
          </View>

          {/* 帮助与支持区域 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>帮助与支持</Text>
            <View style={styles.settingList}>
              <SettingItem
                icon="circle-info"
                iconColor="#06B6D4"
                title="关于我们"
                subtitle="版本信息、团队介绍"
                onPress={handleAboutUs}
                showArrow
              />
              <SettingItem
                icon="shield-halved"
                iconColor="#F59E0B"
                title="隐私政策"
                subtitle="了解我们如何保护您的隐私"
                onPress={handlePrivacyPolicy}
                showArrow
              />
              <SettingItem
                icon="file-contract"
                iconColor="#10B981"
                title="用户协议"
                subtitle="服务条款与使用规范"
                onPress={handleUserAgreement}
                showArrow
              />
            </View>
          </View>

          {/* 系统设置区域 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>系统设置</Text>
            <View style={styles.settingList}>
              <SettingItem
                icon="broom"
                iconColor="#3B82F6"
                title="清除缓存"
                subtitle="清理应用缓存数据"
                onPress={handleClearCache}
                rightText={cacheSize}
              />
            </View>
          </View>

          {/* 退出登录区域 */}
          <View style={styles.section}>
            <SettingItem
              icon="right-from-bracket"
              iconColor="#EF4444"
              title="退出登录"
              onPress={handleLogout}
              isDanger
              centerContent
            />
          </View>
        </ScrollView>

        {/* 确认对话框 */}
        <ConfirmModal
          visible={isConfirmModalVisible}
          title="确认退出登录"
          message="退出后需要重新登录才能使用应用"
          icon="right-from-bracket"
          iconColor="#EF4444"
          confirmText="确认退出"
          confirmColor="#EF4444"
          onConfirm={handleConfirmLogout}
          onCancel={() => setIsConfirmModalVisible(false)}
        />

        {/* Toast 提示 */}
        <Toast
          visible={isToastVisible}
          message={toastMessage}
          type={toastType}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SettingsScreen;

