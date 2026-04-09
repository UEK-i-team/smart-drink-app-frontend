import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../../constants/theme';
import { Drink } from '../../types/drink';
import { DrinkView } from '../drink-view/drink-view';
import { RecommendDrinkView } from '../recommend-drink-view/recommend-drink-view';

interface DrinksCarouselProps {
  drinks: Drink[];
  isLoading: boolean;
  onRequestMore?: () => void;
}

export const DrinksCarousel = ({ drinks, isLoading, onRequestMore }: DrinksCarouselProps) => {
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width + 0.5);
    if (currentPage !== pageNum) {
      setCurrentPage(pageNum);
    }
  };

  const handleDrinkPress = (drink: Drink) => {
    router.push({
      pathname: '/screens/drink-details-screen',
      params: { drink: JSON.stringify(drink) },
    });
  };

  const visibleDrinks = drinks.slice(0, 2);
  const totalPages = visibleDrinks.length + 1; // drinks + recommend card

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        snapToInterval={windowWidth - 20}
        snapToAlignment="center"
        contentContainerStyle={{ flexDirection: 'row' }}
      >
        {visibleDrinks.map((drink) => (
          <View key={drink.id} style={[styles.drinkContainer, { width: windowWidth - 20 }]}>
            <DrinkView
              name={drink.name}
              image={drink.imageUrl ? { uri: drink.imageUrl } : null}
              ingredients={drink.ingredients}
              description={drink.description}
              onPress={() => handleDrinkPress(drink)}
            />
          </View>
        ))}
        <View style={[styles.drinkContainer, { width: windowWidth - 20 }]}>
          <RecommendDrinkView onPress={onRequestMore} />
        </View>
      </ScrollView>

      <View style={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <View
            key={index}
            style={[styles.paginationDot, index === currentPage && styles.paginationDotActive]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    marginTop: 16,
  },
  loadingContainer: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  drinkContainer: {
    // width set dynamically
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
    backgroundColor: colors.inactive,
    marginHorizontal: 2,
  },
  paginationDotActive: {
    backgroundColor: colors.black,
    width: 22,
  },
});
