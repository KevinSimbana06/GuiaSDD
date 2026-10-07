/// <reference types="jest" />

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  loadSubjects,
  saveSubjects,
  SUBJECTS_STORAGE_KEY,
} from './materiasStorage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

describe('materias storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads saved subjects from AsyncStorage', async () => {
    const subjects = [{ id: '1', name: 'Física', firstBim: 7.13 }];
    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(JSON.stringify(subjects));

    await expect(loadSubjects()).resolves.toEqual(subjects);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(SUBJECTS_STORAGE_KEY);
  });

  it('returns an empty list when no subjects are saved', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null);

    await expect(loadSubjects()).resolves.toEqual([]);
  });

  it('persists the complete subject list', async () => {
    const subjects = [{ id: '1', name: 'Física', firstBim: 7.13 }];
    jest.mocked(AsyncStorage.setItem).mockResolvedValueOnce();

    await expect(saveSubjects(subjects)).resolves.toBeUndefined();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      SUBJECTS_STORAGE_KEY,
      JSON.stringify(subjects),
    );
  });

  it('propagates persistence failures', async () => {
    const error = new Error('storage failed');
    jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(error);

    await expect(saveSubjects([])).rejects.toThrow(error);
  });
});
