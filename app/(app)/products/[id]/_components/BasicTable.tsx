import type { ReactNode } from "react";

import { DataTable } from "@/components/core/Table";
import type { CellContext, ColumnDef } from "@tanstack/react-table";

type BasicTableProps = {
  headers: string[];
  rows: ReactNode[][];
  actions?: ReactNode[];
};

export function BasicTable({ headers, rows, actions }: BasicTableProps) {
  type RowData = {
    rowIndex: number;
    cells: ReactNode[];
    action: ReactNode;
  };

  const data: RowData[] = rows.map((r, rowIndex) => ({
    rowIndex,
    cells: r,
    action: actions?.[rowIndex] ?? null,
  }));

  const columns: ColumnDef<RowData, unknown>[] = [
    ...headers.map((h, idx) => ({
      id: `col-${idx}`,
      header: h,
      enableSorting: false,
      cell: (info: CellContext<RowData, unknown>) => info.row.original.cells[idx] ?? null,
    })),
    ...(actions
      ? ([
          {
            id: "actions",
            header: "Actions",
            enableSorting: false,
            cell: (info: CellContext<RowData, unknown>) => info.row.original.action,
          },
        ] as ColumnDef<RowData, unknown>[])
      : []),
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={false}
      showPagination={false}
    />
  );
}
