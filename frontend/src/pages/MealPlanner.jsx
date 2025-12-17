import React, { useState, useEffect } from 'react';
import { getFloatingWeekDays, dayNames, mealTypes, formatDate } from '../utils/dateUtils'
import { fetchWithAuth } from '../utils/fetchWithAuth'; 
import MealSchedulerModal from '../components/MealSchedularModal'
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;
const MEAL_PLANS_URL = `${API_URL}/api/meal`; 

const organizePlan = (meals) => {
    return meals.reduce((acc, meal) => {
        const date = meal.date;
        const type = meal.meal_type.toLowerCase();
        if (!acc[date]) {
            acc[date] = {};
        }
        acc[date][type] = { ...meal, id: meal._id };
        return acc;
    }, {});
};

export default function MealPlanner() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weeklyPlan, setWeeklyPlan] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mealSlot, setMealSlot] = useState({ date: '', type: '' });

    const weekDays = getFloatingWeekDays(currentDate);

    const startDateAPI = weekDays[0];
    const endDateAPI = weekDays[weekDays.length - 1];

    async function fetchPlan() {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        if (!token) {
             setError("Please log in to view your meal plan.");
             setLoading(false);
             return;
        }

        try {
            const res = await fetchWithAuth(
                `${MEAL_PLANS_URL}?start_date=${startDateAPI}&end_date=${endDateAPI}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to fetch meal plan.");
            }

            const meals = await res.json();
            setWeeklyPlan(organizePlan(meals));
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleClick(source_id, source_type) {
        if(source_type === "spoonacular"){
            navigate(`/recipe/${source_id}`);
        }
        else if(source_type === "community"){
            navigate(`/my-recipes/${source_id}`)
        }
    }

    async function handleDeleteMeal(e, mealId) {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to remove this meal?")) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetchWithAuth(`${MEAL_PLANS_URL}/${mealId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to delete meal.");
            }
            fetchPlan(); 
            
        } catch (err) {
            alert(`Error deleting meal: ${err.message}`);
        }
    }


    useEffect(() => {
        fetchPlan();
    }, [startDateAPI, endDateAPI]); 


    const changeWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentDate(newDate);
    };
    
    const startDayIndex = currentDate.getDay(); 
    
    const getDisplayDayName = (index) => {
        const dayOfWeek = (startDayIndex + index) % 7;
        return dayNames[dayOfWeek];
    };

    const handleOpenModal = (date, type) => {
        setMealSlot({ date, type });
        setIsModalOpen(true);
    };

    if (error) return <div className="text-red-500 p-8">Error: {error}</div>;
    
    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Your Weekly Meal Planner</h1>
            
            <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={() => changeWeek('prev')}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition duration-150"
                >
                    &larr; Prev Week 
                </button>
                <h2 className="text-xl font-semibold">
                    {startDateAPI} — {endDateAPI}
                </h2>
                <button 
                    onClick={() => changeWeek('next')}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition duration-150"
                >
                    Next Week &rarr;
                </button>
            </div>

            {loading ? (
                <div className="text-center p-10 text-lg font-medium text-gray-700">Loading Meal Plan...</div>
            ) : (
                <div className="overflow-x-auto bg-white border rounded-lg shadow-xl">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider w-1/5 border-r border-gray-200">Day / Slot</th>
                                {mealTypes.map(type => (
                                    <th key={type} className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider w-1/5">
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-200">
                            {weekDays.map((date, index) => (
                                <tr key={date} className={date === formatDate(new Date()) ? "bg-yellow-50/50" : "hover:bg-gray-50 transition duration-100"}>
                                    <td className="px-6 py-4 whitespace-nowrap text-md font-semibold text-gray-900 border-r border-gray-200">
                                        {getDisplayDayName(index)} ({date})
                                    </td>
                                    {mealTypes.map(type => {
                                        const meal = weeklyPlan[date] && weeklyPlan[date][type];
                                        return (
                                            <td key={type} className="p-2 align-top border-l border-r">
                                                {meal ? (
                                                    <div className="p-2 bg-green-100 rounded-lg text-sm relative group transition duration-100 hover:bg-green-200">
                                                        <p onClick={() => handleClick(meal.source_id, meal.source_type)}
                                                        className="font-bold text-gray-800 break-words">{meal.title}</p> 
                                                        <p className="text-xs text-green-700 truncate">{meal.source_type.toUpperCase()}</p>
                                                        
                                                        <button 
                                                            onClick={(e) => handleDeleteMeal(e, meal.id)}
                                                            className="absolute top-1 right-1 p-1 text-md text-red-500 hover:text-red-700 transition duration-150"
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleOpenModal(date, type)}
                                                        className="w-full h-full min-h-[7rem] p-2 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition duration-150"
                                                    >
                                                        + Add Meal
                                                    </button>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {isModalOpen && (
                <MealSchedulerModal 
                    date={mealSlot.date} 
                    type={mealSlot.type} 
                    onClose={() => setIsModalOpen(false)}
                    onMealAdded={fetchPlan}
                />
            )}

        </div>
    );
}