export type FlavorProfile = 'Sweet' | 'Semi_sweet' | 'Dry';
export type StrengthLevel = 'Low' | 'Medium' | 'High';

export interface Drink {
  id: string;
  name: string;
  description: string;
  flavorProfile: FlavorProfile;
  strength: StrengthLevel;
  imageUrl: string;
  imageDescription: string;
  ingredients: string[];
  instructions: string[];
}

/** Raw shape returned by the backend API */
export interface DrinkApiPayload {
  name: string;
  description: string;
  flavor_profile: string;
  strength: string;
  ingredients: string[];
  instructions: string[];
  image_description: string;
  image_url?: string;
}

export interface DrinksApiResponse {
  annotations: string;
  drinks: DrinkApiPayload[];
}
