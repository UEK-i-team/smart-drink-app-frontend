import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ComponentProps, useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../constants/theme';
import { useFavorites } from '../hooks/useFavorites';
import { Drink, FlavorProfile, StrengthLevel } from '../types/drink';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const FLAVOR_META: Record<FlavorProfile, { label: string; icon: IoniconName; accent: string; copy: string }> = {
  Sweet: { label: 'Słodki', icon: 'sparkles-outline', accent: '#F07867', copy: 'Delikatnie słodki profil' },
  Dry: { label: 'Wytrawny', icon: 'water-outline', accent: '#5E6472', copy: 'Czysty, wytrawny finisz' },
  Semi_sweet: { label: 'Półsłodki', icon: 'leaf-outline', accent: '#52796F', copy: 'Zbalansowany profil smaku' },
};

const STRENGTH_META: Record<StrengthLevel, { label: string; icon: IoniconName; accent: string; copy: string }> = {
  Low: { label: 'Delikatny', icon: 'sunny-outline', accent: '#7BC6A4', copy: 'Niska zawartość alkoholu' },
  Medium: { label: 'Średni', icon: 'flash-outline', accent: '#FF9F1C', copy: 'Zbalansowana moc drinka' },
  High: { label: 'Bardzo mocny', icon: 'flash-sharp', accent: '#E63946', copy: 'Pełna, intensywna moc' },
};

const DrinkDetailsScreen = () => {
  const router = useRouter();
  const { drink: drinkParam } = useLocalSearchParams<{ drink: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();

  const drink = useMemo<Drink | null>(() => {
    if (!drinkParam) return null;
    try {
      return JSON.parse(drinkParam) as Drink;
    } catch {
      return null;
    }
  }, [drinkParam]);

  if (!drink) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Nie udało się wczytać szczegółów drinka.</Text>
        <Pressable onPress={() => router.back()} style={styles.backButtonFallback}>
          <Text style={styles.backButtonFallbackText}>Wróć</Text>
        </Pressable>
      </View>
    );
  }

  const flavorMeta = FLAVOR_META[drink.flavorProfile] ?? FLAVOR_META.Sweet;
  const strengthMeta = STRENGTH_META[drink.strength] ?? STRENGTH_META.Medium;
  const favorited = isFavorite(drink.id);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Image source={{ uri: drink.imageUrl }} style={styles.heroImage} />
        <Pressable
          accessibilityLabel="Wróć"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
        >
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </Pressable>
        <Pressable
          accessibilityLabel="Dodaj do ulubionych"
          onPress={() => toggleFavorite(drink)}
          style={({ pressed }) => [
            styles.favoriteButton,
            pressed && styles.buttonPressed,
            favorited && styles.favoriteButtonActive,
          ]}
        >
          <Ionicons name={favorited ? 'heart' : 'heart-outline'} size={22} color={colors.white} />
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
          value={strengthMeta.label}
          caption={strengthMeta.copy}
          iconName={strengthMeta.icon}
          accent={strengthMeta.accent}
        />
      </View>

      {drink.description ? (
        <Text style={styles.description}>{drink.description}</Text>
      ) : null}

      <SectionCard iconName="leaf-outline" title="Składniki">
        {drink.ingredients.map((ingredient) => (
          <View key={ingredient} style={styles.listRow}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>{ingredient}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard iconName="reader-outline" title="Sposób przygotowania">
        {drink.instructions.map((instruction, index) => (
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
      <Ionicons name={iconName} size={18} color={colors.textMuted} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 64,
    gap: spacing.md + 4,
  },
  heroCard: {
    overflow: 'hidden',
    position: 'relative',
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  heroImage: {
    width: '100%',
    height: 320,
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  favoriteButtonActive: {
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
  },
  title: {
    ...typography.h1,
    color: colors.textDark,
    paddingHorizontal: spacing.md,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  infoPill: {
    flex: 1,
    borderWidth: 2,
    borderRadius: radii.lg,
    padding: 14,
    backgroundColor: colors.card,
    gap: spacing.xs,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  infoCaption: {
    fontSize: 12,
    color: colors.textLight,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md + 4,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: colors.textMuted,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndex: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  backButtonFallback: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
  },
  backButtonFallbackText: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default DrinkDetailsScreen;
