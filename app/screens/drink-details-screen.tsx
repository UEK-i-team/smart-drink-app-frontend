import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Drink } from "../types/drink";

type IoniconName = ComponentProps<typeof Ionicons>["name"];
type FlavorProfileKey = "SWEET" | "BITTER" | "SMOKY" | "DRY" | "FRUITY";
type StrengthKey = "LIGHT" | "MEDIUM" | "STRONG";

interface DrinkApiResponse {
  name: string;
  description: string;
  flavor_profile: FlavorProfileKey;
  strength: StrengthKey;
  ingredients: string[];
  instructions: string[];
  image_description: string;
  image_url?: string;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";

const mockDrinkResponse: DrinkApiResponse = {
  name: "Mojito",
  description: "A refreshing Cuban cocktail with mint and lime.",
  flavor_profile: "SWEET",
  strength: "MEDIUM",
  ingredients: [
    "50ml white rum",
    "30ml lime juice",
    "10ml simple syrup",
    "6-8 mint leaves",
    "Soda water",
  ],
  instructions: [
    "Muddle mint leaves with lime juice and syrup w szklance.",
    "Dodaj rum oraz kostki lodu, delikatnie wymieszaj.",
    "Dopełnij sodą i raz jeszcze wymieszaj łyżką barmańską.",
    "Udekoruj gałązką mięty oraz ćwiartką limonki.",
  ],
  image_description:
    "A tall glass filled with ice, fresh mint leaves, and bubbling liquid with a lime wedge.",
  image_url:
    "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1200&q=80",
};

const flavorProfileMeta: Record<
  FlavorProfileKey,
  { label: string; icon: IoniconName; accent: string; copy: string }
> = {
  SWEET: {
    label: "Słodki",
    icon: "sparkles-outline",
    accent: "#F07867",
    copy: "Delikatnie słodki profil",
  },
  BITTER: {
    label: "Gorzki",
    icon: "leaf-outline",
    accent: "#52796F",
    copy: "Wyrazista goryczka",
  },
  SMOKY: {
    label: "Dymny",
    icon: "flame-outline",
    accent: "#D00000",
    copy: "Dymne nuty aromatyczne",
  },
  DRY: {
    label: "Wytrawny",
    icon: "water-outline",
    accent: "#5E6472",
    copy: "Czysty, wytrawny finisz",
  },
  FRUITY: {
    label: "Owocowy",
    icon: "logo-apple",
    accent: "#EA638C",
    copy: "Owocowa świeżość",
  },
};

const strengthMeta: Record<
  StrengthKey,
  { label: string; icon: IoniconName; accent: string; copy: string }
> = {
  LIGHT: {
    label: "Delikatny",
    icon: "sunny-outline",
    accent: "#7BC6A4",
    copy: "Niska zawartość alkoholu",
  },
  MEDIUM: {
    label: "Średni",
    icon: "flash-outline",
    accent: "#FF9F1C",
    copy: "Zbalansowana moc drinka",
  },
  STRONG: {
    label: "Bardzo mocny",
    icon: "flash-sharp",
    accent: "#E63946",
    copy: "Pełna, intensywna moc",
  },
};

const transformDrinkFromApi = (payload: DrinkApiResponse): Drink => ({
  id: "mock-drink-mojito",
  name: payload.name,
  description: payload.description,
  flavorProfile: payload.flavor_profile,
  strength: payload.strength,
  imageUrl: payload.image_url ?? DEFAULT_IMAGE,
  imageDescription: payload.image_description,
  ingredients: payload.ingredients,
  instructions: payload.instructions,
});

interface DrinkDetailsScreenProps {
  drinkData?: DrinkApiResponse;
}

const DrinkDetailsScreen = ({ drinkData }: DrinkDetailsScreenProps) => {
  const drink = useMemo(
    () => transformDrinkFromApi(drinkData ?? mockDrinkResponse),
    [drinkData]
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const flavorMeta =
    flavorProfileMeta[(drink.flavorProfile as FlavorProfileKey) ?? "SWEET"];
  const strength = strengthMeta[(drink.strength as StrengthKey) ?? "MEDIUM"];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Image source={{ uri: drink.imageUrl }} style={styles.heroImage} />
        <Pressable
          accessibilityLabel="Wróć"
          onPress={() => {}}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Pressable
          accessibilityLabel="Dodaj do ulubionych"
          onPress={() => setIsFavorite((prev) => !prev)}
          style={({ pressed }) => [
            styles.favoriteButton,
            pressed && styles.favoriteButtonPressed,
            isFavorite && styles.favoriteButtonActive,
          ]}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color="#fff"
          />
        </Pressable>
      </View>

      <Text style={styles.title}>{drink.name}</Text>

      <View style={styles.pillsRow}>
        <InfoPill
          label="PROFIL SMAKU"
          value={flavorMeta.label}
          caption={flavorMeta.copy}
          iconName={flavorMeta.icon}
          accent={flavorMeta.accent}
        />
        <InfoPill
          label="MOC DRINKA"
          value={strength.label}
          caption={strength.copy}
          iconName={strength.icon}
          accent={strength.accent}
        />
      </View>

      {drink.description ? (
        <Text style={styles.description}>{drink.description}</Text>
      ) : null}

      <SectionCard iconName="leaf-outline" title="Składniki">
        {drink.ingredients?.map((ingredient) => (
          <View key={ingredient} style={styles.listRow}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>{ingredient}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard iconName="reader-outline" title="Sposób przygotowania">
        {drink.instructions?.map((instruction, index) => (
          <View key={`${instruction}-${index}`} style={styles.stepRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepIndex}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{instruction}</Text>
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );
};

const InfoPill = ({
  label,
  value,
  caption,
  iconName,
  accent,
}: {
  label: string;
  value: string;
  caption: string;
  iconName: IoniconName;
  accent: string;
}) => (
  <View style={[styles.infoPill, { borderColor: accent }]}>
    <View style={styles.infoHeader}>
      <Ionicons name={iconName} size={16} color={accent} />
      <Text style={[styles.infoLabel, { color: accent }]}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
    <Text style={styles.infoCaption}>{caption}</Text>
  </View>
);

const SectionCard = ({
  iconName,
  title,
  children,
}: {
  iconName: IoniconName;
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <Ionicons name={iconName} size={18} color="#4a4a4a" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F4F2",
  },
  content: {
    paddingBottom: 64,
    gap: 20,
  },
  heroCard: {
    // borderRadius: 36,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  heroImage: {
    width: "100%",
    height: 320,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#111",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  favoriteButtonPressed: {
    transform: [{ scale: 0.96 }],
  },
  favoriteButtonActive: {
    backgroundColor: "#C73E1D",
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#111",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  backButtonPressed: {
    transform: [{ scale: 0.96 }],
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2E1A1A",
    paddingHorizontal: 16,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
  },
  infoPill: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#fff",
    gap: 4,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E1A1A",
  },
  infoCaption: {
    fontSize: 12,
    color: "#6B5F5B",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4A4A4A",
    paddingHorizontal: 16,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "#EFE6E1",
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E1A1A",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C73E1D",
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: "#4A4A4A",
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3D9D0",
    alignItems: "center",
    justifyContent: "center",
  },
  stepIndex: {
    fontSize: 14,
    fontWeight: "700",
    color: "#C73E1D",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: "#4A4A4A",
  },
});

export default DrinkDetailsScreen;
