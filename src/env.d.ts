declare const __KP_CANONICAL_ORIGIN__: string;
declare const __KP_INDEXABLE__: boolean;

declare module '*/urls.mjs' {
	export const PRODUCTION_ORIGIN: string;
	export function normaliseBase(base?: string): string;
	export function normaliseOrigin(origin?: string): string;
	export function stripBase(pathname: string, base?: string): string;
	export function canonicalFor(pathname: string, options?: { origin?: string; base?: string; hash?: string }): string;
	export function isCanonicalDeployment(options: { site: string; base: string; origin?: string }): boolean;
}
