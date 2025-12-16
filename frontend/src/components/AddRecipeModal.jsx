import { useState } from "react";

export default function AddRecipeModal({ open, setOpen, onSubmit }) {
    
    const [title, setTitle] = useState("");
    const [readyInMinutes, setReadyInMinutes] = useState("");
    const [servings, setServings] = useState("");
    const [calories, setCalories] = useState("");

    const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
    const [steps, setSteps] = useState([""]);
    const [imageFile, setImageFile] = useState(null);

    function addIngredient() {
        setIngredients([...ingredients, { name: "", amount: "" }]);
    }

    function updateIngredient(index, field, value) {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    }

    function removeIngredient(index) {
        setIngredients(ingredients.filter((_, i) => i !== index));
    }


    function addStep() {
        setSteps([...steps, ""]);
    }

    function updateStep(index, value) {
        const updated = [...steps];
        updated[index] = value;
        setSteps(updated);
    }

    function removeStep(index) {
        setSteps(steps.filter((_, i) => i !== index));
    }


    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", title);
        formData.append("readyInMinutes", readyInMinutes);
        formData.append("servings", servings);
        formData.append("calories", calories);
        
        if (ingredients.length > 0) {
            formData.append("ingredients", JSON.stringify(ingredients));
        }
        
        const stepsFormatted = steps.map((s) => ({step : s}));
        if (stepsFormatted.length > 0) {
            formData.append("steps",JSON.stringify(stepsFormatted));
        }

        if(imageFile){
            formData.append("image", imageFile);
        }

        onSubmit(formData); 
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">

            <div className="bg-white w-[800px] max-h-[95vh] rounded-2xl shadow-2xl p-8 relative overflow-y-auto transform scale-100 transition-transform duration-300">

                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl transition duration-200"
                    onClick={() => setOpen(false)}
                >
                    &times;
                </button>

                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Create New Recipe</h2>

                <form onSubmit={handleSubmit} className="space-y-6 text-base">

                    <div>
                        <label className="font-semibold text-gray-700 block mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="font-semibold text-gray-700 block mb-1">Ready In Minutes</label>
                            <input
                                type="number"
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                                value={readyInMinutes}
                                onChange={(e) => setReadyInMinutes(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-gray-700 block mb-1">Servings</label>
                            <input
                                type="number"
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                                value={servings}
                                onChange={(e) => setServings(e.target.value)}
                                required
                            />
                        </div>
                         <div>
                            <label className="font-semibold text-gray-700 block mb-1">Calories (kcal)</label>
                            <input
                                type="number"
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-semibold text-gray-700 block mb-1">Image (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-50 focus:border-orange-500 transition duration-150"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </div>

                    <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                        <label className="font-semibold text-gray-700 block mb-3">Ingredients</label>

                        {ingredients.map((ing, index) => (
                            <div key={index} className="flex gap-3 mb-3 items-center">
                                <input
                                    type="text"
                                    placeholder="Ingredient Name"
                                    className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={ing.name}
                                    onChange={(e) =>
                                        updateIngredient(index, "name", e.target.value)
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Amount (e.g., 1 cup)"
                                    className="w-40 border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={ing.amount}
                                    onChange={(e) =>
                                        updateIngredient(index, "amount", e.target.value)
                                    }
                                    required
                                />
                                {ingredients.length > 1 && (
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700 text-2xl leading-none"
                                        onClick={() => removeIngredient(index)}
                                    >
                                        &minus;
                                    </button>
                                )}
                            </div>
                        ))}
                        
                        <button
                            type="button"
                            onClick={addIngredient}
                            className="mt-2 text-blue-600 hover:text-blue-800 font-semibold transition duration-200 focus:outline-none"
                        >
                            + Add Another Ingredient
                        </button>
                    </div>

                    <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                        <label className="font-semibold text-gray-700 block mb-3">Instructions (Steps)</label>

                        {steps.map((step, index) => (
                            <div key={index} className="flex gap-3 mt-2 items-start">
                                <span className="font-bold text-lg text-orange-600 pt-2">{index + 1}.</span>
                                <textarea
                                    className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                    rows="3"
                                    value={step}
                                    onChange={(e) => updateStep(index, e.target.value)}
                                    required
                                />
                                {steps.length > 1 && (
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700 text-2xl leading-none pt-1"
                                        onClick={() => removeStep(index)}
                                    >
                                        &minus;
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addStep}
                            className="mt-4 text-blue-600 hover:text-blue-800 font-semibold transition duration-200 focus:outline-none"
                        >
                            + Add Another Step
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-orange-700 transition duration-200 shadow-md transform hover:scale-[1.005]"
                    >
                        Save Recipe
                    </button>
                </form>

            </div>
        </div>
    );
}