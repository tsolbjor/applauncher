import { Command } from "cmdk";
import { ArrowUpRight, Command as CommandIcon, Search } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { ToolLogo } from "./ToolLogo";
import {
  appById,
  apps,
  items,
  type AppDefinition,
  type DestinationDefinition,
  type LauncherItem,
  type ToolCategory,
} from "../config/tools";

const categoryOrder: ToolCategory[] = [
  "Collaboration",
  "Engineering",
  "Analytics",
  "Support",
  "People",
];

interface CommandMenuProps {
  recentIds: string[];
  onItemOpen: (item: LauncherItem) => void;
}

interface RankedItem {
  score: number;
  item: LauncherItem;
}

const normalize = (value: string) => value.toLowerCase().trim();
const tokenize = (value: string) => normalize(value).split(/\s+/).filter(Boolean);

const isApp = (item: LauncherItem): item is AppDefinition => item.type === "app";
const isDestination = (item: LauncherItem): item is DestinationDefinition => item.type === "destination";

const getParentApp = (item: LauncherItem) => (isDestination(item) ? appById.get(item.parentId) : undefined);
const getItemName = (item: LauncherItem) => item.name;
const getItemCategory = (item: LauncherItem) => (isApp(item) ? item.category : getParentApp(item)?.category ?? "Collaboration");
const getItemKeywords = (item: LauncherItem) => item.keywords ?? [];
const getSearchText = (item: LauncherItem) => {
  const parent = getParentApp(item);
  return [
    item.name,
    item.description,
    getItemCategory(item),
    ...getItemKeywords(item),
    parent?.name ?? "",
  ]
    .join(" ")
    .toLowerCase();
};

const fuzzyScore = (query: string, item: LauncherItem, recentIds: string[]) => {
  const normalizedQuery = normalize(query);
  const normalizedName = normalize(getItemName(item));
  const normalizedCategory = normalize(getItemCategory(item));
  const keywordList = getItemKeywords(item).map(normalize);
  const parentName = normalize(getParentApp(item)?.name ?? "");
  const haystack = getSearchText(item);
  const recentIndex = recentIds.findIndex((id) => id === item.id);
  const queryTokens = tokenize(normalizedQuery);
  let score = 0;

  if (!normalizedQuery) {
    return 1;
  }

  if (normalizedName === normalizedQuery) {
    score += 1600;
  } else if (normalizedName.startsWith(normalizedQuery)) {
    score += 1200;
  } else if (normalizedName.includes(normalizedQuery)) {
    score += 850;
  }

  if (parentName === normalizedQuery) {
    score += 620;
  } else if (parentName.startsWith(normalizedQuery)) {
    score += 340;
  }

  if (normalizedCategory === normalizedQuery) {
    score += 500;
  } else if (normalizedCategory.startsWith(normalizedQuery)) {
    score += 220;
  }

  for (const keyword of keywordList) {
    if (keyword === normalizedQuery) {
      score += 420;
      break;
    }

    if (keyword.startsWith(normalizedQuery)) {
      score += 300;
      break;
    }

    if (keyword.includes(normalizedQuery)) {
      score += 180;
      break;
    }
  }

  if (haystack.includes(normalizedQuery)) {
    score += 220;
  }

  for (const token of queryTokens) {
    if (normalizedName.startsWith(token)) {
      score += 160;
    } else if (normalizedName.includes(token)) {
      score += 100;
    }

    if (parentName.startsWith(token)) {
      score += 75;
    }

    if (keywordList.some((keyword) => keyword.startsWith(token))) {
      score += 35;
    }

    if (normalizedCategory.startsWith(token)) {
      score += 40;
    }
  }

  let queryIndex = 0;
  let consecutive = 0;

  for (const character of haystack) {
    if (character === normalizedQuery[queryIndex]) {
      queryIndex += 1;
      consecutive += 1;
      score += 4 + consecutive * 2;

      if (queryIndex === normalizedQuery.length) {
        break;
      }
    } else {
      consecutive = 0;
    }
  }

  if (queryIndex !== normalizedQuery.length && !haystack.includes(normalizedQuery)) {
    return 0;
  }

  if (recentIndex >= 0) {
    score += Math.max(0, 80 - recentIndex * 10);
  }

  if (isApp(item)) {
    score += 20;
  }

  return score;
};

function AppTile({
  app,
  onSelect,
  onOpenInNewTab,
}: {
  app: AppDefinition;
  onSelect: (item: LauncherItem) => void;
  onOpenInNewTab: (item: LauncherItem) => void;
}) {
  return (
    <Command.Item
      value={`${app.name} ${app.category} ${app.description} ${getItemKeywords(app).join(" ")}`}
      onSelect={() => onSelect(app)}
      onMouseDown={(event) => {
        if (event.button === 1 || event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onOpenInNewTab(app);
        }
      }}
      className="group cursor-pointer rounded-[22px] border border-[#e6dad0] bg-white/55 px-3 py-4 text-center text-[#1f1914] outline-none transition hover:bg-[#f7efe6] data-[selected=true]:border-[#d7c0aa] data-[selected=true]:bg-[#efe4d8] data-[selected=true]:text-[#17120e]"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd1c6] bg-white/80 text-[#54473d] transition group-data-[selected=true]:border-[#cdb7a1] group-data-[selected=true]:bg-[#f8f1e8]">
          <ToolLogo icon={app.icon} className="h-4.5 w-4.5" />
        </span>
        <p className="line-clamp-2 min-h-[2rem] text-center text-[11px] font-medium leading-4 tracking-[-0.01em] text-[#3f342b]">
          {app.name}
        </p>
      </div>
    </Command.Item>
  );
}

function DestinationPill({
  item,
  onSelect,
  onOpenInNewTab,
}: {
  item: DestinationDefinition;
  onSelect: (item: LauncherItem) => void;
  onOpenInNewTab: (item: LauncherItem) => void;
}) {
  const parent = getParentApp(item);

  return (
    <Command.Item
      value={`${item.name} ${item.description} ${parent?.name ?? ""} ${getItemKeywords(item).join(" ")}`}
      onSelect={() => onSelect(item)}
      onMouseDown={(event) => {
        if (event.button === 1 || event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onOpenInNewTab(item);
        }
      }}
      className="group flex cursor-pointer items-center gap-3 rounded-[18px] border border-[#e6dad0] bg-white/55 px-3 py-3 text-[#1f1914] outline-none transition hover:bg-[#f7efe6] data-[selected=true]:border-[#d7c0aa] data-[selected=true]:bg-[#efe4d8]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ddd1c6] bg-white/80 text-[#54473d]">
        <ToolLogo icon={parent?.icon ?? appById.get("slack")!.icon} className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium tracking-[-0.01em] text-[#30261f]">{item.name}</p>
        <p className="truncate text-[11px] uppercase tracking-[0.16em] text-[#9a897a]">
          {parent?.name ?? "Destination"}
        </p>
      </div>
    </Command.Item>
  );
}

export function CommandMenu({ recentIds, onItemOpen }: CommandMenuProps) {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const skipNextSelectRef = useRef(false);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const refocusInput = () => inputRef.current?.focus();
    const onWindowFocus = () => refocusInput();
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        window.setTimeout(refocusInput, 0);
      }
    };

    window.addEventListener("focus", onWindowFocus);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("focus", onWindowFocus);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const rankedItems = useMemo<RankedItem[]>(() => {
    return items
      .map((item) => ({ item, score: fuzzyScore(search, item, recentIds) }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score || left.item.name.localeCompare(right.item.name));
  }, [recentIds, search]);

  const recentItems = useMemo(
    () =>
      recentIds
        .map((id) => items.find((item) => item.id === id))
        .filter((item): item is LauncherItem => Boolean(item)),
    [recentIds],
  );

  const recentApps = recentItems.filter(isApp).slice(0, 6);
  const recentDestinations = recentItems.filter(isDestination).slice(0, 4);

  const recommendedApps = useMemo(() => {
    const recentSet = new Set(recentIds);
    const pinnedApps = apps.filter((app) => app.pinned && !recentSet.has(app.id));
    const usedIds = new Set(pinnedApps.map((app) => app.id));

    const categoryFallbacks = categoryOrder
      .map((category) => apps.find((app) => app.category === category && !recentSet.has(app.id) && !usedIds.has(app.id)))
      .filter((app): app is AppDefinition => Boolean(app));

    for (const app of categoryFallbacks) {
      usedIds.add(app.id);
    }

    const remainingApps = apps.filter((app) => !recentSet.has(app.id) && !usedIds.has(app.id));
    return [...pinnedApps, ...categoryFallbacks, ...remainingApps].slice(0, 12);
  }, [recentIds]);

  const pinnedDestinations = useMemo(() => {
    const recentSet = new Set(recentIds);
    return items.filter(isDestination).filter((item) => item.pinned && !recentSet.has(item.id)).slice(0, 4);
  }, [recentIds]);

  const handleSelect = (item: LauncherItem) => {
    if (skipNextSelectRef.current) {
      skipNextSelectRef.current = false;
      return;
    }

    onItemOpen(item);
    window.open(item.url, "_self", "noopener,noreferrer");
  };

  const handleOpenInNewTab = (item: LauncherItem) => {
    skipNextSelectRef.current = true;
    onItemOpen(item);
    window.open(item.url, "_blank", "noopener,noreferrer");
  };

  const handleDirectionalRemap = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const remappedKey = event.key === "ArrowRight" ? "ArrowDown" : "ArrowUp";
    const target = (event.target as HTMLElement) ?? containerRef.current;

    target.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: remappedKey,
        code: remappedKey,
        bubbles: true,
      }),
    );
  };

  const handleResultMouseDown = (event: ReactMouseEvent<HTMLDivElement>, item: LauncherItem) => {
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      event.preventDefault();
      handleOpenInNewTab(item);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-[#d7c8ba] bg-[#f7f2eb]/90 px-4 py-2 text-sm text-[#5b4f44] shadow-panel backdrop-blur-xl transition hover:border-[#b9a28c] hover:bg-[#fbf8f4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8c7257] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f0e8]"
      >
        <CommandIcon className="h-4 w-4" />
        <span className="rounded-md border border-[#ddd1c6] bg-white/70 px-2 py-0.5 text-xs text-[#7f7061]">
          Cmd+K
        </span>
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-3xl rounded-[32px] border border-[#d9cabc] bg-[#f7f2eb]/85 p-4 shadow-panel backdrop-blur-xl"
    >
      <Command
        shouldFilter={false}
        loop
        label="Company command center"
        value={selectedValue}
        onValueChange={setSelectedValue}
        onKeyDownCapture={handleDirectionalRemap}
        className="overflow-hidden rounded-[28px] border border-[#e3d7cb] bg-[#fcfaf7]/90"
      >
        <div className="flex items-center gap-3 border-b border-[#eadfd5] px-5 py-5">
          <Search className="h-5 w-5 text-[#8f7f70]" />
          <Command.Input
            ref={inputRef}
            autoFocus
            value={search}
            onValueChange={(nextSearch) => {
              setSearch(nextSearch);
              setSelectedValue("");
            }}
            onBlur={() => {
              window.setTimeout(() => {
                if (!containerRef.current?.contains(document.activeElement)) {
                  inputRef.current?.focus();
                }
              }, 0);
            }}
            placeholder="Search tools, teams, or workflows"
            className="w-full border-none bg-transparent font-['Newsreader'] text-2xl tracking-[-0.03em] text-[#1b1612] outline-none placeholder:text-[#a08f80] sm:text-[2rem]"
          />
        </div>

        <Command.List className={`h-[480px] px-3 ${search ? "overflow-y-auto py-3" : "overflow-hidden py-4"}`}>
          {!search ? (
            <div className="space-y-4 px-3 py-3">
              {recentApps.length > 0 ? (
                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8f7f70]">
                      Recently Used
                    </h2>
                    <span className="text-[11px] text-[#9e8d7d]">{recentItems.length} items</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                    {recentApps.map((app) => (
                      <AppTile key={app.id} app={app} onSelect={handleSelect} onOpenInNewTab={handleOpenInNewTab} />
                    ))}
                  </div>
                </section>
              ) : null}

              {recentDestinations.length > 0 || pinnedDestinations.length > 0 ? (
                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8f7f70]">
                      Shortcuts
                    </h2>
                    <span className="text-[11px] text-[#9e8d7d]">Pinned destinations</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {[...recentDestinations, ...pinnedDestinations.filter((item) => !recentDestinations.some((recent) => recent.id === item.id))]
                      .slice(0, 4)
                      .map((item) => (
                        <DestinationPill
                          key={item.id}
                          item={item}
                          onSelect={handleSelect}
                          onOpenInNewTab={handleOpenInNewTab}
                        />
                      ))}
                  </div>
                </section>
              ) : null}

              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8f7f70]">
                    Recommended
                  </h2>
                  <span className="text-[11px] text-[#9e8d7d]">Pinned apps first</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                  {recommendedApps.map((app) => (
                    <AppTile key={app.id} app={app} onSelect={handleSelect} onOpenInNewTab={handleOpenInNewTab} />
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="px-3 py-3">
              {rankedItems.map(({ item }) => {
                const parent = getParentApp(item);

                return (
                  <Command.Item
                    key={item.id}
                    value={`${item.name} ${item.description} ${getItemCategory(item)} ${parent?.name ?? ""} ${getItemKeywords(item).join(" ")}`}
                    onSelect={() => handleSelect(item)}
                    onMouseDown={(event) => handleResultMouseDown(event, item)}
                    className="group mb-1 flex cursor-pointer items-center gap-4 rounded-[24px] px-4 py-4 text-[#1f1914] outline-none transition data-[selected=true]:bg-[#efe4d8] data-[selected=true]:text-[#17120e]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ddd1c6] bg-white/70 text-[#54473d] transition group-data-[selected=true]:border-[#cdb7a1] group-data-[selected=true]:bg-[#f8f1e8]">
                      <ToolLogo icon={isDestination(item) ? parent?.icon ?? appById.get("slack")!.icon : item.icon} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-base font-medium tracking-[-0.02em]">{item.name}</p>
                        {isApp(item) ? (
                          <span className="rounded-full border border-[#e0d4c9] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[#9e8d7d]">
                            {item.category}
                          </span>
                        ) : (
                          <span className="rounded-full border border-[#e0d4c9] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[#9e8d7d]">
                            in {parent?.name}
                          </span>
                        )}
                      </div>
                      {isDestination(item) ? (
                        <p className="mt-1 truncate text-sm leading-5 text-[#7d6e61]">{item.description}</p>
                      ) : null}
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#9e8d7d] transition group-data-[selected=true]:text-[#6b5848]" />
                  </Command.Item>
                );
              })}
            </div>
          )}

          <Command.Empty className="px-6 py-14 text-center text-sm text-[#8f7f70]">
            No tools matched. Try an app name, destination, or workflow.
          </Command.Empty>
        </Command.List>
      </Command>
    </div>
  );
}
