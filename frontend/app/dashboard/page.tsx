"use client";

import { useState } from "react";

interface Token {
  name: string;
  invested: number;
}

export default function DashboardPage() {
  const [budget, setBudget] = useState<number>(0);
  const [input, setInput] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [newToken, setNewToken] = useState("");
  const [investmentInputs, setInvestmentInputs] = useState<{
    [key: string]: string;
  }>({});

  const handleAddBudget = () => {
    const value = parseFloat(input);
    if (!isNaN(value)) {
      setBudget((prev) => prev + value);
      setInput("");
    }
  };

  const handleAddToken = () => {
    const name = newToken.trim().toUpperCase();
    if (name && !tokens.some((t) => t.name === name)) {
      setTokens((prev) => [...prev, { name, invested: 0 }]);
      setNewToken("");
    }
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
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">📘 Kozane Dashboard</h1>

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
            placeholder="e.g., BTC, ETH"
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
                Invested: ₱{token.invested.toLocaleString()}
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
