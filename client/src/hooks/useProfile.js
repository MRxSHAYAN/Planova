import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Fetch the logged-in user's profile from the server
export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("planova_token");
    if (!token) { setLoading(false); return; }

    setLoading(true);
    fetch(`${API}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { setProfile(data); setError(null); })
      .catch(() => setError("Could not load profile"))
      .finally(() => setLoading(false));
  }, [reload]);

  // Call refresh() to re-fetch after a save
  const refresh = () => setReload((n) => n + 1);

  return { profile, loading, error, refresh };
}

// Save profile changes to the server
export async function updateProfile(data) {
  const token = localStorage.getItem("planova_token");
  const res = await fetch(`${API}/api/auth/profile`, {
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

// Get initials from a name, e.g. "Ali Hassan" → "AH"
export function initials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}
