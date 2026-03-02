"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number; // 1-indexed (1, 2, 3...)
  totalPages: number;
  onPageClick: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageClick,
  className,
}: PaginationProps) {
  // Generate array of page numbers to display
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];

    // If total pages is 7 or less, show all pages
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust range if near start
    if (currentPage <= 3) {
      startPage = 2;
      endPage = 5;
    }

    // Adjust range if near end
    if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
      endPage = totalPages - 1;
    }

    // Add ellipsis before middle section if needed
    if (startPage > 2) {
      pages.push("ellipsis");
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis after middle section if needed
    if (endPage < totalPages - 1) {
      pages.push("ellipsis");
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageClick(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageClick(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        radius="md"
        iconOnly
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </Button>

      {/* Page Numbers - Hidden on mobile, shown on desktop */}
      <div className="hidden md:flex items-center gap-2">
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-mid-grey select-none"
              >
                ...
              </span>
            );
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? "primary" : "outline"}
              size="sm"
              radius="md"
              onClick={() => onPageClick(page)}
              className="min-w-[36px]"
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Mobile Page Indicator - Shown on mobile, hidden on desktop */}
      <div className="md:hidden flex items-center px-3 py-1.5 text-sm text-mid-grey">
        Page {currentPage} of {totalPages}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        radius="md"
        iconOnly
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
