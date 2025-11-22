

import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

interface OrderDetails {
  orderNumber: string;
  customerName: string;
  orderAmount: string;
  deliveryDate: string;
  paymentTerms: string;
  productDescription: string;
  status: string;
}

interface OrderInfoCardProps {
  orderDetails: OrderDetails;
}

const OrderInfoCard: React.FC<OrderInfoCardProps> = ({ orderDetails }) => {
  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>订单信息</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>客户名称</Text>
            <Text style={styles.infoValue}>{orderDetails.customerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>订单金额</Text>
            <Text style={styles.infoValue}>{orderDetails.orderAmount}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>交货日期</Text>
            <Text style={styles.infoValue}>{orderDetails.deliveryDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>付款方式</Text>
            <Text style={styles.infoValue}>{orderDetails.paymentTerms}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>商品描述</Text>
            <Text style={styles.infoValue}>{orderDetails.productDescription}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderInfoCard;

