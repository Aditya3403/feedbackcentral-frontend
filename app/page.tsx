import Navbar from "../navbar/navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-4xl font-bold text-center">Feedback Management System</h1>
      </main>
    </div>
  );
}