import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

const ACTIVE_BOLT_COLOR = "#FF6B00";
const INACTIVE_BOLT_COLOR = "#CDC5BD";
const ICON_COLOR = "#1F1F1F";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type TasteProfileConfig = {
  labelPl: string;
  iconName: IconName;
  aliases?: string[];
};

type PowerLevelConfig = {
  labelPl: string;
  bolts: number;
  aliases?: string[];
};

export const TASTE_PROFILE_CONFIG: Record<string, TasteProfileConfig> = {
  "sweet": {
    labelPl: "Słodki",
    iconName: "fruit-cherries",
    aliases: ["slodki", "słodki", "sweet"],
  },
  "dry": {
    labelPl: "Wytrawny",
    iconName: "fruit-grapes",
    aliases: ["wytrawny", "dry"],
  },
  "semi_sweet": {
    labelPl: "Półsłodki",
    iconName: "fruit-pineapple",
    aliases: ["pol-slodki", "pół-słodki", "półsłodki", "semi_sweet", "semi-sweet", "semisweet"],
  },
  "semi-dry": {
    labelPl: "Pół wytrawny",
    iconName: "fruit-watermelon",
    aliases: ["pol-wytrawny", "pół-wytrawny"],
  },
  herbal: {
    labelPl: "Ziołowy",
    iconName: "leaf",
    aliases: ["ziolowy", "ziołowy"],
  },
  sour: {
    labelPl: "Kwaśny",
    iconName: "fruit-citrus",
    aliases: ["kwasny", "kwaśny"],
  },
};

export const POWER_LEVEL_CONFIG: Record<string, PowerLevelConfig> = {
  "low": { labelPl: "Słabe", bolts: 1, aliases: ["slabe", "weak", "low"] },
  "medium": { labelPl: "Średni", bolts: 2, aliases: ["sredni", "średni", "medium"] },
  "high": { labelPl: "Mocne", bolts: 3, aliases: ["mocne", "strong", "high"] },
};

const normalizeKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const resolveVariant = <T extends { aliases?: string[] }>(
  value: string,
  config: Record<string, T>
): T | undefined => {
  const normalized = normalizeKey(value);
  return (
    config[normalized] ||
    Object.values(config).find((entry) => entry.aliases?.includes(normalized))
  );
};

// Convert English keys to Polish labels for backend filtering
export const englishToPolishPower = (englishKey: string): string => {
  const config = POWER_LEVEL_CONFIG[englishKey];
  return config?.labelPl || englishKey;
};

export const englishToPolishTaste = (englishKey: string): string => {
  const config = TASTE_PROFILE_CONFIG[englishKey];
  return config?.labelPl || englishKey;
};

export interface DrinkInfoCardProps {
  tasteProfile: string;
  tasteProfileIcon?: ReactNode;
  drinkPower: string;
}

export const DrinkInfoCard: React.FC<DrinkInfoCardProps> = ({
  tasteProfile,
  tasteProfileIcon,
  drinkPower,
}) => {
  const tasteConfig = resolveVariant(tasteProfile, TASTE_PROFILE_CONFIG);
  const powerConfig = resolveVariant(drinkPower, POWER_LEVEL_CONFIG);

  const resolvedTasteLabel = tasteConfig?.labelPl ?? tasteProfile;
  const resolvedPowerLabel = powerConfig?.labelPl ?? drinkPower;
  const boltsToFill = powerConfig?.bolts ?? 0;

  const fallbackIconName: IconName = tasteConfig?.iconName ?? "glass-cocktail";
  const icon = tasteProfileIcon ?? (
    <MaterialCommunityIcons
      name={fallbackIconName}
      size={28}
      color={ICON_COLOR}
    />
  );

  return (
    <View style={styles.container}>
      {/* Taste Section */}
      <View style={styles.section}>
        <View style={styles.iconWrapper}>{icon}</View>
        <View>
          <Text style={styles.label}>PROFIL SMAKU</Text>
          <Text style={styles.value}>{resolvedTasteLabel}</Text>
        </View>
      </View>

      {/* Power Section */}
      <View style={[styles.section, styles.powerSection]}>
        <View style={styles.powerIcons}>
          {Array.from({ length: 3 }).map((_, index) => (
            <MaterialCommunityIcons
              key={index}
              name="flash"
              size={22}
              color={
                index < boltsToFill ? ACTIVE_BOLT_COLOR : INACTIVE_BOLT_COLOR
              }
            />
          ))}
        </View>
        <View>
          <Text style={styles.label}>MOC DRINKA</Text>
          <Text style={styles.value}>{resolvedPowerLabel}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F4F1",
    borderColor: "#FF6D2A",
    borderWidth: 1.1,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 26,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  powerSection: {
    gap: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE3D4",
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.7,
    color: "#4A4A4A",
    fontWeight: "700",
    marginBottom: 2,
  },
  value: {
    fontSize: 20,
    fontWeight: "600",
    color: "#101010",
  },
  powerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
