import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { DrinkInfoCard } from "../components/drink-info-card/drink-info-card";
import { HistoryButton } from "../components/history-button/history-button";
import InputBoxWithSuggestions from "../components/input-box-with-suggestions";

export default function DrinkChatScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <HistoryButton />
      </ScrollView>
      

      {/* Fixed Drink Info Card above Input */}
      <View style={styles.fixedBottomSection}>
        <DrinkInfoCard 
          tasteProfile="Słodki"
          drinkPower="Mocne"
        />
        
        {/* Fixed Input Box at Bottom */}
        <View style={styles.inputWrapper}>
          <InputBoxWithSuggestions 
            placeholder="Z jakim drinkiem ci pomóc"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 280,
  },
  messageContainer: {
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  fixedBottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f5f5f5',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  inputWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
  },
});
