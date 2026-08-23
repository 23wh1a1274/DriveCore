import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import loginCar from "../assets/login-car.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login successful!");

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed"
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

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Additional gradient for premium look */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-slate-950/50 to-black/70" />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">

        <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl backdrop-blur-xl md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="relative hidden min-h-[650px] flex-col justify-between border-r border-white/10 p-12 md:flex">

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-gray-300">
                Welcome Back
              </p>

              <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white">
                Drive<span className="text-red-500">Core</span>
              </h1>

              <div className="mt-6 h-[2px] w-16 bg-red-500" />

              <p className="mt-6 max-w-sm text-base leading-7 text-gray-300">
                A smarter way to manage your dealership inventory,
                vehicles, stock, and operations from one centralized
                platform.
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Dealership Inventory Management System
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Secure. Organized. Efficient.
              </p>
            </div>

          </div>

          {/* RIGHT SIDE - LOGIN BOX */}
          <div className="flex min-h-[650px] items-center justify-center bg-black/20 p-8 sm:p-12">

            <div className="w-full max-w-md">

              {/* Mobile Logo */}
              <div className="mb-12 md:hidden">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                  Welcome Back
                </p>

                <h1 className="mt-3 text-4xl font-semibold text-white">
                  Drive<span className="text-red-500">Core</span>
                </h1>
              </div>

              {/* Heading */}
              <div className="mb-10">
                <h2 className="text-4xl font-semibold tracking-tight text-white">
                  Login
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-300">
                  Access your dealership inventory and manage your
                  vehicles securely.
                </p>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleLogin}
                className="space-y-6"
              >

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
                      backdrop-blur-md
                      outline-none
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
                    placeholder="Enter your password"
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
                      backdrop-blur-md
                      outline-none
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

                {/* Remember Me */}
                <div className="flex items-center justify-between">

                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">

                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(e.target.checked)
                      }
                      className="
                        h-4
                        w-4
                        cursor-pointer
                        rounded
                        border-white/30
                        bg-white/10
                        accent-red-500
                      "
                    />

                    Remember me
                  </label>

                  <button
                    type="button"
                    className="text-sm text-gray-300 transition hover:text-white"
                  >
                    Forgot password?
                  </button>

                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="
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
                  Login
                </button>

              </form>

              {/* Register */}
              <div className="mt-10 text-center">

                <p className="text-sm text-gray-300">
                  Don't have an account?{" "}

                  <Link
                    to="/register"
                    className="font-medium text-white transition hover:text-red-400"
                  >
                    Create an Account
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

export default Login;