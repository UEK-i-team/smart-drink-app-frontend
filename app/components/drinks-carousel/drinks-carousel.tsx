import React, { useState } from "react";
import { 
    ScrollView, 
    StyleSheet, 
    View
} from "react-native";
import { DrinkView } from "../drink-view/drink-view";
import { RecommendDrinkView } from "../recommend-drink-view/recommend-drink-view";
import { DrinkInfoChatBox } from "../drink-info-chat-box/drink-info-chat-box";
import { Dimensions } from "react-native";
import { SAMPLE_DRINKS } from "../../constants/sample-drinks";
import { Drink } from "../../types/drink";

export const DrinksCarousel = ({ message, messageIndex }: { message: string; messageIndex: number  }) => {
    const windowWidth = Dimensions.get("window").width;
    
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
    const filteredDrinks = SAMPLE_DRINKS;
    
    // Horizontal Scroll View
    return (
      <View style={styles.container}>
        <ScrollView 
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          snapToInterval={windowWidth}
          snapToAlignment="center"
        >
          {filteredDrinks.slice(0, 2).map((drink: Drink) => (
            <View key={drink.id} style={styles.drinkContainer}>
             <DrinkView 
                name={drink.name}
                image={{uri: drink.imageUrl}}
                ingredients={[]}
                description={drink.description || ""}
              />
            </View>
          ))}
          <View key="recommend" style={styles.drinkContainer}>
            <RecommendDrinkView />
          </View>
        </ScrollView>
        <View style={styles.pagination}>
        {/* Pagination Dots */}
        {[0, 1, 2].map((index) => (
          <View 
            key={index}
            style={[
              styles.paginationDot,
              index === currentMessagePage && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
      <DrinkInfoChatBox />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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