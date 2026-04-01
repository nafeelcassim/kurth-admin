"use client";

import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { DataTable } from "@/components/core/Table";
import { Select } from "@/components/core";

import { useGetOrder, useGetOrderItems } from "@/hooks/api";
import type { OrderItem, OrderStatus, OrderType } from "@/models/order";
import type { Locale } from "@/service";

const localeOptions = [
  { value: "en", label: "EN" },
  { value: "fr", label: "FR" },
  { value: "de", label: "DE" },
] as const;

function formatMoney(value: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 2,
  }).format(n);
}

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadgeClass(status: OrderStatus) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "in_production":
      return "bg-purple-100 text-purple-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-zinc-100 text-zinc-800";
  }
}

function orderTypeLabel(type: OrderType) {
  return type === "pickup" ? "Pickup" : "Delivery";
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const routeParams = useParams<{ id: string | string[] }>();
  const orderId = Array.isArray(routeParams?.id) ? routeParams?.id[0] : routeParams?.id;

  const [locale, setLocale] = useState<Locale>("en");

  const [itemsPagination, setItemsPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const orderQuery = useGetOrder(orderId, locale);
  const itemsQuery = useGetOrderItems(
    orderId,
    locale,
    itemsPagination.pageIndex + 1,
    itemsPagination.pageSize
  );

  const items = itemsQuery.data?.items ?? [];
  const totalItems = itemsQuery.data?.total ?? 0;
  const pageCount = itemsQuery.data ? Math.ceil(itemsQuery.data.total / itemsQuery.data.limit) : 0;

  const columns = useMemo<ColumnDef<OrderItem>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Item ID",
        cell: ({ row }) => <span className="text-sm text-gray-700">{row.original.id}</span>,
      },
      {
        id: "product",
        header: "Product",
        cell: ({ row }) => {
          const p = row.original.product;
          const name = p.translations?.[0]?.name ?? p.slug;
          return (
            <div className="min-w-0">
              <div className="font-medium text-gray-900 truncate">{name}</div>
              <div className="text-sm text-gray-500 truncate">{p.slug}</div>
            </div>
          );
        },
      },
      {
        id: "dimensions",
        header: "Size (mm)",
        cell: ({ row }) => (
          <span className="text-sm text-gray-700">
            {row.original.widthMm} x {row.original.heightMm}
          </span>
        ),
      },
      {
        accessorKey: "quantity",
        header: "Qty",
        cell: ({ row }) => <span className="text-sm text-gray-700">{row.original.quantity}</span>,
      },
      {
        id: "grossPrice",
        header: "Gross",
        cell: ({ row }) => <span className="text-sm text-gray-700">{formatMoney(row.original.grossPrice)}</span>,
      },
      {
        id: "netPrice",
        header: "Net",
        cell: ({ row }) => <span className="text-sm text-gray-700">{formatMoney(row.original.netPrice)}</span>,
      },
      {
        id: "vat",
        header: "VAT",
        cell: ({ row }) => (
          <span className="text-sm text-gray-700">
            {row.original.vatPercent}% ({formatMoney(row.original.vatAmount)})
          </span>
        ),
      },
      {
        id: "details",
        header: "Details",
        cell: ({ row }) => {
          const i = row.original;
          const gt = i.glassType?.translations?.[0]?.name ?? i.glassTypeId;
          const sh = i.shape?.translations?.[0]?.name ?? i.shapeId;
          const ef = i.edgeFinishing?.translations?.[0]?.name ?? i.edgeFinishingId;
          return (
            <div className="min-w-0 space-y-1">
              <div className="text-sm text-gray-700 truncate">Glass: {gt}</div>
              <div className="text-sm text-gray-700 truncate">Shape: {sh}</div>
              <div className="text-sm text-gray-700 truncate">Edge: {ef}</div>
              <div className="text-sm text-gray-700 truncate">Thickness: {i.thickness?.value ?? "-"}mm</div>
              <div className="text-sm text-gray-700 truncate">Holes: {i.holes?.reduce((acc, h) => acc + h.quantity, 0) ?? 0}</div>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50"
            aria-label="Back"
            title="Back"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <div>
            <div className="text-sm text-gray-500">Order</div>
            <div className="text-xl font-semibold text-gray-900">{orderId}</div>
          </div>
        </div>

        {/* <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">Locale</div>
          <Select<Locale>
            value={locale}
            onValueChange={setLocale}
            options={localeOptions as unknown as { value: Locale; label: string }[]}
            className="min-w-24"
          />
        </div> */}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          {orderQuery.isLoading ? (
            <div className="text-sm text-gray-600">Loading order...</div>
          ) : orderQuery.isError ? (
            <div className="text-sm text-red-600">Failed to load order.</div>
          ) : orderQuery.data ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    "inline-flex rounded-full px-3 py-1 text-xs font-medium " +
                    statusBadgeClass(orderQuery.data.status)
                  }
                >
                  {orderQuery.data.status}
                </span>

                <span
                  className={
                    "inline-flex rounded-full px-3 py-1 text-xs font-medium " +
                    (orderQuery.data.isPaid
                      ? "bg-green-100 text-green-800"
                      : "bg-zinc-100 text-zinc-700")
                  }
                >
                  {orderQuery.data.isPaid ? "Paid" : "Unpaid"}
                </span>

                <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                  {orderTypeLabel(orderQuery.data.orderType)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs font-medium text-gray-500">Total Net</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900">
                    {formatMoney(orderQuery.data.totalNet)}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs font-medium text-gray-500">Total VAT</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900">
                    {formatMoney(orderQuery.data.totalVat)}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs font-medium text-gray-500">Total Gross</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900">
                    {formatMoney(orderQuery.data.totalGross)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs font-medium text-gray-500">Created</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {formatDateTime(orderQuery.data.createdAt)}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs font-medium text-gray-500">Updated</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {formatDateTime(orderQuery.data.updatedAt)}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-xs font-medium text-gray-500">Notes</div>
                <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {orderQuery.data.notes?.trim() ? orderQuery.data.notes : "-"}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">Guest</div>
          {orderQuery.isLoading ? (
            <div className="mt-2 text-sm text-gray-600">Loading guest...</div>
          ) : orderQuery.isError ? (
            <div className="mt-2 text-sm text-red-600">Failed to load guest.</div>
          ) : (
            <div className="mt-2 space-y-3">
              <div className="text-sm text-gray-700">
                <div className="text-xs font-medium text-gray-500">Name</div>
                <div className="mt-1 font-medium text-gray-900">
                  {orderQuery.data?.guestUser
                    ? `${orderQuery.data.guestUser.firstName} ${orderQuery.data.guestUser.lastName}`.trim()
                    : "-"}
                </div>
              </div>

              <div className="text-sm text-gray-700">
                <div className="text-xs font-medium text-gray-500">Email</div>
                <div className="mt-1 text-gray-900">{orderQuery.data?.guestUser?.email ?? "-"}</div>
              </div>

              <div className="text-sm text-gray-700">
                <div className="text-xs font-medium text-gray-500">Phone</div>
                <div className="mt-1 text-gray-900">{orderQuery.data?.guestUser?.mobile ?? "-"}</div>
              </div>

              <div className="text-sm text-gray-700">
                <div className="text-xs font-medium text-gray-500">Address</div>
                <div className="mt-1 text-gray-900">
                  {orderQuery.data?.guestUser?.street ||
                  orderQuery.data?.guestUser?.postalCode ||
                  orderQuery.data?.guestUser?.village ||
                  orderQuery.data?.guestUser?.country ? (
                    <div className="space-y-1">
                      {orderQuery.data?.guestUser?.street ? (
                        <div>{orderQuery.data.guestUser?.street}</div>
                      ) : null}
                      {orderQuery.data?.guestUser?.postalCode ||
                      orderQuery.data?.guestUser?.village ? (
                        <div>
                          {[orderQuery.data?.guestUser?.postalCode, orderQuery.data?.guestUser?.village]
                            .filter(Boolean)
                            .join(" ")}
                        </div>
                      ) : null}
                      {orderQuery.data?.guestUser?.country ? (
                        <div>{orderQuery.data.guestUser.country}</div>
                      ) : null}
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-semibold text-gray-900">Order items</div>
            <div className="text-sm text-gray-500">{totalItems} total</div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={items}
          showPagination
          isLoading={itemsQuery.isLoading}
          manualPagination
          pagination={itemsPagination}
          onPaginationChange={setItemsPagination}
          pageCount={pageCount}
          totalCount={totalItems}
        />
      </div>
    </div>
  );
}
