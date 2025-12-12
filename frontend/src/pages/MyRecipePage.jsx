import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUtensils, FaClock, FaFire } from "react-icons/fa";
import EditRecipeModal from "../components/EditRecipeModal";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export default function MyRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const myId = localStorage.getItem("user_id");

  // edit modal control
  const [showEdit, setShowEdit] = useState(false);

  async function fetchRecipe() {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8000/api/my-recipes/${id}`
      );
      if (!res.ok) throw new Error("Recipe Not Found");

      const data = await res.json();
      setRecipe(data);
    } catch (err) {
      console.error(err);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    const res = await fetchWithAuth(
      `http://localhost:8000/api/my-recipes/${id}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      navigate("/my-recipe");
    } else {
      alert("Failed to delete recipe.");
    }
  }

  async function handleEditSubmit(formData) {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:8000/api/my-recipes/${id}`,
      {
        method: "PUT",
        body: formData,
        headers : {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    if (res.ok) {
      setShowEdit(false);
      fetchRecipe();
    } else {
      alert("Failed to update recipe.");
    }
  }

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading...</p>;

  if (!recipe)
    return (
      <p className="text-center mt-10 text-lg text-red-500">
        Recipe not found.
      </p>
    );

    const isOwner = recipe?.user_id === myId;
    console.log(recipe?.id === myId);
    console.log(recipe.user_id);
    // console.log(localStorage.getItem("user_id"));
    // console.log(myId);
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 animate-fadeIn">
      {/* TOP SECTION */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#FEF9F2] rounded-3xl shadow p-10">

        {/* LEFT - TEXT */}
        <div>
          <h1 className="text-5xl font-bold text-[#8A2C1F] leading-tight mb-6">
            {recipe.title}
          </h1>

          <p className="text-gray-700 text-lg mb-6">
            Enjoy this delicious recipe by recreating it at home.
          </p>
          
          {isOwner && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setShowEdit(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
          )}

          <div className="flex items-center gap-8 mt-8">
            <div className="flex flex-col items-center">
              <FaUtensils className="text-4xl text-orange-600 mb-2" />
              <p className="font-semibold text-gray-800">{recipe.servings || "N/A"}</p>
              <p className="text-sm text-gray-600">Servings</p>
            </div>

            <div className="flex flex-col items-center">
              <FaClock className="text-4xl text-blue-600 mb-2" />
              <p className="font-semibold text-gray-800">
                {recipe.readyInMinutes || "N/A"} min
              </p>
              <p className="text-sm text-gray-600">Cook Time</p>
            </div>

            <div className="flex flex-col items-center">
              <FaFire className="text-4xl text-red-600 mb-2" />
              <p className="font-semibold text-gray-800">
                {recipe.calories || "N/A"}
              </p>
              <p className="text-sm text-gray-600">Calories</p>
            </div>
          </div>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <img
            src={recipe.image || "/no-image.png"}
            alt={recipe.title}
            className="w-full h-[420px] object-cover"
          />
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 mt-16 relative">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-yellow-400"></div>

        {/* INGREDIENTS */}
        <div className="pr-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ingredients</h2>

          <ul className="list-disc ml-6 space-y-3 text-gray-700 text-lg">
            {recipe.ingredients?.map((ing, idx) => (
              <li key={idx}>
                {ing.amount && `${ing.amount} —`} {ing.name}
              </li>
            ))}
          </ul>
        </div>

        {/* STEPS */}
        <div className="pl-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Instructions
          </h2>

          <ol className="list-decimal ml-6 space-y-4 text-gray-700 text-lg leading-relaxed">
            {recipe.steps?.map((step, idx) => (
              <li key={idx}>{step.step}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <EditRecipeModal
          open={showEdit}
          setOpen={setShowEdit}
          initialData={recipe}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
