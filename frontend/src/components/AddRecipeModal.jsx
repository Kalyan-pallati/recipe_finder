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
    formData.append("ingredients", JSON.stringify(ingredients));
    
    const stepsFormatted = steps.map((s) => ({step : s}));
    formData.append("steps",JSON.stringify(stepsFormatted));

    if(imageFile){
      formData.append("image", imageFile);
    }

    onSubmit(formData); 
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-[750px] max-h-[90vh] rounded-xl shadow-xl p-6 relative overflow-y-auto">

        {/* CLOSE BUTTON */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Add Your Recipe</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          {/* TITLE */}
          <div>
            <label className="font-medium">Title</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* TIME + SERVINGS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Ready In Minutes</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded mt-1"
                value={readyInMinutes}
                onChange={(e) => setReadyInMinutes(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="font-medium">Servings</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded mt-1"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                required
              />
            </div>
          </div>

          {/* CALORIES */}
          <div>
            <label className="font-medium">Calories</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded mt-1"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="font-medium">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border px-3 py-2 rounded mt-1"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          {/* INGREDIENTS */}
          <div>
            <label className="font-medium">Ingredients</label>

            {ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Name"
                  className="flex-1 border px-3 py-2 rounded"
                  value={ing.name}
                  onChange={(e) =>
                    updateIngredient(index, "name", e.target.value)
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Amount"
                  className="w-24 border px-3 py-2 rounded"
                  value={ing.amount}
                  onChange={(e) =>
                    updateIngredient(index, "amount", e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => removeIngredient(index)}
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 px-3 py-1 bg-gray-200 rounded"
            >
              + Add Ingredient
            </button>
          </div>

          {/* STEPS */}
          <div>
            <label className="font-medium">Instructions (Steps)</label>

            {steps.map((step, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <textarea
                  className="flex-1 border px-3 py-2 rounded"
                  rows="2"
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => removeStep(index)}
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addStep}
              className="mt-2 px-3 py-1 bg-gray-200 rounded"
            >
              + Add Step
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
          >
            Save Recipe
          </button>
        </form>

      </div>
    </div>
  );
}
