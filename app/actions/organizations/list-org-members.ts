// src/actions/list-org-members.ts
'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

type ListOpts = {
  organizationId?: string;
  limit?: number;
  offset?: number;
  query?: string;
  role?: string[];
  emailAddressQuery?: string;
  orderBy?:
    | '+created_at' | '-created_at'
    | '+email_address' | '-email_address'
    | '+first_name' | '-first_name'
    | '+last_name' | '-last_name'
    | '+username' | '-username'
    | '+phone_number' | '-phone_number';
};

export async function listOrgMembers(opts: ListOpts = {}) {
  const { userId, orgId: activeOrgId } = await auth();
  if (!userId) throw new Error('You must be signed in');

  const organizationId = opts.organizationId ?? activeOrgId;
  if (!organizationId) throw new Error('No active organization. Pass organizationId or set one active.');

  // FIX: await the promise
  const clerk = await clerkClient();

  const { data, totalCount } =
    await clerk.organizations.getOrganizationMembershipList({
      organizationId,
      limit: opts.limit ?? 25,
      offset: opts.offset ?? 0,
      query: opts.query,
      role: opts.role,
      emailAddressQuery: opts.emailAddressQuery,
      orderBy: opts.orderBy,
    });

  return { memberships: data, totalCount };
}
