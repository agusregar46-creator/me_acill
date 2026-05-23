import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import { supabase } from "../lib/supabase";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Admin() {
  const [payments, setPayments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [chartData, setChartData] =
    useState<any[]>([]);

  const [stats, setStats] =
    useState({
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    });

  useEffect(() => {
    loadPayments();

    // REALTIME
    const channel = supabase
      .channel("admin-payments")

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

  async function loadPayments() {
    const { data, error } =
      await supabase
        .from("payments")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setPayments(data);

      // STATS
      setStats({
        total: data.length,

        pending: data.filter(
          (item) =>
            item.status === "pending"
        ).length,

        approved: data.filter(
          (item) =>
            item.status === "approved"
        ).length,

        rejected: data.filter(
          (item) =>
            item.status === "rejected"
        ).length,
      });

      // CHART
      const grouped: any = {};

      data.forEach((item) => {
        const date = new Date(
          item.created_at
        ).toLocaleDateString("id-ID");

        if (!grouped[date]) {
          grouped[date] = 0;
        }

        grouped[date] += 1;
      });

      const chart = Object.keys(grouped).map(
        (date) => ({
          date,
          transaksi: grouped[date],
        })
      );

      setChartData(chart);
    }

    setLoading(false);
  }

  async function updateStatus(
    id: string,
    status: string
  ) {
    const { error } =
      await supabase
        .from("payments")
        .update({ status })
        .eq("id", id);

    if (error) {
      console.log(error);

      alert("Gagal update status");

      return;
    }

    loadPayments();
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white md:px-6">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}
          <div className="mb-10">

            <h1 className="text-4xl font-black md:text-5xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-slate-400">
              Monitoring pembayaran
              realtime
            </p>

          </div>

          {/* STATS */}
          <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-slate-400">
                Total Transaksi
              </p>

              <h2 className="mt-3 text-4xl font-black">
                {stats.total}
              </h2>

            </div>

            {/* PENDING */}
            <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">

              <p className="text-yellow-300">
                Pending
              </p>

              <h2 className="mt-3 text-4xl font-black">
                {stats.pending}
              </h2>

            </div>

            {/* APPROVED */}
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6">

              <p className="text-green-300">
                Approved
              </p>

              <h2 className="mt-3 text-4xl font-black">
                {stats.approved}
              </h2>

            </div>

            {/* REJECTED */}
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">

              <p className="text-red-300">
                Rejected
              </p>

              <h2 className="mt-3 text-4xl font-black">
                {stats.rejected}
              </h2>

            </div>

          </div>

          {/* CHART */}
          <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="mb-6 text-2xl font-bold">
              Grafik Transaksi
            </h2>

            <div className="h-[350px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart data={chartData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="date" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="transaksi"
                    fill="#9333ea"
                    radius={[8, 8, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">

            <table className="min-w-[700px] w-full">

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

                  <th className="p-4 text-left">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-slate-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : payments.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-slate-400"
                    >
                      Belum ada transaksi
                    </td>
                  </tr>
                ) : (
                  payments.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-800"
                    >

                      <td className="p-4">
                        {
                          item.package_name
                        }
                      </td>

                      <td className="p-4 capitalize">
                        {
                          item.payment_method
                        }
                      </td>

                      <td className="p-4">

                        <a
                          href={
                            item.payment_proof
                          }
                          target="_blank"
                          className="text-purple-400 underline"
                        >
                          Lihat
                        </a>

                      </td>

                      <td className="p-4">

                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
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

                      <td className="flex gap-2 p-4">

                        <button
                          onClick={() =>
                            updateStatus(
                              item.id,
                              "approved"
                            )
                          }
                          className="rounded-lg bg-green-600 px-4 py-2 hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              item.id,
                              "rejected"
                            )
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700"
                        >
                          Reject
                        </button>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>
      </div>
    </>
  );
}