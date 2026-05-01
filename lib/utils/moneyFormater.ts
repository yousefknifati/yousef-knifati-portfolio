export type MoneyFormatOptions = {
  locale?: string;
  currency?: string;
  currencyDisplay?: "symbol" | "narrowSymbol" | "code" | "name";
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  notation?: "standard" | "compact";
  compactDisplay?: "short" | "long";
  signDisplay?: "auto" | "never" | "always" | "exceptZero";
};

const nfCache = new Map<string, Intl.NumberFormat>();

function getNumberFormatter(options: Required<MoneyFormatOptions>) {
  const key = JSON.stringify(options);
  const cached = nfCache.get(key);
  if (cached) return cached;

  const nf = new Intl.NumberFormat(options.locale, {
    style: "currency",
    currency: options.currency,
    currencyDisplay: options.currencyDisplay,
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
    notation: options.notation,
    compactDisplay: options.compactDisplay,
    signDisplay: options.signDisplay,
  });

  nfCache.set(key, nf);
  return nf;
}

export function formatMoney(
  value: number | null | undefined,
  opts: MoneyFormatOptions = {}
) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "-";

  const options: Required<MoneyFormatOptions> = {
    locale: opts.locale ?? "en-US",
    currency: opts.currency ?? "USD",
    currencyDisplay: opts.currencyDisplay ?? "symbol",
    minimumFractionDigits: opts.minimumFractionDigits ?? 0,
    maximumFractionDigits: opts.maximumFractionDigits ?? 0,
    notation: opts.notation ?? "standard",
    compactDisplay: opts.compactDisplay ?? "short",
    signDisplay: opts.signDisplay ?? "auto",
  };

  return getNumberFormatter(options).format(value);
}

export function formatMoneyRange(
  from: number | null | undefined,
  to: number | null | undefined,
  opts: MoneyFormatOptions = {}
) {
  const left = formatMoney(from, opts);
  const right = formatMoney(to, opts);

  if (left === "-" && right === "-") return "-";
  if (left === "-") return `Up to ${right}`;
  if (right === "-") return `From ${left}`;
  return `${left} - ${right}`;
}
