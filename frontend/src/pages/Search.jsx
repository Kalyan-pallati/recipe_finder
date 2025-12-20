import { useEffect, useState } from "react";
import { searchRecipes } from "../api/recipeApi";
import { useSearchParams, useNavigate, data } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export default function Search() {

    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const [params] = useSearchParams();
    const navigate = useNavigate();
    const initialQuery = params.get("q") || "";

    const [query, setQuery] = useState(initialQuery);
    const [page, setPage] = useState(1);
    const perPage = 12;

    const [cuisine, setCuisine] = useState("");
    const [diet, setDiet] = useState("");
    const [intolerances, setIntolerances] = useState([]);
    const [maxReadyTime, setMaxReadyTime] = useState("");
    const [minCalories, setMinCalories] = useState("");
    const [maxCalories, setMaxCalories] = useState("");
    const [includeIngredients, setIncludeIngredients] = useState("");
    const [excludeIngredients, setExcludeIngredients] = useState("");
    const [sort, setSort] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");

    const [recipes, setRecipes] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [savedIds, setSavedIds] = useState([]);

    useEffect(() => {
        async function loadSaved() {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetchWithAuth(`${API_URL}/api/recipes/saved_recipes?source_type=spoonacular`, {

                headers: { Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
                });
            
            const data = await res.json()
            if (res.ok) {
                setSavedIds(data.saved_ids.map(id => String(id)));
            }
        }
        loadSaved();
        console.log(savedIds);
    }, []);

    function buildFilters() {
        return {
            cuisine: cuisine || undefined,
            diet: diet || undefined,
            intolerances: intolerances.length ? intolerances.join(",") : undefined,
            maxReadyTime: maxReadyTime || undefined,
            minCalories: minCalories || undefined,
            maxCalories: maxCalories || undefined,
            includeIngredients: includeIngredients || undefined,
            excludeIngredients: excludeIngredients || undefined,
            sort: sort || undefined,
            sortDirection: sortDirection || undefined,
        };
    }

    async function doSearch(p = 1) {
        setLoading(true);
        setError("");

        try {
            const filters = buildFilters();
            const data = await searchRecipes(query, p, perPage, filters);

            setRecipes(data.results || []);
            setTotalResults(data.total_results ?? data.totalResults ?? 0);
            setPage(p);

            const qp = new URLSearchParams();
            if (query) qp.set("q", query);
            qp.set("page", String(p));
            navigate(`/search?${qp.toString()}`, { replace: true });
        } catch (err) {
            setError(err.message || "Failed to fetch recipes");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        window.scroll(0,0);
        if (initialQuery) doSearch(1);
        else {
            setRecipes([]);
            setTotalResults(0);
        }
    }, [initialQuery]);

    const totalPages = Math.max(1, Math.ceil((totalResults || recipes.length) / perPage));
    const canPrev = page > 1;
    const canNext = page < totalPages;

    function handlePrev() {
        if (canPrev) doSearch(page - 1);
    }
    function handleNext() {
        if (canNext) doSearch(page + 1);
    }

    function toggleIntolerance(val) {
        setIntolerances((prev) =>
            prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
        );
    }

    async function handleSave(e, recipe) {
        e.stopPropagation();
        const token = localStorage.getItem("token");
        
        // console.log(recipe.id);
        // console.log(recipe.title);
        // console.log(recipe.image);
        // console.log(recipe.readyInMinutes);
        // console.log(recipe.calories);
        const res = await fetchWithAuth(`${API_URL}/api/recipes/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                recipe_id: String(recipe.id),
                source_type: "spoonacular",
                title: recipe.title,
                image: recipe.image,
                readyInMinutes: recipe.readyInMinutes,
                calories: recipe.calories,
            }),
        });

        if (res.ok) setSavedIds((prev) => [...prev, String(recipe.id)]);
    }

    async function handleUnsave(e, recipeId) {
        e.stopPropagation();
        const token = localStorage.getItem("token");

        const source_type = "spoonacular";
        const res = await fetchWithAuth(`${API_URL}/api/recipes/unsave/${recipeId}?source_type=${source_type}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) setSavedIds((prev) => prev.filter((id) => id !== recipeId));
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">

                <aside className="w-72 md:w-80 lg:w-96 shrink-0 bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Search & Filters</h3>

                    <label className="block text-sm font-medium mb-1">Search</label>
                    <div className="flex gap-2 mb-4">
                        <input className="flex-1 px-3 py-2 border rounded" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. chicken biryani" />
                        <button onClick={() => doSearch(1)} className="px-3 py-2 bg-orange-600 text-white rounded">Go</button>
                    </div>

                    <label className="block text-sm font-medium mb-1">Cuisine</label>
                    <select className="w-full mb-3 px-2 py-2 border rounded" value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
                        <option value="">Any</option>
                        <option>indian</option>
                        <option>italian</option>
                        <option>mexican</option>
                        <option>chinese</option>
                        <option>japanese</option>
                    </select>

                    <label className="block text-sm font-medium mb-1">Diet</label>
                    <select className="w-full mb-3 px-2 py-2 border rounded" value={diet} onChange={(e) => setDiet(e.target.value)}>
                        <option value="">Any</option>
                        <option>vegetarian</option>
                        <option>vegan</option>
                        <option>ketogenic</option>
                    </select>

                    <label className="block text-sm font-medium mb-1">Intolerances</label>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        {["dairy","egg","gluten","peanut","seafood","soy","wheat"].map((i) => (
                            <label key={i} className="inline-flex items-center gap-1">
                                <input type="checkbox" checked={intolerances.includes(i)} onChange={() => toggleIntolerance(i)} />
                                <span className="capitalize">{i}</span>
                            </label>
                        ))}
                    </div>

                    <label className="block text-sm font-medium mb-1">Max Ready Time</label>
                    <input type="number" className="w-full mb-3 px-2 py-2 border rounded" value={maxReadyTime} onChange={(e) => setMaxReadyTime(e.target.value)} />

                    <label className="block text-sm font-medium mb-1">Min Calories</label>
                    <input type="number" className="w-full mb-3 px-2 py-2 border rounded" value={minCalories} onChange={(e) => setMinCalories(e.target.value)} />

                    <label className="block text-sm font-medium mb-1">Max Calories</label>
                    <input type="number" className="w-full mb-3 px-2 py-2 border rounded" value={maxCalories} onChange={(e) => setMaxCalories(e.target.value)} />

                    <label className="block text-sm font-medium mb-1">Include Ingredients</label>
                    <input type="text" className="w-full mb-3 px-2 py-2 border rounded" value={includeIngredients} onChange={(e) => setIncludeIngredients(e.target.value)} />

                    <label className="block text-sm font-medium mb-1">Exclude Ingredients</label>
                    <input type="text" className="w-full mb-3 px-2 py-2 border rounded" value={excludeIngredients} onChange={(e) => setExcludeIngredients(e.target.value)} />

                    <label className="block text-sm font-medium mb-1">Sort by</label>
                    <select className="w-full mb-3 px-2 py-2 border rounded" value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="">Relevance</option>
                        <option value="popularity">Popularity</option>
                        <option value="healthiness">Healthiness</option>
                        <option value="time">Time</option>
                    </select>

                    <label className="block text-sm font-medium mb-1">Sort direction</label>
                    <select className="w-full mb-3 px-2 py-2 border rounded" value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>

                    <div className="mt-4 flex gap-2">
                        <button onClick={() => doSearch(1)} className="flex-1 bg-orange-600 text-white py-2 rounded">Apply</button>
                        <button
                            onClick={() => {
                                setCuisine("");
                                setDiet("");
                                setIntolerances([]);
                                setMaxReadyTime("");
                                setMinCalories("");
                                setMaxCalories("");
                                setIncludeIngredients("");
                                setExcludeIngredients("");
                                setSort("");
                                setSortDirection("asc");
                            }}
                            className="flex-1 border py-2 rounded"
                        >
                            Reset
                        </button>
                    </div>
                </aside>

                <section className="flex-1">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Results</h2>
                            <p className="text-sm text-gray-600">{totalResults} results</p>
                        </div>

                        <div className="text-sm text-gray-600">
                            Page {page} / {totalPages}
                        </div>
                    </div>

                    {loading ? (
                        <div className="min-h-[400px] flex items-center justify-center">Loading...</div>
                    ) : error ? (
                        <div className="min-h-[200px] p-6 bg-red-50 text-red-600 rounded">{error}</div>
                    ) : recipes.length === 0 ? (
                        <div className="min-h-[200px] p-6 text-gray-600">
                            No recipes found. Try another search.
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {recipes.map((r) => (
                                    <article
                                        key={r.id}
                                        onClick={() => navigate(`/recipe/${r.id}`)}
                                        className="relative bg-white rounded-lg overflow-hidden shadow transition-all duration-300 cursor-pointer group hover:scale-[1.03] hover:shadow-xl"
                                    >

                                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                                        <div className="relative z-20">

                                            <img src={r.image} alt={r.title} className="w-full h-40 object-cover group-hover:brightness-75 transition" />

                                            <div className="p-3 transition group-hover:text-white">
                                                <h3 className="font-semibold text-lg mb-1">{r.title}</h3>

                                                <div className="flex items-center gap-4 text-sm text-gray-600 group-hover:text-gray-200">
                                                    <span>⏱ {r.readyInMinutes ?? "N/A"} mins</span>
                                                    <span>🔥 {r.calories ?? "N/A"} kcal</span>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex gap-2 p-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/recipe/${r.id}`);
                                                    }}
                                                    className="text-sm bg-orange-500 text-white px-3 py-1 rounded transition group-hover:bg-white group-hover:text-orange-600"
                                                >
                                                    View
                                                </button>

                                                {savedIds.includes(String(r.id)) ? (
                                                    <button
                                                        onClick={(e) => handleUnsave(e, r.id)}
                                                        className="text-sm bg-red-500 text-white px-3 py-1 rounded transition group-hover:bg-white group-hover:text-red-600"
                                                    >
                                                        Unsave
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => handleSave(e, r)}
                                                        className="text-sm border px-3 py-1 rounded transition group-hover:bg-white group-hover:text-black"
                                                    >
                                                        Save
                                                    </button>
                                                )}
                                            </div>

                                        </div>
                                    </article>

                                ))}
                            </div>

                            <div className="mt-6 flex items-center justify-center gap-4">
                                <button
                                    disabled={!canPrev}
                                    onClick={handlePrev}
                                    className={`px-4 py-2 rounded ${canPrev ? "bg-white border" : "bg-gray-100 text-gray-400"}`}
                                >
                                    Prev
                                </button>

                                <div className="px-3 py-2 bg-white border rounded">
                                    Page {page} of {totalPages}
                                </div>

                                <button
                                    disabled={!canNext}
                                    onClick={handleNext}
                                    className={`px-4 py-2 rounded ${canNext ? "bg-white border" : "bg-gray-100 text-gray-400"}`}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}