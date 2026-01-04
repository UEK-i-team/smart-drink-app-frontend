import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ChatBoxTextProps {
  message: string;
  onHistoryPress?: () => void;
  onRetryPress?: () => void;
  hasError?: boolean;
}

export const ChatBoxText: React.FC<ChatBoxTextProps> = ({
  message,
  onHistoryPress,
  onRetryPress,
  hasError = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.historyButton}
        onPress={onHistoryPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons 
          name="time-outline" 
          size={20} 
          color="white" 
        />
      </TouchableOpacity>
      <View style={[styles.bubble, hasError && styles.errorBubble]}>
        <Text style={[styles.text, hasError && styles.errorText]}>
          {message}
        </Text>
        {hasError && (
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={onRetryPress}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            <Ionicons 
              name="refresh" 
              size={16} 
              color="#FF6B35" 
            />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderBottomRightRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: "#000000",
  },
  errorBubble: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FF6B35",
  },
  errorText: {
    color: "#666666",
    fontStyle: "italic",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF6B35",
    alignSelf: "flex-start",
  },
  retryText: {
    fontSize: 12,
    color: "#FF6B35",
    marginLeft: 4,
    fontWeight: "500",
  },
  historyButton: {
    alignSelf: "flex-end",
    bottom: -8,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "black",
    zIndex: 1,
  },
});
