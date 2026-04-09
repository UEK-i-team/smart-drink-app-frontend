import { useCallback, useEffect, useRef, useState } from 'react';
import { Drink } from '../types/drink';
import { loadHistory, saveHistory, upsertHistoryEntry } from '../utils/drink-storage';

export function useHistory() {
  const [history, setHistory] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const historyRef = useRef<Drink[]>([]);

  useEffect(() => {
    loadHistory()
      .then((data) => {
        historyRef.current = data;
        setHistory(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const addToHistory = useCallback(async (drink: Drink) => {
    const updated = await upsertHistoryEntry(drink, historyRef.current);
    historyRef.current = updated;
    setHistory(updated);
  }, []);

  const clearHistory = useCallback(async () => {
    await saveHistory([]);
    historyRef.current = [];
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory, isLoading };
}
