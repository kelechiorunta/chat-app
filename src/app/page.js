import Image from "next/image";
import Dashboard from "./components/DashBoard";
import Login from "./components/Login";
import AnimationPage from "./components/AnimationPage";
import ConnectzPage from "./animation/page";

export default function Home() {
  return (
    <main className="flex w-full flex-col items-center justify-between px-24">
      <ConnectzPage/>
    </main>
  );
}
