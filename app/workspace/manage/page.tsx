
import { OrganizationProfile } from '@clerk/nextjs'
import { WorkspaceHeader } from "@/components/workspace-header"

export default function OrganizationProfilePage() {
    return (
      <div className="flex flex-col w-full">
        <WorkspaceHeader title="Organization Profile" />
        <div className="flex-1 w-full">
          <OrganizationProfile
            appearance={{
              elements: {
                rootBox: "flex-1 w-full max-w-none rounded-none",
                cardBox: "w-full h-[calc(100vh-64px)] max-w-none rounded-none",
                navbar: "w-full max-w-none rounded-none"
              },
            }}
          />
        </div>
      </div>
    );
  }