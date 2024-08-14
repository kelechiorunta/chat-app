import Image from "next/image";
import Dashboard from "./components/DashBoard";
import Login from "./components/Login";

export default function Home() {
  return (
    <main className="flex w-max-full flex-col items-center justify-between px-24">
      <Login/>
    </main>
  );
}
