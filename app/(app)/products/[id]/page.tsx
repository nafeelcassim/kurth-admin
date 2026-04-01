"use client";

import React from "react";

import { useEdgeFinishings, useGlassTypes, useShapes, useThicknesses } from "@/hooks/api";

import type { ShapeTranslationDetailItem } from "@/models/shape";

import { Pencil1Icon } from "@radix-ui/react-icons";

import {
  AddShapeDialog,
  EdgeFinishingSection,
  GlassTypeSection,
  MinimumAreaSectionContainer,
  ShapeSection,
  ThicknessSection,
  UpdateShapeDialog,
  AddThicknessDialog,
  UpdateThicknessDialog,
  DeleteThickness,
  AddEdgeFinishingDialog,
  UpdateEdgeFinishingDialog,
  DeleteEdgeFinishing,
  AddGlassTypeDialog,
  UpdateGlassTypeDialog,
  DeleteGlassType,
} from "./_components";
import { DeleteShape } from "./_components/shape";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const { data: shapes } = useShapes();
  const { data: thicknesses } = useThicknesses();
  const { data: edgeFinishings } = useEdgeFinishings(id);
  const { data: glassTypes } = useGlassTypes(id);

  const getEnglishName = (
    translations?: ShapeTranslationDetailItem[],
    fallback?: string,
  ) => {
    const en = translations?.find((t) => t.language === "en")?.name;
    if (en) return en;
    const first = translations?.[0]?.name;
    return first ?? fallback ?? "";
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Product Details
        </h1>
        <p className="mt-1 text-sm text-zinc-600">Product ID: {id}</p>
      </div>

      <ShapeSection
        data={(shapes ?? []).map((s) => ({
          id: s.id,
          shape: getEnglishName(s.translations, s.name),
          priceMultiplier: s.priceMultiplier ?? null,
          isActive: s.isActive,
        }))}
        addTrigger={
          <AddShapeDialog
            productId={id}
            trigger={
              <button
                type="button"
                className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                Add
              </button>
            }
          />
        }
        renderActions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <UpdateShapeDialog
              shapeId={row.id}
              trigger={
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50"
                  aria-label="Update"
                  title="Update"
                >
                  <Pencil1Icon className="h-4 w-4" />
                </button>
              }
            />
            <DeleteShape id={row.id} />
          </div>
        )}
        onDelete={(row) => console.log("Delete shape", { productId: id, row })}
      />

      <ThicknessSection
        data={(thicknesses ?? [])
          .filter((t) => t.productId === id)
          .map((t) => ({
            id: t.id,
            value: t.value,
            isActive: t.isActive,
          }))}
        addTrigger={
          <AddThicknessDialog
            productId={id}
            trigger={
              <button
                type="button"
                className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                Add
              </button>
            }
          />
        }
        renderActions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <UpdateThicknessDialog
              thicknessId={row.id}
              trigger={
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50"
                  aria-label="Update"
                  title="Update"
                >
                  <Pencil1Icon className="h-4 w-4" />
                </button>
              }
            />
            <DeleteThickness id={row.id} />
          </div>
        )}
      />

      <MinimumAreaSectionContainer productId={id} />

      <EdgeFinishingSection
        data={(edgeFinishings ?? []).map((e) => ({
          id: e.id,
          name: e.translations?.find((t) => t.language === "en")?.name || "",
          pricePerLfm: e.pricePerLfm,
          minLengthLfm: e.minLengthLfm,
          isActive: e.isActive,
        }))}
        addTrigger={
          <AddEdgeFinishingDialog
            productId={id}
            trigger={
              <button
                type="button"
                className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                Add
              </button>
            }
          />
        }
        renderActions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <UpdateEdgeFinishingDialog
              edgeFinishingId={row.id}
              productId={id}
              trigger={
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50"
                  aria-label="Update"
                  title="Update"
                >
                  <Pencil1Icon className="h-4 w-4" />
                </button>
              }
            />
            <DeleteEdgeFinishing id={row.id} productId={id} />
          </div>
        )}
      />

      <GlassTypeSection
        data={(glassTypes ?? []).map((g) => ({
          id: g.id,
          name: g.translations?.find((t) => t.language === "en")?.name || g.name,
          imageUrl: g.imageUrl,
          isActive: g.isActive,
        }))}
        addTrigger={
          <AddGlassTypeDialog
            productId={id}
            trigger={
              <button
                type="button"
                className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                Add
              </button>
            }
          />
        }
        renderActions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <UpdateGlassTypeDialog
              glassTypeId={row.id}
              productId={id}
              trigger={
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50"
                  aria-label="Update"
                  title="Update"
                >
                  <Pencil1Icon className="h-4 w-4" />
                </button>
              }
            />
            <DeleteGlassType id={row.id} productId={id} />
          </div>
        )}
      />
    </div>
  );
}
