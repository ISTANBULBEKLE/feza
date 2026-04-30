type Falsy = false | 0 | "" | null | undefined;

export function cx(...parts: Array<string | Falsy>): string {
  return parts.filter(Boolean).join(" ");
}
