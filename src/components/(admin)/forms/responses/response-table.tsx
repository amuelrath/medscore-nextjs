"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EYE_BLINK from "public/icons/wired-flat-69-eye.json";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { ResponseColumn } from "@/db/types";
import { useFormValues } from "@/providers/form-values-provider";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Player } from "@lottiefiles/react-lottie-player";

export function ResponseTable() {
  const { form } = useFormValues();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const query = trpc.forms.responses.useSuspenseQuery({ formId: form.id });
  const { columns: columnsData } = query[1].data;
  const sortedColumnsData = columnsData.sort((a, b) => {
    const dateA = new Date(a.createdAt as string);
    const dateB = new Date(b.createdAt as string);
    return dateB.getTime() - dateA.getTime();
  });

  const columns: ColumnDef<ResponseColumn>[] = [
    {
      accessorKey: "creatorFullName",
      header: () => "Evaluator",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "evaluateeFullName",
      header: () => "Evaluatee",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "createdAt",
      header: () => "Submission Time",
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
      },
    },
  ];

  const table = useReactTable({
    data: sortedColumnsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    globalFilterFn: (row, columnId, value) => {
      return Object.entries(row.original)
        .filter(([key]) => !["deletedAt"].includes(key))
        .some(([key, cellValue]) =>
          cellValue?.toString().toLowerCase().includes(value.toLowerCase()),
        );
    },
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      pagination: { pageSize: 4 }
    },
  });

  return (
    <div className={cn("h-96 relative")} >
      <div className="flex justify-between pb-4 items-center">
        <h3 className={cn("text-xl font-bold")}>
          Recent Responses
        </h3>
        <Input
          placeholder="Search Responses..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm xs:w-1/2"
        />
      </div>
      <div className="rounded-md border">
        <Table className={cn("")}>
          <TableHeader className={cn("")}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={cn("font-poppins font-bold")}
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Player
                    src={EYE_BLINK}
                    loop
                    autoplay
                    speed={0.7}
                    className={cn("size-24 drop-shadow-lg")}
                  />
                  No Responses Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className={cn("absolute bottom-0 right-0 xs:-bottom-2")} >
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      </div>
    </div>
  );
}
