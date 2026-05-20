declare global {
  interface Window {
    solana?: any;
  }
}

export async function connectWallet() {
  if (!window.solana) {
    alert(
      "Install Phantom Wallet dulu"
    );

    window.open(
      "https://phantom.app/",
      "_blank"
    );

    return null;
  }

  const response =
    await window.solana.connect();

  return response.publicKey.toString();
}