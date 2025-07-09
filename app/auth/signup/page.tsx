"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("recruiter");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (role === "faculty") {
      // Check if the email is already registered in the users table
      const { data: userExists } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (userExists) {
        setError("This faculty email is already registered. Please sign in.");
        return;
      }
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      return;
    }
    if (data.user) {
      await supabase.from("users").insert([
        { id: data.user.id, email, role }
      ]);
    }
    setSuccess("Signup successful! Please check your email for confirmation.");
    setTimeout(() => {
        window.location.href = "/auth/login";
    }, 2000); // Redirects after 2 seconds
  };

  return (
    <form onSubmit={handleSignup} className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Sign Up</h2>
      <input
        className="border rounded px-3 py-2 w-full"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="border rounded px-3 py-2 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <select
        className="border rounded px-3 py-2 w-full"
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option value="recruiter">Recruiter</option>
        <option value="faculty">Faculty</option>
      </select>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Sign Up
      </button>
    </form>
  );
}