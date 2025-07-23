'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

export async function getOrgDetails(opts: { organizationId?: string } = {}) {
  const { userId, orgId: activeOrgId } = await auth();
  if (!userId) throw new Error('You must be signed in');

  const organizationId = opts.organizationId ?? activeOrgId;
  if (!organizationId) throw new Error('No active organization. Pass organizationId or set one active.');

  // FIX: await the promise
  const clerk = await clerkClient();

  // Get organization details
  const organization = await clerk.organizations.getOrganization({
    organizationId,
  });

  return { organization };
}

export async function verifyOrgAdmin() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return false;
  
  // FIX: await the promise
  const clerk = await clerkClient();

  // Get membership to check role
  try {
    // Get all memberships and find the one for this user
    const membershipList = await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });
    
    const membership = membershipList.data.find(m => m.publicUserData?.userId === userId);
    if (!membership) return false;
    
    return membership.role.includes('admin');
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function updateOrgDetails(organizationId: string, data: {
  name?: string;
  slug?: string;
  publicMetadata?: Record<string, any>;
}) {
  const isAdmin = await verifyOrgAdmin();
  if (!isAdmin) throw new Error('You must be an admin to update organization details');

  // FIX: await the promise
  const clerk = await clerkClient();

  // Update organization
  const updatedOrg = await clerk.organizations.updateOrganization(
    organizationId,
    data
  );

  return { organization: updatedOrg };
}
