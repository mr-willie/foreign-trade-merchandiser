import React from "react";
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { Tabs } from "expo-router";
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


export default function Layout() {
  return (
    <Tabs 
      backBehavior="order"
      screenOptions={{ 
          tabBarActiveTintColor: "#3B82F6",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarStyle: {
            backgroundColor: "#ffffff1a"
          }
      }}>

        <Tabs.Screen
            name="index"
            options={{href: null}}
        />

        <Tabs.Screen name="p-home" options={{
            title: '首页', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="house" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-follow_up_list" options={{
            title: '跟单', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="list-check" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-doc_manage" options={{
            title: '单证', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="folder" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-data_analytics" options={{
            title: '数据', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="chart-column" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-settings" options={{
            title: '我的', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="user" size={20} color={color} />
            )
        }}/>
    </Tabs>
  );
}