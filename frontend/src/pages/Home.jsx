import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-12 py-6 border-b bg-white">
        
        <div className="text-xl font-bold">LOGO</div>

        <div className="flex items-center gap-10 text-gray-700 font-medium">
          <a href="#" className="hover:text-orange-600">Browse Recipes</a>
          <a href="#" className="hover:text-orange-600">My Planner</a>
          <a href="#" className="hover:text-orange-600">Premium</a>
          <a href="#" className="hover:text-orange-600">Resources</a>

          <button
            className="hover:text-orange-600"
            onClick={() => navigate("/auth")}
          >
            Login
          </button>

          <button
            className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700"
            onClick={() => navigate("/auth")}
          >
            Signup
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-6 bg-[url('/bg-pattern.png')] bg-cover bg-center">
        <h1 className="text-4xl font-semibold text-orange-600 mb-6">
          Plan your way to healthier eating
        </h1>

        <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed mb-10">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh
          euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim
          ad minim veniam, quis nostrud exerci tation ullamcorper suscipit.
        </p>

        <button
          className="bg-orange-600 text-white px-10 py-3 rounded-lg text-lg hover:bg-orange-700"
          onClick={() => navigate("/auth")}
        >
          SIGNUP (FREE)
        </button>
      </section>

    </div>
  );
}

export default Home;
