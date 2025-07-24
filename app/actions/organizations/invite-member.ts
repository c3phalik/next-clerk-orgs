'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { z } from 'zod';

// Define the input schema for validation
const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['org:admin', 'org:member']).default('org:member'),
  organizationId: z.string().optional(),
  inviterUserId: z.string().optional(),
});

export type InviteMemberResult = {
  success: boolean;
  message: string;
  invitation?: any;
  error?: any;
};

export async function inviteMember(formData: FormData): Promise<InviteMemberResult> {
  const { userId, orgId: activeOrgId, orgRole } = await auth();
  
  // Validate user is authenticated and is an admin
  if (!userId) {
    return {
      success: false,
      message: 'You must be signed in to invite members',
    };
  }

  if (!activeOrgId) {
    return {
      success: false,
      message: 'No active organization selected',
    };
  }

  // Only org admins can invite members
  if (orgRole !== 'org:admin') {
    return {
      success: false,
      message: 'Only organization admins can invite members',
    };
  }

  try {
    // Parse and validate input
    const rawInput = {
      email: formData.get('email'),
      role: formData.get('role'),
      organizationId: formData.get('organizationId') || activeOrgId,
      inviterUserId: formData.get('inviterUserId') || userId,
    };

    const validatedInput = inviteSchema.parse(rawInput);
    const organizationId = validatedInput.organizationId || activeOrgId;

    // Create invitation with Clerk API
    const clerk = await clerkClient();
    
    console.log("ORganization ID:",organizationId)
    console.log("Invited Role:",validatedInput.role)
    console.log("Invited Email:",validatedInput.email)
    console.log("Invited Inviter ID:",validatedInput.inviterUserId)
    const invitation = await clerk.organizations.createOrganizationInvitation({
      organizationId,
      emailAddress: validatedInput.email,
      role: validatedInput.role,
      redirectUrl: `${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/workspace/workspace-selector'}`,
      inviterUserId: validatedInput.inviterUserId,
    });

    // Extract only the needed properties to create a plain JavaScript object
    const serializedInvitation = {
      id: invitation.id,
      emailAddress: invitation.emailAddress,
      role: invitation.role,
      organizationId: invitation.organizationId,
      status: invitation.status,
      createdAt: invitation.createdAt,
      expiresAt: invitation.expiresAt,
    };

    return {
      success: true,
      message: `Successfully invited ${validatedInput.email} to the organization`,
      invitation: serializedInvitation,
    };
  } catch (error) {
    console.error('Failed to invite member:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to invite member',
      error,
    };
  }
}
