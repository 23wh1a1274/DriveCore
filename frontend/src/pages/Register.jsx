import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import loginCar from "../assets/login-car.jpg";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      alert("Registration successful!");

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* Background Image */}
      <img
        src={loginCar}
        alt="Luxury car background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Subtle premium gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/40" />
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">

        <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-black/20 shadow-2xl backdrop-blur-xl md:grid-cols-2">

          {/* LEFT SIDE - BRANDING */}
          <div className="relative hidden min-h-[650px] flex-col justify-between border-r border-white/10 p-12 md:flex">

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-gray-300">
                Welcome to
              </p>

              <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white">
                Drive<span className="text-red-500">Core</span>
              </h1>

              <div className="mt-6 h-[2px] w-16 bg-red-500" />

              <p className="mt-6 max-w-sm text-base leading-7 text-gray-300">
                Manage your dealership inventory, track vehicle stock,
                and organize your operations from one centralized
                platform.
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Dealership Inventory Management System
              </p>

              <p className="mt-2 text-xs tracking-wide text-gray-500">
                Secure. Organized. Efficient.
              </p>
            </div>

          </div>

          {/* RIGHT SIDE - REGISTER FORM */}
          <div className="flex min-h-[650px] items-center justify-center bg-black/20 p-8 sm:p-12">

            <div className="w-full max-w-md">

              {/* Mobile Branding */}
              <div className="mb-10 md:hidden">

                <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                  Welcome to
                </p>

                <h1 className="mt-3 text-4xl font-semibold text-white">
                  Drive<span className="text-red-500">Core</span>
                </h1>

              </div>

              {/* Heading */}
              <div className="mb-8">

                <h2 className="text-4xl font-semibold tracking-tight text-white">
                  Create Account
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-300">
                  Create your account to start managing your dealership
                  inventory and vehicles.
                </p>

              </div>

              {/* FORM */}
              <form
                onSubmit={handleRegister}
                className="space-y-5"
              >

                {/* Name */}
                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-200"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="
                      w-full
                      rounded-lg
                      border
                      border-white/20
                      bg-white/10
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      backdrop-blur-md
                      transition-all
                      duration-200
                      placeholder:text-gray-400
                      hover:bg-white/15
                      focus:border-red-400
                      focus:bg-white/15
                      focus:ring-2
                      focus:ring-red-500/30
                    "
                  />

                </div>

                {/* Email */}
                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-200"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="
                      w-full
                      rounded-lg
                      border
                      border-white/20
                      bg-white/10
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      backdrop-blur-md
                      transition-all
                      duration-200
                      placeholder:text-gray-400
                      hover:bg-white/15
                      focus:border-red-400
                      focus:bg-white/15
                      focus:ring-2
                      focus:ring-red-500/30
                    "
                  />

                </div>

                {/* Password */}
                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-200"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="
                      w-full
                      rounded-lg
                      border
                      border-white/20
                      bg-white/10
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      backdrop-blur-md
                      transition-all
                      duration-200
                      placeholder:text-gray-400
                      hover:bg-white/15
                      focus:border-red-400
                      focus:bg-white/15
                      focus:ring-2
                      focus:ring-red-500/30
                    "
                  />

                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  className="
                    mt-3
                    w-full
                    rounded-lg
                    bg-red-600
                    py-3.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-red-950/30
                    transition-all
                    duration-200
                    hover:bg-red-500
                    hover:shadow-red-500/30
                    active:scale-[0.99]
                  "
                >
                  Create Account
                </button>

              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">

                <p className="text-sm text-gray-300">
                  Already have an account?{" "}

                  <Link
                    to="/login"
                    className="font-medium text-white transition hover:text-red-400"
                  >
                    Login
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;