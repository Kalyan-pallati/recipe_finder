import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Saved() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 12;

  const navigate = useNavigate();

  async function loadSaved() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    setLoading(true);

    const res = await fetch(
      `http://localhost:8000/api/recipes/saved?page=${page}&per_page=${perPage}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();

    setRecipes(data.results);
    setTotal(data.total_results);
    setLoading(false);
  }

  async function handleUnsave(recipeId) {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8000/api/recipes/unsave/${recipeId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (res.ok) {
      // remove from UI instantly
      setRecipes((prev) => prev.filter((r) => r.recipe_id !== recipeId));
    }
  }

  useEffect(() => {
    loadSaved();
  }, [page]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (recipes.length === 0)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-3">No saved recipes yet</h2>
        <button
          className="bg-orange-500 text-white px-6 py-2 rounded-lg"
          onClick={() => navigate("/search")}
        >
          Browse Recipes
        </button>
      </div>
    );

  return (
    <div className="px-10 py-10">
      <h2 className="text-3xl font-bold mb-8">Saved Recipes</h2>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {recipes.map((rec) => (
          <div
            key={rec.recipe_id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={rec.image}
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => navigate(`/recipe/${rec.recipe_id}`)}
            />

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{rec.title}</h3>

              <div className="text-sm text-gray-700 mb-3">
                ⏱ {rec.readyInMinutes || "?"} mins<br />
                🔥 {rec.calories || "?"} kcal
              </div>

              <div className="flex gap-3">
                <button
                  className="bg-orange-500 text-white px-4 py-1 rounded-md"
                  onClick={() => navigate(`/recipe/${rec.recipe_id}`)}
                >
                  View
                </button>

                <button
                  className="bg-red-500 text-white px-4 py-1 rounded-md"
                  onClick={() => handleUnsave(rec.recipe_id)}
                >
                  Unsave
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-5 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <button
          disabled={page * perPage >= total}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
