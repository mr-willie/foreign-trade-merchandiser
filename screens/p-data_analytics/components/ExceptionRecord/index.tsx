

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface ExceptionRecordProps {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  timeColor: string;
}

const ExceptionRecord: React.FC<ExceptionRecordProps> = ({
  icon,
  iconColor,
  title,
  description,
  time,
  timeColor,
}) => {
  const handlePress = () => {
    console.log(`Exception record pressed: ${title}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}33` }]}>
          <FontAwesome6 name={icon} size={14} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={[styles.time, { color: timeColor }]}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExceptionRecord;

