import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Dimensions } from "react-native";
import { ChatBoxText } from "../components/chat-box-text/chat-box-text";
import { DrinkInfoCard } from "../components/drink-info-card/drink-info-card";
import InputBoxWithSuggestions from "../components/input-box-with-suggestions";
import { SAMPLE_DRINKS } from "../constants/sample-drinks";
import DrinkCard from "../components/drink-card/drink-card";

export default function DrinkChatScreen() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const windowWidth = Dimensions.get("window").width;

  // Handle Message Change
  const handleMessageChange = (message: string) => {
    setMessage(message);
  }

  // Send Message
  const handleSendMessage = () => {
    setMessages([...messages, message]);
    setMessage("");
    return (
      <View style={styles.messageContainer}>
        <ChatBoxText message={message} />
        {handleShowDrinks(message)}
      </View>
    )
  }

  // Show Drinks
  const handleShowDrinks = (message: string) => {
    if (!message) return null;
    
  // Pagination
  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width + 0.5);
    
    if (currentIndex !== pageNum) {
      setCurrentIndex(pageNum);
    }
  };
    return (
      <View style={styles.container}>
        <ScrollView 
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          snapToInterval={windowWidth}
        >
          {SAMPLE_DRINKS.slice(0, 3).map((drink) => (
            <View key={drink.id}>
              <DrinkCard
                drink={drink}
                isFavorite={false}
                onToggleFavorite={() => {}}
              />
            </View>
          ))}
        </ScrollView>
        <View style={styles.pagination}>
        {SAMPLE_DRINKS.slice(0, 3).map((_, index) => (
          <View 
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            <ChatBoxText message={message} />
            {handleShowDrinks(message)}
          </React.Fragment>
        ))}
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
            value={message}
            onChange={handleMessageChange}
            onSend={handleSendMessage}
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
  pagination: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#000000ff', 
    width: 12,
  },
});
