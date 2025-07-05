// Example: components/AddFacultyForm.tsx

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AddFacultyFormProps {
  onFacultyAdded?: () => void;
}

export default function AddFacultyForm({ onFacultyAdded }: AddFacultyFormProps) {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    // Insert a default department value to satisfy NOT NULL constraint
    const { error } = await supabase.from("faculty").insert([{ email, department: "General" }]);
    setLoading(false);
    if (error) setError(error.message);
    else {
      setSuccess("Faculty email added!");
      setEmail("");
      if (onFacultyAdded) onFacultyAdded();
    }
  };

  return (
    <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 items-start">
      <input
        type="email"
        placeholder="Faculty Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border border-emerald-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-md shadow hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Faculty"}
      </button>
      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  );
}