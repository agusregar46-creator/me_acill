import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { connectWallet } from "../lib/wallet";

export default function Navbar() {
  const [wallet, setWallet] =
    useState("");

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <nav className="border-b border-slate-800 bg-slate-950 text-white">

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-black text-purple-400"
        >
          AcillNet
        </Link>

        {/* MENU */}
        <div className="flex items-center gap-4">

          <Link
            to="/"
            className="hover:text-purple-400"
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className="hover:text-purple-400"
          >
            Dashboard
          </Link>

          <a
            href="#paket"
            className="hover:text-purple-400"
          >
            Paket
          </a>

          <Link
            to="/admin"
            className="hover:text-purple-400"
          >
            Admin
          </Link>

          {/* WALLET */}
          <button
            onClick={async () => {
              const address =
                await connectWallet();

              if (address) {
                setWallet(address);
              }
            }}
            className="rounded-xl border border-purple-500 px-4 py-2 hover:bg-purple-500/20"
          >
            {wallet
              ? wallet.slice(0, 4) +
                "..." +
                wallet.slice(-4)
              : "Connect Wallet"}
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-600 px-4 py-2 hover:bg-red-700"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}