/**
 * Minimal `cn` for the shadcn-style Sparkles component when copied into a
 * Tailwind + clsx + tailwind-merge project, replace this file with:
 * `npx shadcn@latest add` generated `@/lib/utils`.
 */
export function cn(
	...inputs: Array<string | number | false | null | undefined>
): string {
	return inputs.filter(Boolean).join(" ");
}
