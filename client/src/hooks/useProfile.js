/**
 * useProfile — fetch the logged-in user's profile from the API.
 * Returns { profile, loading, error, refresh }
 * profile fields: _id, name, email, role, phone, city, company, avatar
 */
import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetch_ = useCallback(async () => {
    const token = localStorage.getItem("planova_token");
    if (!token) { setLoading(false); return; }

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load profile");
      setProfile(await res.json());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { profile, loading, error, refresh: fetch_ };
}

/** Update name/email/password. Returns updated user or throws. */
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
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Update failed");
  }
  return res.json();
}

/** Derive initials from a name string */
export function initials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}
