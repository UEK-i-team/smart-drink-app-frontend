import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface HintProps {
  text: string;
  onPress?: () => void;
}

const Hint: React.FC<HintProps> = ({ text, onPress }) => (
  <TouchableOpacity
    style={styles.quickHintBubble}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress}
  >
    <Text style={styles.quickHintText} numberOfLines={3} ellipsizeMode="tail">
      {text}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  quickHintBubble: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 120,
    maxWidth: 220,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    display: 'flex',
    justifyContent: 'center',
  },
  quickHintText: {
    fontSize: 14,
    color: '#444',
  },
});

export default Hint;
