import { useEffect, useState } from "react";
import { CommandMenu } from "./components/CommandMenu";
import { type LauncherItem } from "./config/tools";

const RECENT_TOOLS_STORAGE_KEY = "company-command-center.recent-tools";
const MAX_RECENT_TOOLS = 6;

const readRecentTools = () => {
  if (typeof window === "undefined") {
    return [];
  }

  const storedValue = window.localStorage.getItem(RECENT_TOOLS_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    return Array.isArray(parsedValue) ? parsedValue.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
};

export default function App() {
  const [now, setNow] = useState(() => new Date());
  const [recentIds, setRecentIds] = useState<string[]>(() => readRecentTools());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify(recentIds));
  }, [recentIds]);

  const handleToolOpen = (item: LauncherItem) => {
    setRecentIds((current) => [item.id, ...current.filter((id) => id !== item.id)].slice(0, MAX_RECENT_TOOLS));
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f0e8] text-[#1f1914]">
      <div className="absolute inset-0 bg-paper opacity-80" />
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-8 sm:px-10">
        <div className="mb-12 flex w-full items-start justify-between text-[11px] font-medium uppercase tracking-[0.28em] text-[#7f7061]">
          <span>Forte</span>
          <span className="tabular-nums">
            {now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
        </div>

        <div className="mb-8 max-w-3xl text-center">
          <h1 className="font-['Newsreader'] text-5xl leading-[0.98] tracking-[-0.04em] text-[#17120e] sm:text-6xl md:text-7xl">
            Navigate the company
            <br />
            with one command.
          </h1>
        </div>

        <section className="flex w-full items-center justify-center">
          <CommandMenu recentIds={recentIds} onItemOpen={handleToolOpen} />
        </section>
      </div>
    </main>
  );
}
