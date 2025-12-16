import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface RecommendDrinkViewProps {
  onPress?: () => void;
}

export const RecommendDrinkView: React.FC<RecommendDrinkViewProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={["#F0F0F0", "#F0F0F0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.centeredContent}>
              <Text style={styles.title}>Zaproponuj więcej podobnych</Text>
              <View style={styles.iconContainer}>
                <Ionicons name="add-outline" size={24} color="white" />
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    overflow: "hidden",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  contentContainer: {
    borderRadius: 26,
    borderColor: "black",
    borderWidth: 1,
    flex: 1,
    padding: 16,
    paddingLeft: 8,
    height: 245,
    width: "100%",
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  centeredContent: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 32,
    color: "black",
    textAlign: "center",
    fontWeight: "200",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "white",
    marginHorizontal: 6,
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: "black",
    opacity: 0.95,
  },
});
