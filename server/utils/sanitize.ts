import xss from "xss";

const xssOptions = {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style"],
};

export function sanitizeString(input: string | null | undefined): string | null {
  if (input === null || input === undefined) {
    return null;
  }
  return xss(input.trim(), xssOptions);
}

export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  stringFields: (keyof T)[]
): T {
  const result = { ...obj };
  for (const field of stringFields) {
    if (typeof result[field] === "string") {
      result[field] = sanitizeString(result[field] as string) as T[keyof T];
    }
  }
  return result;
}
