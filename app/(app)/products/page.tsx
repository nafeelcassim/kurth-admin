"use client";

import { useRouter } from "next/navigation";
import { AddProductDialog, UpdateProductDialog } from "./_components";
import { useProducts } from "@/hooks/api";

export default function Products() {
  const router = useRouter();
  const { data: products, isLoading } = useProducts();

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex items-center justify-end">
        <AddProductDialog
          trigger={
            <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15">
              Add Product
            </button>
          }
        />
      </div>

      {isLoading ? (
        <div className="text-sm text-zinc-600">Loading...</div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {(products ?? []).map((product) => {
          const firstTranslation = product.translations[0];
          const title = firstTranslation?.name ?? product.slug;
          const description = firstTranslation?.description ?? "";

          return (
            <div
              key={product.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">{title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{description}</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => router.push(`/products/${product.id}/configurations`)} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800">
                  View Pricing
                </button>

                <button onClick={() => router.push(`/products/${product.id}`)} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800">
                  Manage Config Data
                </button>

                <UpdateProductDialog
                  productId={product.id}
                  trigger={
                    <button className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50">
                      Update
                    </button>
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}