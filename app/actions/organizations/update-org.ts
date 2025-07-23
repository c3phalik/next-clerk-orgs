'use server'

import { redirect } from "next/navigation"
import { clerkClient } from "@clerk/nextjs/server"
import { auth } from "@clerk/nextjs/server"

type UpdateOrgParams = {
  name?: string
  publicMetadata?: Record<string, any>
}

type UpdateOrgResponse = {
  success: boolean
  message: string
}

/**
 * Updates organization details
 * 
 * @param orgId Organization ID
 * @param data Update data including name, slug, and publicMetadata
 * @param currentSlug Current organization slug (for redirect purposes)
 */
export async function updateOrganization(formData: FormData): Promise<UpdateOrgResponse> {
  // Get organization ID from form data, with fallback to auth session
  let orgId = formData.get("orgId") as string
  
  // If no orgId in form data, try to get it from the auth session (backwards compatibility)
  if (!orgId) {
    const session = await auth()
    orgId = session.orgId as string
  }
  
  if (!orgId) {
    console.error("No organization ID provided")
    return { success: false, message: "No organization ID provided" }
  }
  
  // Get form data
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const logoUrl = formData.get("logoUrl") as string
  const website = formData.get("website") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const currentSlug = formData.get("currentSlug") as string
  
  // Prepare update data
  const updateData: UpdateOrgParams = {
    name,
    publicMetadata: {
      description,
      logoUrl,
      website,
      email,
      phone,
      address
    }
  }

  try {
    // Update organization with Clerk API
    const clerk = await clerkClient()
    await clerk.organizations.updateOrganization(orgId, updateData)
    
    // Return success response
    return { 
      success: true, 
      message: "Organization settings updated successfully" 
    }
  } catch (error) {
    console.error("Error updating organization:", error)
    // Return error response with helpful message
    return { 
      success: false, 
      message: `Failed to update organization: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }
  }
}
