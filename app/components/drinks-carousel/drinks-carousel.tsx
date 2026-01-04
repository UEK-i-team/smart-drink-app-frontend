import React, { useState, useEffect, useRef } from "react";
import { 
    ScrollView, 
    StyleSheet, 
    View
} from "react-native";
import { DrinkView } from "../drink-view/drink-view";
import { RecommendDrinkView } from "../recommend-drink-view/recommend-drink-view";
import { DrinkInfoChatBox } from "../drink-info-chat-box/drink-info-chat-box";
import { Dimensions } from "react-native";
import { Drink } from "../../types/drink";
import { getDrinks, addToHistory } from "@/api.js";

export const DrinksCarousel = ({ 
  message, 
  messageIndex, 
  filters, 
  onError 
}: { 
  message: string; 
  messageIndex: number; 
  filters: { flavorProfile: string; power: string };
  onError?: (error: string) => void;
}) => {
    const windowWidth = Dimensions.get("window").width;
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [processedMessages, setProcessedMessages] = useState<Set<number>>(new Set());
    const scrollViewRef = useRef<ScrollView>(null);

    // Manual retry function
    const retryFetch = () => {
      fetchDrinks();
    };

    // Get Drinks
    const fetchDrinks = async () => {
      try {
        // Add timeout handling
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        );
        
        const response = await Promise.race([getDrinks(filters), timeout]);
        const drinksData = response.drinks || response;
        setDrinks(drinksData);
        setMessagePagination(prev => ({
          ...prev,
          [messageIndex]: 0
        }));
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
        }, 100);
      } catch (error) {
        console.error('Error fetching drinks:', error);
        setDrinks([]);
        
        // Handle specific error types
        let errorMessage = 'Unknown error occurred while fetching drinks';
        
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Unable to connect to server. Check your internet connection.';
        } else if (error instanceof Error && error.message.includes('Request timeout')) {
          errorMessage = 'Timeout error: Server took too long to respond. Please try again.';
        } else if (error instanceof Error && error.message.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = 'Connection refused: Backend server is not running or not accessible.';
        } else if (error instanceof Error && error.message.includes('404')) {
          console.log('Image 404 error (expected):', error.message);
          return;
        } else if (typeof error === 'string' && error.includes('404')) {
          console.log('Image URL 404 error (expected):', error);
          return;
        }
        
        console.error(errorMessage);
        onError?.(errorMessage);
      }
    }
    
    const handleImageError = (error: any) => {
      console.log('Image loading error:', error);
    };
    
    useEffect(() => {
      fetchDrinks();
    }, [filters, messageIndex]); 
    
    if (!message) return null;
    
    const [messagePagination, setMessagePagination] = useState<{[key: number]: number}>({});
    
    // Pagination
    const handleScroll = (event: any) => {
      const contentOffset = event.nativeEvent.contentOffset;
      const viewSize = event.nativeEvent.layoutMeasurement;
      const pageNum = Math.floor(contentOffset.x / viewSize.width + 0.5);
      
      const currentMessagePage = messagePagination[messageIndex] || 0;
      if (currentMessagePage !== pageNum) {
        setMessagePagination(prev => ({
          ...prev,
          [messageIndex]: pageNum
        }));
      }
    };
    
    const currentMessagePage = messagePagination[messageIndex] || 0;
    
    // Apply filter if provided
    const filteredDrinks = drinks.filter((drink: Drink) => {
      const flavorMatch = !filters.flavorProfile || drink.flavor_profile === filters.flavorProfile;
      const strengthMatch = !filters.power || drink.strength === filters.power;
      return flavorMatch && strengthMatch;
    });

    // Add drinks to history with context
    const addDrinksToHistory = async () => {
      if (filteredDrinks && filteredDrinks.length > 0 && !processedMessages.has(messageIndex)) {
        
        setProcessedMessages((prev: Set<number>) => new Set([...prev, messageIndex]));
        
        for (const drink of filteredDrinks) {
          try {
            await addToHistory(drink);
            console.log(`Drink "${drink.name}" added to history successfully`);
          } catch (historyError) {
            console.error(`Failed to add drink "${drink.name}" to history:`, historyError);
          }
        }
      }
    }
    
    // Add drinks to history when drinks are loaded (not when filtered)
    useEffect(() => {
      if (drinks.length > 0 && !processedMessages.has(messageIndex)) {
        addDrinksToHistory();
      }
    }, [drinks, messageIndex]);
    
    // Horizontal Scroll View
    return (
      <View style={styles.container}>
        <ScrollView 
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          snapToInterval={windowWidth}
          snapToAlignment="center"
          contentContainerStyle={{ flexDirection: 'row' }}
        >
          {filteredDrinks.length > 0 ? (
          [
            ...filteredDrinks.slice(0, 2).map((drink: Drink, index: number) => (
              <View key={drink.name || index} style={styles.drinkContainer}>
                <DrinkView 
                    name={drink.name}
                    image={drink.image_description && drink.image_description.startsWith('http') ? {uri: drink.image_description} : null}
                    ingredients={drink.ingredients || []}
                    description={drink.description || ""}
                  />
              </View>
            )),
            <View key="recommend" style={styles.drinkContainer}>
                <RecommendDrinkView />
            </View>
          ]
          ) : (
            <View key="recommend" style={styles.drinkContainer}>
                <RecommendDrinkView />
            </View>
          )}
        </ScrollView>
        <View style={styles.pagination}>
        {/* Pagination Dots */}
        {filteredDrinks.length === 0 ? (
          <View 
            style={[
              styles.paginationDot,
              styles.paginationDotActive
            ]}
          />
        ) : (
          Array.from({ length: Math.min(filteredDrinks.length, 2) + 1 }, (_, index) => (
            <View 
              key={index}
              style={[
                styles.paginationDot,
                index === currentMessagePage && styles.paginationDotActive
              ]}
          />
        ))
        )}
      </View>
      {/* <DrinkInfoChatBox /> */}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    marginTop: 16,
  },
  drinkContainer: {
    width: Dimensions.get('window').width,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 14,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 2,
  },
  paginationDotActive: {
    backgroundColor: '#000000ff', 
    width: 22,
  },
})