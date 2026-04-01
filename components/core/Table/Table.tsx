"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
  type OnChangeFn,
} from "@tanstack/react-table";
import {
  CaretSortIcon,
  CaretUpIcon,
  CaretDownIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { Input } from "../Input";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  toolbarRight?: React.ReactNode;
  showPagination?: boolean;
  pageSize?: number;
  isLoading?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageCount?: number;
  totalCount?: number;
  manualPagination?: boolean;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  manualSorting?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  toolbarRight,
  showPagination = true,
  pageSize = 10,
  isLoading = false,
  pagination: controlledPagination,
  onPaginationChange,
  pageCount,
  totalCount,
  manualPagination = false,
  sorting: controlledSorting,
  onSortingChange,
  manualSorting = false,
}: DataTableProps<TData, TValue>) {
  const [uncontrolledSorting, setUncontrolledSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [uncontrolledPagination, setUncontrolledPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const sorting = controlledSorting ?? uncontrolledSorting;
  const setSorting = onSortingChange ?? setUncontrolledSorting;

  const pagination = controlledPagination ?? uncontrolledPagination;
  const setPagination = onPaginationChange ?? setUncontrolledPagination;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(manualSorting ? {} : { getSortedRowModel: getSortedRowModel() }),
    getFilteredRowModel: getFilteredRowModel(),
    ...(manualPagination ? {} : { getPaginationRowModel: getPaginationRowModel() }),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    manualPagination,
    manualSorting,
    ...(manualPagination && typeof pageCount === "number" ? { pageCount } : {}),
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      {searchKey ? (
        <div className="flex  gap-2 justify-between">
          <div className="flex-1 max-w-sm">
            <Input
              leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
              placeholder={searchPlaceholder}
              value={
                typeof searchValue === "string"
                  ? searchValue
                  : ((table.getColumn(searchKey)?.getFilterValue() as string) ?? "")
              }
              onChange={(e) => {
                if (onSearchChange) {
                  onSearchChange(e.target.value);
                  return;
                }
                table.getColumn(searchKey)?.setFilterValue(e.target.value);
              }}
            />
          </div>

          {toolbarRight ? <div className="shrink-0">{toolbarRight}</div> : null}
        </div>
      ) : toolbarRight ? (
        <div className="flex items-center justify-end">{toolbarRight}</div>
      ) : null}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex cursor-pointer select-none items-center gap-2 hover:text-gray-900"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="ml-auto">
                              {header.column.getIsSorted() === "asc" ? (
                                <CaretUpIcon className="h-4 w-4" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <CaretDownIcon className="h-4 w-4" />
                              ) : (
                                <CaretSortIcon className="h-4 w-4 opacity-50" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No results found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {showPagination ? (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                totalCount ?? table.getFilteredRowModel().rows.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium">
              {totalCount ?? table.getFilteredRowModel().rows.length}
            </span>{" "}
            results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={
                manualPagination
                  ? table.getState().pagination.pageIndex <= 0
                  : !table.getCanPreviousPage()
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={
                manualPagination
                  ? typeof pageCount === "number"
                    ? table.getState().pagination.pageIndex >= pageCount - 1
                    : data.length < table.getState().pagination.pageSize
                  : !table.getCanNextPage()
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}