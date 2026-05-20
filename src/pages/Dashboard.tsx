import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [payments, setPayments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // LOAD DATA
  async function loadPayments() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } =
      await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setPayments(data);
    }

    setLoading(false);
  }

  // REALTIME
  useEffect(() => {
    loadPayments();

    const channel = supabase
      .channel("payments-changes")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "payments",
        },
        () => {
          loadPayments();
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 px-6 py-20 text-white">

        <div className="mx-auto max-w-6xl">

          {/* HEADER */}
          <div className="mb-10">

            <h1 className="text-5xl font-black">
              Dashboard
            </h1>

            <p className="mt-3 text-slate-400">
              Riwayat pembayaran Anda
            </p>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

              <div className="text-slate-400">
                Loading...
              </div>

            </div>
          ) : payments.length === 0 ? (

            /* EMPTY */
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

              <h2 className="text-2xl font-bold">
                Belum ada transaksi
              </h2>

              <p className="mt-3 text-slate-400">
                Anda belum melakukan pembayaran.
              </p>

            </div>

          ) : (

            /* TABLE */
            <div className="overflow-x-auto rounded-2xl border border-slate-800">

              <table className="w-full">

                <thead className="bg-slate-900">
                  <tr>

                    <th className="p-4 text-left">
                      Paket
                    </th>

                    <th className="p-4 text-left">
                      Payment
                    </th>

                    <th className="p-4 text-left">
                      Bukti
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    <th className="p-4 text-left">
                      Tanggal
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {payments.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-800"
                    >

                      <td className="p-4 font-semibold">
                        {item.package_name}
                      </td>

                      <td className="p-4 capitalize">
                        {item.payment_method}
                      </td>

                      <td className="p-4">

                        <a
                          href={item.payment_proof}
                          target="_blank"
                          className="text-purple-400 underline"
                        >
                          Lihat Bukti
                        </a>

                      </td>

                      <td className="p-4">

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            item.status ===
                            "approved"
                              ? "bg-green-600"
                              : item.status ===
                                "rejected"
                              ? "bg-red-600"
                              : "bg-yellow-600"
                          }`}
                        >
                          {item.status}
                        </span>

                      </td>

                      <td className="p-4 text-slate-400">

                        {new Date(
                          item.created_at
                        ).toLocaleString(
                          "id-ID"
                        )}

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>
      </div>
    </>
  );
}