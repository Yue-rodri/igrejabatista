import { format, isSameDay, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Converte uma string de data ISO (ex: "2026-11-19T00:00:00.000Z" ou "2026-11-19")
 * para um objeto Date no fuso horário local (evitando o recuo de 1 dia no UTC-3).
 */
export function parseLocalDate(dateInput) {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate());
  }
  const str = String(dateInput);
  const datePart = str.split("T")[0];
  const parts = datePart.split("-").map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    const [year, month, day] = parts;
    return new Date(year, month - 1, day);
  }
  const fallback = new Date(dateInput);
  return isNaN(fallback.getTime()) ? null : fallback;
}

/**
 * Formata uma data usando fuso local com locale pt-BR.
 */
export function formatLocalDate(dateInput, pattern = "d 'de' MMMM", options = {}) {
  const parsed = parseLocalDate(dateInput);
  if (!parsed) return "";
  return format(parsed, pattern, { locale: ptBR, ...options });
}

/**
 * Converte Date ou string ISO para formato de input HTML type="date" (YYYY-MM-DD).
 */
export function toInputDateString(dateInput) {
  const parsed = parseLocalDate(dateInput);
  if (!parsed) return "";
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, "0");
  const d = String(parsed.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Compara se duas datas caem no mesmo dia local.
 */
export function isSameLocalDay(dateA, dateB) {
  const a = parseLocalDate(dateA);
  const b = parseLocalDate(dateB);
  if (!a || !b) return false;
  return isSameDay(a, b);
}

/**
 * Verifica se uma data pertence ao mês da data de referência (fuso local).
 */
export function isInSelectedMonth(dateInput, referenceDate) {
  const d = parseLocalDate(dateInput);
  const ref = parseLocalDate(referenceDate) || new Date();
  if (!d) return false;
  return d >= startOfMonth(ref) && d <= endOfMonth(ref);
}

/**
 * Verifica se a data de nascimento (dia e mês) corresponde ao dia de hoje.
 */
export function isBirthdayToday(birthDateInput) {
  const birth = parseLocalDate(birthDateInput);
  if (!birth) return false;
  const today = new Date();
  return birth.getDate() === today.getDate() && birth.getMonth() === today.getMonth();
}
