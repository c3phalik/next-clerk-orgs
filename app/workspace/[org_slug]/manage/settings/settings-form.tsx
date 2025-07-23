'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Building2, Image, Mail, MapPin, Phone, Loader } from "lucide-react"
import { useOrganization } from '@clerk/nextjs'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateOrganization } from "@/app/actions/organizations/update-org"

type SettingsFormProps = {
  orgId: string;
  currentSlug: string; // Still need this for redirect purposes
}

export function SettingsForm({ orgId, currentSlug }: SettingsFormProps) {
  const { organization, isLoaded } = useOrganization()
  
  // Helper function to safely access organization metadata fields
  const getMetadata = (key: string): string => {
    if (!organization || !organization.publicMetadata) return '';
    const metadata = organization.publicMetadata as Record<string, unknown>;
    return (metadata[key] as string) || '';  
  }
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    // Add the orgId to the form data for more explicit identification
    formData.append('orgId', orgId)
    
    try {
      const result = await updateOrganization(formData)
      
      if (result.success) {
        toast.success(result.message || 'Organization settings updated')
      } else {
        toast.error(result.message || 'Failed to update settings')
      }
    } catch (error) {
      toast.error('Failed to update settings: Network or server error')
      console.error('Error updating organization:', error)
    }
  }
  
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-lg">Loading organization details...</span>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Organization not found</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Hidden field to pass current slug for redirect purposes */}
      <input type="hidden" name="currentSlug" value={currentSlug} />
      
      {/* Header with save button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold sr-only">Organization Details</h2>
        <Button type="submit" className="ml-auto">Save Changes</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your organization's basic information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Organization Name*</Label>
                <Input 
                  id="name" 
                  name="name"
                  defaultValue={organization?.name || ''} 
                  required 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  defaultValue={getMetadata('description')}
                  placeholder="Describe your organization"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Branding & Identity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Branding</CardTitle>
            <CardDescription>
              Customize your organization's brand identity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="logoUrl" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Logo URL
                </Label>
                <Input 
                  id="logoUrl" 
                  name="logoUrl"
                  type="url"
                  defaultValue={getMetadata('logoUrl')} 
                  placeholder="https://example.com/logo.png" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Update your organization's contact details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input 
                  id="phone" 
                  name="phone"
                  type="tel"
                  defaultValue={getMetadata('phone')} 
                  placeholder="+1 (555) 123-4567" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  defaultValue={getMetadata('email')} 
                  placeholder="org@example.com" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Textarea 
                  id="address" 
                  name="address"
                  defaultValue={getMetadata('address')}
                  placeholder="123 Main St, City, State, ZIP"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Danger Zone Card */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Destructive actions that cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Deleting your organization will permanently remove all associated data, members, and settings.
              This action cannot be undone.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              type="button"
              disabled
            >
              Delete Organization
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
