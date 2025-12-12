import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export default function CommunityRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 12;
  const navigate = useNavigate();

  async function fetchAllRecipes() {
    setLoading(true);

    const res = await fetchWithAuth(
      `http://localhost:8000/api/my-recipes/community?page=${page}&per_page=${perPage}`
    );

    const data = await res.json();
    setRecipes(data.results || []);
    setTotal(data.total_results || 0);
    setLoading(false);
  }

  useEffect(() => {
    fetchAllRecipes();
  }, [page]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Community Recipes</h1>
        <p className="text-gray-600 font-medium">Page {page} / {totalPages || 1}</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-600">No community recipes found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {recipes.map((r) => (
              <article
                key={r.id}
                onClick={() => navigate(`/my-recipes/${r.id}`)}
                className="
                  relative bg-white rounded-lg overflow-hidden shadow 
                  transition-all duration-300 cursor-pointer group
                  hover:scale-[1.03] hover:shadow-xl
                "
              >
                <div
                  className="
                    absolute inset-0 bg-black/80
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 z-10
                  "
                ></div>

                <div className="relative z-20">
                  <img
                    src={r.image || "/no-image.png"}
                    alt={r.title}
                    className="w-full h-40 object-cover"
                  />

                  <div className="p-3 group-hover:text-white transition">
                    <h3 className="font-semibold text-lg mb-1">{r.title}</h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600 group-hover:text-gray-200">
                      <span>⏱ {r.readyInMinutes ?? "N/A"} mins</span>
                      <span>🔥 {r.calories ?? "N/A"} kcal</span>
                    </div>

                    <div className="mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/my-recipes/${r.id}`);
                        }}
                        className="
                          text-sm px-3 py-1 rounded transition
                          bg-orange-500 text-white
                          group-hover:bg-white group-hover:text-orange-600
                        "
                      >
                        View
                      </button>
                    </div>
                  </div>

                </div>
              </article>
            ))}

          </div>

          <div className="flex justify-center gap-5 mt-10 pb-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
