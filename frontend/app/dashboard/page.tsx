"use client";

import { useEffect, useState } from "react";

// --- SYMBOL → COINPAPRIKA ID MAP ---
const SYMBOL_TO_ID: Record<string, string> = {
  BTC: "btc-bitcoin",
  ETH: "eth-ethereum",
  SOL: "sol-solana",
  DOGE: "doge-dogecoin",
  XRP: "xrp-xrp",
};

interface Token {
  name: string; // BTC
  id: string; // btc-bitcoin
  invested: number;
  price?: number;
}

export default function DashboardPage() {
  const [budget, setBudget] = useState<number>(0);
  const [input, setInput] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [newToken, setNewToken] = useState("");
  const [investmentInputs, setInvestmentInputs] = useState<{
    [key: string]: string;
  }>({});

  // --- Fetch price from CoinPaprika ---
  const fetchPaprikaPrice = async (tokenId: string): Promise<number | null> => {
    try {
      const res = await fetch(
        `https://api.coinpaprika.com/v1/tickers/${tokenId}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.quotes.USD.price;
    } catch {
      return null;
    }
  };

  // 🧠 Fetch price only when new token is added (not on every state change)
  const fetchTokenPriceAndSet = async (token: Token) => {
    const price = await fetchPaprikaPrice(token.id);
    setTokens((prev) =>
      prev.map((t) =>
        t.name === token.name ? { ...t, price: price ?? undefined } : t
      )
    );
  };

  const handleAddBudget = () => {
    const value = parseFloat(input);
    if (!isNaN(value)) {
      setBudget((prev) => prev + value);
      setInput("");
    }
  };

  const handleAddToken = () => {
    const name = newToken.trim().toUpperCase();
    const id = SYMBOL_TO_ID[name];
    if (!id || tokens.some((t) => t.name === name)) return;

    const newEntry = { name, id, invested: 0 };
    setTokens((prev) => [...prev, newEntry]);
    setNewToken("");

    // 🔁 fetch price for new token
    fetchTokenPriceAndSet(newEntry);
  };

  const handleInvest = (name: string) => {
    const value = parseFloat(investmentInputs[name]);
    if (isNaN(value) || value <= 0 || value > budget) return;

    setTokens((prev) =>
      prev.map((token) =>
        token.name === name
          ? { ...token, invested: token.invested + value }
          : token
      )
    );
    setBudget((prev) => prev - value);
    setInvestmentInputs((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 px-[20px] py-[40px]">
      <h1 className="text-3xl font-bold text-center">Kozane Dashboard</h1>

      {/* Budget Section */}
      <section className="bg-zinc-800 p-6 rounded space-y-4">
        <h2 className="text-xl font-semibold">💰 Investment Budget</h2>
        <div className="text-3xl text-green-400">
          ₱{budget.toLocaleString()}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Add amount"
            className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleAddBudget}
            className="bg-green-600 px-4 rounded"
          >
            Add
          </button>
        </div>
      </section>

      {/* Add Token Section */}
      <section className="bg-zinc-800 p-6 rounded space-y-4">
        <h2 className="text-xl font-semibold">➕ Add Token</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., BTC, ETH, SOL"
            className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
            value={newToken}
            onChange={(e) => setNewToken(e.target.value)}
          />
          <button onClick={handleAddToken} className="bg-blue-600 px-4 rounded">
            Add
          </button>
        </div>
      </section>

      {/* Token List */}
      <section className="bg-zinc-800 p-6 rounded space-y-2">
        <h2 className="text-xl font-semibold">📊 Your Tokens</h2>
        {tokens.length === 0 && (
          <p className="text-gray-400">No tokens added yet.</p>
        )}
        {tokens.map((token) => (
          <div
            key={token.name}
            className="flex flex-col gap-2 border-b border-zinc-700 py-3"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{token.name}</span>
              <span className="text-sm text-gray-400">
                Invested: ₱{token.invested.toLocaleString()} | Price: $
                {token.price?.toFixed(2) ?? "..."}
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="₱ Amount"
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
                value={investmentInputs[token.name] || ""}
                onChange={(e) =>
                  setInvestmentInputs((prev) => ({
                    ...prev,
                    [token.name]: e.target.value,
                  }))
                }
              />
              <button
                onClick={() => handleInvest(token.name)}
                className="bg-purple-600 px-4 rounded"
              >
                Invest
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
