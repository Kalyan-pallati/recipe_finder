import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddRecipeModal from "../components/AddRecipeModal";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function fetchMyRecipes() {
    setLoading(true);
    const res = await fetchWithAuth("http://localhost:8000/api/my-recipes/");
    const data = await res.json();
    setRecipes(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  async function handleCreateRecipe(formData) {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/my-recipes/", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      setOpen(false);
      fetchMyRecipes();
    } else {
      console.error(await res.text());
      alert("Failed to create recipe.");
    }
  }

  async function handleDeleteRecipe(e, recipe_id) {
    e.stopPropagation();

    try {
      const res = await fetchWithAuth(
        `http://localhost:8000/api/my-recipes/${recipe_id}`,
        { method: "DELETE" }
      );

      if (res.ok) fetchMyRecipes();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">My Recipes</h1>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Add Recipe
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-600">You haven't created any recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {recipes.map(r => (
            <article
              key={r.id}
              onClick={() => navigate(`/my-recipes/${r.id}`)}
              className="
                relative bg-white rounded-lg overflow-hidden shadow
                transition-all duration-300 cursor-pointer group
                hover:scale-[1.03] hover:shadow-xl
              "
            >
              <div
                className="
                  absolute inset-0 bg-black/80
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 z-10
                "
              ></div>

              <div className="relative z-20">
                <img
                  src={r.image || "/no-image.png"}
                  alt={r.title}
                  className="w-full h-40 object-cover"
                />

                <div className="p-3 group-hover:text-white transition">
                  <h3 className="font-semibold text-lg mb-1">{r.title}</h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 group-hover:text-gray-200">
                    <span>⏱ {r.readyInMinutes ?? "N/A"} mins</span>
                    <span>🔥 {r.calories ?? "N/A"} kcal</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/my-recipes/${r.id}`);
                      }}
                      className="
                        text-sm px-3 py-1 rounded transition
                        bg-orange-500 text-white
                        group-hover:bg-white group-hover:text-orange-600
                      "
                    >
                      View
                    </button>

                    <button
                      onClick={(e) => handleDeleteRecipe(e, r.id)}
                      className="
                        text-sm px-3 py-1 rounded transition
                        bg-red-500 text-white
                        group-hover:bg-white group-hover:text-red-600
                      "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

            </article>
          ))}

        </div>
      )}

      {open && (
        <AddRecipeModal
          open={open}
          setOpen={setOpen}
          onSubmit={handleCreateRecipe}
        />
      )}
    </div>
  );
}
