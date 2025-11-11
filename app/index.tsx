import { StyleSheet, View } from "react-native";
import { IngredientDrinks } from "../components/ingredient-drinks";

export default function Index() {
  return (
    <View style={styles.container}>
      <IngredientDrinks initialIngredient="pineapple" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
});
