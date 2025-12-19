import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text } from "react-native";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { DrinkOptions } from "./drink-options/drink-options";

interface InputBoxWithSuggestionsProps {
  value?: string;
  onChange?: (message: string) => void;
  onSend?: () => void;
  onSelectionChange?: (selectedItems: {
    drinkOptions: string[];
    power: string;
    flavorProfile: string;
  }) => void;
  placeholder?: string;
  suggestions?: string[];
}

export default function InputBoxWithSuggestions({
  value,
  onChange,
  onSend,
  onSelectionChange,
  placeholder = "Z jakim drinkiem ci pomóc",
  suggestions = [
    "Skomponuj drinks ze składników: Wódka, Cytryna, Mięta",
    "Skomponuj na drinks, który zgadzasz się z wakacjami nad morzem",
    "Polecam drink orzeźwiający na gorący dzień",
  ],
}: InputBoxWithSuggestionsProps) {
  const [showDrinkOptions, setShowDrinkOptions] = useState(false);
  const [filters, setFilters] = useState({ flavorProfile: "", power: "" });
  
  // Show drink options
  const handleShowDrinkOptions = (newData: { flavorProfile: string; power: string }) => {
    setFilters(newData)
    setShowDrinkOptions(true)
  }

  const handleCloseDrinkOptions = () => {
    setShowDrinkOptions(false)
  }

  const handleClickSuggestion = (suggestion: string) => {
    if (onChange) {
      onChange(suggestion);
    }
  }

  return (
    <View style={styles.container}>
      {/* Scrollable suggestion chips */}
      {!value && (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.suggestionsContainer}
        contentContainerStyle={styles.suggestionsContent}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity onPress={() => handleClickSuggestion(suggestion)}>
            <View key={index} style={styles.suggestionChip}>
              <Text>{suggestion}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      )}
      {/* Input section */}
      <View style={styles.inputContainer}>
        <View style={styles.inputContent}>
          <View style={styles.inputLeft}>
            {/* Text Input */}
            <TextInput
              style={styles.textInput}
              placeholder={placeholder}
              placeholderTextColor="#999"
              multiline={false}
              onChangeText={onChange}
              value={value}
            />
            
            {/* Left side buttons */}
            <View style={styles.leftButtons}>
              <TouchableOpacity style={styles.inputIconButton}>
                <Ionicons name="camera-outline" size={22} color="#333" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleShowDrinkOptions(filters)} style={styles.inputIconButton}>
                <Ionicons name="options-outline" size={22} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Send button */}
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={onSend}
          >
            <Ionicons name="arrow-up" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {showDrinkOptions && <DrinkOptions 
        data={filters}
        onSelectionChange={onSelectionChange} 
        onClose={() => handleCloseDrinkOptions()} 
        onConfirm={(filters: {flavorProfile: string; power: string}) => handleShowDrinkOptions(filters)}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  suggestionsContainer: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
    height: 80,
    marginBottom: -6,
  },
  suggestionsContent: {
    gap: 8,
    paddingRight: 24,
    paddingBottom: 4,
  },
  suggestionChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: 200,
    height: 72,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "center",
  },
  suggestionText: {
    fontSize: 11,
    color: "#666",
    lineHeight: 16,
    textAlignVertical: "center",
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingLeft: 16,
    paddingVertical: 8,
    paddingRight: 8,
  },
  inputContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  inputLeft: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  textInput: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  leftButtons: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  inputIconButton: {
    width: 36,
    height: 36,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    width: 56,
    height: 56,
    backgroundColor: "#FF6B35",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
