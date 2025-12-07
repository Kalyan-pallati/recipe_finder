import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchRecipes } from "../api/recipeApi";

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  async function handleSearch() {
    if (!query.trim()) return;

    try {
      const data = await searchRecipes(query);
      console.log("SEARCH RESULTS:", data);
      navigate(`/search?q=${query}`);

    } catch (err) {
      console.error("Search error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-12 py-6 border-b bg-white">
        
        {/* Logo */}
        <div className="text-xl font-bold">LOGO</div>

        {/* Navbar Links + Right Search Bar */}
        <div className="flex items-center gap-10 text-gray-700 font-medium">

          <a href="#" className="hover:text-orange-600">Browse Recipes</a>
          <a href="#" className="hover:text-orange-600">My Planner</a>
          <a href="#" className="hover:text-orange-600">Premium</a>
          <a href="#" className="hover:text-orange-600">Resources</a>

          {/* Search Bar (Right Side) */}
          <div className="flex w-[320px]">
            <input
              type="text"
              placeholder="Search for recipes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-l-xl focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-2 bg-orange-600 text-white rounded-r-xl hover:bg-orange-700"
            >
              Search
            </button>
          </div>

        </div>

      </nav>

      {/* HERO SECTION */}
      <section className="text-center py-24 px-6 bg-[url('/bg-pattern.png')] bg-cover bg-center">
        <h1 className="text-4xl font-semibold text-orange-600 mb-6">
          Plan your way to healthier eating
        </h1>

        <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed mb-10">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh
          euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
        </p>

        <button
          className="bg-orange-600 text-white px-10 py-3 rounded-lg text-lg hover:bg-orange-700"
          onClick={() => navigate("/auth")}
        >
          SIGNUP (FREE)
        </button>
      </section>

    </div>
  );
}

export default Home;
