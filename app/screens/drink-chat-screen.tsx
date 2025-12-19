import React, { useState, useRef, useEffect } from "react";
import { ScrollView, StyleSheet, View, Dimensions } from "react-native";
import { ChatBoxText } from "../components/chat-box-text/chat-box-text";
import { DrinkInfoCard } from "../components/drink-info-card/drink-info-card";
import InputBoxWithSuggestions from "../components/input-box-with-suggestions";
import { DrinksCarousel } from "../components/drinks-carousel/drinks-carousel";


export default function DrinkChatScreen() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [filters, setFilters] = useState({ flavorProfile: "Słodki", power: "Mocne" });
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Handle on History Press
  const handleHistoryPress = (msg: string) => {
    setMessage(msg);
  }

  // Handle Message Change
  const handleMessageChange = (message: string) => {
    setMessage(message);
  }

  // Handle Filter Change
  const handleFilterChange = (filterData: { drinkOptions: string[], power: string, flavorProfile: string }) => {
    setFilters({
      flavorProfile: filterData.flavorProfile,
      power: filterData.power
    });
  }

  // Send Message
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage("");
    }
  }

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
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageContainer}>
            <ChatBoxText 
              message={msg} 
              onHistoryPress={() => handleHistoryPress(msg)}
            />
            <DrinksCarousel message={msg} messageIndex={index} filters={filters} />
          </View>
        ))}
      </ScrollView>

      {/* Fixed Drink Info Card above Input */}
      <View style={styles.fixedBottomSection}>
        <DrinkInfoCard 
          tasteProfile={filters.flavorProfile}
          drinkPower={filters.power}
        />
        {/* Fixed Input Box at Bottom */}
        <View style={styles.inputWrapper}>
          <InputBoxWithSuggestions 
            value={message}
            onChange={handleMessageChange}
            onSend={handleSendMessage}
            onSelectionChange={handleFilterChange}
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
    paddingHorizontal: 8,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 350,
  },
  drinkContainer: {
    width: Dimensions.get('window').width,
  },
  messageContainer: {
    paddingTop: 16,
    paddingHorizontal: 8
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
