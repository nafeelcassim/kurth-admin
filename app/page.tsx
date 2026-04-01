
import AppShell from "@/components/AppShell";

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Use the side menu to open Orders or Users.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
