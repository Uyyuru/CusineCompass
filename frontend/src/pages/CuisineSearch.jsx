import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CuisineSearch() {
  // Initialize state with values from localStorage if they exist
  const [cuisine, setCuisine] = useState(() => localStorage.getItem('lastCuisine') || "");
  const [restaurants, setRestaurants] = useState(() => {
    const saved = localStorage.getItem('lastRestaurants');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => 
    parseInt(localStorage.getItem('lastPage')) || 1
  );
  const [totalPages, setTotalPages] = useState(() => 
    parseInt(localStorage.getItem('lastTotalPages')) || 1
  );
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [maxDistance, setMaxDistance] = useState(() => 
    parseInt(localStorage.getItem('lastMaxDistance')) || 25
  );
  const [distanceRange, setDistanceRange] = useState(() => 
    localStorage.getItem('lastDistanceRange') || 'nearby'
  );
  const [showDistanceFilter, setShowDistanceFilter] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isDistanceFilterActive, setIsDistanceFilterActive] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (cuisine) localStorage.setItem('lastCuisine', cuisine);
    if (restaurants.length) localStorage.setItem('lastRestaurants', JSON.stringify(restaurants));
    if (currentPage) localStorage.setItem('lastPage', currentPage.toString());
    if (totalPages) localStorage.setItem('lastTotalPages', totalPages.toString());
    if (maxDistance) localStorage.setItem('lastMaxDistance', maxDistance.toString());
    if (distanceRange) localStorage.setItem('lastDistanceRange', distanceRange);
  }, [cuisine, restaurants, currentPage, totalPages, maxDistance, distanceRange]);

  // Get user's location when component mounts
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationError(null);
          if (cuisine && restaurants.length === 0) {
            handleSearch(currentPage);
          }
        },
        (error) => {
          setLocationError("Unable to get your location. Distance calculation won't be available.");
          console.error("Error getting location:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  }, []);

  // Clear saved data when leaving the page
  useEffect(() => {
    return () => {
      // Uncomment if needed:
      // localStorage.removeItem('lastCuisine');
      // localStorage.removeItem('lastRestaurants');
      // localStorage.removeItem('lastPage');
      // localStorage.removeItem('lastTotalPages');
      // localStorage.removeItem('lastMaxDistance');
      // localStorage.removeItem('lastDistanceRange');
    };
  }, []);

  // Additional geolocation effect to avoid dependency warnings
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationError(null);
          if (cuisine && restaurants.length === 0) {
            handleSearch(currentPage);
          }
        },
        (error) => {
          setLocationError("Unable to get your location. Distance calculation won't be available.");
          console.error("Error getting location:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  }, []);

  // Optimize handleSearch with caching
  const handleSearch = useCallback(async (page = 1) => {
    if (!cuisine) {
      alert("Please enter a cuisine type");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        cuisine: cuisine,
        page: page.toString(),
        limit: '6'
      });
      if (userLocation && isDistanceFilterActive) {
        params.append('latitude', userLocation.latitude.toString());
        params.append('longitude', userLocation.longitude.toString());
        params.append('maxDistance', maxDistance.toString());
      }
      const response = await axios.get(`http://localhost:6969/restaurants-by-cuisine?${params}`);
      if (!response.data) {
        throw new Error('No data received');
      }
      const newRestaurants = response.data.data || [];
      if (newRestaurants.length === 0) {
        setError('No restaurants found for this cuisine type');
        setRestaurants([]);
      } else {
        setRestaurants(newRestaurants);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.total_pages);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to fetch restaurants. Please try again.');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [cuisine, userLocation, isDistanceFilterActive, maxDistance]);

  // Handle page changes (text or image-based search)
  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      if (fileInputRef.current?.files?.length > 0) {
        handleImageUpload({ target: { files: [fileInputRef.current.files[0]] } }, newPage);
      } else {
        handleSearch(newPage);
      }
    }
  }, [handleSearch, totalPages]);

  // Update distance range change handler
  const handleDistanceRangeChange = useCallback((range) => {
    setDistanceRange(range);
    setIsDistanceFilterActive(true);
    let newDistance;
    switch (range) {
      case 'nearby':
        newDistance = 10;
        break;
      case 'city':
        newDistance = 50;
        break;
      case 'state':
        newDistance = 500;
        break;
      case 'country':
        newDistance = 3000;
        break;
      default:
        newDistance = 50;
    }
    setMaxDistance(newDistance);
    if (cuisine) {
      setShowNotification(true);
      setSearchMessage(`Range updated to ${range}. Click Search to see restaurants within ${newDistance}km`);
      setTimeout(() => setShowNotification(false), 6000);
    }
  }, [cuisine]);

  // Form submit handler
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (cuisine.trim()) {
      handleSearch(1);
    }
  }, [handleSearch, cuisine]);

  // Clear distance filter
  const handleClearDistanceFilter = () => {
    setIsDistanceFilterActive(false);
    handleSearch(1);
  };

  // Save state before navigating to restaurant details
  const handleRestaurantClick = (restaurantId) => {
    localStorage.setItem('lastCuisine', cuisine);
    localStorage.setItem('lastRestaurants', JSON.stringify(restaurants));
    localStorage.setItem('lastPage', currentPage.toString());
    localStorage.setItem('lastTotalPages', totalPages.toString());
    localStorage.setItem('lastMaxDistance', maxDistance.toString());
    localStorage.setItem('lastDistanceRange', distanceRange);
    navigate(`/restaurant/${restaurantId}`);
  };

  // Handle image upload search
  const handleImageUpload = async (e, page = 1) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post(`/api/analyze-image?page=${page}&limit=6`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setRestaurants(response.data.result);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setCuisine(response.data.searchTags.join(', '));
      } else {
        setError('No restaurants found for the detected cuisine');
      }
    } catch (err) {
      console.error('Image analysis error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; z-index: 50; }
      `}</style>
      
      {/* Header Section */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          <h1 className="text-5xl font-extrabold text-center text-gray-800 tracking-tight mb-8">
            Find Your Next Meal
            <span className="block text-lg font-normal text-gray-500 mt-2">
              Search restaurants by cuisine type 
              {userLocation && <span className="text-green-600 ml-2 font-medium">• Location enabled</span>}
            </span>
          </h1>
          {locationError && (
            <div className="max-w-2xl mx-auto mb-4">
              <p className="text-amber-600 text-sm text-center">{locationError}</p>
            </div>
          )}

          {/* Two-Column Layout */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar - fixed narrow width on medium+ screens */}
            <div className="md:w-64 flex flex-col gap-8">
              {/* Image Filter Box */}
              <div className="flex flex-col items-center gap-4 p-6 bg-white/90 shadow-xl backdrop-blur-sm rounded-2xl">
                <h2 className="text-lg font-semibold text-gray-800">Image Search</h2>
                <p className="text-sm text-gray-500 text-center">
                  Upload a food image to find matching restaurants.
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current.click()} 
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  Upload Image
                </button>
              </div>

              {/* Distance Filter */}
              {userLocation && (
                <div className="bg-white/90 shadow-md backdrop-blur-sm p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                        />
                      </svg>
                      <span className="text-gray-700 font-semibold">Distance Filter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isDistanceFilterActive && (
                        <button onClick={handleClearDistanceFilter} className="text-red-500 hover:text-red-700 text-sm">
                          Clear
                        </button>
                      )}
                      <button onClick={() => setShowDistanceFilter(!showDistanceFilter)} className="text-gray-500 hover:text-gray-700">
                        {showDistanceFilter ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                  {showDistanceFilter && (
                    <div className="pt-2 space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleDistanceRangeChange('nearby')}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                            distanceRange === 'nearby' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          10km
                        </button>
                        <button 
                          onClick={() => handleDistanceRangeChange('city')}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                            distanceRange === 'city' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          50km
                        </button>
                        <button 
                          onClick={() => handleDistanceRangeChange('state')}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                            distanceRange === 'state' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          500km
                        </button>
                        <button 
                          onClick={() => handleDistanceRangeChange('country')}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                            distanceRange === 'country' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          3000km
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                        <span>
                          {distanceRange === 'nearby' && "Within walking distance"}
                          {distanceRange === 'city' && "City-wide"}
                          {distanceRange === 'state' && "State/Region"}
                          {distanceRange === 'country' && "Nationwide"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="md:flex-1 flex flex-col gap-8">
              {/* Text Search Form */}
              <div className="bg-white/90 shadow-md backdrop-blur-sm p-6 rounded-2xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Text Search</h2>
                <form onSubmit={handleSubmit} className="flex gap-4">
                  <input
                    type="text"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder="e.g., Italian, Chinese"
                    className="flex-1 p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-600 focus:outline-none transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!cuisine.trim() || loading}
                    className={`px-8 rounded-xl transition-colors ${
                      !cuisine.trim() || loading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105'
                    } text-white`}
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </form>
              </div>

              {/* Notification */}
              {showNotification && (
                <div className="fixed inset-x-0 top-6 h-40 flex justify-center">
                  <div className="bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in-up flex items-center gap-3 max-w-md">
                    <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    <div className="flex flex-col">
                      <span className="font-medium">{searchMessage}</span>
                      <button 
                        onClick={() => handleSearch(1)}
                        className="mt-2 bg-white/20 cursor-pointer hover:bg-white/30 text-sm px-4 py-2 rounded-lg transition-colors"
                      >
                        Search Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Restaurants Grid & Pagination */}
              <div className="flex flex-col gap-8">
                {loading && (
                  <div className="flex justify-center my-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-indigo-200 border-t-indigo-600"></div>
                  </div>
                )}
                {/* {error && (
                  <div className="max-w-2xl mx-auto mb-12">
                    <div className="bg-white shadow-md backdrop-blur-sm border border-red-100 p-4 rounded-2xl">
                      <p className="text-red-600 text-center">{error}</p>
                    </div>
                  </div>
                )} */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {restaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      onClick={() => handleRestaurantClick(restaurant.id)}
                      className="group bg-white shadow-md backdrop-blur-sm p-6 rounded-3xl hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer"
                    >
                      {restaurant.featured_image && (
                        <div className="mb-6 rounded-2xl overflow-hidden h-56">
                          <img
                            src={restaurant.featured_image}
                            alt={restaurant.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <h2 className="text-xl font-semibold mb-3 text-gray-800">{restaurant.name}</h2>
                      <div className="space-y-3">
                        <p className="text-gray-600 font-medium">{restaurant.cuisines}</p>
                        <p className="text-gray-500 text-sm">{restaurant.location?.address}</p>
                        <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 w-fit">
                          <span className="text-gray-800 font-semibold mr-1">{restaurant.user_rating?.aggregate_rating}</span>
                          <span className="text-yellow-400">★</span>
                        </div>
                      </div>
                      {restaurant.distance && (
                        <div className="mt-3 flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                            />
                          </svg>
                          {restaurant.distance < 1 
                            ? `${(restaurant.distance * 1000).toFixed(0)}m away`
                            : restaurant.distance >= 100
                              ? `${(restaurant.distance / 1000).toFixed(1)}k km away`
                              : `${restaurant.distance.toFixed(1)} km away`
                          }
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {restaurants.length > 0 && (
                  <div className="mt-16 mb-8 flex justify-center items-center gap-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-6 py-3 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                        currentPage === 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white shadow-sm text-gray-800 hover:bg-gray-800 hover:text-white hover:scale-105'
                      }`}
                    >
                      Previous
                    </button>
                    <span className="px-6 py-3 bg-white shadow-sm backdrop-blur-sm rounded-xl text-gray-800 font-medium">
                      {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-6 py-3 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                        currentPage === totalPages
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white shadow-sm text-gray-800 hover:bg-gray-800 hover:text-white hover:scale-105'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
