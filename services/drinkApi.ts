const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

enum FlavorProfiles {
  SWEET = 'Sweet',
  SEMI_SWEET = 'Semi_sweet',
  DRY = 'Dry',
}

enum Strengths {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface Drink {
  name: string;
  description: string;
  flavor_profile: FlavorProfiles;
  strength: Strengths;
  ingredients: string[];
  instructions: string[];
  image_description: string;
}

export async function createDrink(prompt: string): Promise<Drink> {
  const res = await fetch(`${API_URL}/getDrink`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`Failed to create drink: ${res.status}`);
  return res.json();
}
