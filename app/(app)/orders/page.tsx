"use client";

import { useEffect, useMemo, useState } from "react";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";
import { DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

import { DataTable } from "@/components/core/Table";
import { Input, Select } from "@/components/core";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/core";
import { useDeleteOrder, useOrders, useUpdateOrder } from "@/hooks/api";
import type {
  OrderListItem,
  OrderStatus,
  OrderType,
  SortOrder,
} from "@/models/order";

export default function OrdersPage() {
  const router = useRouter();
  const updateOrderMutation = useUpdateOrder();
  const deleteOrderMutation = useDeleteOrder();

  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const [orderIdSearch, setOrderIdSearch] = useState("");
  const [debouncedOrderIdSearch, setDebouncedOrderIdSearch] = useState("");

  const [guestSearch, setGuestSearch] = useState("");
  const [debouncedGuestSearch, setDebouncedGuestSearch] = useState("");

  const [orderType, setOrderType] = useState<OrderType | "">("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [isPaid, setIsPaid] = useState<"" | "true" | "false">("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedOrderIdSearch(orderIdSearch);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [orderIdSearch]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedGuestSearch(guestSearch);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [guestSearch]);

  const sortOrder: SortOrder | undefined =
    sorting[0]?.id === "createdAt"
      ? ((sorting[0].desc ? "DESC" : "ASC") as SortOrder)
      : undefined;

  const ordersQuery = useOrders({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    orderId: debouncedOrderIdSearch.trim() || undefined,
    guestUserName: debouncedGuestSearch.trim() || undefined,
    orderType: orderType || undefined,
    status: status || undefined,
    isPaid: isPaid === "" ? undefined : isPaid === "true",
    sortOrder,
  });

  const data = ordersQuery.data?.data ?? [];

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = useMemo<ColumnDef<OrderListItem>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="text-sm text-gray-600">{row.original.id}</span>
        ),
      },
      {
        id: "guestUser",
        header: "Guest User",
        cell: ({ row }) => {
          const guest = row.original.guestUser;
          if (!guest) return <span className="text-gray-500">-</span>;
          return (
            <div className="min-w-0">
              <div className="font-medium text-gray-900">
                {`${guest.firstName} ${guest.lastName}`.trim()}
              </div>
              <div className="text-sm text-gray-500">{guest.email}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "orderType",
        header: "Order Type",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm text-gray-900">
            {row.original.orderType}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => {
          const order = row.original;
          const isUpdatingThisRow =
            updateOrderMutation.isPending && updateOrderMutation.variables?.id === order.id;

          return (
            <Select<OrderStatus>
              value={order.status}
              disabled={isUpdatingThisRow}
              onValueChange={async (nextStatus) => {
                if (nextStatus === order.status) return;
                await updateOrderMutation.mutateAsync({
                  id: order.id,
                  payload: { status: nextStatus },
                });
              }}
              options={[
                { value: "pending", label: "Pending" },
                { value: "confirmed", label: "Confirmed" },
                { value: "in_production", label: "In production" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              className="min-w-48"
            />
          );
        },
      },
      {
        accessorKey: "isPaid",
        header: "Paid",
        enableSorting: false,
        cell: ({ row }) => {
          const order = row.original;
          const isUpdatingThisRow =
            updateOrderMutation.isPending && updateOrderMutation.variables?.id === order.id;

          const value = order.isPaid ? "true" : "false";
          return (
            <Select<"true" | "false">
              value={value}
              disabled={isUpdatingThisRow}
              onValueChange={async (next) => {
                const nextPaid = next === "true";
                if (nextPaid === order.isPaid) return;
                await updateOrderMutation.mutateAsync({
                  id: order.id,
                  payload: { isPaid: nextPaid },
                });
              }}
              options={[
                { value: "true", label: "Paid" },
                { value: "false", label: "Unpaid" },
              ]}
              className="min-w-32"
            />
          );
        },
      },

      {
        accessorKey: "createdAt",
        header: "Created At",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-gray-600">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-gray-600">
            {formatDate(row.original.updatedAt)}
          </span>
        ),
      },

      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const orderId = row.original.id;
          const isDeletingThisRow = deleteOrderMutation.isPending && deleteOrderId === orderId;

          return (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => router.push(`/orders/${orderId}`)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50"
                aria-label="View more"
                title="View more"
              >
                <DotsHorizontalIcon className="h-4 w-4" />
              </button>

              <AlertDialog
                open={deleteOrderId === orderId}
                onOpenChange={(open) => setDeleteOrderId(open ? orderId : null)}
              >
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    disabled={isDeletingThisRow}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Delete"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete order?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Cancel
                      </button>
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            await deleteOrderMutation.mutateAsync(orderId);
                            setDeleteOrderId(null);
                          } catch {
                            // keep dialog open on error
                          }
                        }}
                        disabled={isDeletingThisRow}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isDeletingThisRow ? "Deleting..." : "Confirm delete"}
                      </button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
      },
    ],
    [
      deleteOrderId,
      deleteOrderMutation,
      router,
      updateOrderMutation,
    ],
  );

  return (
    <div className="mx-auto w-full max-w-6xl">
      <DataTable
        columns={columns}
        data={data}
        searchKey="id"
        searchValue={orderIdSearch}
        onSearchChange={(value) => {
          setOrderIdSearch(value);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        searchPlaceholder="Search orders by order ID..."
        toolbarRight={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="w-full max-w-sm">
              <Input
                placeholder="Search guest name or email..."
                value={guestSearch}
                onChange={(e) => {
                  setGuestSearch(e.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
              />
            </div>

            <Select<OrderType | "">
              value={orderType}
              onValueChange={(v) => {
                setOrderType(v);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              placeholder="All types"
              options={[
                { value: "", label: "All types" },
                { value: "pickup", label: "Pickup" },
                { value: "delivery", label: "Delivery" },
              ]}
            />

            <Select<OrderStatus | "">
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              placeholder="All statuses"
              options={[
                { value: "", label: "All statuses" },
                { value: "pending", label: "Pending" },
                { value: "confirmed", label: "Confirmed" },
                { value: "in_production", label: "In production" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />

            <Select<"" | "true" | "false">
              value={isPaid}
              onValueChange={(v) => {
                setIsPaid(v);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              placeholder="All payments"
              options={[
                { value: "", label: "All payments" },
                { value: "true", label: "Paid" },
                { value: "false", label: "Unpaid" },
              ]}
            />
          </div>
        }
        isLoading={ordersQuery.isLoading}
        manualPagination
        pagination={pagination}
        onPaginationChange={setPagination}
        pageCount={ordersQuery.data?.totalPages}
        totalCount={ordersQuery.data?.totalItems}
        manualSorting
        sorting={sorting}
        onSortingChange={(updater) => {
          const nextSorting =
            typeof updater === "function" ? updater(sorting) : updater;
          setSorting(nextSorting);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
      />
    </div>
  );
}
