import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Auth() {

	const API_URL = import.meta.env.VITE_API_BASE_URL;

	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState(""); 
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword]= useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  	const [passwordError, setPasswordError] = useState("");

	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const returnUrl = params.get("returnUrl") || "/";
	const navigate = useNavigate();

  const validatePassword = (pass) => {
    const minLength = 7;
    const hasNumber = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const hasUppercase = /[A-Z]/.test(pass);

    if(pass.length < minLength) return "Password must be at least 7 characters long";
    if(!hasNumber) return "Password must contain at least one number";
    if(!hasSpecialChar) return "Password must contain at least one special character";
    if(!hasUppercase) return "Password must contain at least one upper case character";
    
    return "";
  }

	async function handleLogin(e) {
		e.preventDefault();

		const res = await fetch(`${API_URL}api/auth/login`, {
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
	}

	async function handleSignup(e) {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}
    
    const validationMessage = validatePassword(password);
    if(validationMessage){
      setPasswordError(validationMessage);
      return;
    }
    setPassword("");

		const payload = {
			email,
			username,
			password,
			confirm_password: confirmPassword,
		};

		const res = await fetch("http://localhost:8000/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		const data = await res.json();

		if (res.ok) {
			alert("Verification OTP Sent. Please check your inbox");
			setIsSignUp(false);
      
		} else {
			alert("Signup failed: " + data.detail);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-white-100">
			<div className="relative w-[900px] h-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">

				<div className="w-1/2 h-full p-12 flex flex-col justify-center transition-all duration-500">
					{!isSignUp ? (
						<form onSubmit={handleLogin} className="animate-fadeIn">
							<h2 className="text-4xl font-bold mb-8">Sign In</h2>

							<input
								type="email"
								placeholder="Email"
								className="mb-4 px-4 py-3 border rounded-lg w-full"
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Password"
								className="mb-6 px-4 py-3 border rounded-lg w-full pr-12"
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 focus:outline-none">
								{showPassword ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
							</button>
							</div>

							<button className="bg-orange-500 w-full text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
								Login
							</button>
						</form>
					) : (
						<form onSubmit={handleSignup} className="animate-fadeIn">
							<h2 className="text-4xl font-bold mb-8">Create Account</h2>

							<input
								type="email"
								placeholder="Email"
								className="mb-4 px-4 py-3 border rounded-lg w-full"
								onChange={(e) => setEmail(e.target.value)}
								required
							/>

							<input
								type="text"
								placeholder="Username"
								className="mb-4 px-4 py-3 border rounded-lg w-full"
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
							<div className="relative">
							<input
								type={showPassword? "text" : "password"}
								placeholder="Password"
								className="mb-4 px-4 py-3 border rounded-lg w-full pr-12"
								onChange={(e) => {
                  setPassword(e.target.value);
                  if(passwordError) setPasswordError("");
                }}
								required
							/>
							<button type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 focus:outline-none">
								{showPassword? <FaEyeSlash size={20}/>: <FaEye size={20}/>}
							</button>
							</div>
							<div className="relative">
							<input
								type={showConfirmPassword?"text" : "password"}
								placeholder="Confirm Password"
								className="mb-6 px-4 py-3 border rounded-lg w-full"
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
							<button type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 focus:outline-none">
								{showConfirmPassword? <FaEyeSlash size={20}/>: <FaEye size={20}/>}
							</button>
							</div>
              {passwordError && <p className="text-red-500 text-xs mb-2">{passwordError}</p>}
							<button className="bg-green-600 w-full text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
								Sign Up
							</button>
						</form>
					)}
				</div>
				
				<div
					className={`
						w-1/2 h-full flex flex-col items-center justify-center text-white
						transition-all duration-700
						${isSignUp ? "bg-pink-600" : "bg-blue-600"}
					`}
				>
					{!isSignUp ? (
						<>
							<h1 className="text-4xl font-bold mb-4">New Here?</h1>
							<p className="mb-6 text-center px-6">Create an account to explore recipes</p>
							<button
								onClick={() => {
									setIsSignUp(true);
									setShowPassword(false);
									setShowConfirmPassword(false);
								}}
								className="px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-600 transition"
							>
								Sign Up
							</button>
						</>
					) : (
						<>
							<h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
							<p className="mb-6 text-center px-6">Already have an account?</p>
							<button
								onClick={() => {
									setIsSignUp(false);
									setShowPassword(false);
									setShowConfirmPassword(false);
								}}
								className="px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-pink-600 transition"
							>
								Sign In
							</button>
						</>
					)}
				</div>

			</div>
		</div>
	);
}