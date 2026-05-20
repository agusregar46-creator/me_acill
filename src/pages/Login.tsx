import { useState } from "react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../lib/supabase";

import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  if (user) {
    return <Navigate to="/" />;
  }

  async function handleLogin() {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
    } else {
      navigate("/");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={handleLogin}>
        Masuk
      </button>
    </div>
  );
}