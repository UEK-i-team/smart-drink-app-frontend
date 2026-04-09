import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FlaskAndGlassSVG from '../../assets/svgs/flask-and-glass-svg';
import { ChatBoxText } from '../components/chat-box-text/chat-box-text';
import { DrinkInfoCard } from '../components/drink-info-card/drink-info-card';
import { DrinksCarousel } from '../components/drinks-carousel/drinks-carousel';
import ErrorDisplay from '../components/error-display/error-display';
import InputBoxWithSuggestions from '../components/input-box-with-suggestions';
import { colors } from '../constants/theme';
import { useHistory } from '../hooks/useHistory';
import { useDrinkRecommendations } from '../hooks/useDrinkRecommendations';
import { Drink } from '../types/drink';

interface Filters {
  flavorProfile: string;
  power: string;
}

interface ChatMessage {
  id: string;
  text: string;
  filters: Filters;
  drinks: Drink[];
  status: 'loading' | 'success' | 'error';
}

export default function DrinkChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [filters, setFilters] = useState<Filters>({
    flavorProfile: 'sweet',
    power: 'medium',
  });
  const [currentError, setCurrentError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const { addToHistory } = useHistory();
  const { fetchDrinks } = useDrinkRecommendations();

  const validateInput = (text: string): boolean =>
    text.trim().length >= 3 && text.trim().length <= 500;

  const handleFilterChange = (filterData: {
    drinkOptions: string[];
    power: string;
    flavorProfile: string;
  }) => {
    setFilters({ flavorProfile: filterData.flavorProfile, power: filterData.power });
  };

  const handleSendMessage = async () => {
    if (!validateInput(inputText)) return;

    const messageId = `${Date.now()}`;
    const sentText = inputText;
    const sentFilters = { ...filters };

    setInputText('');
    setMessages((prev) => [
      ...prev,
      { id: messageId, text: sentText, filters: sentFilters, drinks: [], status: 'loading' },
    ]);

    try {
      const drinks = await fetchDrinks(sentText);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, drinks, status: 'success' } : msg
        )
      );

      for (const drink of drinks) {
        await addToHistory(drink);
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: 'error' } : msg
        )
      );
      setCurrentError('Nie udało się pobrać propozycji drinków. Spróbuj ponownie.');
    }
  };

  const handleRetry = async (messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;

    setCurrentError(null);
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, status: 'loading', drinks: [] } : m))
    );

    try {
      const drinks = await fetchDrinks(msg.text);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, drinks, status: 'success' } : m))
      );
      for (const drink of drinks) {
        await addToHistory(drink);
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: 'error' } : m))
      );
      setCurrentError('Nie udało się pobrać propozycji drinków. Spróbuj ponownie.');
    }
  };

  const handleRequestMore = async (messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;
    await handleRetry(messageId);
  };

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
        onPress={() => router.push('/screens/favorites-history-screen')}
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
          messages.map((msg) => (
            <View key={msg.id} style={styles.messageContainer}>
              <ChatBoxText
                message={msg.text}
                onHistoryPress={() => setInputText(msg.text)}
                onRetryPress={() => handleRetry(msg.id)}
                hasError={msg.status === 'error'}
              />
              <DrinksCarousel
                drinks={msg.drinks}
                isLoading={msg.status === 'loading'}
                onRequestMore={() => handleRequestMore(msg.id)}
              />
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.fixedBottomSection}>
        <DrinkInfoCard
          tasteProfile={filters.flavorProfile}
          drinkPower={filters.power}
          onSelectionChange={handleFilterChange}
        />
        <View style={styles.inputWrapper}>
          <InputBoxWithSuggestions
            value={inputText}
            onChange={setInputText}
            onSend={handleSendMessage}
            onSelectionChange={handleFilterChange}
            placeholder="Z jakim drinkiem ci pomóc"
            disabled={false}
            validationError={!validateInput(inputText) && inputText.length > 0}
          />
        </View>
      </View>

      <ErrorDisplay
        error={currentError}
        onDismiss={() => setCurrentError(null)}
        autoHide
        duration={8000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
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
  emptyScrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80,
  },
  navHistoryButton: {
    position: 'absolute',
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
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
    backgroundColor: colors.backgroundMuted,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
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
