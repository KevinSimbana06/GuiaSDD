const EMPTY_NAME_MESSAGE = 'Escribe el nombre de la materia.';
const INVALID_SCORE_MESSAGE =
  'Escribe una nota entre 0 y 20 con hasta dos decimales.';

export type SubjectDraft = {
  valid: boolean;
  normalizedName: string;
  normalizedScore: number;
  errors: {
    name?: string;
    score?: string;
  };
};

export function normalizeSubjectName(name: string): string {
  return name.trim();
}

export function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function isValidScore(value: number): boolean {
  return value >= 0 && value <= 20;
}

export function normalizeNumericInput(raw: string): number | null {
  const trimmed = raw.trim();

  if (trimmed === '' || !/^\d+(?:\.\d+)?$/.test(trimmed)) {
    return null;
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  const normalized = roundToTwoDecimals(parsed);
  return isValidScore(normalized) ? normalized : null;
}

export function buildSubjectDraft(
  name: string,
  scoreInput: string,
): SubjectDraft {
  const normalizedName = normalizeSubjectName(name);
  const errors: SubjectDraft['errors'] = {};

  if (normalizedName === '') {
    errors.name = EMPTY_NAME_MESSAGE;
  }

  const normalizedScore = normalizeNumericInput(scoreInput);
  if (normalizedScore === null) {
    errors.score = INVALID_SCORE_MESSAGE;
  }

  return {
    valid: Object.keys(errors).length === 0,
    normalizedName,
    normalizedScore: normalizedScore ?? 0,
    errors,
  };
}

export function hasDuplicateName(
  existingNames: string[],
  normalizedName: string,
): boolean {
  const candidate = normalizeSubjectName(normalizedName).toLowerCase();
  return existingNames.some(
    (existingName) =>
      normalizeSubjectName(existingName).toLowerCase() === candidate,
  );
}
