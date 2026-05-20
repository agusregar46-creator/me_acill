import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    console.log(data);
    console.log(error);

    if (error) {
      alert(error.message);
    } else {
      alert("Register berhasil");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Register</h1>

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

      <button onClick={handleRegister}>
        Daftar
      </button>
    </div>
  );
}