import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FlaskAndGlassSVG from "../../assets/svgs/flask-and-glass-svg";
import { ChatBoxText } from "../components/chat-box-text/chat-box-text";
import {
  DrinkInfoCard,
  englishToPolishPower,
  englishToPolishTaste,
} from "../components/drink-info-card/drink-info-card";
import { DrinksCarousel } from "../components/drinks-carousel/drinks-carousel";
import ErrorDisplay from "../components/error-display/error-display";
import InputBoxWithSuggestions from "../components/input-box-with-suggestions";

export default function DrinkChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<string[]>([]);
  const [messageFilters, setMessageFilters] = useState<
    { flavorProfile: string; power: string }[]
  >([]);
  const [message, setMessage] = useState<string>("");
  const [filters, setFilters] = useState({
    flavorProfile: "sweet",
    power: "weak",
  });
  const [failedMessages, setFailedMessages] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Handle on History Press
  const handleHistoryPress = (msg: string) => {
    setMessage(msg);
  };

  // Handle Error Display
  const handleError = (errorMessage: string) => {
    console.log("Error received:", errorMessage); // Debug log
    setCurrentError(errorMessage);
  };

  const dismissError = () => {
    setCurrentError(null);
  };

  const handleRetryMessage = (index: number) => {
    setFailedMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    setCurrentError(null);
  };

  // Input Validation
  const validateInput = (text: string): boolean => {
    if (!text || text.trim().length === 0) return false;
    if (text.trim().length < 3) return false;
    if (text.trim().length > 500) return false;
    return true;
  };

  // Handle Message Change
  const handleMessageChange = (message: string) => {
    setMessage(message);
  };

  // Handle Filter Change
  const handleFilterChange = (filterData: {
    drinkOptions: string[];
    power: string;
    flavorProfile: string;
  }) => {
    setFilters({
      flavorProfile: filterData.flavorProfile,
      power: filterData.power,
    });
  };

  // Send Message
  const handleSendMessage = async () => {
    if (!validateInput(message)) {
      return;
    }

    setIsLoading(true);
    const messageIndex = messages.length;

    try {
      const sentMessage = message;
      const sentFilters = { ...filters };

      setMessages((prev) => [...prev, sentMessage]);
      setMessageFilters((prev) => [...prev, sentFilters]);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      setFailedMessages((prev) => new Set(prev).add(messageIndex));
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navHistoryButton, { top: insets.top + 8 }]}
        onPress={() => router.push("/screens/favorites-history-screen")}
        accessibilityRole="button"
        accessibilityLabel="View drink history"
      >
        <Ionicons name="time-outline" size={24} color="white" />
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          messages.length === 0 && styles.emptyScrollContent,
        ]}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <FlaskAndGlassSVG />
          </View>
        ) : (
          messages.map((msg, index) => (
            <View key={index} style={styles.messageContainer}>
              <ChatBoxText
                message={msg}
                onHistoryPress={() => handleHistoryPress(msg)}
                onRetryPress={() => handleRetryMessage(index)}
                hasError={failedMessages.has(index)}
              />
              <DrinksCarousel
                message={msg}
                messageIndex={index}
                filters={{
                  flavorProfile: englishToPolishTaste(
                    messageFilters[index]?.flavorProfile ||
                      filters.flavorProfile,
                  ),
                  power: englishToPolishPower(
                    messageFilters[index]?.power || filters.power,
                  ),
                }}
                onError={handleError}
              />
            </View>
          ))
        )}
      </ScrollView>

      {/* Fixed Drink Info Card above Input */}
      <View style={styles.fixedBottomSection}>
        <DrinkInfoCard
          tasteProfile={englishToPolishTaste(filters.flavorProfile)}
          drinkPower={englishToPolishPower(filters.power)}
        />
        {/* Fixed Input Box at Bottom */}
        <View style={styles.inputWrapper}>
          <InputBoxWithSuggestions
            value={message}
            onChange={handleMessageChange}
            onSend={handleSendMessage}
            onSelectionChange={handleFilterChange}
            placeholder="Z jakim drinkiem ci pomóc"
            disabled={isLoading}
            validationError={!validateInput(message) && message.length > 0}
          />
        </View>
      </View>

      {/* Error Display */}
      <ErrorDisplay
        error={currentError}
        onDismiss={dismissError}
        autoHide={true}
        duration={8000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(235, 231, 230, 1)",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 8,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: 350,
  },
  emptyScrollContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80,
  },
  emptyStateText: {
    marginTop: 24,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "400",
  },
  navHistoryButton: {
    position: "absolute",
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  drinkContainer: {
    width: Dimensions.get("window").width,
  },
  messageContainer: {
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  fixedBottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(235, 231, 230, 1)",
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
