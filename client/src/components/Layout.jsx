import { ShieldCheck } from "lucide-react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-white">
              <ShieldCheck size={25} />
            </div>

            <div>
              <p className="text-base font-bold tracking-tight text-slate-900">
                Immigration Portal
              </p>
              <p className="text-xs text-slate-500">
                Personal Information Demo
              </p>
            </div>
          </a>

          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
            DEMO PORTAL
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white px-5 py-5 text-center text-xs text-slate-500">
        Demonstration application — not an official government service.
      </footer>
    </div>
  );
}