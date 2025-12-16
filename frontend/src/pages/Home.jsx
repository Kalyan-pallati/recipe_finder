import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaRegBookmark, FaCalendarAlt } from 'react-icons/fa'; // Importing useful icons

function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate("/search");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50"> 
            <section className="text-center py-20 px-6 border-b">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-snug mb-4">
                        Discover, Save, and Plan Your Perfect Meals
                    </h1>

                    <p className="text-xl text-gray-600 leading-relaxed mb-10">
                        Stop stressing over dinner! Find millions of recipes, organize your favorites, 
                        and schedule your weekly meals effortlessly with our easy-to-use planner.
                    </p>

                    <form onSubmit={handleSearch} className="flex max-w-xl mx-auto rounded-full shadow-2xl overflow-hidden bg-white">
                        <input
                            type="text"
                            className="flex-1 px-6 py-4 text-lg border-none focus:ring-0 focus:outline-none"
                            placeholder="Try searching for 'Spicy Tacos' or 'Vegan Pasta'..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-orange-600 text-white px-8 py-4 text-lg font-semibold transition duration-200 hover:bg-orange-700"
                        >
                            <FaSearch className="inline mr-2" /> Search Now
                        </button>
                    </form>
                </div>
            </section>

            <section className="py-20 px-6 max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
                    Everything You Need in One Place
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    
                    <div className="text-center p-8 bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <FaSearch className="text-5xl text-blue-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-3 text-gray-800">Explore Recipes</h3>
                        <p className="text-gray-600">
                            Search millions of recipes powered by Spoonacular, filtered by diet, cuisine, calories, and cook time.
                        </p>
                    </div>

                    <div className="text-center p-8 bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <FaRegBookmark className="text-5xl text-orange-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-3 text-gray-800">Keep Your Favorites</h3>
                        <p className="text-gray-600">
                            Save recipes from the web or add your own community recipes. Access them instantly from any device.
                        </p>
                    </div>

                    <div className="text-center p-8 bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <FaCalendarAlt className="text-5xl text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-3 text-gray-800">Weekly Meal Planner</h3>
                        <p className="text-gray-600">
                            Drag and drop your saved recipes directly onto your weekly meal calendar for effortless planning.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-orange-600 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Planning?</h2>
                <button
                    className="bg-white text-orange-600 px-10 py-3 rounded-full text-lg font-bold transition duration-300 hover:bg-gray-100 shadow-lg"
                    onClick={() => navigate("/search")}
                >
                    Start Exploring Recipes Today
                </button>
            </section>

        </div>
    );
}

export default Home;