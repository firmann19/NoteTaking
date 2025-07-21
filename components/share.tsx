"use client";

import { useState } from "react";

type Props = {
  noteId: string;
};

export default function ShareForm({ noteId }: Props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleShare = async () => {
    setMessage("");
    setError("");

    const res = await fetch(`/api/notes/${noteId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Terjadi kesalahan.");
    } else {
      setMessage("Catatan berhasil dibagikan.");
      setEmail("");
    }
  };

  return (
    <div className="mb-8">
      <h3 className="font-semibold mb-2 text-lg">Bagikan ke user lain</h3>
      <div className="flex items-center gap-2 mb-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email user"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleShare}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Share
        </button>
      </div>
      {message && <p className="text-green-600 text-sm">{message}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
