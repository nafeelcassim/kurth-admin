'use client'

import { useEffect, useMemo, useState } from "react";
import {
  Pencil1Icon,
} from "@radix-ui/react-icons";
import { ColumnDef, type SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/core/Table";
import { DeleteUserAlertDialog, UpdateUserDialog } from "./_components";
import { AddUserDialog } from "./_components";
import { useUsers } from "@/hooks/api";
import type { FindUsersDto, UserListItem } from "@/models";

interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive";
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export default function UsersPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  const orderBy: FindUsersDto["orderBy"] | undefined =
    sorting[0]?.id === "email" ||
    sorting[0]?.id === "createdAt" ||
    sorting[0]?.id === "lastLoginAt"
      ? (sorting[0].id as FindUsersDto["orderBy"])
      : undefined;
  const order: FindUsersDto["order"] | undefined = sorting[0]
    ? sorting[0].desc
      ? "DESC"
      : "ASC"
    : undefined;

  const { data: usersResponse, isLoading } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
    orderBy,
    order,
  });

  const tableData: User[] = useMemo(() => {
    const apiUsers: UserListItem[] = usersResponse?.data ?? [];
    return apiUsers.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`.trim(),
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      status: u.isActive ? "active" : "inactive",
      isActive: u.isActive,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
    }));
  }, [usersResponse?.data]);

  // Define columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">#{row.original.id}</span>
      ),
    },

    {
      accessorKey: "name",
      header: "Name",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {row.original.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-gray-700">{row.original.email}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            row.original.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <span className="text-gray-600">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      accessorKey: "lastLoginAt",
      header: "Last Login",
      cell: ({ row }) => {
        if (!row.original.lastLoginAt) return <span className="text-gray-500">-</span>;
        const date = new Date(row.original.lastLoginAt);
        return (
          <span className="text-gray-600">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UpdateUserDialog
            user={{
              id: row.original.id,
              firstName: row.original.firstName,
              lastName: row.original.lastName,
              isActive: row.original.isActive,
            }}
            trigger={
              <button
                className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
                title="Edit"
              >
                <Pencil1Icon className="h-4 w-4" />
              </button>
            }
          />
          <DeleteUserAlertDialog userId={row.original.id} />
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl">
      <DataTable
        columns={columns}
        data={tableData}
        searchKey="name"
        searchPlaceholder="Search users by name or email"
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        toolbarRight={<AddUserDialog />}
        pageSize={pagination.pageSize}
        isLoading={isLoading}
        manualPagination
        manualSorting
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={(updater) => {
          const nextSorting = typeof updater === "function" ? updater(sorting) : updater;
          setSorting(nextSorting);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        pageCount={usersResponse?.meta.totalPages}
        totalCount={usersResponse?.meta.total}
      />
    </div>
  );
}
