import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash, FaUtensils, FaClock, FaHeart } from "react-icons/fa";

export default function Login() {

    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get("returnUrl") || "/";

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.access_token);
                const decoded = jwtDecode(data.access_token);
                localStorage.setItem("user_id", decoded.id);
                navigate(returnUrl);
            } else {
                alert("Login failed: " + data.detail);
            }
        } catch (err) {
            alert("An error occurred during login.");
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            <div className="w-full md:w-[50%] bg-[#7f1d1d] text-white p-12 flex flex-col justify-center">
                <div className="max-w-md mx-auto">
                    <h1 className="text-5xl font-bold mb-6">Welcome Back</h1>
                    <p className="text-xl text-red-100 mb-10">Sign in to continue managing your culinary collection and meal plans.</p>
                    
                    <ul className="space-y-6 text-red-50">
                        <li className="flex gap-4">
                            <FaUtensils className="mt-1 shrink-0 opacity-80" />
                            <div>
                                <p className="font-semibold text-white">Your Recipes</p>
                                <p className="text-sm opacity-80">Access all your saved and community-contributed recipes.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <FaClock className="mt-1 shrink-0 opacity-80" />
                            <div>
                                <p className="font-semibold text-white">Meal Schedule</p>
                                <p className="text-sm opacity-80">Stay on track with your weekly meal planner and nutritional goals.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <FaHeart className="mt-1 shrink-0 opacity-80" />
                            <div>
                                <p className="font-semibold text-white">Favorites</p>
                                <p className="text-sm opacity-80">Quickly find the dishes you love and share them with the community.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="w-full md:w-[55%] p-8 md:p-16 flex flex-col">
                <div className="flex justify-end mb-12 text-sm">
                    <span className="text-gray-600 mr-2">New to RecipeApp?</span>
                    <Link to={`/signup?returnUrl=${encodeURIComponent(returnUrl)}`} 
                    className="text-blue-600 font-medium hover:underline">Create an account &rarr;</Link>
                </div>

                <div className="max-w-[440px] mx-auto w-full flex-1 flex flex-col justify-center">
                    <form onSubmit={handleLogin} className="animate-fadeIn">
                        <h2 className="text-2xl font-semibold mb-8 text-gray-900">Sign in to RecipeApp</h2>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">Email address</label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className="w-full px-3 py-2 bg-[#f6f8fa] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" 
                                    placeholder="Enter your email"
                                    required 
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-semibold text-gray-900">Password</label>
                                    <Link to="/forgot-password" size="sm" className="text-[11px] text-blue-600 hover:underline">Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className="w-full px-3 py-2 bg-[#f6f8fa] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" 
                                        placeholder="Enter password"
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute right-3 top-2.5 text-gray-400"
                                    >
                                        {showPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
                                    </button>
                                </div>
                            </div>

                            <button className="w-full bg-black text-white py-2.5 rounded-md font-bold hover:bg-gray-800 transition shadow-sm mt-4">
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}