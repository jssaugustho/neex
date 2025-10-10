export type PlanUnit = "WEEKLY" | "MONTHLY" | "YEARLY";

/** Soma 1 semana (ou mais) em UTC */
export function addWeeksUTC(base: Date, weeks = 1): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + 7 * weeks);
  return d;
}

/** Soma 1 mês (ou mais) em UTC, respeitando 31/30/29/28 */
export function addMonthsUTC(base: Date, months = 1): Date {
  return new Date(
    Date.UTC(
      base.getUTCFullYear(),
      base.getUTCMonth() + months,
      base.getUTCDate(),
      base.getUTCHours(),
      base.getUTCMinutes(),
      base.getUTCSeconds(),
      base.getUTCMilliseconds(),
    ),
  );
}

/** Soma 1 ano (ou mais) em UTC (29/fev → 28 se necessário) */
export function addYearsUTC(base: Date, years = 1): Date {
  return new Date(
    Date.UTC(
      base.getUTCFullYear() + years,
      base.getUTCMonth(),
      base.getUTCDate(),
      base.getUTCHours(),
      base.getUTCMinutes(),
      base.getUTCSeconds(),
      base.getUTCMilliseconds(),
    ),
  );
}

/** (Opcional) Ajusta para expirar no fim do dia UTC */
export function endOfDayUTC(d: Date): Date {
  const e = new Date(d);
  e.setUTCHours(23, 59, 59, 999);
  return e;
}

/** Calcula a próxima expiração a partir de uma data base, dado o tipo e intervalo */
export function computeExpiryUTC(
  startAt: Date,
  unit: PlanUnit,
  interval = 1,
  options?: { endOfDay?: boolean },
): Date {
  let next: Date;
  switch (unit) {
    case "WEEKLY":
      next = addWeeksUTC(startAt, interval);
      break;
    case "MONTHLY":
      next = addMonthsUTC(startAt, interval);
      break;
    case "YEARLY":
      next = addYearsUTC(startAt, interval);
      break;
    default:
      next = addMonthsUTC(startAt, 1);
      break;
  }
  return options?.endOfDay ? endOfDayUTC(next) : next;
}

/**
 * Retorna se a assinatura está expirada.
 * - expired = nowUTC >= expiresAt
 * - graceMs: milissegundos extras de tolerância (opcional)
 */
export function isExpired(
  expiresAt: Date | null | undefined,
  graceMs = 0,
): boolean {
  if (!expiresAt) return true; // sem expiração salva = trate como expirado
  const now = Date.now();
  return now >= new Date(expiresAt).getTime() + graceMs;
}

/**
 * Útil para renovação: decide a data base para "empilhar" tempo.
 * Se já está ativa, soma a partir do expiresAt; senão, a partir de agora.
 */
export function renewalBase(expiresAt: Date | null | undefined): Date {
  const now = new Date();
  if (expiresAt && new Date(expiresAt).getTime() > now.getTime()) {
    return new Date(expiresAt);
  }
  return now;
}
