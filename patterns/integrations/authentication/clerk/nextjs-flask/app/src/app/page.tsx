import Header from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to Clerk Auth Demo</h1>
        <p>Sign in to access the protected dashboard with data from Flask backend.</p>
      </main>
    </div>
  );
}