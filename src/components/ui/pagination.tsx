import { cn } from "@/lib/styles";
import { ChevronLeftIcon } from "@/components/ui/icons";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white-soft text-brand-900 transition-all duration-200 hover:border-brand-700 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200",
            currentPage === page
              ? "bg-brand-900 text-white-soft shadow-md"
              : "border border-line bg-white-soft text-brand-900 hover:border-brand-700 hover:bg-cream-50"
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white-soft text-brand-900 transition-all duration-200 hover:border-brand-700 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Halaman berikutnya"
      >
        <ChevronLeftIcon className="h-4 w-4 rotate-180" />
      </button>
    </nav>
  );
}
