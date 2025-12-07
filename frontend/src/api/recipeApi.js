export async function searchRecipes(query, page = 1, perPage = 12) {
    const res = await fetch(
        `http://localhost:8000/api/recipes/search?q=${query}&page=${page}&per_page=${perPage}`
    );
    if(!res.ok) {
        throw new Error('Failed to fetch recipes');
    }
    return await res.json();
}