import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  autoHide = true,
  duration = 5000,
}) => {
  const [visible, setVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (error) {
      setVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (autoHide) {
        const timer = setTimeout(() => {
          hideError();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      hideError();
    }
  }, [error, duration]);

  const hideError = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onDismiss?.();
    });
  };

  if (!error) return null;

  const getErrorIcon = (errorMessage: string) => {
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
      return 'warning';
    } else if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      return 'time';
    } else if (errorMessage.includes('Connection refused') || errorMessage.includes('backend')) {
      return 'server';
    } else {
      return 'alert-circle';
    }
  };

  const getErrorColor = (errorMessage: string) => {
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
      return '#FF6B35'; // Orange for network issues
    } else if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      return '#F59E0B'; // Amber for timeouts
    } else if (errorMessage.includes('Connection refused') || errorMessage.includes('backend')) {
      return '#EF4444'; // Red for server issues
    } else {
      return '#6B7280'; // Gray for general errors
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.errorBox, { borderLeftColor: getErrorColor(error) }]}>
        <View style={styles.errorContent}>
          <Ionicons 
            name={getErrorIcon(error)} 
            size={20} 
            color={getErrorColor(error)} 
            style={styles.errorIcon}
          />
          <View style={styles.errorTextContainer}>
            <Text style={styles.errorTitle}>Connection Error</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={hideError}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  errorBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  errorIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 12,
  },
});
