export async function searchRecipes(query, page = 1, perPage = 12, filters = {}) {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const params = new URLSearchParams();
  if (query) params.append("q", query);
  params.append("page", String(page));
  params.append("per_page", String(perPage));

  Object.entries(filters).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    if (Array.isArray(v)) {
      if (v.length) params.append(k, v.join(","));
      return;
    }
    if (String(v).trim() === "") return;
    params.append(k, String(v));
  });

  const url = `${API_URL}/api/recipes/search?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errBody = await res.text().catch(()=>"");
    throw new Error(`Failed to fetch recipes: ${res.status} ${errBody}`);
  }
  return await res.json();
}
