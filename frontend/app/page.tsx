import Image from "next/image";
import Navbar from "./components/Navbar";
import BudgetPage from "./budget/page";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <h1 className="text-3xl font-bold">Welcome to Kozane</h1>
      </main>
    </>
  );
}
