import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Subject } from '@/types/materia';

export const SUBJECTS_STORAGE_KEY = 'materias-v1';

export async function loadSubjects(): Promise<Subject[]> {
  const serialized = await AsyncStorage.getItem(SUBJECTS_STORAGE_KEY);
  if (serialized === null) {
    return [];
  }

  const parsed: unknown = JSON.parse(serialized);
  if (!Array.isArray(parsed)) {
    throw new Error('Stored subjects must be an array.');
  }

  return parsed as Subject[];
}

export async function saveSubjects(subjects: Subject[]): Promise<void> {
  await AsyncStorage.setItem(
    SUBJECTS_STORAGE_KEY,
    JSON.stringify(subjects),
  );
}
