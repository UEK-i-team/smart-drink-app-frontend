import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { DrinkView } from "../components/drink-view/drink-view";
import { createDrink } from "../services/drinkApi";

export default function Index() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createdDrinkText, setCreatedDrinkText] = useState<string | null>(null);

  async function handleCreate() {
    try {
      setCreating(true);
      setCreatedDrinkText(null);
      const drink = await createDrink("Podaj 3 kreatywne drinki z rumem i colą");
      const summary = `Name: ${drink.name}\nDescription: ${drink.description || "-"}\nIngredients: ${(drink.ingredients || []).join(", ")}`;
      setCreatedDrinkText(summary);
    } catch (e: any) {
      setCreatedDrinkText(`Error: ${e.message || e.toString()}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <DrinkView
          name="Sazerac"
          image={require("@/assets/images/drink.png")} // generowany img
          ingredients={[
            "Whiskey",
            "Absynt",
            "Gorzki angostura",
            "Bardzo mocne",
          ]}
          description="Klasyczny koktajl z Nowego Orleanu. Sazerac to mocny, wyrafinowany eliksir na bazie żytniei whiskey z absyntem, nutą i aromatem cytrusów."
          isSelected={true}
          isFavorite={isFavorite}
          onFavoritePress={() => setIsFavorite(!isFavorite)}
          onPress={() => console.log("Drink card pressed")}
        />
        <Button
          title={creating ? "Creating..." : "Create drink"}
          onPress={handleCreate}
          disabled={creating}
        />
        {createdDrinkText && (
          <Text style={styles.resultText}>{createdDrinkText}</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  resultText: {
    color: "#fff",
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
  },
});
