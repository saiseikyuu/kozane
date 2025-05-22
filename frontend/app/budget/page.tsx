"use client";

import { useState } from "react";

export default function BudgetPage() {
  const [budget, setBudget] = useState<number>(0);
  const [input, setInput] = useState("");

  const handleSetBudget = () => {
    const value = parseFloat(input);
    if (!isNaN(value)) {
      setBudget((prev) => prev + value);
      setInput("");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-zinc-800 p-6 rounded-lg shadow-md space-y-4">
      <h1 className="text-2xl font-bold">💰 Investment Budget</h1>

      <div className="text-4xl text-green-400 font-mono">
        ₱{budget.toLocaleString()}
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Add amount"
          className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSetBudget}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}
