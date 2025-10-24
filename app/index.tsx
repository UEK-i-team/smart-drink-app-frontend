import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { DrinkView } from "../components/drink-view/drink-view";

export default function Index() {
  const [isFavorite, setIsFavorite] = useState(false);

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
});