import { OrganizationList } from "@clerk/nextjs"
import { WorkspaceHeader } from "@/components/workspace-header"

export default function WorkspaceSelectorPage() {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <OrganizationList />
      </div>
    );
  }
  