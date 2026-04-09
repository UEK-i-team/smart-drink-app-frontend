import { useCallback, useEffect, useRef, useState } from 'react';
import { Drink } from '../types/drink';
import { loadFavorites, toggleFavoritePersisted } from '../utils/drink-storage';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const favoritesRef = useRef<Drink[]>([]);

  useEffect(() => {
    loadFavorites()
      .then((data) => {
        favoritesRef.current = data;
        setFavorites(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const toggleFavorite = useCallback(async (drink: Drink) => {
    const updated = await toggleFavoritePersisted(drink, favoritesRef.current);
    favoritesRef.current = updated;
    setFavorites(updated);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoritesRef.current.some((f) => f.id === id),
    []
  );

  return { favorites, toggleFavorite, isFavorite, isLoading };
}
