import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({children}) {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if(!token){
        const returnUrl = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
    }
    return children;
}