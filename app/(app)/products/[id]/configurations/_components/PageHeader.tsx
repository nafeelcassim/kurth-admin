import React from "react";

type PageHeaderProps = {
  id: string;
  onReset: () => void;
};

function PageHeaderComponent({ id, onReset }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Product Configurations</h1>
        <p className="mt-1 text-sm text-zinc-600">Product ID: {id}</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
      >
        Reset
      </button>
    </div>
  );
}

export const PageHeader = React.memo(PageHeaderComponent);
