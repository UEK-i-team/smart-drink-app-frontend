import React, { useState } from "react";
import { ScrollView, StyleSheet, View, FlatList } from "react-native";
import { ChatBoxText } from "../components/chat-box-text/chat-box-text";
import { DrinkInfoCard } from "../components/drink-info-card/drink-info-card";
import { DrinkView } from "../components/drink-view/drink-view";
import InputBoxWithSuggestions from "../components/input-box-with-suggestions";
import { SAMPLE_DRINKS } from "../constants/sample-drinks";

export default function DrinkChatScreen() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);


  const handleMessageChange = (message: string) => {
    setMessage(message);
  }

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

  const handleShowDrinks = (message: string) => {
    if (!message) return null;
    
    const filteredDrinks = SAMPLE_DRINKS.filter(drink => 
      drink.name.toLowerCase().includes(message.toLowerCase())
    );
    if (filteredDrinks.length === 0) return null;
    const startIndex = 0;
    const endIndex = 3;
    const drinksToShow = 3;
    const handleScroll = (event: any) => {
      const contentOffset = event.nativeEvent.contentOffset;
      const viewSize = event.nativeEvent.layoutMeasurement;
      const pageNum = Math.floor(contentOffset.x / viewSize.width);
      setCurrentIndex(pageNum);
    };
    return (
      <View style={styles.singleDrinkWrapper}>
        <ScrollView 
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          scrollEventThrottle={16}
          onScroll={handleScroll}
        >
          {filteredDrinks.slice(startIndex, endIndex).map((drink) => (
            <View key={drink.id}>
              <DrinkView 
                name={drink.name}
                image={{uri: drink.imageUrl}}
                ingredients={[]}
                description={drink.description}
              />
            </View>
          ))}
        </ScrollView>
        <View style={styles.pagination}>
        {filteredDrinks.slice(0, drinksToShow).map((_, index) => (
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
  },
  scrollContent: {
    paddingBottom: 280,
  },
  messageContainer: {
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  singleDrinkContainer: {
    height: 220,
    marginVertical: 10,
  },
  drinkScrollContent: {
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
    backgroundColor: '#D94A3D', 
    width: 12,
  },
});
