import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import qrisImage from "../assets/qris.png";
import { payWithSolana } from "../lib/solanaPayment";

export default function Home() {
  const [packages, setPackages] =
    useState<any[]>([]);

  const [selectedPackage, setSelectedPackage] =
    useState<any>(null);

  const [paymentMethod, setPaymentMethod] =
    useState("solana");

  const [paymentProof, setPaymentProof] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  // LOAD PACKAGES
  useEffect(() => {
    loadPackages();
  }, []);

  async function loadPackages() {
    const { data, error } =
      await supabase
        .from("packages")
        .select("*")
        .order("price_sol", {
          ascending: true,
        });

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setPackages(data);
    }
  }

  // HANDLE FILE
  function handleFileChange(
    e: any
  ) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setPaymentProof(file);

    setPreview(
      URL.createObjectURL(file)
    );
  }

  // HANDLE PAYMENT
  async function handlePayment() {
    // LOGIN CHECK
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert(
        "Silakan login dulu"
      );

      return;
    }

    // VALIDASI
    if (!selectedPackage) {
      alert(
        "Pilih paket dulu"
      );

      return;
    }

    if (!paymentProof) {
      alert(
        "Upload bukti pembayaran dulu"
      );

      return;
    }

    // FILE NAME
    const fileName = `${Date.now()}-${
      paymentProof.name
    }`;

    // UPLOAD STORAGE
    const { error: uploadError } =
      await supabase.storage
        .from("payments")
        .upload(
          fileName,
          paymentProof
        );

    if (uploadError) {
      alert(
        uploadError.message
      );

      return;
    }

    // PUBLIC URL
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("payments")
      .getPublicUrl(fileName);

    // INSERT DATABASE
    const { error } =
      await supabase
        .from("payments")
        .insert({
          user_id: user.id,

          package_name:
            selectedPackage.name,

          payment_method:
            paymentMethod,

          payment_proof:
            publicUrl,

          status: "pending",

          created_at:
            new Date().toISOString(),
        });

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Pembayaran berhasil dikirim 🚀"
    );

    // RESET
    setSelectedPackage(null);

    setPaymentProof(null);

    setPreview(null);

    setPaymentMethod("solana");
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 text-white">

        {/* HERO */}
        <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-32 text-center">

          <div className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            🚀 Powered by Solana
          </div>

          <h1 className="mt-8 text-6xl font-black leading-tight">
            Internet super cepat,
            <br />
            dibayar crypto.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-400">
            Platform pembayaran internet
            berbasis blockchain dengan
            integrasi Solana dan
            Supabase realtime.
          </p>

          <div className="mt-10 flex gap-4">

            <button
              onClick={() => {
                const el =
                  document.getElementById(
                    "paket"
                  );

                el?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="rounded-xl bg-purple-600 px-8 py-4 text-lg font-semibold hover:bg-purple-700"
            >
              Mulai Sekarang
            </button>

            <button
              onClick={() => {
                const el =
                  document.getElementById(
                    "paket"
                  );

                el?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="rounded-xl border border-slate-700 px-8 py-4 text-lg hover:bg-slate-900"
            >
              Lihat Paket
            </button>

          </div>
        </section>

        {/* PACKAGES */}
        <section
          id="paket"
          className="mx-auto max-w-6xl px-6 py-20"
        >

          <h2 className="text-center text-4xl font-bold">
            Paket Internet
          </h2>

          <p className="mt-4 text-center text-slate-400">
            Pilih paket sesuai kebutuhan
            Anda
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-3">

            {packages.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-8"
              >

                <h3 className="text-2xl font-bold">
                  {item.name}
                </h3>

                <p className="mt-2 text-slate-400">
                  {item.speed_mbps} Mbps
                </p>

                <div className="mt-6">

                  <div className="text-5xl font-black text-purple-400">
                    Rp
                    {(
                      item.price_sol *
                      2000000
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </div>

                  <div className="mt-2 text-lg text-slate-500">
                    ≈ ◎
                    {item.price_sol} SOL
                  </div>

                </div>

                <p className="mt-2 text-slate-500">
                  per bulan
                </p>

                <button
                  onClick={() =>
                    setSelectedPackage(
                      item
                    )
                  }
                  className="mt-10 w-full rounded-xl bg-purple-600 py-3 font-semibold hover:bg-purple-700"
                >
                  Pilih Paket
                </button>

              </div>
            ))}

          </div>
        </section>

        {/* MODAL */}
        {selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">

            <div className="w-full max-w-lg rounded-2xl bg-slate-900 p-8">

              <div className="flex items-center justify-between">

                <h2 className="text-3xl font-bold">
                  Checkout
                </h2>

                <button
                  onClick={() =>
                    setSelectedPackage(
                      null
                    )
                  }
                  className="text-2xl text-slate-400"
                >
                  ×
                </button>

              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-6">

                <h3 className="text-2xl font-bold">
                  {selectedPackage.name}
                </h3>

                <div className="mt-3 text-4xl font-black text-purple-400">

                  Rp
                  {(
                    selectedPackage.price_sol *
                    2000000
                  ).toLocaleString(
                    "id-ID"
                  )}

                </div>

                <div className="mt-2 text-slate-400">
                  ≈ ◎
                  {
                    selectedPackage.price_sol
                  }{" "}
                  SOL
                </div>

              </div>

              {/* PAYMENT METHOD */}
              <div className="mt-8">

                <h3 className="mb-4 text-lg font-bold">
                  Metode Pembayaran
                </h3>

                <div className="grid gap-3">

                  <button
                    onClick={() =>
                      setPaymentMethod(
                        "solana"
                      )
                    }
                    className={`rounded-xl border p-4 text-left ${
                      paymentMethod ===
                      "solana"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-700"
                    }`}
                  >
                    🟣 Solana Wallet
                  </button>

                  <button
                    onClick={() =>
                      setPaymentMethod(
                        "qris"
                      )
                    }
                    className={`rounded-xl border p-4 text-left ${
                      paymentMethod ===
                      "qris"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-700"
                    }`}
                  >
                    📱 QRIS
                  </button>

                  <button
                    onClick={() =>
                      setPaymentMethod(
                        "bank"
                      )
                    }
                    className={`rounded-xl border p-4 text-left ${
                      paymentMethod ===
                      "bank"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-700"
                    }`}
                  >
                    🏦 Transfer Bank
                  </button>

                </div>
              </div>

              {/* QRIS */}
              {paymentMethod ===
                "qris" && (
                <div className="mt-6">

                  <img
                    src={qrisImage}
                    alt="QRIS"
                    className="mx-auto w-64 rounded-2xl border border-slate-700"
                  />

                </div>
              )}

              {/* BANK */}
              {paymentMethod ===
                "bank" && (
                <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950 p-6">

                  <p className="text-slate-400">
                    Transfer ke:
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    BCA 1234567890
                  </h3>

                  <p className="mt-2">
                    a/n Agus Regar
                  </p>

                </div>
              )}

              {/* UPLOAD */}
              <div className="mt-8">

                <h3 className="mb-3 text-lg font-bold">
                  Upload Bukti
                  Pembayaran
                </h3>

                <input
                  type="file"
                  onChange={
                    handleFileChange
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
                />

                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-4 rounded-xl border border-slate-700"
                  />
                )}

                {/* SOLANA BUTTON */}
                {paymentMethod ===
                  "solana" && (
                  <button
                    onClick={async () => {
                      const signature =
                        await payWithSolana(
                          selectedPackage.price_sol
                        );

                      if (signature) {
                        alert(
                          "Pembayaran Solana berhasil 🚀"
                        );

                        console.log(
                          signature
                        );
                      }
                    }}
                    className="mt-6 w-full rounded-xl bg-green-600 py-3 font-semibold hover:bg-green-700"
                  >
                    Bayar dengan Solana
                  </button>
                )}

                {/* CONFIRM */}
                <button
                  onClick={
                    handlePayment
                  }
                  className="mt-6 w-full rounded-xl bg-purple-600 py-3 font-semibold hover:bg-purple-700"
                >
                  Konfirmasi Pembayaran
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
}