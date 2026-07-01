export function emptyStringToUndefined(value: unknown): unknown {
  if (value === '' || value === 'null' || value === null) return undefined;
  return value;
}

export function digitsOnly(value: unknown): unknown {
  if (value === undefined || value === null) return value;
  if (
    typeof value !== 'string' &&
    typeof value !== 'number' &&
    typeof value !== 'boolean' &&
    typeof value !== 'bigint'
  ) {
    return value;
  }
  return String(value).replace(/\D/g, '');
}

export function optionalDigitsOnly(value: unknown): unknown {
  const normalized = digitsOnly(value);
  if (normalized === '') return undefined;
  return normalized;
}

export function optionalNumber(value: unknown): unknown {
  const normalized = emptyStringToUndefined(value);
  if (normalized === undefined) return undefined;
  return Number(normalized);
}

export function nullableNumber(value: unknown): unknown {
  if (value === '' || value === 'null' || value === null) return null;
  if (value === undefined) return undefined;
  return Number(value);
}

export function optionalBoolean(value: unknown): unknown {
  const normalized = emptyStringToUndefined(value);
  if (normalized === undefined) return undefined;
  if (typeof normalized === 'boolean') return normalized;
  return normalized === 'true';
}

export function trimString(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return value.trim();
}

export function optionalTrimmedString(value: unknown): unknown {
  return emptyStringToUndefined(trimString(value));
}

export function lowercaseEmail(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return value.trim().toLowerCase();
}

export function optionalLowercaseEmail(value: unknown): unknown {
  const normalized = optionalTrimmedString(value);
  if (typeof normalized !== 'string') return normalized;
  return normalized.toLowerCase();
}

export function uppercaseString(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return value.trim().toUpperCase();
}
