"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { AddProductDialog, UpdateProductDialog } from "./_components";
import { useProducts } from "@/hooks/api";

export default function Products() {
  const router = useRouter();
  const { data: products, isLoading } = useProducts();

  // TODO: Temporary fix to allow only one product
  const hasAtLeastOneProduct = (products?.length ?? 0) > 0;
  const isCreateDisabled = isLoading || hasAtLeastOneProduct;

  const aspectRatioStyle = (ratio?: string | null): CSSProperties | undefined => {
    if (!ratio) return undefined;
    if (ratio === "1:1") return { aspectRatio: "1 / 1" };
    if (ratio === "4:3") return { aspectRatio: "4 / 3" };
    if (ratio === "3:4") return { aspectRatio: "3 / 4" };
    return undefined;
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex items-center justify-end">
        <AddProductDialog
          trigger={
            <button
              disabled={isCreateDisabled}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Add Product
            </button>
          }
        />
      </div>

      {isLoading ? (
        <div className="text-sm text-zinc-600">Loading...</div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {(products ?? []).map((product) => {
          const firstTranslation = product.translations[0];
          const title = firstTranslation?.name ?? product.slug;
          const description = firstTranslation?.description ?? "";

          return (
            <div
              key={product.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {product.imageUrl ? (
                <div
                  className="w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
                  style={aspectRatioStyle(product.aspectRatio)}
                >
                  <NextImage
                    src={product.imageUrl}
                    alt={title}
                    width={1200}
                    height={900}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : null}

              <h3 className="mt-3 text-sm font-semibold text-zinc-900 line-clamp-1">{title}</h3>
              <p className="mt-1 text-xs text-zinc-600 line-clamp-2">{description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => router.push(`/products/${product.id}/configurations`)} className="rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800">
                  View Pricing
                </button>

                <button onClick={() => router.push(`/products/${product.id}`)} className="rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800">
                  Manage Config Data
                </button>

                <UpdateProductDialog
                  productId={product.id}
                  trigger={
                    <button className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50">
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