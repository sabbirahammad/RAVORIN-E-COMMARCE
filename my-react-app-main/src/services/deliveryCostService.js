import axios from 'axios';

// Get auth token from localStorage or context
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Fetch delivery costs from backend
export const fetchDeliveryCosts = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get('https://apii.ravorin.com/api/v1/admin/delivery-costs', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      return response.data.deliveryCosts;
    } else {
      throw new Error('Failed to fetch delivery costs');
    }
  } catch (error) {
    console.error('Error fetching delivery costs:', error);
    // Return default values if API fails
    return {
      dhakaInside: 60,
      dhakaOutside: 120
    };
  }
};

// Calculate delivery cost based on shipping address
export const calculateDeliveryCost = (shippingAddress, deliveryCosts) => {
  if (!shippingAddress || !deliveryCosts) {
    return deliveryCosts?.dhakaOutside || 120; // Default to outside if no address
  }

  // Check if the city contains "Dhaka" (case insensitive)
  const city = shippingAddress.city || '';
  const isDhaka = city.toLowerCase().includes('dhaka');

  return isDhaka ? deliveryCosts.dhakaInside : deliveryCosts.dhakaOutside;
};

// Get delivery cost for a specific address
export const getDeliveryCostForAddress = async (shippingAddress) => {
  try {
    const deliveryCosts = await fetchDeliveryCosts();
    return calculateDeliveryCost(shippingAddress, deliveryCosts);
  } catch (error) {
    console.error('Error calculating delivery cost:', error);
    return 120; // Default fallback
  }
};
