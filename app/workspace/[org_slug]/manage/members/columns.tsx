"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define the membership type based on Clerk's OrganizationMembership structure
export type Membership = {
  id: string
  role: string
  publicUserData?: {
    firstName?: string
    lastName?: string
    imageUrl?: string
    userId?: string
    identifier?: string // email
  }
  publicMetadata?: Record<string, any>
  createdAt: string | Date
  updatedAt?: string | Date
}

export const columns: ColumnDef<Membership>[] = [
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
    id: "avatar",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-muted">
          {row.original.publicUserData?.imageUrl ? (
            <img 
              src={row.original.publicUserData.imageUrl || "https://github.com/shadcn.png"} 
              alt="User avatar" 
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-medium">
              {(row.original.publicUserData?.firstName?.[0] || '') + 
               (row.original.publicUserData?.lastName?.[0] || '')}
            </span>
          )}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "email",
    accessorFn: (row) => row.publicUserData?.identifier || '',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const email = row.original.publicUserData?.identifier
      
      return (
        <div className="flex flex-col">
          <span className="font-medium">{email || "—"}</span>
        </div>
      )
    },
  },
  {
    id: "name",
    accessorFn: (row) => `${row.publicUserData?.firstName || ''} ${row.publicUserData?.lastName || ''}`.trim(),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Full Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const firstName = row.original.publicUserData?.firstName || ""
      const lastName = row.original.publicUserData?.lastName || ""
      
      if (!firstName && !lastName) return "—"
      
      return `${firstName} ${lastName}`.trim()
    },
  },
  {
    accessorKey: "role",
    header: () => <div className="text-left">Role</div>,
    cell: ({ row }) => {
      const role: string = row.getValue("role")
      return (
        <div className="text-left">
          <Badge 
            variant={
              role == "admin" ? "default" : 
              role == "member" ? "outline" : 
              "secondary"
            }
            className="capitalize"
          >
            {role}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      // Format the date safely
      try {
        const dateValue = row.getValue("createdAt");
        const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
        }).format(date instanceof Date ? date : new Date());
        return <div>{formattedDate}</div>;
      } catch (error) {
        // Fallback if date parsing fails
        return <div>Unknown</div>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const member = row.original
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(member.id)}
            >
              Copy member ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Change role</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Remove member</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
