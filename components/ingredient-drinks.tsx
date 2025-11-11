import React, { useEffect, useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface DrinkShort {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  instructions?: string | null; // added english instructions
}

interface IngredientDrinksProps {
  initialIngredient?: string;
}

export const IngredientDrinks: React.FC<IngredientDrinksProps> = ({ initialIngredient = 'pineapple' }) => {
  const [ingredient, setIngredient] = useState(initialIngredient);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drinks, setDrinks] = useState<DrinkShort[]>([]);

  async function fetchDrinkDetails(id: string): Promise<string | null> {
    try {
      const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data?.drinks && Array.isArray(data.drinks) && data.drinks[0]) {
        return data.drinks[0].strInstructions || null;
      }
      return null;
    } catch {
      return null;
    }
  }

  async function fetchDrinks() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const raw = data.drinks;
      let parsed: DrinkShort[] = [];
      if (Array.isArray(raw)) {
        parsed = raw as DrinkShort[];
      } else if (typeof raw === 'string') {
        if (raw.toLowerCase().includes('no data')) {
          parsed = [];
        } else {
          throw new Error(raw);
        }
      } else if (raw == null) {
        parsed = [];
      } else {
        throw new Error('Unexpected response format');
      }

      parsed = parsed.slice(0, 3);

      const withInstructions = await Promise.all(
        parsed.map(async (d) => ({
          ...d,
            instructions: await fetchDrinkDetails(d.idDrink),
        }))
      );

      setDrinks(withInstructions);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
      setDrinks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDrinks();
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Ingredient (e.g. gin)"
          value={ingredient}
          onChangeText={setIngredient}
        />
        <Button title={loading ? 'Loading...' : 'Search'} onPress={fetchDrinks} disabled={loading} />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <ScrollView contentContainerStyle={styles.content}>
        {drinks.map(d => (
          <View key={d.idDrink} style={styles.card}>
            <Image source={{ uri: d.strDrinkThumb }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{d.strDrink}</Text>
              {d.instructions && (
                <Text style={styles.instructions} numberOfLines={5}>{d.instructions}</Text>
              )}
            </View>
          </View>
        ))}
        {!loading && drinks.length === 0 && !error && (
          <Text style={styles.empty}>No drinks found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 50,
  },
  content: {
    paddingBottom: 20,
    paddingHorizontal: 16,
    gap: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#444',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    flexShrink: 1,
    marginBottom: 4,
  },
  instructions: {
    color: '#ccc',
    fontSize: 12,
    lineHeight: 16,
  },
  error: {
    color: '#ff6666',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  empty: {
    color: '#aaa',
    paddingHorizontal: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});
