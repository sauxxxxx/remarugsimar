"use client";

import {
  BriefcaseBusiness,
  Code2,
  FolderOpen,
  Gamepad2,
  Home,
  Layers3,
  Mail,
  PenLine,
  Search,
  Wrench,
  UserRound,
} from "lucide-react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getPortfolioSearchItems,
  type PortfolioSearchIcon,
  type PortfolioSearchItem,
} from "./portfolio-search.data";

const GROUP_ORDER: PortfolioSearchItem["group"][] = [
  "Navigate",
  "Projects",
  "Writing",
  "Services",
  "Technologies",
  "Contact",
];

const SEARCH_ICONS = {
  about: UserRound,
  contact: Mail,
  experience: BriefcaseBusiness,
  game: Gamepad2,
  home: Home,
  project: FolderOpen,
  service: Wrench,
  stack: Layers3,
  technology: Code2,
  writing: PenLine,
} satisfies Record<PortfolioSearchIcon, typeof Search>;

type PortfolioSearchProps = {
  includeGame?: boolean;
};

export function PortfolioSearch({ includeGame = false }: PortfolioSearchProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const optionRefs = useRef(new Map<string, HTMLButtonElement>());
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchItems = useMemo(() => getPortfolioSearchItems(includeGame), [includeGame]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return searchItems.filter((item) => item.showByDefault);

    return searchItems.filter((item) =>
      [item.label, item.description, item.group, ...item.keywords]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, searchItems]);

  const groups = useMemo(
    () =>
      GROUP_ORDER.map((group) => ({
        group,
        items: visibleItems.filter((item) => item.group === group),
      })).filter(({ items }) => items.length > 0),
    [visibleItems],
  );
  const highlightedItem = visibleItems[highlightedIndex];

  const openDialog = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery("");
    setHighlightedIndex(0);
    dialog.showModal();
  }, []);

  useEffect(() => {
    function handleGlobalShortcut(event: globalThis.KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLocaleLowerCase() !== "k") return;
      event.preventDefault();

      const dialog = dialogRef.current;
      if (dialog?.open) {
        dialog.close();
        return;
      }

      if (document.querySelector("dialog[open]")) return;
      openDialog();
    }

    window.addEventListener("keydown", handleGlobalShortcut);
    return () => window.removeEventListener("keydown", handleGlobalShortcut);
  }, [openDialog]);

  function highlightOption(nextIndex: number) {
    if (!visibleItems.length) return;
    const normalizedIndex = (nextIndex + visibleItems.length) % visibleItems.length;
    setHighlightedIndex(normalizedIndex);
    optionRefs.current.get(visibleItems[normalizedIndex].id)?.scrollIntoView({ block: "nearest" });
  }

  function navigateTo(item: PortfolioSearchItem) {
    dialogRef.current?.close();

    if (item.action === "open-game") {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLButtonElement>(".stack-builder-trigger")?.click();
      });
      return;
    }

    if (!item.href) return;
    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }

    const destination = new URL(item.href, window.location.href);
    const isCurrentPage =
      destination.origin === window.location.origin &&
      destination.pathname === window.location.pathname;

    if (isCurrentPage && destination.hash) {
      const target = document.getElementById(destination.hash.slice(1));
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", destination.hash);
      return;
    }

    window.location.assign(destination.href);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      dialogRef.current?.close();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      highlightOption(highlightedIndex + 1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      highlightOption(highlightedIndex - 1);
    }

    if (event.key === "Enter" && highlightedItem) {
      event.preventDefault();
      navigateTo(highlightedItem);
    }
  }

  return (
    <>
      <button
        aria-keyshortcuts="Control+K Meta+K"
        aria-label="Search portfolio"
        className="portfolio-search-trigger"
        onClick={openDialog}
        title="Search portfolio (Ctrl/⌘ K)"
        type="button"
      >
        <Search aria-hidden="true" size={12} strokeWidth={1.6} />
      </button>

      <dialog
        aria-labelledby="portfolio-search-title"
        className="portfolio-search-dialog"
        onClose={() => {
          setQuery("");
          setHighlightedIndex(0);
        }}
        ref={dialogRef}
      >
        <div className="portfolio-search-dialog__content">
          <h2 className="sr-only" id="portfolio-search-title">Search portfolio</h2>

          <label className="portfolio-search-input">
            <Search aria-hidden="true" size={14} />
            <span className="sr-only">Search pages, projects, technologies, and links</span>
            <input
              aria-activedescendant={
                highlightedItem ? `portfolio-search-option-${highlightedItem.id}` : undefined
              }
              aria-autocomplete="list"
              aria-controls="portfolio-search-options"
              aria-expanded="true"
              autoComplete="off"
              autoFocus
              onChange={(event) => {
                setQuery(event.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search pages, projects, or technologies…"
              role="combobox"
              type="search"
              value={query}
            />
            <kbd>esc</kbd>
          </label>

          <div className="portfolio-search-list" id="portfolio-search-options" role="listbox">
            {visibleItems.length ? (
              groups.map(({ group, items }) => (
                <section
                  aria-labelledby={`portfolio-search-group-${group}`}
                  className="portfolio-search-group"
                  key={group}
                  role="group"
                >
                  <p className="portfolio-search-group__label" id={`portfolio-search-group-${group}`}>
                    {group}
                  </p>
                  {items.map((item) => {
                    const optionIndex = visibleItems.findIndex(({ id }) => id === item.id);
                    const Icon = SEARCH_ICONS[item.icon];

                    return (
                      <button
                        aria-selected={optionIndex === highlightedIndex}
                        className="portfolio-search-option"
                        data-highlighted={optionIndex === highlightedIndex || undefined}
                        id={`portfolio-search-option-${item.id}`}
                        key={item.id}
                        onClick={() => navigateTo(item)}
                        onMouseEnter={() => setHighlightedIndex(optionIndex)}
                        ref={(element) => {
                          if (element) optionRefs.current.set(item.id, element);
                          else optionRefs.current.delete(item.id);
                        }}
                        role="option"
                        type="button"
                      >
                        <Icon aria-hidden="true" size={14} strokeWidth={1.5} />
                        <span className="portfolio-search-option__copy">
                          <span>{item.label}</span>
                          <small>{item.description}</small>
                        </span>
                        {item.meta ? <span className="portfolio-search-option__meta">{item.meta}</span> : null}
                      </button>
                    );
                  })}
                </section>
              ))
            ) : (
              <div className="portfolio-search-empty">
                <p>No matching results</p>
                <span>Try a project, technology, or section name.</span>
              </div>
            )}
          </div>

          <footer className="portfolio-search-dialog__status">
            <span>↑↓ navigate · enter open · esc close</span>
            <span>Ctrl/⌘ K</span>
          </footer>
        </div>
      </dialog>
    </>
  );
}
