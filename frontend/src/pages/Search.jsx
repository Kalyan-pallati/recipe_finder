import { useEffect, useState } from "react";
import { searchRecipes } from "../api/recipeApi";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Search() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = params.get("q") || "";

  // form state
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const perPage = 12;

  // filters (10-ish)
  const [cuisine, setCuisine] = useState(""); // e.g., "italian"
  const [diet, setDiet] = useState(""); // e.g., "vegetarian"
  const [intolerances, setIntolerances] = useState([]); // array of strings
  const [maxReadyTime, setMaxReadyTime] = useState("");
  const [minCalories, setMinCalories] = useState("");
  const [maxCalories, setMaxCalories] = useState("");
  const [includeIngredients, setIncludeIngredients] = useState(""); // comma-separated
  const [excludeIngredients, setExcludeIngredients] = useState(""); // comma-separated
  const [sort, setSort] = useState(""); // e.g. "popularity", "healthiness"
  const [sortDirection, setSortDirection] = useState("asc"); // asc/desc

  // results state
  const [recipes, setRecipes] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Compose filters object to pass to API helper
  function buildFilters() {
    return {
      cuisine: cuisine || undefined,
      diet: diet || undefined,
      intolerances: intolerances.length ? intolerances : undefined,
      maxReadyTime: maxReadyTime || undefined,
      minCalories: minCalories || undefined,
      maxCalories: maxCalories || undefined,
      includeIngredients: includeIngredients || undefined,
      excludeIngredients: excludeIngredients || undefined,
      sort: sort || undefined,
      sortDirection: sortDirection || undefined,
    };
  }

  // fetch helper
  async function doSearch(p = 1) {
    setLoading(true);
    setError("");
    const filters = buildFilters();
    try {
      const data = await searchRecipes(query, p, perPage, filters);
      setRecipes(data.results || []);
      setTotalResults(data.total_results ?? data.totalResults ?? 0);
      setPage(p);
      // update address bar with query and page
      const qp = new URLSearchParams();
      if (query) qp.set("q", query);
      qp.set("page", String(p));
      navigate(`/search?${qp.toString()}`, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch recipes");
    } finally {
      setLoading(false);
    }
  }

  // initial effect: if initialQuery present, run search
  useEffect(() => {
    if (initialQuery) {
      doSearch(1);
    } else {
      // empty results until user searches
      setRecipes([]);
      setTotalResults(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // pagination helpers
  const totalPages = Math.max(1, Math.ceil((totalResults || recipes.length) / perPage));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  function handlePrev() {
    if (!canPrev) return;
    doSearch(page - 1);
  }
  function handleNext() {
    if (!canNext) return;
    doSearch(page + 1);
  }

  // helper to toggle intolerance checkbox values
  function toggleIntolerance(val) {
    setIntolerances(prev => prev.includes(val) ? prev.filter(x=>x!==val) : [...prev, val]);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* LEFT SIDEBAR: filters (25-30%) */}
        <aside className="w-72 md:w-80 lg:w-96 shrink-0 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Search & Filters</h3>

          <label className="block text-sm font-medium mb-1">Search</label>
          <div className="flex gap-2 mb-4">
            <input
              className="flex-1 px-3 py-2 border rounded"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. chicken biryani"
            />
            <button
              onClick={() => doSearch(1)}
              className="px-3 py-2 bg-orange-600 text-white rounded"
            >
              Go
            </button>
          </div>

          {/* Filter: Cuisine */}
          <label className="block text-sm font-medium mb-1">Cuisine</label>
          <select value={cuisine} onChange={(e)=>setCuisine(e.target.value)} className="w-full mb-3 px-2 py-2 border rounded">
            <option value="">Any</option>
            <option>italian</option>
            <option>indian</option>
            <option>mexican</option>
            <option>chinese</option>
            <option>japanese</option>
            <option>french</option>
          </select>

          {/* Diet */}
          <label className="block text-sm font-medium mb-1">Diet</label>
          <select value={diet} onChange={(e)=>setDiet(e.target.value)} className="w-full mb-3 px-2 py-2 border rounded">
            <option value="">Any</option>
            <option>vegetarian</option>
            <option>vegan</option>
            <option>gluten free</option>
            <option>ketogenic</option>
            <option>pescetarian</option>
          </select>

          {/* Intolerances (checkbox list) */}
          <label className="block text-sm font-medium mb-1">Intolerances</label>
          <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
            {["dairy","egg","gluten","peanut","seafood","sesame","soy","sulfite","tree nut","wheat"].map(i => (
              <label key={i} className="inline-flex items-center gap-2">
                <input type="checkbox" checked={intolerances.includes(i)} onChange={()=>toggleIntolerance(i)} />
                <span className="capitalize">{i}</span>
              </label>
            ))}
          </div>

          {/* Time */}
          <label className="block text-sm font-medium mb-1">Max ready time (mins)</label>
          <input type="number" value={maxReadyTime} onChange={(e)=>setMaxReadyTime(e.target.value)} className="w-full mb-3 px-2 py-2 border rounded" />

          {/* Calories */}
          <label className="block text-sm font-medium mb-1">Min calories</label>
          <input type="number" value={minCalories} onChange={(e)=>setMinCalories(e.target.value)} className="w-full mb-3 px-2 py-2 border rounded" />
          <label className="block text-sm font-medium mb-1">Max calories</label>
          <input type="number" value={maxCalories} onChange={(e)=>setMaxCalories(e.target.value)} className="w-full mb-3 px-2 py-2 border rounded" />

          {/* Include/Exclude ingredients */}
          <label className="block text-sm font-medium mb-1">Include ingredients (comma separated)</label>
          <input type="text" value={includeIngredients} onChange={(e)=>setIncludeIngredients(e.target.value)} className="w-full mb-3 px-2 py-2 border rounded" />
          <label className="block text-sm font-medium mb-1">Exclude ingredients (comma separated)</label>
          <input type="text" value={excludeIngredients} onChange={(e)=>setExcludeIngredients(e.target.value)} className="w-full mb-3 px-2 py-2 border rounded" />

          {/* Sorting */}
          <label className="block text-sm font-medium mb-1">Sort by</label>
          <select value={sort} onChange={(e)=>setSort(e.target.value)} className="w-full mb-3 px-2 py-2 border rounded">
            <option value="">Relevance</option>
            <option value="popularity">Popularity</option>
            <option value="healthiness">Healthiness</option>
            <option value="time">Time</option>
          </select>

          <label className="block text-sm font-medium mb-1">Sort direction</label>
          <select value={sortDirection} onChange={(e)=>setSortDirection(e.target.value)} className="w-full mb-3 px-2 py-2 border rounded">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <div className="mt-4 flex gap-2">
            <button onClick={() => doSearch(1)} className="flex-1 bg-orange-600 text-white py-2 rounded">Apply</button>
            <button onClick={()=>{
              // reset filters
              setCuisine(""); setDiet(""); setIntolerances([]); setMaxReadyTime("");
              setMinCalories(""); setMaxCalories(""); setIncludeIngredients(""); setExcludeIngredients("");
              setSort(""); setSortDirection("asc");
            }} className="flex-1 border py-2 rounded">Reset</button>
          </div>
        </aside>

        {/* RIGHT: results */}
        <section className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Results</h2>
              <p className="text-sm text-gray-600">{totalResults} results</p>
            </div>

            {/* small page indicator */}
            <div className="text-sm text-gray-600">
              Page {page} / {totalPages}
            </div>
          </div>

          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center">Loading...</div>
          ) : error ? (
            <div className="min-h-[200px] p-6 bg-red-50 text-red-600 rounded">{error}</div>
          ) : recipes.length === 0 ? (
            <div className="min-h-[200px] p-6 text-gray-600">No recipes. Try another query.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recipes.map((r) => (
                  <article key={r.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition cursor-pointer">
                    <img src={r.image} alt={r.title} className="w-full h-40 object-cover" />
                    <div className="p-3">
                      <h3 className="font-semibold text-lg mb-1">{r.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>⏱ {r.readyInMinutes ?? "N/A"} mins</span>
                        <span>🔥 {r.calories ?? "N/A"} kcal</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={()=> window.open(r.sourceUrl || `https://spoonacular.com/recipes/${r.id}`, "_blank")} className="text-sm bg-orange-500 text-white px-3 py-1 rounded">View</button>
                        <button onClick={()=> {/* future: save favorite */}} className="text-sm border px-3 py-1 rounded">Save</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination controls */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <button disabled={!canPrev} onClick={handlePrev} className={`px-4 py-2 rounded ${canPrev ? "bg-white border" : "bg-gray-100 text-gray-400"}`}>Prev</button>
                <div className="px-3 py-2 bg-white border rounded">Page {page} of {totalPages}</div>
                <button disabled={!canNext} onClick={handleNext} className={`px-4 py-2 rounded ${canNext ? "bg-white border" : "bg-gray-100 text-gray-400"}`}>Next</button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
