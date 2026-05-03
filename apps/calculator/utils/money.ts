export function toCents(amount: number): number {
  if (!Number.isFinite(amount)) {
    return 0;
  }

  return Math.round(amount * 100);
}

export function fromCents(cents: number): number {
  if (!Number.isFinite(cents)) {
    return 0;
  }

  return cents / 100;
}

export function multiplyDollars(amount: number, multiplier: number): number {
  const amountInCents = toCents(amount);
  if (!Number.isFinite(multiplier)) {
    return fromCents(amountInCents);
  }

  return fromCents(Math.round(amountInCents * multiplier));
}
