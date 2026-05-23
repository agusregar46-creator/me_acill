import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { supabase } from "../lib/supabase";
import { connectWallet } from "../lib/wallet";

export default function Navbar() {
  const [wallet, setWallet] =
    useState("");

  const [open, setOpen] =
    useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  async function handleConnectWallet() {
    const address =
      await connectWallet();

    if (address) {
      setWallet(address);
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 text-white backdrop-blur">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-black text-purple-400"
        >
          AcillNet
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-4 md:flex">

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
            onClick={handleConnectWallet}
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

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>

      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-800 bg-slate-900 md:hidden">

          <div className="flex flex-col gap-4 px-6 py-6">

            <Link
              to="/"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>

            <a
              href="#paket"
              onClick={() => setOpen(false)}
            >
              Paket
            </a>

            <Link
              to="/admin"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>

            {/* WALLET */}
            <button
              onClick={handleConnectWallet}
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
      )}
    </nav>
  );
}