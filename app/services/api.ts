import { DrinksApiResponse } from '../types/drink';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
const TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly type: 'network' | 'timeout' | 'server'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new ApiError(
        'Przekroczono czas oczekiwania. Spróbuj ponownie.',
        'timeout'
      );
    }
    throw new ApiError(
      'Błąd sieci: Nie można połączyć z serwerem.',
      'network'
    );
  } finally {
    clearTimeout(timerId);
  }
}

export async function getDrinkRecommendations(
  prompt: string
): Promise<DrinksApiResponse> {
  const response = await fetchWithTimeout(`${API_URL}/get-drink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new ApiError(`Serwer zwrócił błąd: ${response.status}`, 'server');
  }

  return response.json();
}

export async function getMockDrinks(): Promise<DrinksApiResponse> {
  const response = await fetchWithTimeout(`${API_URL}/get-mock-drinks`);

  if (!response.ok) {
    throw new ApiError(`Serwer zwrócił błąd: ${response.status}`, 'server');
  }

  return response.json();
}
