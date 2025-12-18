import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";

export default function SignUp() {

    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get("returnUrl") || "/";

    const validatePassword = (pass) => {
        const minLength = 7;
        const hasNumber = /\d/.test(pass);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        const hasUppercase = /[A-Z]/.test(pass);

        if (pass.length < minLength) return "Password must be at least 7 characters long";
        if (!hasUppercase) return "Password must contain at least one uppercase character";
        if (!hasNumber) return "Password must contain at least one number";
        if (!hasSpecialChar) return "Password must contain at least one special character";
        return "";
    };

    async function handleSignup(e) {
        e.preventDefault();
        if (password !== confirmPassword) { setPasswordError("Passwords do not match"); return; }
        const validationMessage = validatePassword(password);
        if (validationMessage) { setPasswordError(validationMessage); return; }
        setPasswordError("");
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password, confirm_password: confirmPassword }),
            });
            if (res.ok) { 
                // setIsVerifying(true); 
                navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
            } else { 
                const data = await res.json(); 
                alert(data.detail); 
            }
        } catch (err) { 
            alert("An error occurred."); 
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            <div className="w-full md:w-[50%] bg-red-800 text-white p-12 flex flex-col justify-center">
                <div className="max-w-md mx-auto">
                    <h1 className="text-5xl font-bold mb-6">Create your free account</h1>
                    <p className="text-xl text-white-400 mb-10">Explore powerful recipe management and community features.</p>
                    
                    <ul className="space-y-6 text-gray-300">
                        <li className="flex gap-4">
                            <FaCheck className="text-green-500 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold text-white">Access to Recipes</p>
                                <p className="text-sm">Search any Recipe you want.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <FaCheck className="text-green-500 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold text-white">Weekly Meal Planning</p>
                                <p className="text-sm">Collaborate securely on public and private meal plans.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <FaCheck className="text-green-500 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold text-white">Community Support</p>
                                <p className="text-sm">Connect with foodies worldwide for instant feedback.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="w-full md:w-[55%] p-8 md:p-16 flex flex-col">
                <div className="flex justify-end mb-12 text-sm">
                    <span className="text-gray-600 mr-2">Already have an account?</span>
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in &rarr;</Link>
                </div>

                <div className="max-w-[440px] mx-auto w-full flex-1 flex flex-col justify-center">
                        <form onSubmit={handleSignup} className="animate-fadeIn">
                            <h2 className="text-2xl font-semibold mb-8 text-gray-900">Sign up for RecipeApp</h2>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">Email *</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-[#f6f8fa] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">Username *</label>
                                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 bg-[#f6f8fa] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">Password *</label>
                                    <div className="relative">
                                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); if(passwordError) setPasswordError(""); }} className="w-full px-3 py-2 bg-[#f6f8fa] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" required />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                                            {showPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
                                        </button>
                                    </div>
                                    {passwordError ? (
                                        <p className="text-red-600 text-xs mt-2 font-medium">{passwordError}</p>
                                    ) : (
                                        <p className="text-gray-500 text-[11px] mt-2 leading-relaxed">Password should be at least 7 characters including a number, an uppercase letter, and a special character.</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">Confirm Password *</label>
                                    <div className="relative">
                                        <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 bg-[#f6f8fa] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" required />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-gray-400">
                                            {showConfirmPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
                                        </button>
                                    </div>
                                </div>

                                <button className="w-full bg-[#2da44e] text-white py-2.5 rounded-md font-bold hover:bg-[#2c974b] transition shadow-sm mt-4">Create account</button>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    );
}