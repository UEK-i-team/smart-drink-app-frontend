import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DrinkCard from '../components/drink-card/drink-card';
import Background from '../components/main-background/Background';
import { colors, radii, spacing } from '../constants/theme';
import { useFavorites } from '../hooks/useFavorites';
import { useHistory } from '../hooks/useHistory';
import { Drink } from '../types/drink';

const TABS = [
  { key: 'favorites' as const, label: 'Ulubione' },
  { key: 'history' as const, label: 'Historia' },
];

type TabKey = (typeof TABS)[number]['key'];

const FavoritesHistoryScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>('favorites');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { favorites, toggleFavorite, isLoading: favLoading } = useFavorites();
  const { history, isLoading: histLoading } = useHistory();

  const isLoading = favLoading || histLoading;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // AsyncStorage reads are fast; just a brief visual indicator
    setTimeout(() => setIsRefreshing(false), 400);
  }, []);

  const displayedData: Drink[] = activeTab === 'favorites' ? favorites : history;

  const listEmptyComponent = (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>
        {activeTab === 'favorites' ? 'Brak ulubionych drinków' : 'Brak historii'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'favorites'
          ? 'Dodaj drinka do ulubionych, klikając ikonę serca.'
          : 'Historia zapisze się automatycznie po przeglądaniu drinków.'}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <Background />
      <View style={styles.content}>
        <View style={styles.topBar} />
        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            >
              <Ionicons
                name={tab.key === 'favorites' ? 'heart-outline' : 'time-outline'}
                size={16}
                color={activeTab === tab.key ? colors.white : '#3F3F3F'}
              />
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator color={colors.black} />
          </View>
        ) : (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={displayedData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DrinkCard
                drink={item}
                isFavorite={favorites.some((fav) => fav.id === item.id)}
                onToggleFavorite={toggleFavorite}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
            }
            ListEmptyComponent={listEmptyComponent}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  topBar: {
    alignSelf: 'center',
    width: 72,
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.black,
    marginBottom: spacing.xs,
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radii.md,
    backgroundColor: colors.tabInactive,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: colors.tabActive,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3F3F3F',
  },
  tabLabelActive: {
    color: colors.white,
  },
  loaderWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingVertical: 14,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});

export default FavoritesHistoryScreen;
