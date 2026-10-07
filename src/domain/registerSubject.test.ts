/// <reference types="jest" />

import { registerSubject } from './registerSubject';

describe('registerSubject', () => {
  it('adds a valid subject with normalized values', async () => {
    const persist = jest.fn().mockResolvedValue(undefined);

    await expect(
      registerSubject([], '  Física  ', '7.126', persist, () => 'subject-1'),
    ).resolves.toEqual({
      ok: true,
      subject: { id: 'subject-1', name: 'Física', firstBim: 7.13 },
    });
    expect(persist).toHaveBeenCalledWith([
      { id: 'subject-1', name: 'Física', firstBim: 7.13 },
    ]);
  });

  it('blocks a duplicate without persisting', async () => {
    const existing = [{ id: '1', name: 'Física', firstBim: 8 }];
    const persist = jest.fn().mockResolvedValue(undefined);

    await expect(
      registerSubject(existing, ' física ', '10', persist, () => 'subject-2'),
    ).resolves.toEqual({
      ok: false,
      errors: { name: 'Ya tienes una materia con ese nombre.' },
    });
    expect(persist).not.toHaveBeenCalled();
  });

  it('reports persistence failure and does not return a saved subject', async () => {
    const persist = jest.fn().mockRejectedValue(new Error('storage failed'));

    await expect(
      registerSubject([], 'Física', '10', persist, () => 'subject-1'),
    ).resolves.toEqual({
      ok: false,
      formError: 'No se registro la materia.',
    });
  });
});
