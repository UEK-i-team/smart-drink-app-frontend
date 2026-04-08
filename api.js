const API_BASE_URL = 'http://localhost:3000';

// Get drinks with optional filters
export const getDrinks = async (filters = {}) => {
  try {
    const url = `${API_BASE_URL}/get-mock-drinks`;


    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.drinks || data;
  } catch (error) {
    console.error('Error fetching drinks:', error);
    throw error;
  }
};

// Get single drink by ID
export const getDrinkById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching drink:', error);
    throw error;
  }
};

// Get history
export const getHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/getHistory`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

// Add to history
export const addToHistory = async (drink) => {
  try {
    const response = await fetch(`${API_BASE_URL}/addHistory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ drink })
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating history:', error);
    throw error;
  }
};