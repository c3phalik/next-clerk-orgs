# Next.js Clerk Workspace Application

A modern Next.js application using Clerk for authentication and organization management. This application includes features for workspace management, member invitations, and user profiles.

## Prerequisites

- Node.js 18.17.0 or later
- npm, yarn, or pnpm
- A Clerk account (https://clerk.dev)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd next-clerk
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Clerk

1. Sign up for a Clerk account at https://clerk.dev
2. Create a new application in the Clerk Dashboard
3. **Important**: Enable Organizations in your Clerk application settings
   - Go to the Clerk Dashboard
   - Navigate to your application
   - Go to "Settings" > "Organizations"
   - Enable the Organizations feature
4. Configure the JWT template to include organization roles and permissions

### 4. Configure environment variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/workspace
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/workspace
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Features

- User authentication with Clerk
- Organization/workspace management
- Member invitations and management
- Role-based access control
- Modern UI with ShadCN components

## Key Technologies

- Next.js 14+ (App Router)
- React 18+
- Clerk Authentication
- ShadCN UI Components
- Tailwind CSS
- TypeScript

## Workspace Management

This application leverages Clerk's Organizations feature for workspace management. Users can:

- Create new workspaces
- Invite members to workspaces
- Manage workspace settings and members
- Switch between different workspaces

## Development

### Branch Structure

- `main`: Production-ready code
- `dev`: Development branch
- Feature branches: Created for specific features

### Adding New Features

1. Create a new branch from `dev`
2. Implement your feature
3. Create a pull request to merge back into `dev`

## Deployment

The application can be deployed on Vercel or any other platform that supports Next.js applications.

```bash
npm run build
```

## Additional Resources

- [Clerk Documentation](https://clerk.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [ShadCN UI](https://ui.shadcn.com/)
