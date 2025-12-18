import { useEffect, useState } from "react";

export default function EditRecipeModal({open, setOpen, initialData, onSubmit}) {
    const [title, setTitle] = useState("");
    const [readyInMinutes, setReadyInMinutes] = useState("");
    const [servings, setServings] = useState("");
    const [calories, setCalories] = useState("");

    const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
    const [steps, setSteps] = useState([""]);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if(!initialData) return;

        setTitle(initialData.title || "");
        setReadyInMinutes(initialData.readyInMinutes || "");
        setServings(initialData.servings || "");
        setCalories(initialData.calories || "");
        
        setIngredients(initialData.ingredients && initialData.ingredients.length > 0 ? initialData.ingredients : [{ name: "", amount: "" }]);
        
        setSteps(initialData.steps?.map(s => s.step) || [""]);
    },[initialData]);

    function addIngredient() {
        setIngredients([...ingredients, {"name":"", "amount":""}]);
    }

    function removeIngredient(index) {
        setIngredients(ingredients.filter((_, i) => i !== index));
    }
    function updateIngredient(index, field, value) {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    }

    function addStep(){
        setSteps([...steps, ""]);
    }
    function updateStep(index, value){
        const updated = [...steps];
        updated[index] = value;
        setSteps(updated);
    }

    function removeStep(index) {
        setSteps(steps.filter((_, i) => i !== index))
    }

    function handleSubmit(e) {
        e.preventDefault();

        const form = new FormData();
        
        form.append("title", title);
        form.append("readyInMinutes", readyInMinutes );
        form.append("servings", servings);
        form.append("calories", calories);
        form.append("source_type", "community");
        
        if (ingredients.length > 0) {
            form.append("ingredients", JSON.stringify(ingredients));
        }

        const formattedSteps = steps.map((s) => ({step : s}));
        if (formattedSteps.length > 0) {
            form.append("steps", JSON.stringify(formattedSteps));
        }

        if (imageFile) form.append("image", imageFile);

        onSubmit(form);
    }
    
    if(!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">

            <div className="bg-white w-[800px] max-h-[95vh] rounded-2xl shadow-2xl p-8 relative overflow-y-auto transform scale-100 transition-transform duration-300">

                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl transition duration-200"
                    onClick={() => setOpen(false)}
                >
                    &times;
                </button>

                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Edit Recipe: {initialData.title}</h2>

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
                        {initialData?.image && !imageFile && (
                             <p className="text-sm mt-1 text-gray-500">
                                Current image will be kept. Upload a new file to replace it.
                             </p>
                        )}
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
                        <label className="font-semibold text-gray-700 block mb-3">Instructions</label>

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
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md transform hover:scale-[1.005]"
                    >
                        Save Changes
                    </button>

                </form>

            </div>
        </div>
    );
}