import { useState } from "react";

export function AddMealModal({
    open, setOpen, recipe, sourceType, onSubmit
}) {
    const [date, setDate] = useState("");
    const [mealType, setMealType] = useState("lunch");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e){
        e.preventDefault();
        setError(null);

        if(!date || !mealType){
            setError("Please Select date and Meal Type");
            return;
        }
        const payload = {
            source_id: String(recipe.id || recipe.recipe_id),
            source_type: sourceType,
            date,
            meal_type: mealType,
            title: recipe.title,
            image: recipe.image || null
        }

        setLoading(true);
        await onSubmit(payload);
        setLoading(false);
    }
    
    if(!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ">
            <div className="bg-white w-[420px] rounded-xl shadow-2xl p-6 relative">
                <button
                className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700"
                onClick={() => setOpen(false)}>
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">Add to Meal Plan</h2>

                <p className="text-sm gray-600 mb-4">
                    <span className="font-semibold">{recipe.title}</span>
                </p>

                {error && (
                    <p className="text-red-500 text-sm mb-3">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-1">Date</label>
                        <input type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg"
                        required />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Meal Type</label>
                        <select value={mealType}
                        onChange={(e) => setMealType(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg">
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="snack">Snack</option>
                            <option value="dinner">Dinner</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 border rounded-lg"
                        disabled={loading}>
                            Cancel
                        </button>

                        <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
                            {loading ? "Saving...": "Add Meal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ); 
}