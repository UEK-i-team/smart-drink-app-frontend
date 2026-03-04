import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface DrinkViewProps {
  name: string;
  image: any;
  ingredients: string[];
  description: string;
  isSelected?: boolean;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  onPress?: () => void;
}

export const DrinkView: React.FC<DrinkViewProps> = ({
  name,
  image,
  ingredients,
  description,
  isSelected = false,
  isFavorite = false,
  onFavoritePress,
  onPress,
}) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <LinearGradient
          colors={["#D94A3D", "#C83828"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          {/* Image Section */}
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={image} style={styles.image} resizeMode="cover" onError={(error) => console.log('Image load error:', error)} />
            ) : (
              <View style={[styles.image, styles.placeholderImage]}>
                <Ionicons name="wine" size={40} color="#ffffff" />
              </View>
            )}
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.title}>{name}</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.recipeLabel}>PRZEPIS DRINKA</Text>
                  {isSelected && (
                    <>
                      <View style={styles.dot} />
                      <Text style={styles.statusText}>Wybrany</Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            {/* Ingredients */}
            <View style={styles.ingredientsContainer}>
              {ingredients.map((ingredient, index) => (
                <React.Fragment key={index}>
                  <Text style={styles.ingredient}>{ingredient}</Text>
                  {index < ingredients.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </React.Fragment>
              ))}
            </View>

            {/* Description */}
            <Text style={styles.description} numberOfLines={3}>
              {description}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Favorite Button - positioned above the container */}
      {/* <TouchableOpacity
        onPress={onFavoritePress}
        style={styles.favoriteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color="white"
        />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  container: {
    flexDirection: "row",
    borderRadius: 26,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  imageContainer: {
    width: 120,
    height: 220,
    backgroundColor: "#F5E6D3",
    borderRadius: 12,
    margin: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingLeft: 8,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  recipeLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
    letterSpacing: 0.5,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "white",
    marginHorizontal: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "400",
    color: "white",
  },
  // favoriteButton: {
  //   padding: 8,
  //   position: "absolute",
  //   top: -8,
  //   right: -8,
  //   backgroundColor: "black",
  //   borderRadius: 20,
  //   zIndex: 1,
  // },
  ingredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginVertical: 12,
  },
  ingredient: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
    marginRight: 4,
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: "white",
    opacity: 0.95,
  },
});
