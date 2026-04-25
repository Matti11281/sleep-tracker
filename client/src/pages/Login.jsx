import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back! 🌙");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at top,#1a0a3c 0%,#050510 60%)",
      }}
    >
      <div
        className="absolute top-1/3 left-1/2 w-96 h-96 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)",
        }}
      />

      <div className="relative z-10 glass rounded-3xl p-10 w-full max-w-md animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="w-16 h-16 btn-primary rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-float">
            😴
          </div>
          <h2 className="text-3xl font-black">Welcome Back</h2>
          <p className="text-purple-300 mt-1 text-sm">
            Sign in to your sleep dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-purple-300 font-medium uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field px-4 py-3 rounded-xl text-sm"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-purple-300 font-medium uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field px-4 py-3 rounded-xl text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 rounded-xl font-bold mt-2 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In 🌙"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-purple-300">
          No account?{" "}
          <Link
            to="/register"
            className="text-white font-semibold hover:text-purple-300 transition"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
