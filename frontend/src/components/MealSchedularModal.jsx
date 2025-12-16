import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const MEAL_PLANS_URL = "http://localhost:8000/api/meal";
// Fetch a reasonable number of saved recipes for the modal selector
const SAVED_RECIPES_URL = "http://localhost:8000/api/recipes/saved?per_page=100"; 

export default function MealSchedulerModal({ date, type, onClose, onMealAdded }) {
    
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [loadingRecipes, setLoadingRecipes] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [scheduling, setScheduling] = useState(false);
    const [error, setError] = useState(null);

    // --- Data Fetching: Load Saved Recipes ---
    useEffect(() => {
        const loadSavedRecipes = async () => {
            setLoadingRecipes(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetchWithAuth(SAVED_RECIPES_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const data = await res.json();
                if (res.ok) {
                    // Saved recipes already have the necessary source_type field
                    setSavedRecipes(data.results || []); 
                } else {
                    throw new Error(data.detail || "Failed to load saved recipes.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingRecipes(false);
            }
        };
        loadSavedRecipes();
    }, []);

    // --- Scheduling Handler (POST /meal-plans) ---
    const handleSchedule = async () => {
        if (!selectedRecipe) {
            setError("Please select a recipe.");
            return;
        }

        setScheduling(true);
        setError(null);
        const token = localStorage.getItem('token');

        const payload = {
            source_id: String(selectedRecipe.recipe_id), 
            source_type: selectedRecipe.source_type, 
            date: date,
            meal_type: type,
            title: selectedRecipe.title,
            image: selectedRecipe.image || null, 
        };

        try {
            const res = await fetchWithAuth(MEAL_PLANS_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Failed to schedule meal. Slot may be booked.");
            }

            onClose();
            onMealAdded(); 
            
        } catch (err) {
            setError(err.message);
            setScheduling(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                
                <h2 className="text-2xl font-bold mb-2">Schedule Meal</h2>
                <p className="text-gray-600 mb-4">Slot: <span className="font-semibold">{type.toUpperCase()}</span> on <span className="font-semibold">{date}</span></p>

                {error && <p className="text-red-500 mb-3">{error}</p>}
                
                <div className="flex-1 overflow-y-auto border p-3 rounded mb-4">
                    <h3 className="text-lg font-medium mb-2">Select a Saved Recipe:</h3>

                    {loadingRecipes ? (
                        <p className="text-center py-5">Loading saved recipes...</p>
                    ) : savedRecipes.length === 0 ? (
                        <p className="text-gray-500 text-center py-5">You have no saved recipes. Browse and save some first!</p>
                    ) : (
                        <div className="space-y-2">
                            {savedRecipes.map((r) => (
                                <div 
                                    key={r.recipe_id}
                                    onClick={() => setSelectedRecipe(r)}
                                    className={`
                                        flex items-center p-2 rounded cursor-pointer transition 
                                        ${selectedRecipe && selectedRecipe.recipe_id === r.recipe_id 
                                            ? 'bg-blue-100 border-2 border-blue-500' 
                                            : 'bg-gray-50 hover:bg-gray-100 border'
                                        }
                                    `}
                                >
                                    <img src={r.image || '/default.png'} alt={r.title} className="w-10 h-10 object-cover rounded mr-3" />
                                    <div className="flex-1">
                                        <p className="font-medium">{r.title}</p>
                                        
                                        <p className="text-xs text-gray-500">
                                            {r.source_type 
                                                ? r.source_type.charAt(0).toUpperCase() + r.source_type.slice(1) + ' Recipe'
                                                : 'Unknown Source Recipe'
                                            }
                                        </p>

                                    </div>
                                    {selectedRecipe && selectedRecipe.recipe_id === r.recipe_id && (
                                        <span className="text-blue-600 font-bold">&#10003;</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                        disabled={scheduling}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSchedule}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        disabled={scheduling || !selectedRecipe}
                    >
                        {scheduling ? 'Scheduling...' : 'Save to Plan'}
                    </button>
                </div>
            </div>
        </div>
    );
}