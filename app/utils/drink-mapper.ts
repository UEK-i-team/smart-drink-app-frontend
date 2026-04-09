import { Drink, DrinkApiPayload, FlavorProfile, StrengthLevel } from '../types/drink';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';

const VALID_FLAVOR_PROFILES: FlavorProfile[] = ['Sweet', 'Semi_sweet', 'Dry'];
const VALID_STRENGTHS: StrengthLevel[] = ['Low', 'Medium', 'High'];

function normalizeFlavorProfile(value: string): FlavorProfile {
  const normalized = value.trim().replace(/[-\s]/g, '_');
  const found = VALID_FLAVOR_PROFILES.find(
    (fp) => fp.toLowerCase() === normalized.toLowerCase()
  );
  return found ?? 'Sweet';
}

function normalizeStrength(value: string): StrengthLevel {
  const found = VALID_STRENGTHS.find(
    (s) => s.toLowerCase() === value.trim().toLowerCase()
  );
  return found ?? 'Medium';
}

export function mapApiDrinkToDrink(payload: DrinkApiPayload, index: number): Drink {
  const imageUrl =
    payload.image_url && payload.image_url.startsWith('http')
      ? payload.image_url
      : DEFAULT_IMAGE;

  return {
    id: `${Date.now()}-${index}-${payload.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: payload.name,
    description: payload.description,
    flavorProfile: normalizeFlavorProfile(payload.flavor_profile),
    strength: normalizeStrength(payload.strength),
    imageUrl,
    imageDescription: payload.image_description,
    ingredients: payload.ingredients ?? [],
    instructions: payload.instructions ?? [],
  };
}
