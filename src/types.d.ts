export type Lesson = {
  key: string;
  slug: string;
  creator?: string;
  creatorURL?: string;
  creatorLogo?: string;
  logoHeight?: number;
  sponsorURL?: string;
  sponsorLogo?: string;
  sponsor?: string;
  title: string;
  description: string;
};

export type LessonData = {
  initialValue?: string;
  initialFlags?: string;
  safariAccept?: boolean;
  interactive?: boolean;
  regex?: string[];
  flags?: string;
  content: string;
  noHint?: boolean;
  hiddenFlags?: boolean;
  cursorPosition?: number;
  readOnly?: boolean;
  visibleRegex?: string;
  useFlagsControl?: boolean;
  title: string;
  originalTitle?: string;
  videoURL?: string;
  description: string;
  image?: string;
  answer: string[];
  customValidate?: (regex: string) => boolean;
};

export type CheatsheetData = {
  title: string;
  description?: string;
  content: string;
  code: string;
  flags: string;
  regex: string;
};

export type PracticeLevelId = 'beginner' | 'intermediate' | 'advanced';

export type PracticeTestCase = {
  content: string;
  expectedMatches: string[];
};

export type PracticeSolution = {
  regex: string;
  flags: string;
};

export type PracticeChallenge = {
  id: string;
  level: PracticeLevelId;
  title: string;
  description: string;
  initialValue?: string;
  initialFlags?: string;
  testCases: PracticeTestCase[];
  hints: string[];
  solution: PracticeSolution;
};

export type PracticeLevel = {
  id: PracticeLevelId;
  title: string;
  description: string;
};

export type PracticeProgress = {
  version: 1;
  completed: string[];
  currentByLevel: Partial<Record<PracticeLevelId, string>>;
};
