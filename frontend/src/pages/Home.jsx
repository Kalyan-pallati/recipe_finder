import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchRecipes } from "../api/recipeApi";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50"> 

      <section className="text-center py-24 px-6 bg-[url('/bg-pattern.png')] bg-cover bg-center">
        <h1 className="text-4xl font-semibold text-orange-600 mb-6">
          Plan your way to healthier eating
        </h1>

        <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed mb-10">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh
          euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
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
