import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { Dashboard } from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Dashboard />
      </main>
    </div>
  );
}
