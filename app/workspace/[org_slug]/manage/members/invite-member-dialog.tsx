"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { inviteMember } from "@/app/actions/organizations/invite-member"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

// Define the form schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["org:admin", "org:member"]),
})

type InviteMemberFormValues = z.infer<typeof formSchema>

export function InviteMemberDialog({ orgId }: { orgId?: string }) {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()
  const { user } = useUser()

  // Initialize the form with react-hook-form
  const form = useForm<InviteMemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "org:member",
    },
  })

  // Handle form submission
  async function onSubmit(data: InviteMemberFormValues) {
    setIsSubmitting(true)

    try {
      // Create a FormData object
      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("role", data.role)
      
      if (orgId) {
        formData.append("organizationId", orgId)
      }
      
      // Add the current user's ID as the inviter
      if (user?.id) {
        formData.append("inviterUserId", user.id)
      }

      // Call the server action
      const result = await inviteMember(formData)

      if (result.success) {
        toast.success(result.message)
        form.reset()
        setOpen(false)
        // Refresh the page to show the updated list
        router.refresh()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite Member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Invite a new member</DialogTitle>
              <DialogDescription>
                Send an invitation email to add a new member to this organization.
                They'll receive instructions on how to join.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="org:member">Member</SelectItem>
                        <SelectItem value="org:admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
