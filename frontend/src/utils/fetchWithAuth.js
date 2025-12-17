export async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem("token");

    if(!token) {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
         window.location.href = `/login?returnUrl=${returnUrl}`;
    }
    const headers = {
        ...(options.headers || {}),
        Authorization : `Bearer ${token}`,
        "Content-Type": "application/json",
    };
    
    const res = await fetch(url, {...options, headers});

    if(res.status === 401){

        const current = window.location.pathname + window.location.search;
        const encoded = encodeURIComponent(current);

        localStorage.removeItem("token");

        window.location.href = `/login?returnUrl=${encoded}`;
        
        throw new Error("Session Expired. Logged Out");
    }
    return res;
}