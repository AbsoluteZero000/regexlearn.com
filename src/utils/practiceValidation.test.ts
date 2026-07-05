import { describe, expect, it } from 'vitest';

import {
  getPracticeChallenges,
  practiceChallenges,
  practiceLevels,
} from 'src/data/practice';
import practiceMessages from 'src/localization/en/practice.json';
import validatePracticeSolution, { collectMatches } from './practiceValidation';

describe('practice challenge data', () => {
  it('contains 12 uniquely identified challenges per level', () => {
    expect(new Set(practiceChallenges.map(challenge => challenge.id)).size).toBe(36);
    practiceLevels.forEach(level => {
      expect(getPracticeChallenges(level.id)).toHaveLength(12);
    });
  });

  it('has copy for every challenge and hint', () => {
    practiceChallenges.forEach(challenge => {
      [challenge.title, challenge.description, ...challenge.hints].forEach(message => {
        expect(practiceMessages).toHaveProperty(message);
      });
    });
  });

  it('accepts every authored reference solution', () => {
    practiceChallenges.forEach(challenge => {
      expect(
        validatePracticeSolution(
          challenge,
          challenge.solution.regex,
          challenge.solution.flags,
        ).passed,
        challenge.id,
      ).toBe(true);
    });
  });
});

describe('practice validation', () => {
  const literal = practiceChallenges.find(challenge => challenge.id === 'beginner.literal');

  it('accepts equivalent expressions based on their behavior', () => {
    expect(validatePracticeSolution(literal, '(?:cat)', 'g').passed).toBe(true);
  });

  it('rejects missing or extra matches', () => {
    expect(validatePracticeSolution(literal, 'cat|dog', 'g').passed).toBe(false);
    expect(validatePracticeSolution(literal, 'cat', '').passed).toBe(false);
  });

  it('reports invalid and empty expressions without throwing', () => {
    expect(validatePracticeSolution(literal, '[', 'g')).toMatchObject({
      valid: false,
      passed: false,
      error: 'invalid',
    });
    expect(validatePracticeSolution(literal, '', 'g')).toMatchObject({
      valid: true,
      passed: false,
      error: 'empty',
    });
  });

  it('supports flags, backreferences, and repeated stateless evaluation', () => {
    const backreference = practiceChallenges.find(
      challenge => challenge.id === 'intermediate.backreference',
    );
    expect(
      validatePracticeSolution(
        backreference,
        backreference.solution.regex,
        backreference.solution.flags,
      ).passed,
    ).toBe(true);
    expect(collectMatches('a a a', 'a', 'g')).toEqual(['a', 'a', 'a']);
    expect(collectMatches('a a a', 'a', 'g')).toEqual(['a', 'a', 'a']);
  });
});
