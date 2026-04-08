import { SAMPLE_DRINKS } from "../constants/sample-drinks";
import { Drink } from "../types/drink";

// Unified API base URL, utilizing EXPO_PUBLIC environment variables with a fallback
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  getMockDrinks: `${API_URL}/get-mock-drinks`,
  getDrink: `${API_URL}/get-drink`,
  getHistory: `${API_URL}/getHistory`,
  addHistory: `${API_URL}/addHistory`,
};

export interface DrinksResponse {
  annotations: string;
  drinks: Drink[];
}

export interface GeminiResponse {
  annotations: string;
  drinks: Drink[];
}

/**
 * Get drinks with optional filters (incorporates backend fallback to SAMPLE_DRINKS)
 */
export async function getDrinks(
  filters: Record<string, any> = {},
): Promise<Drink[]> {
  try {
    const url = new URL(API_ENDPOINTS.getMockDrinks);
    // Append filters to url.searchParams if necessary
    // Object.entries(filters).forEach(([key, value]) => url.searchParams.append(key, String(value)));

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.drinks || data;
  } catch (error) {
    console.warn(
      "Backend unavailable, falling back to mock SAMPLE_DRINKS.",
      error,
    );

    // Map SAMPLE_DRINKS to match the backend structure expected by the app
    const fallbackDrinks = SAMPLE_DRINKS.map((drink) => ({
      ...drink,
      flavor_profile: drink.flavor_profile,
      image_description: drink.imageUrl,
    })) as unknown as Drink[];

    return fallbackDrinks;
  }
}

/**
 * Get single drink by ID
 */
export async function getDrinkById(id: string | number): Promise<Drink> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching drink:", error);
    throw error;
  }
}

/**
 * Get history
 */
export async function getHistory(): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINTS.getHistory, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching history:", error);
    throw error;
  }
}

/**
 * Add a drink to history
 */
export async function addToHistory(drink: Drink): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINTS.addHistory, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drink }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating history:", error);
    throw error;
  }
}

/**
 * Fetches mock drinks from the backend
 */
export async function getMockDrinks(): Promise<DrinksResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.getMockDrinks, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching mock drinks:", error);
    throw error;
  }
}

/**
 * Sends a prompt to get drink recommendations from AI
 */
export async function getDrinkRecommendation(
  prompt: string,
): Promise<GeminiResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.getDrink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting drink recommendation:", error);
    throw error;
  }
}
