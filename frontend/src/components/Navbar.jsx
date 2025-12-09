import {Link, useNavigate} from 'react-router-dom';

export default function NavBar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/auth');
    }
    return (
        <nav className="flex items-center justify-between px-12 py-6 border-b bg-white shadow-sm">
        <div className="text-2xl font-bold text orange-600 cursor-pointer" 
        onClick={() => navigate("/")}>Recipe Finder</div>
        <div className="flex items-center gap-8 text-gray-700 font-medium">
            <Link to="/search" className="hover:text-orange-600 transition">Search Recipes</Link>
            <Link to="/add-recipe" className="hover:text-orange-600 transition">Add Recipe</Link>
            <Link to="/community" className="hover:text-orange-600 transition">Community</Link>
            {token ? (
                <>
                <Link to="/account" className="hover:text-orange-600 transition"> My Account</Link>
                <button onClick={handleLogout} className="hover:text-orange-700 transition">Logout</button>
                </>
            ) : (
               <button onClick={() => navigate('/auth')} 
               className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition">
                Login</button>
            )}
        </div>
        </nav>
    );
}