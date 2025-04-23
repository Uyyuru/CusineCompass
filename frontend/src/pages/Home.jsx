export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-slide-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="block">Discover Culinary</span>
            <span className="block text-indigo-600">Delights Near You</span>
          </h1>
          <p className="text-lg text-gray-600">
            Find the best restaurants, cafes, and bars in your area with just a few clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-lg card-hover-effect">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Search by Image</h2>
            <p className="text-gray-600 mb-6">
              Upload a photo of your favorite dish, and we'll find restaurants that serve it.
            </p>
            <a
              href="/cuisine-search"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Try Image Search
            </a>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg card-hover-effect">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Search by Cuisine</h2>
            <p className="text-gray-600 mb-6">
              Find restaurants based on your favorite cuisine type.
            </p>
            <a
              href="/cuisine-search"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Start Searching
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-lg card-hover-effect">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Easy Search</h3>
            <p className="text-gray-600 text-center">
              Find your favorite cuisines with our intuitive search system.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg card-hover-effect">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Location Based</h3>
            <p className="text-gray-600 text-center">
              Find restaurants near you with precise distance filtering.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg card-hover-effect">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Image Search</h3>
            <p className="text-gray-600 text-center">
              Upload food photos to find matching restaurants.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg mb-12 text-center card-hover-effect">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Explore?</h2>
          <p className="text-gray-600 mb-6">
            Start your culinary journey today and discover amazing restaurants near you.
          </p>
          <a
            href="/cuisine-search"
            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }

        .card-hover-effect {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card-hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}