import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created! 🎉");
      navigate("/dashboard");
    } catch {
      toast.error("Something went wrong");
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
            🌙
          </div>
          <h2 className="text-3xl font-black">Join SleepAI</h2>
          <p className="text-purple-300 mt-1 text-sm">
            Start your better sleep journey tonight
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            {
              label: "Full Name",
              type: "text",
              val: name,
              set: setName,
              ph: "John Doe",
            },
            {
              label: "Email",
              type: "email",
              val: email,
              set: setEmail,
              ph: "you@example.com",
            },
            {
              label: "Password",
              type: "password",
              val: password,
              set: setPassword,
              ph: "••••••••",
            },
          ].map(({ label, type, val, set, ph }) => (
            <div key={label} className="flex flex-col gap-1">
              <label className="text-xs text-purple-300 font-medium uppercase tracking-wider">
                {label}
              </label>
              <input
                type={type}
                placeholder={ph}
                value={val}
                onChange={(e) => set(e.target.value)}
                className="input-field px-4 py-3 rounded-xl text-sm"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 rounded-xl font-bold mt-2 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Account 🚀"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-purple-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white font-semibold hover:text-purple-300 transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
