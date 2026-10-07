import {
  buildSubjectDraft,
  hasDuplicateName,
} from './materia';
import type { Subject } from '@/types/materia';

const DUPLICATE_NAME_MESSAGE = 'Ya tienes una materia con ese nombre.';
const PERSISTENCE_ERROR_MESSAGE = 'No se registro la materia.';

type RegisterFailure = {
  ok: false;
  errors?: {
    name?: string;
    score?: string;
  };
  formError?: string;
};

type RegisterSuccess = {
  ok: true;
  subject: Subject;
};

export type RegisterResult = RegisterFailure | RegisterSuccess;
export type PersistSubjects = (subjects: Subject[]) => Promise<void>;

export async function registerSubject(
  existingSubjects: Subject[],
  name: string,
  scoreInput: string,
  persist: PersistSubjects,
  createId: () => string,
): Promise<RegisterResult> {
  const draft = buildSubjectDraft(name, scoreInput);
  if (!draft.valid) {
    return { ok: false, errors: draft.errors };
  }

  if (hasDuplicateName(existingSubjects.map((subject) => subject.name), draft.normalizedName)) {
    return {
      ok: false,
      errors: { name: DUPLICATE_NAME_MESSAGE },
    };
  }

  const subject: Subject = {
    id: createId(),
    name: draft.normalizedName,
    firstBim: draft.normalizedScore,
  };

  try {
    await persist([...existingSubjects, subject]);
  } catch {
    return { ok: false, formError: PERSISTENCE_ERROR_MESSAGE };
  }

  return { ok: true, subject };
}
