import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ChatBoxTextProps {
  message: string;
  onHistoryPress?: () => void;
}

export const ChatBoxText: React.FC<ChatBoxTextProps> = ({
  message,
  onHistoryPress,
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
      <View style={styles.bubble}>
        <Text style={styles.text}>
          {message}
        </Text>
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
  historyButton: {
    alignSelf: "flex-end",
    bottom: -8,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "black",
    zIndex: 1,
  },
});
