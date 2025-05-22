import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50   ">
      <div className=" mx-auto px-[20px] py-[20px] flex justify-between items-center text-white">
        <Link href="/" className="text-xl font-bold">
          Kozane
        </Link>
        <div className="space-x-6 hidden md:flex">
          <Link href="/assets">Assets</Link>
          <Link href="/budget">Budget</Link>
          <Link href="/investments">Investments</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
