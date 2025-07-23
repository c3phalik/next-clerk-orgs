// app/workspace/[org_slug]/manage/settings/page.tsx
import { redirect } from "next/navigation";
import { WorkspaceHeader } from "@/components/workspace-header";
import { SettingsForm } from "./settings-form";
import { auth } from "@clerk/nextjs/server";
import { verifyOrgAdmin } from "@/app/actions/organizations/get-org-details";

// Option A: await the Promise (recommended)
export default async function SettingsPage({
  params,
}: {
  params: Promise<{ org_slug: string }>;
}) {
  const { org_slug } = await params;

  const { userId, orgId } = await auth();
  if (!userId) {
    redirect("/auth/sign-in");
  }

  // If your admin check needs orgId or slug, pass it explicitly
  const isAdmin = await verifyOrgAdmin();
  if (!isAdmin) {
    redirect(`/workspace/${org_slug}`);
  }

  return (
    <>
      <WorkspaceHeader
        title="Settings"
        parentHref={`/workspace/${org_slug}`}
        parentLabel="Workspace"
      />
      <div className="container py-6 space-y-8 px-6">
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <SettingsForm orgId={orgId!} currentSlug={org_slug} />
      </div>
    </>
  );
}
