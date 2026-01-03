const API_BASE_URL = 'http://localhost:3000';

// Get drinks with optional filters
export const getDrinks = async (filters = {}) => {
  try {
    const url = `${API_BASE_URL}/`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    
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