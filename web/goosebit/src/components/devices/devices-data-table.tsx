import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { secondsAgoToRecentDate } from "@/lib/date-utils";
import type { Device } from "@/schemas/devices";
import { useDevicesStore } from "@/stores/devices";

interface DevicesDataTableProps {
  data: Device[];
  isLoading?: boolean;
}

export function DevicesDataTable({ data, isLoading }: DevicesDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const {
    selectedDevices,
    selectDevice,
    deselectDevice,
    selectAllDevices,
    clearSelection,
  } = useDevicesStore();

  const columns: ColumnDef<Device>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            if (value) {
              selectAllDevices();
              table.toggleAllPageRowsSelected(true);
            } else {
              clearSelection();
              table.toggleAllPageRowsSelected(false);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedDevices.has(row.original.id)}
          onCheckedChange={(value) => {
            if (value) {
              selectDevice(row.original.id);
            } else {
              deselectDevice(row.original.id);
            }
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("name") || "Unnamed Device"}
        </div>
      ),
    },
    {
      accessorKey: "sw_version",
      header: "SW Version",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("sw_version")}</div>
      ),
    },
    {
      accessorKey: "feed",
      header: "Feed",
      cell: ({ row }) => <div>{row.getValue("feed") || "-"}</div>,
    },
    {
      accessorKey: "last_state",
      header: "State",
      cell: ({ row }) => {
        const state = row.getValue("last_state") as string;
        return (
          <Badge variant={state === "Registered" ? "success" : "secondary"}>
            {state}
          </Badge>
        );
      },
    },
    {
      accessorKey: "update_mode",
      header: "Update Mode",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("update_mode")}</div>
      ),
    },
    {
      accessorKey: "last_ip",
      header: "Last IP",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("last_ip")}</div>
      ),
    },
    {
      accessorKey: "force_update",
      header: "Force Update",
      cell: ({ row }) => {
        const forceUpdate = row.getValue("force_update") as boolean;
        return (
          <div className="flex items-center">
            <div
              className={`size-2 rounded-full ${
                forceUpdate ? "bg-green-500" : "bg-muted-foreground"
              }`}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const progress = row.getValue("progress") as number | null;
        if (progress === null || progress === undefined) {
          return <div>-</div>;
        }
        return (
          <div className="flex items-center gap-2">
            <Progress value={progress} className="w-16" />
            <span className="text-sm">{progress}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "polling",
      header: "Polling Status",
      cell: ({ row }) => {
        const polling = row.getValue("polling") as boolean;
        const pollSeconds = row.original.poll_seconds;
        const lastSeen = row.getValue("last_seen") as number;

        // Consider overdue if last seen is more than 2x the poll interval
        const isOverdue = lastSeen > pollSeconds * 2;

        return (
          <Badge variant={polling && !isOverdue ? "success" : "warning"}>
            {polling && !isOverdue ? "Active" : "Overdue"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "hw_model",
      header: "Hardware",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.getValue("hw_model")} v{row.original.hw_revision}
        </div>
      ),
    },
    {
      accessorKey: "last_seen",
      header: "Last Seen",
      cell: ({ row }) => {
        const lastSeen = row.getValue("last_seen") as number;
        return (
          <div className="text-sm">{secondsAgoToRecentDate(lastSeen)}</div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Loading devices...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
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
                  No devices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
