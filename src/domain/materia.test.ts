/// <reference types="jest" />

import {
  buildSubjectDraft,
  hasDuplicateName,
  normalizeNumericInput,
  normalizeSubjectName,
} from './materia';

describe('materia domain rules', () => {
  describe('normalizeSubjectName', () => {
    it('removes external spaces and preserves internal capitalization', () => {
      expect(normalizeSubjectName('  Cálculo Numérico  ')).toBe('Cálculo Numérico');
    });
  });

  describe('normalizeNumericInput', () => {
    it.each<[string, number]>([
      ['0', 0],
      ['20', 20],
      [' 7.126 ', 7.13],
      ['7.124', 7.12],
    ])('normalizes %s to %s', (input: string, expected: number) => {
      expect(normalizeNumericInput(input)).toBe(expected);
    });

    it.each<string>(['', '   ', '-0.01', '20.01', 'abc', '7,5', '15.123.4'])(
      'rejects invalid input %s',
      (input: string) => {
        expect(normalizeNumericInput(input)).toBeNull();
      },
    );
  });

  describe('buildSubjectDraft', () => {
    it('reports an empty name with the exact message', () => {
      expect(buildSubjectDraft('   ', '10')).toMatchObject({
        valid: false,
        errors: { name: 'Escribe el nombre de la materia.' },
      });
    });

    it('reports an empty or invalid score with the exact message', () => {
      const message = 'Escribe una nota entre 0 y 20 con hasta dos decimales.';

      expect(buildSubjectDraft('Física', '')).toMatchObject({
        valid: false,
        errors: { score: message },
      });
      expect(buildSubjectDraft('Física', '21')).toMatchObject({
        valid: false,
        errors: { score: message },
      });
    });

    it('returns normalized values for a valid draft', () => {
      expect(buildSubjectDraft('  Física  ', '7.126')).toEqual({
        valid: true,
        normalizedName: 'Física',
        normalizedScore: 7.13,
        errors: {},
      });
    });
  });

  describe('hasDuplicateName', () => {
    it('compares names without case sensitivity', () => {
      expect(hasDuplicateName(['Cálculo', 'Física'], ' cálculo ')).toBe(true);
      expect(hasDuplicateName(['Cálculo', 'Física'], 'Química')).toBe(false);
    });
  });
});
