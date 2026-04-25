import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Hexagon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", displayName: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.displayName || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    
    
    toast.success("Account created successfully!");
    navigate({ to: "/app" });
  };

  const fields = [
    { key: "username", label: "Username", type: "text", placeholder: "johndoe" },
    { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { key: "displayName", label: "Display name", type: "text", placeholder: "John Doe" },
    { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <Hexagon className="h-7 w-7 text-primary fill-primary/20" />
          <span className="text-xl font-semibold text-foreground">Hive</span>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h1 className="text-lg font-semibold text-foreground mb-1">Create account</h1>
          <p className="text-sm text-muted-foreground mb-6">Get started with Hive</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key as keyof typeof form]}
                  onChange={update(f.key)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  placeholder={f.placeholder}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
