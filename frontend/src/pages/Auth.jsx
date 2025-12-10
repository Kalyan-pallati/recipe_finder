import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const returnUrl = params.get("returnUrl") || "/";

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.access_token);
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

    const res = await fetch("http://localhost:8000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        confirm_password: confirmPassword,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Account created! Please login.");
      setIsSignUp(false);
    } else {
      alert("Signup failed: " + data.detail);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative w-[900px] h-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">

        {/* LEFT: Forms */}
        <div className="w-1/2 h-full p-12 flex flex-col justify-center transition-all duration-500">
          {!isSignUp ? (
            <form onSubmit={handleLogin} className="animate-fadeIn">
              <h2 className="text-4xl font-bold mb-8">Sign In</h2>

              <input
                type="email"
                placeholder="Email"
                className="mb-4 px-4 py-3 border rounded-lg w-full"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="mb-6 px-4 py-3 border rounded-lg w-full"
                onChange={(e) => setPassword(e.target.value)}
              />

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
              />

              <input
                type="password"
                placeholder="Password"
                className="mb-4 px-4 py-3 border rounded-lg w-full"
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="mb-6 px-4 py-3 border rounded-lg w-full"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button className="bg-green-600 w-full text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                Sign Up
              </button>
            </form>
          )}
        </div>

        {/* RIGHT: Sliding Panel */}
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
                onClick={() => setIsSignUp(true)}
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
                onClick={() => setIsSignUp(false)}
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
