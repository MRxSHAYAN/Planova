import { useState, useEffect } from "react";

// Fetch the logged-in user's profile from the server
export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [reload,  setReload]  = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("planova_token");
    if (!token) { setLoading(false); return; }

    setLoading(true);
    fetch("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server returned " + res.status);
        return res.json();
      })
      .then((data) => { setProfile(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [reload]);

  const refresh = () => setReload((n) => n + 1);

  return { profile, loading, error, refresh };
}

// Save profile changes to the server
export async function updateProfile(data) {
  const token = localStorage.getItem("planova_token");
  const res = await fetch("/api/auth/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Update failed");
  return body;
}

// Get initials from a name — "Ali Hassan" → "AH"
export function initials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}
