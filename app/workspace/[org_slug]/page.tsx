"use client"

import { OrganizationDetails } from "@/components/organization-details"
import { WorkspaceHeader } from "@/components/workspace-header"

export default function WorkspacePage() {
  return (
    <>
      <WorkspaceHeader title="Organization Details" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <OrganizationDetails />
      </div>
    </>
  )
}
