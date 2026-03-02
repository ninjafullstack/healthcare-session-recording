# Next.js Project with Bun

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), using [Bun](https://bun.sh/) as the package manager. This project uses TypeScript, ESLint, and Tailwind CSS.

## Getting Started

First, ensure you have Bun installed. If not, you can install it by following the instructions on the [official Bun website](https://bun.sh/).

Then, run the development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimise and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Using Bun

Bun is a fast all-in-one JavaScript runtime and toolkit. Here are some common commands:

- Install dependencies: `bun install`
- Add a new package: `bun add package-name`
- Remove a package: `bun remove package-name`
- Run scripts: `bun run script-name`

## Deployment

To build the application for production, run:
```bash
bun run build
```

You can then start the production server with:
```bash
bun start
```

For more information on deployment, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Naming Conventions

This project follows consistent naming conventions across different parts of the application:

### Frontend (JavaScript/TypeScript)

- **Components**: Use PascalCase for component names and filenames (e.g., `UserProfile.tsx`, `NavBar.tsx`)
- **Variables and Functions**: Use camelCase (e.g., `userId`, `formatDate`)
- **Constants**: Use UPPER_CASE (e.g., `MAX_ATTEMPTS`, `API_URL`)
- **Page Files and Directories**: Use kebab-case in the `app` folder (e.g., `about-us/page.tsx`, `user-profile/page.tsx`)
- **Layout Files**: Use lowercase `layout.tsx`
- **Special Files**: Use lowercase for files like `loading.tsx`, `error.tsx`, `not-found.tsx`
- **Route Handlers**: Use lowercase `route.ts` or `route.js` for API route handlers
- **Utilities and Hooks**: Use camelCase (e.g., `useAuth.ts`, `formatDate.ts`)
- **Interfaces and Types**: Use PascalCase (e.g., `User`, `ApiResponse`)

### Backend (Python)

- **Variables and Functions**: Use snake_case (e.g., `user_id`, `format_date`)
- **Constants**: Use UPPER_CASE (e.g., `MAX_ATTEMPTS`, `API_URL`)
- **Classes**: Use PascalCase (e.g., `UserProfile`)

### Firebase and API Responses

- **Firestore Field Names**: Use camelCase to match JavaScript conventions
- **API Response Fields**: Use camelCase for consistency with JavaScript clients

These conventions help maintain consistency across the project and align with common practices in each language and framework.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Branch Structure

This project follows the Git Flow workflow, which helps manage feature development, bug fixes, and releases in a structured manner. Below is the branch structure we use:

- **main**: The main branch contains the production-ready code. It is always stable and reflects the latest release.

- **develop**: The develop branch is where the latest development changes are integrated. It contains the most recent features and bug fixes that are ready for testing.

  - **feature/add-user-login**: Feature branches are used to develop new features. They branch off from develop and are merged back into develop once the feature is complete.

  - **bugfix/template-dialog**: Bugfix branches are used to fix bugs. They also branch off from develop and are merged back into develop after the fix is complete.
  
    - **bugfix/template-dialog-extra-space**: Sub-branches can be created for more granular bug fixes or improvements related to a specific bugfix branch.

  - **chore/update-ci-config**: Chore branches are used for maintenance tasks, such as updating configurations or dependencies.

  - **refactor/improve-auth-logic**: Refactor branches are used to improve or restructure existing code without changing its functionality.

  - **feature/add-analytics**: Another example of a feature branch for adding new functionality.

- **hotfix/fix-critical-issue**: Hotfix branches are used to quickly address critical issues in the main branch. They branch off from main and are merged back into both main and develop after the fix.

This structure allows for organised and efficient development, ensuring that new features and fixes are properly tested before being released.

# healthcare-session-recording
# healthcare-session-recording
