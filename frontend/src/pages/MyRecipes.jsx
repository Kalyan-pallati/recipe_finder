import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddRecipeModal from "../components/AddRecipeModal";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function fetchMyRecipes() {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      const returnUrl = encodeURIComponent(window.location.pathname);
      navigate(`/auth?returnUrl=${returnUrl}`);
      return;
    }

    const res = await fetch("http://localhost:8000/api/my-recipes/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setRecipes(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  async function handleCreateRecipe(payload) {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/my-recipes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      fetchMyRecipes();
    } else {
      console.error(await res.text());
      alert("Failed to create recipe.");
    }
  }

  async function handleDeleteRecipe(e, recipe_id) {
    e.preventDefault();
    console.log(recipe_id);
    try {
    const token = localStorage.getItem("token");
    if(!token) {
      const returnUrl = encodeURIComponent(window.location.pathname);
      navigate(`/auth?returnUrl=${returnUrl}`);
      return;
    }

    const res = await fetch(`http://localhost:8000/api/my-recipes/${recipe_id}`,{
      method : "DELETE",
      headers: {
        Authorization : `Bearer ${token}`,
      }
    });
    // if (res.ok) setRecipes(prev => prev.filter(r => r._id !== recipe_id));
    if(res.ok) fetchMyRecipes();
  } catch(err) {
    console.error(err)
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
          {recipes.map((r) => (
            <article
              key={r.id}
              className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
              // onClick={() => navigate(`/my-recipes/${r.id}`)} 
            >
              <img
                src={r.image || "/no-image.png"}
                alt={r.title}
                className="w-full h-40 object-cover rounded"
              />

            <div className="p-3">
                <h3 className="font-semibold text-lg mb-1">{r.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>⏱ {r.readyInMinutes ?? "N/A"} mins</span>
                    <span>🔥 {r.calories ?? "N/A"} kcal</span>
                </div>
            </div>

            <div className="mt-3 flex gap-2">
            <button onClick={(e) => {
                e.stopPropagation();
                navigate(`/my-recipes/${r.id}`);}}
                className="text-sm bg-orange-500 text-white px-3 py-1 rounded">
                View
            </button>

            <button onClick={(e) => handleDeleteRecipe(e, r.id)}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded">
            Delete</button>

            </div>

              <h2 className="mt-3 text-lg font-semibold">{r.title}</h2>

              <p className="text-sm text-gray-600 line-clamp-2">
                {r.description}
              </p>
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
