export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const estimateCost = async (requestData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error estimating cost:', error);
    throw error;
  }
};
