import React, { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, usePathname, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  "TurboModuleRegistry.getEnforcing(...): 'RNMapsAirModule' could not be found",
  // 添加其它想暂时忽略的错误或警告信息
]);

export default function RootLayout() {
  const pathname = usePathname();
  const searchParams = useGlobalSearchParams();

  useEffect(() => {
    if (!pathname) {
      return;
    }
    let searchString = '';
    if (Object.keys(searchParams).length > 0) {
      const queryString = Object.keys(searchParams)
        .map(key => {
          const value = searchParams[key];
          if (typeof value === 'string') {
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
          }
          return '';
        }).filter(Boolean).join('&');

      searchString = '?' + queryString;
    }

    const pageId = pathname.replace('/', '').toUpperCase();
    console.log('当前pageId:', pageId, ', pathname:', pathname, ', search:', searchString);
    if (typeof window === 'object' && window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'chux-path-change',
        pageId: pageId,
        pathname: pathname,
        search: searchString,
      }, '*');
    }
  }, [pathname, searchParams])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light"></StatusBar>
      <Stack screenOptions={{
        // 设置所有页面的切换动画为从右侧滑入，适用于iOS 和 Android
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        // 隐藏自带的头部
        headerShown: false 
      }}>
        <Stack.Screen name="(tabs)" options={{ title: "底部导航栏" }} />
        <Stack.Screen name="p-follow_up_detail" options={{ title: "跟单详情页" }} />
        <Stack.Screen name="p-doc_detail" options={{ title: "单证详情页" }} />
        <Stack.Screen name="p-doc_generation" options={{ title: "单证生成页" }} />
        <Stack.Screen name="p-task_reminder" options={{ title: "任务提醒页" }} />
        <Stack.Screen name="p-customer_manage" options={{ title: "客户管理页" }} />
        <Stack.Screen name="p-customer_detail" options={{ title: "客户详情页" }} />
        <Stack.Screen name="p-product_manage" options={{ title: "产品管理页" }} />
        <Stack.Screen name="p-product_detail" options={{ title: "产品详情页" }} />
        <Stack.Screen name="p-import_contract" options={{ title: "导入合同页" }} />
        <Stack.Screen name="p-import_export_license" options={{ title: "进出口许可办理页" }} />
        <Stack.Screen name="p-shipping_logistics" options={{ title: "海运物流安排页" }} />
        <Stack.Screen name="p-commercial_draft" options={{ title: "商业汇票管理页" }} />
        <Stack.Screen name="p-shipping_advice" options={{ title: "装运通知管理页" }} />
        <Stack.Screen name="p-customs_declaration" options={{ title: "报关单管理页" }} />
        <Stack.Screen name="p-commodity_inspection" options={{ title: "商检证书管理页" }} />
        <Stack.Screen name="p-goods_insurance" options={{ title: "货物保险办理页" }} />
        <Stack.Screen name="p-certificate_of_origin" options={{ title: "产地证管理页" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
