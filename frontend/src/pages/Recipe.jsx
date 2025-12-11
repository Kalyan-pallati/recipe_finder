import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUtensils, FaClock, FaFire } from "react-icons/fa";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export default function Recipe() {
  const { id } = useParams(); 
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isSaved, setIsSaved] = useState(false);

  async function handleSaveRecipe() {
    const token = localStorage.getItem("token");

    try {
      const res = await fetchWithAuth("http://localhost:8000/api/recipes/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipe_id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            readyInMinutes: recipe.readyInMinutes,
            calories: calories
          }),
        });
        
        const data = await res.json();

        if(res.ok) {
          setIsSaved(true);
        } else {
          alert(data.detail || "Failed to save recipe");
        }
    }
    catch (err) {
      alert("Error saving recipe");
      console.error(err);
    }
  }
  async function handleUnsaveRecipe() {
    const token = localStorage.getItem("token");
    
    const res = await fetchWithAuth(`http://localhost:8000/api/recipes/unsave/${recipe.id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });
    const data = await res.json();
    if(res.ok){
      setIsSaved(false);
    } else{
      alert(data.detail || "Failed to unsave recipe")
    }
  }

 useEffect(() => {
  async function fetchRecipe() {
    try {
      const res = await fetch(`http://localhost:8000/api/recipes/${id}`);
      if (!res.ok) throw new Error("Recipe not found");

      const data = await res.json();
      setRecipe(data);
    } catch (err) {
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }

  async function checkSaved() {
    const token = localStorage.getItem("token");

    try {
      const res = await fetchWithAuth(
        `http://localhost:8000/api/recipes/is-saved/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) return;

      const data = await res.json();
      setIsSaved(data.saved);
    } catch (err) {
      console.error("Error checking saved status:", err);
    }
  }

  fetchRecipe();
  checkSaved(); 

}, [id]);


  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  if (!recipe)
    return (
      <p className="text-center mt-10 text-lg text-red-500">
        Recipe not found.
      </p>
    );

  
  const calories =
    recipe.nutrition?.find((n) => n.name.toLowerCase() === "calories")
      ?.amount || "N/A";

  
  const steps =
    recipe.instructions
      ?.replace(/<\/?[^>]+(>|$)/g, "")
      .split(".")
      .map((s) => s.trim())
      .filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 animate-fadeIn">

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#FEF9F2] rounded-3xl shadow p-10">

        <div>
          <h1 className="text-5xl font-bold text-[#8A2C1F] leading-tight mb-6">
            {recipe.title}
          </h1>

          <p className="text-gray-700 text-lg mb-6">
            Enjoy this delicious recipe by recreating it at home.
          </p>

          {isSaved ? (
            <button onClick={handleUnsaveRecipe}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Unsave
            </button>
          ) : (
            <button onClick={handleSaveRecipe}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Save
            </button>
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
              <p className="font-semibold text-gray-800">{calories}</p>
              <p className="text-sm text-gray-600">Calories</p>
            </div>
          </div>

          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition"
          >
            View Original Recipe
          </a>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-lg">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-[420px] object-cover"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 mt-16 relative">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-yellow-400"></div>

        <div className="pr-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Recipe Ingredients
          </h2>
          <ul className="list-disc ml-6 space-y-3 text-gray-700 text-lg">
            {recipe.ingredients?.map((ing, idx) => (
              <li key={idx}>
                {ing.amount} {ing.unit} — {ing.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="pl-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Recipe Directions
          </h2>
          <ol className="list-decimal ml-6 space-y-4 text-gray-700 text-lg leading-relaxed">
            {steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-16 bg-white rounded-3xl shadow p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Nutrition Facts</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recipe.nutrition?.slice(0, 8).map((n, idx) => (
            <div key={idx} className="bg-gray-100 p-4 rounded-xl shadow text-center">
              <p className="font-semibold text-gray-800">{n.name}</p>
              <p className="text-lg font-bold text-gray-900">
                {n.amount} {n.unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
