import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:6969/restaurant/${id}`);
        setRestaurant(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load restaurant details");
        setLoading(false);
      }
    };
    fetchRestaurantDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
        <div className="animate-spin h-16 w-16 border-t-4 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
        <p className="text-xl font-semibold text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-transform hover:scale-105"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-transform hover:scale-105"
        >
          <span className="text-lg">←</span> Back to Results
        </button>

        {restaurant && (
          <div className="space-y-6 bg-white/90 shadow-xl backdrop-blur-sm p-6 rounded-2xl">
            <img
              src={restaurant.featured_image}
              alt={restaurant.name}
              className="w-full h-60 object-cover rounded-lg"
            />
            <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            <p className="text-gray-600">{restaurant.location?.address}</p>
            <p className="text-lg font-semibold text-gray-800">
              Rating: {restaurant.user_rating?.aggregate_rating || 'N/A'}
            </p>
            <p className="text-gray-600">Cuisines: {restaurant.cuisines || 'Not specified'}</p>
            <p className="text-gray-600">Cost for Two: ₹{restaurant.average_cost_for_two || 'N/A'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
