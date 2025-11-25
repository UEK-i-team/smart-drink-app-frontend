import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Drink } from "../../types/drink";
import { Ionicons } from "@expo/vector-icons";

interface DrinkCardProps {
  drink: Drink;
  isFavorite: boolean;
  onToggleFavorite: (drink: Drink) => void;
}

const DrinkCard = ({ drink, isFavorite, onToggleFavorite }: DrinkCardProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.cardContainer}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: drink.imageUrl }} style={styles.image} />
        </View>
        <View style={styles.details}>
          <Text style={styles.title}>{drink.name}</Text>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>PROFIL SMAKU</Text>
            <Text style={styles.metaValue}>{drink.flavorProfile}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>MOC DRINKA</Text>
            <Text style={styles.metaValue}>{drink.strength}</Text>
          </View>
        </View>
      </View>
      <Pressable
        accessibilityLabel="Przełącz ulubione"
        onPress={() => onToggleFavorite(drink)}
        style={({ pressed }) => [
          styles.favoriteButton,
          pressed && styles.favoriteButtonPressed,
          isFavorite && styles.favoriteButtonActive,
        ]}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={22}
          color={isFavorite ? "#fff" : "#FF6B6B"}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    position: "relative",
    marginRight: 12,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C73E1D",
    borderRadius: 32,
    paddingVertical: 6,
    paddingHorizontal: 6,
    gap: 14,
    shadowColor: "#8C1F07",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  imageWrapper: {
    flexBasis: 161,
    height: 161,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#9F2F12",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  metaBlock: {
    marginBottom: 10,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#FAD4C0",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  favoriteButton: {
    position: "absolute",
    top: -12,
    right: -12,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  favoriteButtonActive: {
    backgroundColor: "#111",
  },
  favoriteButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
});

export default DrinkCard;
