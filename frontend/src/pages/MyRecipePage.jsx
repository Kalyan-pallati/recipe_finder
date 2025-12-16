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
            navigate("/my-recipes");
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
        return <p className="text-center mt-10 text-xl font-medium text-gray-700">Loading recipe details...</p>;

    if (!recipe)
        return (
            <p className="text-center mt-20 text-2xl text-red-600 font-semibold">
                Recipe not found.
            </p>
        );

    const isOwner = recipe?.user_id === myId;
    
    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-12">
            {/* TOP SECTION */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100">

                {/* LEFT - TEXT & STATS */}
                <div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-snug mb-4">
                        {recipe.title}
                    </h1>

                    {isOwner && (
                        <div className="flex gap-4 mb-8 pt-2">
                            <button
                                onClick={() => setShowEdit(true)}
                                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-full transition duration-300 hover:bg-blue-700 shadow-md transform hover:scale-[1.02]"
                            >
                                Edit Recipe
                            </button>

                            <button
                                onClick={handleDelete}
                                className="px-5 py-2 bg-red-600 text-white font-medium rounded-full transition duration-300 hover:bg-red-700 shadow-md transform hover:scale-[1.02]"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                    
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
                            <p className="font-bold text-xl text-gray-800">
                                {recipe.calories || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">Calories</p>
                        </div>
                    </div>

                    <p className="text-gray-700 text-lg mt-8">
                        This recipe was shared by a community member. Please feel free to edit it if you have improvements!
                    </p>
                </div>

                <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <img
                        src={recipe.image || "/no-image.png"}
                        alt={recipe.title}
                        className="w-full h-[450px] object-cover transition duration-500 hover:scale-[1.05]"
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mt-16 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
                
                {/* INGREDIENTS (2/5 column width) */}
                <div className="md:col-span-2">
                    <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-3 mb-6 tracking-wide">Ingredients</h2>

                    <ul className="list-none space-y-3 text-gray-700 text-lg">
                        {recipe.ingredients?.map((ing, idx) => (
                            <li key={idx} className="flex items-start">
                                <span className="text-orange-500 text-xl mr-3 leading-none">•</span>
                                <span className="font-semibold text-gray-800 mr-2">{ing.amount || '—'}</span>
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
                        {recipe.steps?.map((step, idx) => (
                            <li key={idx} className="flex items-start">
                                <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0 shadow-md">
                                    {idx + 1}
                                </span>
                                <span>{step.step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {showEdit && recipe && (
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