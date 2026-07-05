import type { PracticeChallenge } from 'src/types';

export type PracticeValidationResult = {
  valid: boolean;
  passed: boolean;
  visibleMatches: string[];
  error?: 'empty' | 'invalid';
};

const normalizeFlags = (flags = '') =>
  ['g', 'm', 'i'].filter(flag => flags.includes(flag)).join('');

export const collectMatches = (content: string, source: string, flags = ''): string[] => {
  if (!source) return [];

  const normalizedFlags = normalizeFlags(flags);
  const isGlobal = normalizedFlags.includes('g');
  const executionFlags = isGlobal ? normalizedFlags : `${normalizedFlags}g`;
  const expression = new RegExp(source, executionFlags);
  const matches: string[] = [];

  let match = expression.exec(content);
  while (match) {
    matches.push(match[0]);
    if (!isGlobal || match[0] === '') break;
    match = expression.exec(content);
  }

  return matches;
};

const arraysEqual = (left: string[], right: string[]) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const validatePracticeSolution = (
  challenge: PracticeChallenge,
  regex: string,
  flags = '',
): PracticeValidationResult => {
  if (!regex) {
    return { valid: true, passed: false, visibleMatches: [], error: 'empty' };
  }

  try {
    const results = challenge.testCases.map(testCase =>
      collectMatches(testCase.content, regex, flags),
    );
    const passed = results.every((matches, index) =>
      arraysEqual(matches, challenge.testCases[index].expectedMatches),
    );

    return {
      valid: true,
      passed,
      visibleMatches: results[0] || [],
    };
  } catch {
    return { valid: false, passed: false, visibleMatches: [], error: 'invalid' };
  }
};

export default validatePracticeSolution;
