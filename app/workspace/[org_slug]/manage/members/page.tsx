import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { columns, Membership } from "./columns"
import { DataTable } from "./data-table"
import { WorkspaceHeader } from "@/components/workspace-header"
import { listOrgMembers } from "@/app/actions/organizations/list-org-members"
type SearchParams = { [key: string]: string | string[] | undefined }

export default async function MembersPage({
  params,
  searchParams,
}: {
  params: Promise<{ org_slug: string }>
  searchParams: Promise<SearchParams>
}) {
  const { org_slug } = await params

  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    redirect("/auth/sign-in")
  }

  try {
    // Get pagination parameters from search params
    const page = Number((await searchParams).page) || 0
    const pageSize = Number((await searchParams).pageSize) || 10
    const limit = pageSize
    const offset = page * pageSize

    // Fetch members from our server action with pagination
    const { memberships, totalCount } = await listOrgMembers({
      limit,
      offset,
    })

    const transformedMembers: Membership[] = memberships.map((membership) => {
      const publicUserData = membership.publicUserData
        ? {
            firstName: membership.publicUserData.firstName || "",
            lastName: membership.publicUserData.lastName || "",
            imageUrl: membership.publicUserData.imageUrl || "",
            userId: membership.publicUserData.userId || "",
            identifier: membership.publicUserData.identifier || "",
          }
        : {}

      const createdAt =
        typeof membership.createdAt === "number"
          ? new Date(membership.createdAt).toISOString()
          : String(membership.createdAt || "")

      return {
        id: membership.id,
        role: membership.role,
        publicUserData,
        publicMetadata: membership.publicMetadata ? { ...membership.publicMetadata } : {},
        createdAt,
        updatedAt:
          typeof membership.updatedAt === "number"
            ? new Date(membership.updatedAt).toISOString()
            : String(membership.updatedAt || ""),
      }
    })

    return (
      <>
        <WorkspaceHeader
          title="Members"
          parentHref={`/workspace/${org_slug}`}
          parentLabel="Workspace"
        />
        <div className="container py-6 px-6">
          <h1 className="mb-8 text-3xl font-bold">Manage Organization Members</h1>
          <p className="mb-4 text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? "member" : "members"} in this organization
          </p>
          <DataTable columns={columns} data={transformedMembers} totalCount={totalCount} orgId={orgId} />
        </div>
      </>
    )
  } catch (error) {
    console.error("Error loading members:", error)
    return (
      <>
        <WorkspaceHeader
          title="Members"
          parentHref={`/workspace/${org_slug}`}
          parentLabel="Workspace"
        />
        <div className="container py-6">
          <h1 className="mb-8 text-3xl font-bold">Manage Organization Members</h1>
          <div className="rounded-md bg-destructive/10 p-4 text-destructive">
            Error loading members. Please try again later.
          </div>
        </div>
      </>
    )
  }
}
