export interface Drink {
  id: string;
  name: string;
  flavorProfile: string;
  strength: string;
  description?: string;
  imageUrl: string;
  ingredients?: string[];
  instructions?: string[];
  imageDescription?: string;
}
