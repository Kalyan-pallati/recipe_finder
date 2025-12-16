import {Link, useNavigate} from 'react-router-dom';
import { FaCalendarAlt, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa'; 

export default function NavBar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id'); 
        navigate('/');
    }

    return (
        <nav className="flex items-center justify-between px-12 py-6 border-b bg-white shadow-sm">
            <div 
                className="text-2xl font-bold text-orange-600 cursor-pointer" 
                onClick={() => navigate("/")}
            >
                Recipe Finder
            </div>
            
            <div className="flex items-center gap-8 text-gray-700 font-medium">
                
                <Link to="/search" className="hover:text-orange-600 transition">Search Recipes</Link>
                <Link to="/saved" className="hover:text-orange-600 transition">Saved Recipes</Link>
                <Link to="/my-recipe" className="hover:text-orange-600 transition">My Recipes</Link>
                <Link to="/community" className="hover:text-orange-600 transition">Community</Link>
                
                {token ? (
                    <>
                        <Link to="/meal-planner" 
                            className="hover:text-orange-600 transition flex items-center gap-1">
                            <FaCalendarAlt className="text-lg" /> Meal Planner
                        </Link>
                        
                        <button onClick={handleLogout} 
                            className="hover:text-orange-700 transition flex items-center gap-1 text-red-600">
                            <FaSignOutAlt className="text-lg" /> Logout
                        </button>
                    </>
                ) : (
                    <button onClick={() => navigate('/auth')} 
                        className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition flex items-center gap-2">
                        <FaSignInAlt className="text-sm" /> Login
                    </button>
                )}
            </div>
        </nav>
    );
}