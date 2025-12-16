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

        const payload = {
            recipe_id: String(recipe.id), 
            source_type: "spoonacular", 
            title: recipe.title,
            image: recipe.image,
            readyInMinutes: recipe.readyInMinutes,
            calories: calories 
        };
        
        const cleanPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
        );

        try {
            const res = await fetchWithAuth("http://localhost:8000/api/recipes/save",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(cleanPayload),
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
        const sourceType = "spoonacular"; 
        
        const res = await fetchWithAuth(
            `http://localhost:8000/api/recipes/unsave/${String(recipe.id)}?source_type=${sourceType}`, 
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            }
        );
        const data = await res.json();
        if(res.ok){
            setIsSaved(false);
        } else{
            alert(data.detail || "Failed to unsave recipe")
        }
    }

    useEffect(() => {
        async function fetchRecipeDetails() {
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

        async function checkSavedStatus() {
            const token = localStorage.getItem("token");
            if (!token) return;

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

        fetchRecipeDetails();
        checkSavedStatus(); 
    }, [id]);


    if (loading) return <p className="text-center mt-10 text-xl font-medium text-gray-700">Loading recipe details...</p>;

    if (!recipe)
        return (
            <p className="text-center mt-20 text-2xl text-red-600 font-semibold">
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
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100">

                <div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-snug mb-6">
                        {recipe.title}
                    </h1>

                    <div className="mb-8 pt-2">
                        {isSaved ? (
                            <button onClick={handleUnsaveRecipe}
                            className="bg-red-600 text-white px-5 py-2 font-medium rounded-full transition duration-300 hover:bg-red-700 shadow-md transform hover:scale-[1.02]">
                                Unsave Recipe
                            </button>
                        ) : (
                            <button onClick={handleSaveRecipe}
                            className="bg-green-600 text-white px-5 py-2 font-medium rounded-full transition duration-300 hover:bg-green-700 shadow-md transform hover:scale-[1.02]">
                                Save Recipe
                            </button>
                        )}
                    </div>
                    <div className="flex items-start justify-start gap-10 mt-6 border-t border-b py-4">

                        <div className="flex flex-col items-center">
                            <FaUtensils className="text-3xl text-orange-500 mb-2" />
                            <p className="font-bold text-xl text-gray-800">{recipe.servings || "N/A"}</p>
                            <p className="text-sm text-gray-600">Servings</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <FaClock className="text-3xl text-blue-500 mb-2" />
                            <p className="font-bold text-xl text-gray-800">
                                {recipe.readyInMinutes || "N/A"} min
                            </p>
                            <p className="text-sm text-gray-600">Time</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <FaFire className="text-3xl text-red-500 mb-2" />
                            <p className="font-bold text-xl text-gray-800">{calories}</p>
                            <p className="text-sm text-gray-600">Calories</p>
                        </div>
                    </div>
                    
                    <a
                        href={recipe.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-8 inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold shadow transition duration-300 transform hover:scale-[1.02]"
                    >
                        View Original Recipe Source
                    </a>
                </div>

                <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-[450px] object-cover transition duration-500 hover:scale-[1.05]"
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mt-16 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
                
                <div className="md:col-span-2">
                    <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-3 mb-6 tracking-wide">Ingredients</h2>
                    <ul className="list-none space-y-3 text-gray-700 text-lg">
                        {recipe.ingredients?.map((ing, idx) => (
                            <li key={idx} className="flex items-start">
                                <span className="text-orange-500 text-xl mr-3 leading-none">•</span>
                                <span className="font-semibold text-gray-800 mr-2">{ing.amount} {ing.unit} —</span>
                                {ing.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-3 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-10 border-gray-200">
                    <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-3 mb-6 tracking-wide">
                        Instructions
                    </h2>
                    <ol className="list-none space-y-6 text-gray-800 text-lg leading-relaxed">
                        {steps.map((step, idx) => (
                            <li key={idx} className="flex items-start">
                                <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0 shadow-md">
                                    {idx + 1}
                                </span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Nutrition Facts</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {recipe.nutrition?.slice(0, 12).map((n, idx) => (
                        <div key={idx} className="bg-gray-100 p-4 rounded-xl shadow text-center transition duration-300 hover:bg-gray-200">
                            <p className="font-semibold text-gray-800">{n.name}</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">
                                {Math.round(n.amount)} {n.unit}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}