<!-- BEGIN:repo-agent-rules -->

# mini-competitions Agent Rules

## Project Stack

- Next.js 16 App Router with React 19 and TypeScript strict mode.
- Tailwind CSS v4 is used for styling.
- MongoDB is the primary datastore.
- Better Auth is wired through a custom Mongo adapter.
- ESLint extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.

## High-Level Structure

- `src/app/` is for route composition, layout, metadata, and UI-only components.
- `src/core/domains/` is the domain layer and should stay framework-free.
- `src/core/infrastructures/` contains concrete implementations for repositories and application services.
- `src/lib/` contains shared infrastructure helpers such as Mongo, auth, repository base classes, and application error helpers.

## Domain Layer Rules

- Keep entities as plain classes with behavior only when it belongs to the domain.
- Keep use-case files focused on interfaces and input/output contracts.
- Keep repository contracts in the domain layer and avoid importing MongoDB, Next.js, or auth adapters there.
- Keep Zod schemas in `src/core/domains/schemas/` and export both schemas and inferred base types from the index file.

## Infrastructure Layer Rules

- Put concrete use cases in `src/core/infrastructures/applications/` and concrete repositories in `src/core/infrastructures/repositories/`.
- Repositories should extend the base `Repository` from `src/lib/repository`.
- Repository `create` and `update` methods should preserve the entity pattern used here: generate `id` with `uuid`, set `createdAt` and `updatedAt`, and keep `deletedAt` soft-delete semantics.
- If a repository needs uniqueness, define indexes in the repository constructor and let the shared collection helper create them.

## Shared Utility Rules

- Use the shared Mongo client from `src/lib/client.ts`; do not create ad hoc clients in feature code.
- Keep auth bootstrap in `src/lib/auth.ts` and keep adapter normalization/mapping logic centralized in `src/lib/applications/adapter.ts`.
- Use the shared application helpers in `src/lib/applications/` for `BaseUseCase`, `NotFoundError`, and `throwAppError`.
- Use the shared repository helpers in `src/lib/repository/` for field schemas, `BaseEntity`, `uuid`, and the base repository implementation.

## Next.js Rules

- Treat `src/app/layout.tsx` and `src/app/page.tsx` as composition points, not places for business logic.
- Prefer App Router patterns and consult the Next.js docs under `node_modules/next/dist/docs/` before changing framework-sensitive behavior.
- Keep global CSS minimal: design tokens, base document styles, and Tailwind layer setup belong in `src/app/globals.css`.

## Style Conventions Observed In This Repo

- Use the `@/` import alias for imports from `src/`.
- Keep naming consistent with the existing codebase: PascalCase for classes, camelCase for functions and variables, and lowercase file names with dots where already used.
- Preserve the current formatting style in touched files; avoid unrelated reformatting.
- Prefer small, focused modules over large mixed-purpose files.
- Follow the existing error flow: validate existence before update/delete operations and surface domain-specific not-found errors through `throwAppError`.

## Validation

- Run `npm run lint` after code changes when possible.
- On Windows, if the shell blocks npm execution, use `cmd /c npm.cmd run lint`.
- Use Prettier as the default formatter for code style.
- Run `npm run format` to apply formatting changes.
- Run `npm run format:check` to verify formatting in CI/check-only flows.
- Do not introduce new dependencies unless the change clearly needs them.

<!-- END:repo-agent-rules -->
