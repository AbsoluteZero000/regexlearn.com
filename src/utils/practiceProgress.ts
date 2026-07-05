import type { PracticeLevelId, PracticeProgress } from 'src/types';

const STORAGE_KEY = 'practice.v1';

export const emptyPracticeProgress = (): PracticeProgress => ({
  version: 1,
  completed: [],
  currentByLevel: {},
});

export const getPracticeProgress = (): PracticeProgress => {
  if (typeof window === 'undefined') return emptyPracticeProgress();

  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (
      value?.version !== 1 ||
      !Array.isArray(value.completed) ||
      typeof value.currentByLevel !== 'object'
    ) {
      return emptyPracticeProgress();
    }

    return {
      version: 1,
      completed: value.completed.filter(item => typeof item === 'string'),
      currentByLevel: value.currentByLevel || {},
    };
  } catch {
    return emptyPracticeProgress();
  }
};

export const setPracticeProgress = (progress: PracticeProgress) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
};

export const completePracticeChallenge = (
  progress: PracticeProgress,
  challengeId: string,
): PracticeProgress => ({
  ...progress,
  completed: progress.completed.includes(challengeId)
    ? progress.completed
    : [...progress.completed, challengeId],
});

export const setCurrentPracticeChallenge = (
  progress: PracticeProgress,
  level: PracticeLevelId,
  challengeId: string,
): PracticeProgress => ({
  ...progress,
  currentByLevel: { ...progress.currentByLevel, [level]: challengeId },
});

export const resetPracticeLevel = (
  progress: PracticeProgress,
  level: PracticeLevelId,
  levelChallengeIds: string[],
): PracticeProgress => ({
  ...progress,
  completed: progress.completed.filter(id => !levelChallengeIds.includes(id)),
  currentByLevel: { ...progress.currentByLevel, [level]: levelChallengeIds[0] },
});
