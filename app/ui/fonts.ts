/**
 * Heatwave Hub brand typography (Brand Guidelines 2026, p.05).
 *
 * Arial / Regular - Medium - Bold.
 *
 * Arial is a system typeface that ships with Windows and macOS and is not
 * licensed for self-hosting, so the brand face is referenced through a font
 * stack instead of being downloaded as a webfont. `font-arial` is defined in
 * `tailwind.config.ts` and is also applied as the document default in
 * `app/ui/global.css`.
 *
 * Note: Arial has no true Medium weight, so `font-medium` (500) falls back to
 * Regular in most browsers. Use Regular or Bold for weight contrast.
 */
export const arial = {
  className: "font-arial",
} as const;
