const MAX_DEPTH = 3;
const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'email',
  'document',
  'cpf',
  'cnpj',
  'code',
  'verificationCode',
]);

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function maskString(value: string, key?: string): string {
  if (key && key.toLowerCase().includes('email')) {
    const [local, domain] = value.split('@');
    if (!domain) {
      return '***';
    }
    const safeLocal =
      local.length <= 2 ? '*' : `${local[0]}***${local[local.length - 1]}`;
    return `${safeLocal}@${domain}`;
  }

  if (value.length <= 4) {
    return '***';
  }

  return `${value.slice(0, 3)}***${value.slice(-2)}`;
}

function sanitizeObject(
  value: Record<string, unknown>,
  depth: number,
): Record<string, unknown> {
  const output: Record<string, unknown> = {};

  Object.entries(value).forEach(([key, entry]) => {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(key) || SENSITIVE_KEYS.has(lowerKey)) {
      output[key] = typeof entry === 'string' ? maskString(entry, key) : '***';
      return;
    }

    output[key] = sanitizeLogData(entry, depth + 1, key);
  });

  return output;
}

export function sanitizeLogData(
  value: unknown,
  depth = 0,
  key?: string,
): unknown {
  if (depth > MAX_DEPTH) {
    return '[MaxDepth]';
  }

  if (value === null || value === undefined) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
    };
  }

  if (typeof value === 'string') {
    if (
      (key && SENSITIVE_KEYS.has(key.toLowerCase())) ||
      EMAIL_REGEX.test(value)
    ) {
      return maskString(value, key);
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeLogData(entry, depth + 1, key));
  }

  if (typeof value === 'object') {
    return sanitizeObject(value as Record<string, unknown>, depth);
  }

  return value;
}

export function toLogString(value: unknown): string {
  try {
    return JSON.stringify(sanitizeLogData(value));
  } catch {
    return String(value);
  }
}
