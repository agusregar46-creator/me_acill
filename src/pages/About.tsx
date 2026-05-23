import Navbar from "../components/Navbar";

export default function About() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 px-4 py-20 text-white md:px-6">

        <div className="mx-auto max-w-5xl">

          <div className="text-center">

            <div className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
              Tentang Platform
            </div>

            <h1 className="mt-6 text-4xl font-black md:text-6xl">
              Tentang Sistem
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base text-slate-400 md:text-lg">
              Platform ini merupakan sistem
              pembayaran internet modern
              berbasis blockchain yang
              mengintegrasikan teknologi
              Solana, Supabase, dan React
              untuk menciptakan pembayaran
              digital yang realtime, aman,
              dan transparan.
            </p>

          </div>

          {/* CARD */}
          <div className="mt-16 grid gap-8 md:grid-cols-2">

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

              <h2 className="text-2xl font-bold text-purple-400">
                🚀 Teknologi
              </h2>

              <ul className="mt-6 space-y-4 text-slate-300">

                <li>
                  • React + Vite
                </li>

                <li>
                  • TailwindCSS
                </li>

                <li>
                  • Supabase Database
                </li>

                <li>
                  • Supabase Auth
                </li>

                <li>
                  • Supabase Storage
                </li>

                <li>
                  • Solana Blockchain
                </li>

                <li>
                  • Phantom Wallet
                </li>

              </ul>

            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

              <h2 className="text-2xl font-bold text-purple-400">
                🔥 Fitur
              </h2>

              <ul className="mt-6 space-y-4 text-slate-300">

                <li>
                  • Authentication
                </li>

                <li>
                  • Dashboard Admin
                </li>

                <li>
                  • Dashboard User
                </li>

                <li>
                  • Realtime Payment
                </li>

                <li>
                  • Upload Bukti Transfer
                </li>

                <li>
                  • QRIS & Bank Transfer
                </li>

                <li>
                  • Solana Payment
                </li>

              </ul>

            </div>

          </div>

          {/* BOTTOM */}
          <div className="mt-16 rounded-3xl border border-slate-800 bg-gradient-to-r from-purple-900/30 to-slate-900 p-10 text-center">

            <h2 className="text-3xl font-black">
              Blockchain + Realtime
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Sistem ini dirancang untuk
              memberikan pengalaman
              pembayaran digital modern
              dengan integrasi blockchain
              Solana dan backend realtime
              Supabase.
            </p>

          </div>

        </div>
      </div>
    </>
  );
}