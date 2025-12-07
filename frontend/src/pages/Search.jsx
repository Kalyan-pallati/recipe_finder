import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Search() {
    const [params] = useSearchParams();
    const query = params.get("q");

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        async function fetchRecipes() {
            try {
                const response = await fetch(`http://localhost:8000/api/recipes/search?q=${query}`);
                const data = await response.json();
                setRecipes(data.results || []);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
            setLoading(false);
        }
        fetchRecipes();
    }, [query]);

    if(loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-xl">
                Loading recipes...
            </div>
        ); 
    }

    return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Results for: <span className="text-orange-600">{query}</span>
      </h1>

      {recipes.length === 0 ? (
        <p className="text-gray-600 text-lg">No such recipes found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {recipes.map((recipe) => (
                <div key={recipe.id}
                className="shadow-md rounded-xl overflow-hidden bg-white hover:scale-105 transition cursor-pointer">
                    <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
                
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-2">{recipe.title}</h2>
                        <p className="text-gray-600 text-sm">Ready in {recipe.readyInMinutes} mins</p>
                    </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}
export default Search;