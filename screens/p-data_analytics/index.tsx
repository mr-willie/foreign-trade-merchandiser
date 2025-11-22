

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import MetricCard from './components/MetricCard';
import BarChart from './components/BarChart';
import ProgressChart from './components/ProgressChart';
import ProcessTimeItem from './components/ProcessTimeItem';
import StaffEfficiencyItem from './components/StaffEfficiencyItem';
import ExceptionRecord from './components/ExceptionRecord';

type TabType = 'overview' | 'efficiency' | 'exception';

const DataAnalyticsScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleCustomReportPress = () => {
    console.log('跳转到自定义报表页面');
    // 自定义报表页面（P-CUSTOM_REPORT）在当前版本中未实现
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderOverviewContent = () => (
    <View>
      {/* 核心指标 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>核心指标</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            icon="chart-line"
            iconColor="#3B82F6"
            value="45"
            label="本月订单"
            change="+12%"
            changeType="positive"
          />
          <MetricCard
            icon="dollar-sign"
            iconColor="#10B981"
            value="¥2.3M"
            label="本月金额"
            change="+8%"
            changeType="positive"
          />
          <MetricCard
            icon="check-circle"
            iconColor="#F59E0B"
            value="89%"
            label="完成率"
            change="+5%"
            changeType="positive"
          />
          <MetricCard
            icon="exclamation-triangle"
            iconColor="#EF4444"
            value="12"
            label="逾期订单"
            change="+3%"
            changeType="negative"
          />
        </View>
      </View>

      {/* 订单趋势图 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>订单趋势</Text>
        <View style={styles.chartContainer}>
          <BarChart />
          <Text style={styles.chartDescription}>近6个月订单数量趋势</Text>
        </View>
      </View>

      {/* 客户分布 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>客户分布</Text>
        <View style={styles.chartContainer}>
          <ProgressChart
            data={[
              { label: '欧洲', percentage: 45, color: '#3B82F6' },
              { label: '北美', percentage: 30, color: '#8B5CF6' },
              { label: '亚洲', percentage: 20, color: '#06B6D4' },
              { label: '其他', percentage: 5, color: '#F59E0B' },
            ]}
          />
        </View>
      </View>
    </View>
  );

  const renderEfficiencyContent = () => (
    <View>
      {/* 效率指标 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>效率指标</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            icon="clock"
            iconColor="#10B981"
            value="12.5"
            label="平均处理天数"
            change="-15%"
            changeType="positive"
          />
          <MetricCard
            icon="tasks"
            iconColor="#3B82F6"
            value="92%"
            label="任务完成率"
            change="+8%"
            changeType="positive"
          />
          <MetricCard
            icon="exclamation-circle"
            iconColor="#F59E0B"
            value="8%"
            label="逾期率"
            change="+3%"
            changeType="negative"
          />
          <MetricCard
            icon="file-alt"
            iconColor="#8B5CF6"
            value="95%"
            label="单证准确率"
            change="-10%"
            changeType="positive"
          />
        </View>
      </View>

      {/* 环节耗时分析 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>环节耗时分析</Text>
        <View style={styles.chartContainer}>
          <View style={styles.processTimeContainer}>
            <ProcessTimeItem
              icon="file-contract"
              iconColor="#3B82F6"
              label="合同签订"
              time="2.3天"
            />
            <ProcessTimeItem
              icon="certificate"
              iconColor="#8B5CF6"
              label="许可证办理"
              time="4.1天"
            />
            <ProcessTimeItem
              icon="ship"
              iconColor="#06B6D4"
              label="海运物流"
              time="3.8天"
            />
            <ProcessTimeItem
              icon="clipboard-check"
              iconColor="#F59E0B"
              label="报关报检"
              time="2.9天"
            />
          </View>
        </View>
      </View>

      {/* 跟单员效率排行 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>跟单员效率排行</Text>
        <View style={styles.chartContainer}>
          <View style={styles.staffEfficiencyContainer}>
            <StaffEfficiencyItem
              rank={1}
              name="张经理"
              rate="95%"
              rankColor="#3B82F6"
            />
            <StaffEfficiencyItem
              rank={2}
              name="李主管"
              rate="92%"
              rankColor="#8B5CF6"
            />
            <StaffEfficiencyItem
              rank={3}
              name="王专员"
              rate="88%"
              rankColor="#06B6D4"
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderExceptionContent = () => (
    <View>
      {/* 异常指标 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>异常指标</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            icon="file-excel"
            iconColor="#EF4444"
            value="15"
            label="单证缺失"
            change="+5%"
            changeType="negative"
          />
          <MetricCard
            icon="clock"
            iconColor="#F59E0B"
            value="8"
            label="流程延误"
            change="+3%"
            changeType="negative"
          />
          <MetricCard
            icon="exclamation-triangle"
            iconColor="#8B5CF6"
            value="3"
            label="客户投诉"
            change="-2%"
            changeType="positive"
          />
          <MetricCard
            icon="shield-alt"
            iconColor="#06B6D4"
            value="2"
            label="合规风险"
            change="-10%"
            changeType="positive"
          />
        </View>
      </View>

      {/* 异常类型分布 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>异常类型分布</Text>
        <View style={styles.chartContainer}>
          <ProgressChart
            data={[
              { label: '单证缺失', percentage: 45, color: '#EF4444' },
              { label: '流程延误', percentage: 30, color: '#F59E0B' },
              { label: '客户投诉', percentage: 15, color: '#8B5CF6' },
              { label: '合规风险', percentage: 10, color: '#06B6D4' },
            ]}
          />
        </View>
      </View>

      {/* 近期异常记录 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>近期异常记录</Text>
        <View style={styles.exceptionRecordsContainer}>
          <ExceptionRecord
            icon="file-excel"
            iconColor="#EF4444"
            title="PO-2024001 报关单缺失"
            description="ABC贸易公司订单，缺少出口报关单"
            time="2024-01-15 14:30"
            timeColor="#EF4444"
          />
          <ExceptionRecord
            icon="clock"
            iconColor="#F59E0B"
            title="PO-2024002 许可证办理延误"
            description="DEF制造有限公司订单，许可证申请超期"
            time="2024-01-14 16:45"
            timeColor="#F59E0B"
          />
          <ExceptionRecord
            icon="exclamation-triangle"
            iconColor="#8B5CF6"
            title="客户投诉处理中"
            description="GHI贸易公司对交货时间提出投诉"
            time="2024-01-13 10:20"
            timeColor="#8B5CF6"
          />
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'efficiency':
        return renderEfficiencyContent();
      case 'exception':
        return renderExceptionContent();
      default:
        return renderOverviewContent();
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部导航区域 */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                  <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                  <Text style={styles.pageTitle}>数据分析</Text>
                  <Text style={styles.pageSubtitle}>业务数据统计与分析</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.customReportButton} onPress={handleCustomReportPress}>
                <FontAwesome6 name="plus" size={12} color="#FFFFFF" style={styles.customReportIcon} />
                <Text style={styles.customReportText}>自定义报表</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 报表标签页 */}
          <View style={styles.tabsSection}>
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'overview' ? styles.tabActive : styles.tabInactive]}
                onPress={() => handleTabPress('overview')}
              >
                <Text style={[styles.tabText, activeTab === 'overview' ? styles.tabTextActive : styles.tabTextInactive]}>
                  业务概览
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'efficiency' ? styles.tabActive : styles.tabInactive]}
                onPress={() => handleTabPress('efficiency')}
              >
                <Text style={[styles.tabText, activeTab === 'efficiency' ? styles.tabTextActive : styles.tabTextInactive]}>
                  效率分析
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'exception' ? styles.tabActive : styles.tabInactive]}
                onPress={() => handleTabPress('exception')}
              >
                <Text style={[styles.tabText, activeTab === 'exception' ? styles.tabTextActive : styles.tabTextInactive]}>
                  异常分析
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 标签页内容 */}
          {renderTabContent()}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default DataAnalyticsScreen;

