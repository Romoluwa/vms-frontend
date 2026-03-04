"use client";
import React, { ReactNode, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import Pagination from "./Pagination";
import ClipboardIcon from "../icons/clipboard";
import Pagination from "./Pagination";

type DefaultTableProps<T> = {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  topcontent?: ReactNode;
  currentPage?: number;
  totalPages?: number;
  totalElements?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
  initialSortBy?: SortingState;
  noDataMessage?: ReactNode | string;
  loading?: boolean;
  tableClassName?: string;
  onRowClick?: (row: T) => void;
};

export default function DefaultTable<T>({
  columns,
  data,
  topcontent,
  currentPage,
  totalPages,
  onPageChange,
  showPagination = false,
  initialSortBy,
  noDataMessage = "No data available",
  loading = false,
  onRowClick,
}: DefaultTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(initialSortBy || []);

  const table = useReactTable({
    data: data ?? [],
    columns: columns ?? [],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const rowsPerPage = 10;
  const rows = table.getRowModel().rows ?? [];

  return (
    <div className="h-full">
      {/* Optional top content */}
      {topcontent && <div>{topcontent}</div>}

      {/* table section */}
      <div className="w-full rounded-lg">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-[#fafafa] text-xs">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="group bg-gray-100 select-none whitespace-nowrap border-gray-300"
                  >
                    <div className="flex items-center gap-1 text-[#4B5563]">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(rowsPerPage)].map((_, index) => (
                <TableRow
                  key={index}
                  className="bg-white animate-pulse border-gray-300"
                >
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex} className="text-xs">
                      <div className="h-4 w-full rounded bg-gray-300"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows?.length ? (
              <>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    // Added 'cursor-pointer' so the mouse turns into a hand
                    // Added 'hover:bg-slate-50' to highlight the row on hover
                    // Added 'transition-colors' for a smooth effect
                    className="bg-white border-gray-300 cursor-pointer hover:bg-slate-50 transition-colors group"
                    onClick={() => {
                      onRowClick?.(row.original);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        // Added 'group-hover' logic if you ever want to highlight specific text on hover
                        className="text-xs text-[#535862] whitespace-nowrap py-4"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                <TableRow className="bg-white">
                  <TableCell
                    colSpan={columns.length}
                    className="py-10 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 text-sm">
                      <ClipboardIcon height={50} width={50} />
                      {noDataMessage || "No data available"}
                    </div>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages && totalPages >= 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage || 1}
            totalPages={totalPages}
            onPageClick={onPageChange || (() => {})}
          />
        </div>
      )}
    </div>
  );
}
