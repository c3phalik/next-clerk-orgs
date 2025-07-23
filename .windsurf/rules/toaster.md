---
trigger: glob
globs: *.tsx
---

Import toaster from sonner & add to the root Layout.

import { Toaster } from "@/components/ui/sonner"

Example:
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}

Usage:
toast("Event has been created.")