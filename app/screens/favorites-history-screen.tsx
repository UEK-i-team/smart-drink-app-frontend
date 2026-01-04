import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Background from "../components/main-background/Background";
import DrinkCard from "../components/drink-card/drink-card";
import ErrorDisplay from "../components/error-display/error-display";
import { Drink } from "../types/drink";
import {
  ensureHistorySeeded,
  loadFavorites,
  toggleFavoritePersisted,
  upsertHistoryEntry,
} from "../utils/drink-storage";
import { Ionicons } from "@expo/vector-icons";
import { getHistory } from "@/api.js";

const TABS = [
  { key: "favorites" as const, label: "Ulubione" },
  { key: "history" as const, label: "Historia" },
];

type TabKey = (typeof TABS)[number]["key"];

const FavoritesHistoryScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>("favorites");
  const [favorites, setFavorites] = useState<Drink[]>([]);
  const [history, setHistory] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(
    async (options?: { skipLoader?: boolean }) => {
      const skipLoader = options?.skipLoader ?? false;
      setErrorMessage(null);
      if (!skipLoader) {
        setIsLoading(true);
      }

      // Load history
      try {
        const historyData = await getHistory();
        setHistory(historyData);
      } catch (error) {
        let errorMessage = "Nie udało się wczytać historii. Spróbuj ponownie.";
        
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          errorMessage = 'Błąd sieci: Nie można połączyć z serwerem. Sprawdź połączenie z internetem.';
        } else if (error instanceof Error && error.message.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = 'Odrzucono połączenie: Serwer backend nie jest uruchomiony lub nie jest dostępny.';
        } else if (error instanceof Error && error.message.includes('timeout')) {
          errorMessage = 'Przekroczono czas oczekiwania: Serwer odpowiada zbyt wolno. Spróbuj ponownie.';
        } else if (typeof error === 'string' && error.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = 'Odrzucono połączenie: Serwer backend nie jest uruchomiony lub nie jest dostępny.';
        } else if (error && typeof error === 'object' && 'message' in error) {
          const errorMsg = (error as any).message;
          if (errorMsg.includes('ERR_CONNECTION_REFUSED')) {
            errorMessage = 'Odrzucono połączenie: Serwer backend nie jest uruchomiony lub nie jest dostępny.';
          } else if (errorMsg.includes('Failed to fetch')) {
            errorMessage = 'Błąd sieci: Nie można połączyć z serwerem. Sprawdź połączenie z internetem.';
          }
        }
        
        setErrorMessage(errorMessage);
      }

      try {
        const [storedFavorites] = await Promise.all([
          loadFavorites(),
          // ensureHistorySeeded(historyData),
        ]);

        setFavorites(storedFavorites);
      } catch (error) {
        
        let errorMessage = "Nie udało się wczytać danych. Spróbuj ponownie.";
        
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          errorMessage = 'Błąd sieci: Nie można połączyć z serwerem. Sprawdź połączenie z internetem.';
        } else if (error instanceof Error && error.message.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = 'Odrzucono połączenie: Serwer backend nie jest uruchomiony lub nie jest dostępny.';
        } else if (error instanceof Error && error.message.includes('timeout')) {
          errorMessage = 'Przekroczono czas oczekiwania: Serwer odpowiada zbyt wolno. Spróbuj ponownie.';
        }
        
        setErrorMessage(errorMessage);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setErrorMessage(null);
    await loadData({ skipLoader: true });
  }, [loadData]);

  const handleToggleFavorite = useCallback(
    async (drink: Drink) => {
      try {
        const updatedFavorites = await toggleFavoritePersisted(drink, favorites);
        setFavorites(updatedFavorites);

        const updatedHistory = await upsertHistoryEntry(drink, history);
        setHistory(updatedHistory);
      } catch (error) {
        
        let errorMessage = "Nie udało się zapisać zmian. Spróbuj ponownie.";
        
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          errorMessage = 'Błąd sieci: Nie można połączyć z serwerem. Sprawdź połączenie z internetem.';
        } else if (error instanceof Error && error.message.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = 'Odrzucono połączenie: Serwer backend nie jest uruchomiony lub nie jest dostępny.';
        } else if (error instanceof Error && error.message.includes('timeout')) {
          errorMessage = 'Przekroczono czas oczekiwania: Serwer odpowiada zbyt wolno. Spróbuj ponownie.';
        }
        
        setErrorMessage(errorMessage);
      }
    },
    [favorites, history]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load data when tab changes
  useEffect(() => {
    loadData({ skipLoader: true });
  }, [activeTab, loadData]);

  const displayedData = activeTab === "favorites" ? favorites : history;

  const listEmptyComponent = (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>
        {activeTab === "favorites"
          ? "Brak ulubionych drinków"
          : "Brak historii"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === "favorites"
          ? "Dodaj drinka do ulubionych, klikając ikonę serca."
          : "Historia zapisze się automatycznie, gdy odwiedzisz karty drinków."}
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
                name={tab.key === "favorites" ? "heart-outline" : "time-outline"}
                size={16}
                color={activeTab === tab.key ? "#fff" : "#3F3F3F"}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.key && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
        {isLoading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator color="#111" />
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
                onToggleFavorite={handleToggleFavorite}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
            }
            ListEmptyComponent={listEmptyComponent}
          />
        )}
      </View>
      <ErrorDisplay 
          error={errorMessage}
          onDismiss={() => setErrorMessage(null)}
          autoHide={true}
          duration={8000}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  topBar: {
    alignSelf: "center",
    width: 72,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#111",
    marginBottom: 4,
  },
  tabRow: {
    flexDirection: "row",
    gap: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#cececeff",
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: "#111",
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3F3F3F",
  },
  tabLabelActive: {
    color: "#fff",
  },
  errorText: {
    color: "#B00020",
    fontSize: 13,
    textAlign: "center",
  },
  loaderWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingVertical: 14,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});

export default FavoritesHistoryScreen;
