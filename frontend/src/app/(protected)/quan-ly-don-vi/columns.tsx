import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import { Location } from "@/types/locations";

export const getLocationColumns = (
  onEdit: (location: Location) => void
): ColumnDef<Location>[] => {
  const columns: ColumnDef<Location>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "btlhcm_dv_madv",
      header: "STT",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "btlhcm_dv_tendv",
      header: "Tên đơn vị",
    },
    {
      accessorKey: "btlhcm_dv_diachi",
      header: "Địa chỉ",
    },
    {
      accessorKey: "btlhcm_px_tenpx",
      header: "Phường/xã",
    },
    {
      accessorKey: "btlhcm_tt_tentt",
      header: "Tỉnh/thành",
    },
    {
      accessorKey: "btlhcm_qk_tenqk",
      header: "Quân khu",
    },
    {
      accessorKey: "btlhcm_dv_ngaytao",
      header: "Ngày tạo",
      cell: ({ row }) =>
        formatDate(row.getValue("btlhcm_dv_ngaytao") as string),
    },
    {
      accessorKey: "btlhcm_dv_ngaycapnhat",
      header: "Ngày cập nhật",
      cell: ({ row }) =>
        formatDate(row.getValue("btlhcm_dv_ngaycapnhat") as string),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const location = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(location)}>
                Chỉnh sửa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
