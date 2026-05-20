import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const [payments, setPayments] =
    useState<any[]>([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [access, setAccess] =
    useState(false);

  const [password, setPassword] =
    useState("");

  async function loadPayments() {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

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
    }
  }

  async function updateStatus(
    id: string,
    status: string
  ) {
    await supabase
      .from("payments")
      .update({ status })
      .eq("id", id);

    loadPayments();
  }

  useEffect(() => {
    if (access) {
      loadPayments();
    }
  }, [access]);

  // LOGIN ADMIN
  if (!access) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl">

          <h1 className="mb-6 text-3xl font-bold">
            Admin Access
          </h1>

          <p className="mb-4 text-slate-400">
            Masukkan password admin untuk masuk dashboard.
          </p>

          <input
            type="password"
            placeholder="Password admin"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 outline-none"
          />

          <button
            onClick={() => {
              if (password === "admin123") {
                setAccess(true);
              } else {
                alert("Password salah");
              }
            }}
            className="mt-4 w-full rounded-xl bg-purple-600 py-3 font-semibold hover:bg-purple-700"
          >
            Masuk Admin
          </button>

        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <button
          onClick={() => setAccess(false)}
          className="rounded-xl border border-slate-700 px-4 py-2 hover:bg-slate-800"
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">

        <div className="rounded-2xl bg-slate-900 p-6">
          <p className="text-slate-400">
            Total
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {stats.total}
          </h2>
        </div>

        <div className="rounded-2xl bg-yellow-600 p-6">
          <p>Pending</p>

          <h2 className="mt-2 text-4xl font-bold">
            {stats.pending}
          </h2>
        </div>

        <div className="rounded-2xl bg-green-600 p-6">
          <p>Approved</p>

          <h2 className="mt-2 text-4xl font-bold">
            {stats.approved}
          </h2>
        </div>

        <div className="rounded-2xl bg-red-600 p-6">
          <p>Rejected</p>

          <h2 className="mt-2 text-4xl font-bold">
            {stats.rejected}
          </h2>
        </div>

      </div>

      {/* TABLE */}
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
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-800"
              >
                <td className="p-4">
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
                    className={`rounded-full px-3 py-1 text-sm ${
                      item.status === "approved"
                        ? "bg-green-600"
                        : item.status === "rejected"
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {item.status}
                  </span>
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
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}