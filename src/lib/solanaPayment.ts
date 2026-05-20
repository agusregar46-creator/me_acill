import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

declare global {
  interface Window {
    solana?: any;
  }
}

// GANTI DENGAN WALLET PHANTOM KAMU
const MERCHANT_WALLET =
  "CeT44V5mx2c9PMEnCsKMzPi15umY8kEmaGCxkk2JA2Qa";

export async function payWithSolana(
  amount: number
) {
  try {
    // CHECK PHANTOM
    if (!window.solana) {
      alert(
        "Install Phantom Wallet dulu"
      );

      window.open(
        "https://phantom.app/",
        "_blank"
      );

      return;
    }

    // CONNECT WALLET
    const provider = window.solana;

    await provider.connect();

    // SOLANA CONNECTION
    const connection =
      new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );

    // SENDER
    const fromPubkey =
      provider.publicKey;

    // RECEIVER
    const toPubkey =
      new PublicKey(
        MERCHANT_WALLET
      );

    // CREATE TRANSACTION
    const transaction =
      new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports:
            amount *
            LAMPORTS_PER_SOL,
        })
      );

    transaction.feePayer =
      fromPubkey;

    // BLOCKHASH
    const {
      blockhash,
    } =
      await connection.getLatestBlockhash();

    transaction.recentBlockhash =
      blockhash;

    // SIGN TRANSACTION
    const signed =
      await provider.signTransaction(
        transaction
      );

    // SEND TRANSACTION
    const signature =
      await connection.sendRawTransaction(
        signed.serialize()
      );

    // CONFIRM
    await connection.confirmTransaction(
      signature
    );

    return signature;
  } catch (error) {
    console.log(error);

    alert(
      "Transaksi gagal"
    );
  }
}