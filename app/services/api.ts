import { API_ENDPOINTS } from '../config/api';
import { Drink } from '../types/drink';

export interface DrinksResponse {
  annotations: string;
  drinks: Drink[];
}

export interface GeminiResponse {
  annotations: string;
  drinks: Drink[];
}

/**
 * Fetches mock drinks from the backend
 */
export async function getMockDrinks(): Promise<DrinksResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.getMockDrinks, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching mock drinks:', error);
    throw error;
  }
}

/**
 * Sends a prompt to get drink recommendations from AI
 */
export async function getDrinkRecommendation(prompt: string): Promise<GeminiResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.getDrink, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting drink recommendation:', error);
    throw error;
  }
}
