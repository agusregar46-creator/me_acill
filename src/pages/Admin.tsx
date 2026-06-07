import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [authorized, setAuthorized] =
    useState(false);

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
    checkAdmin();
  }, []);

  async function checkAdmin() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const {
        data: roleData,
        error,
      } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      console.log("User ID:", user.id);
      console.log("Role Data:", roleData);

      if (error || !roleData) {
        navigate("/dashboard");
        return;
      }

      if (roleData.role !== "admin") {
        navigate("/dashboard");
        return;
      }

      setAuthorized(true);

      await loadPayments();

      supabase
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
    } catch (err) {
      console.error(err);
      navigate("/dashboard");
    }
  }

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
      setLoading(false);
      return;
    }

    if (data) {
      setPayments(data);

      setStats({
        total: data.length,
        pending: data.filter(
          (x) => x.status === "pending"
        ).length,
        approved: data.filter(
          (x) => x.status === "approved"
        ).length,
        rejected: data.filter(
          (x) => x.status === "rejected"
        ).length,
      });

      const grouped: Record<
        string,
        number
      > = {};

      data.forEach((item) => {
        const date = new Date(
          item.created_at
        ).toLocaleDateString("id-ID");

        grouped[date] =
          (grouped[date] || 0) + 1;
      });

      const chart =
        Object.keys(grouped).map(
          (date) => ({
            date,
            transaksi:
              grouped[date],
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
      alert("Gagal update status");
      return;
    }

    loadPayments();
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Memeriksa akses admin...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white md:px-6">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <h1 className="text-4xl font-black">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Monitoring pembayaran realtime
            </p>
          </div>

          <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p>Total Transaksi</p>
              <h2 className="text-4xl font-black">
                {stats.total}
              </h2>
            </div>

            <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
              <p>Pending</p>
              <h2 className="text-4xl font-black">
                {stats.pending}
              </h2>
            </div>

            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
              <p>Approved</p>
              <h2 className="text-4xl font-black">
                {stats.approved}
              </h2>
            </div>

            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
              <p>Rejected</p>
              <h2 className="text-4xl font-black">
                {stats.rejected}
              </h2>
            </div>

          </div>

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
                  <CartesianGrid strokeDasharray="3 3" />
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

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full min-w-[700px]">

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
                      className="p-8 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : (
                  payments.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-800"
                    >
                      <td className="p-4">
                        {item.package_name}
                      </td>

                      <td className="p-4">
                        {item.payment_method}
                      </td>

                      <td className="p-4">
                        <a
                          href={
                            item.payment_proof
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-400 underline"
                        >
                          Lihat
                        </a>
                      </td>

                      <td className="p-4">
                        {item.status}
                      </td>

                      <td className="p-4">
                        {new Date(
                          item.created_at
                        ).toLocaleString(
                          "id-ID"
                        )}
                      </td>

                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() =>
                            updateStatus(
                              item.id,
                              "approved"
                            )
                          }
                          className="rounded bg-green-600 px-3 py-2"
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
                          className="rounded bg-red-600 px-3 py-2"
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