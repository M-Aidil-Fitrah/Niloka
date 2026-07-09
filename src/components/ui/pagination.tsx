import { cn } from "@/lib/styles";
import { ChevronLeftIcon } from "@/components/ui/icons";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getVisiblePages(current: number, total: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("...");

  if (total > 1) pages.push(total);

  return pages;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1 sm:gap-2" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-line bg-white-soft text-brand-900 transition-all duration-200 hover:border-brand-700 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeftIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>

      {visiblePages.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-xs text-ink-600">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
            className={cn(
              "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all duration-200",
              currentPage === page
                ? "bg-brand-900 text-white-soft shadow-md"
                : "border border-line bg-white-soft text-brand-900 hover:border-brand-700 hover:bg-cream-50"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-line bg-white-soft text-brand-900 transition-all duration-200 hover:border-brand-700 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Halaman berikutnya"
      >
        <ChevronLeftIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-180" />
      </button>
    </nav>
  );
}
