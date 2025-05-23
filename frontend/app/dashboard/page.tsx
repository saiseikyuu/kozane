"use client";

import { useState } from "react";

interface Token {
  name: string;
  symbol: string;
  id: string;
  invested: number;
  price?: number;
}

export default function DashboardPage() {
  const [budget, setBudget] = useState<number>(0);
  const [input, setInput] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [newToken, setNewToken] = useState("");
  const [investmentInputs, setInvestmentInputs] = useState<{
    [symbol: string]: string;
  }>({});
  const [withdrawInputs, setWithdrawInputs] = useState<{
    [symbol: string]: string;
  }>({});

  const fetchCoinIdFromSymbol = async (
    symbol: string
  ): Promise<Token | null> => {
    try {
      const res = await fetch("https://api.coinpaprika.com/v1/coins");
      const coins = await res.json();

      const coin = coins.find(
        (c: any) =>
          c.symbol.toUpperCase() === symbol.toUpperCase() &&
          c.rank !== 0 &&
          !c.is_token
      );

      if (!coin) return null;

      return {
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        id: coin.id,
        invested: 0,
      };
    } catch {
      return null;
    }
  };

  const fetchPaprikaPrice = async (tokenId: string): Promise<number | null> => {
    try {
      const res = await fetch(
        `https://api.coinpaprika.com/v1/tickers/${tokenId}`
      );
      const data = await res.json();
      return data.quotes.USD.price;
    } catch {
      return null;
    }
  };

  const fetchTokenPriceAndSet = async (token: Token) => {
    const price = await fetchPaprikaPrice(token.id);
    setTokens((prev) =>
      prev.map((t) =>
        t.symbol === token.symbol ? { ...t, price: price ?? undefined } : t
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

  const handleAddToken = async () => {
    const symbol = newToken.trim().toUpperCase();
    if (!symbol || tokens.some((t) => t.symbol === symbol)) return;

    const token = await fetchCoinIdFromSymbol(symbol);
    if (!token) {
      alert("Token not found.");
      return;
    }

    setTokens((prev) => [...prev, token]);
    setNewToken("");
    fetchTokenPriceAndSet(token);
  };

  const handleInvest = (symbol: string) => {
    const value = parseFloat(investmentInputs[symbol]);
    if (isNaN(value) || value <= 0 || value > budget) return;

    setTokens((prev) =>
      prev.map((token) =>
        token.symbol === symbol
          ? { ...token, invested: token.invested + value }
          : token
      )
    );
    setBudget((prev) => prev - value);
    setInvestmentInputs((prev) => ({ ...prev, [symbol]: "" }));
  };

  const handleWithdraw = (symbol: string) => {
    const value = parseFloat(withdrawInputs[symbol]);
    const token = tokens.find((t) => t.symbol === symbol);
    if (!token || isNaN(value) || value <= 0 || value > token.invested) return;

    setTokens((prev) =>
      prev.map((t) =>
        t.symbol === symbol ? { ...t, invested: t.invested - value } : t
      )
    );
    setBudget((prev) => prev + value);
    setWithdrawInputs((prev) => ({ ...prev, [symbol]: "" }));
  };

  const totalInvested = tokens.reduce((sum, t) => sum + t.invested, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-8 px-[20px] py-[40px]">
      <h1 className="text-3xl font-bold text-center">Kozane Dashboard</h1>

      {/* 💹 Portfolio Summary */}
      <section className="bg-zinc-800 p-6 rounded space-y-4">
        <h2 className="text-xl font-semibold">💹 Portfolio Summary (USD)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          <div className="bg-zinc-900 p-4 rounded">
            <p className="text-sm text-gray-400">Available Budget</p>
            <p className="text-2xl text-green-400">
              ${budget.toLocaleString()}
            </p>
          </div>
          <div className="bg-zinc-900 p-4 rounded">
            <p className="text-sm text-gray-400">Total Invested</p>
            <p className="text-2xl text-orange-400">
              ${totalInvested.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* ➕ Add to Budget */}
      <section className="bg-zinc-800 p-6 rounded space-y-4">
        <h2 className="text-xl font-semibold">➕ Add to Budget (USD)</h2>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="$ Amount"
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

      {/* ➕ Add Token */}
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

      {/* 📊 Token List */}
      <section className="bg-zinc-800 p-6 rounded space-y-2">
        <h2 className="text-xl font-semibold">📊 Your Tokens</h2>
        {tokens.length === 0 && (
          <p className="text-gray-400">No tokens added yet.</p>
        )}
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className="flex flex-col gap-2 border-b border-zinc-700 py-3"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {token.name} ({token.symbol})
              </span>
              <span className="text-sm text-gray-400">
                Invested: ${token.invested.toLocaleString()} | Price: $
                {token.price?.toFixed(2) ?? "..."}
              </span>
            </div>

            {/* 💸 Invest */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="$ Amount"
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
                value={investmentInputs[token.symbol] || ""}
                onChange={(e) =>
                  setInvestmentInputs((prev) => ({
                    ...prev,
                    [token.symbol]: e.target.value,
                  }))
                }
              />
              <button
                onClick={() => handleInvest(token.symbol)}
                className="bg-purple-600 px-4 rounded"
              >
                Invest
              </button>
            </div>

            {/* 🏧 Withdraw */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="$ Amount"
                className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
                value={withdrawInputs[token.symbol] || ""}
                onChange={(e) =>
                  setWithdrawInputs((prev) => ({
                    ...prev,
                    [token.symbol]: e.target.value,
                  }))
                }
              />
              <button
                onClick={() => handleWithdraw(token.symbol)}
                className="bg-red-600 px-4 rounded"
              >
                Withdraw
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
