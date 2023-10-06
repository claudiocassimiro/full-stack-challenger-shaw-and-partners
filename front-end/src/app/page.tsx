import ListCSV from "@/components/ListCSV";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl text-center mb-6">CSV Reader</h1>
      <ListCSV />
    </main>
  );
}
