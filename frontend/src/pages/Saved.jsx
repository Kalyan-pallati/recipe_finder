import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export default function Saved() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 12;

  const navigate = useNavigate();

  async function loadSaved() {
    setLoading(true);

    const res = await fetchWithAuth(
      `http://localhost:8000/api/recipes/saved?page=${page}&per_page=${perPage}`
    );

    const data = await res.json();
    setRecipes(data.results);
    setTotal(data.total_results);
    setLoading(false);
  }

  async function handleUnsave(recipeId, source_type) {
    const res = await fetchWithAuth(
      `http://localhost:8000/api/recipes/unsave/${recipeId}?source_type=${source_type}`,
      { method: "DELETE" }
    );

    if (res.ok) {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {recipes.map((rec) => (
          <article
            key={rec.recipe_id}
            onClick={() => {
              if(rec.source_type === "spoonacular"){
              navigate(`/recipe/${rec.recipe_id}?source_type=${rec.source_type}`)}
              else if(rec.source_type === "community"){
                navigate(`/my-recipes/${rec.recipe_id}`)
              }
            }}
            className="
              relative bg-white rounded-xl overflow-hidden shadow 
              transition-all duration-300 cursor-pointer 
              group hover:scale-[1.03] hover:shadow-xl
            "
          >
            <div
              className="
                absolute inset-0 bg-black/70 
                opacity-0 group-hover:opacity-100 
                transition-opacity duration-300 z-10
              "
            ></div>
            <div className="relative z-20">
              <img
                src={rec.image}
                alt={rec.title}
                className="w-full h-48 object-cover group-hover:brightness-75 transition"
              />

              <div className="p-4 transition duration-300 group-hover:text-white">
                <h3 className="font-semibold text-lg mb-1">{rec.title}</h3>

                <div className="text-sm text-gray-700 group-hover:text-gray-200 mb-3">
                  ⏱ {rec.readyInMinutes || "?"} mins  
                  <br />
                  🔥 {rec.calories || "?"} kcal
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/recipe/${rec.recipe_id}`);
                    }}
                    className="
                      text-sm px-4 py-1 rounded transition 
                      bg-orange-500 text-white 
                      group-hover:bg-white group-hover:text-orange-600
                    "
                  >
                    View
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnsave(rec.recipe_id, rec.source_type);
                    }}
                    className="
                      text-sm px-4 py-1 rounded transition
                      bg-red-500 text-white 
                      group-hover:bg-white group-hover:text-red-600
                    "
                  >
                    Unsave
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

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
