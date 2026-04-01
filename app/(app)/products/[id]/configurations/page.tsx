"use client";

import React, { useCallback } from "react";

import { PageHeader } from "./_components/PageHeader";
import { VatRateSectionContainer } from "./_components/VatRateSectionContainer";
import { PricePerM2SectionContainer } from "./_components/PricePerM2SectionContainer";
import { EdgePricingSectionContainer } from "./_components/EdgePricingSectionContainer";
import { ThroughHolePricingSectionContainer } from "./_components/ThroughHolePricingSectionContainer";

export default function ProductConfigurationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const handleReset = useCallback(() => {}, []);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader id={id} onReset={handleReset} />

      <VatRateSectionContainer productId={id} />

      <PricePerM2SectionContainer productId={id} />

      <EdgePricingSectionContainer productId={id} />

      <ThroughHolePricingSectionContainer productId={id} />
    </div>
  );
}