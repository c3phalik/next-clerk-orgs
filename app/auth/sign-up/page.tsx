"use client"

import { SignUp } from "@clerk/nextjs"
import Image from "next/image"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 py-12">
      <div className="mb-8">
        <Image
          src="/next.svg"
          alt="Logo"
          width={120}
          height={30}
          className="dark:invert"
          priority
        />
      </div>
      
      
        <div className="p-4">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-0 border-0 bg-transparent",
                header: "text-center",
                footer: "text-center",
              },
            }}
            routing="path"
            path="/auth/sign-up"
            signInUrl="/auth/sign-in"
            forceRedirectUrl="/workspace/workspace-selector"
          />
        </div>
      
    </div>
  )
}
