import type { PracticeChallenge, PracticeLevel, PracticeLevelId } from 'src/types';

export const practiceLevels: PracticeLevel[] = [
  {
    id: 'beginner',
    title: 'practice.level.beginner.title',
    description: 'practice.level.beginner.description',
  },
  {
    id: 'intermediate',
    title: 'practice.level.intermediate.title',
    description: 'practice.level.intermediate.description',
  },
  {
    id: 'advanced',
    title: 'practice.level.advanced.title',
    description: 'practice.level.advanced.description',
  },
];

type ChallengeInput = Omit<PracticeChallenge, 'id' | 'level' | 'title' | 'description'> & {
  slug: string;
};

const makeChallenge = (level: PracticeLevelId, input: ChallengeInput): PracticeChallenge => ({
  ...input,
  id: `${level}.${input.slug}`,
  level,
  title: `practice.challenge.${level}.${input.slug}.title`,
  description: `practice.challenge.${level}.${input.slug}.description`,
  hints: [
    `practice.challenge.${level}.${input.slug}.hint1`,
    `practice.challenge.${level}.${input.slug}.hint2`,
  ],
});

const beginner: PracticeChallenge[] = [
  makeChallenge('beginner', {
    slug: 'literal',
    initialFlags: 'g',
    testCases: [
      { content: 'cat dog cat bird', expectedMatches: ['cat', 'cat'] },
      { content: 'dog catalog cat', expectedMatches: ['cat', 'cat'] },
    ],
    hints: [],
    solution: { regex: 'cat', flags: 'g' },
  }),
  makeChallenge('beginner', {
    slug: 'dot',
    initialFlags: 'g',
    testCases: [
      { content: 'cat cot cut cart', expectedMatches: ['cat', 'cot', 'cut'] },
      { content: 'cit c9t ct', expectedMatches: ['cit', 'c9t'] },
    ],
    hints: [],
    solution: { regex: 'c.t', flags: 'g' },
  }),
  makeChallenge('beginner', {
    slug: 'character-set',
    initialValue: 'gr[]y',
    initialFlags: 'g',
    testCases: [
      { content: 'gray grey groy', expectedMatches: ['gray', 'grey'] },
      { content: 'grey gry gray', expectedMatches: ['grey', 'gray'] },
    ],
    hints: [],
    solution: { regex: 'gr[ae]y', flags: 'g' },
  }),
  makeChallenge('beginner', {
    slug: 'range',
    initialFlags: 'g',
    testCases: [
      { content: 'A1 B2 C3 D4 a5', expectedMatches: ['A1', 'B2', 'C3'] },
      { content: 'C9 Z1 B0', expectedMatches: ['C9', 'B0'] },
    ],
    hints: [],
    solution: { regex: '[A-C]\\d', flags: 'g' },
  }),
  makeChallenge('beginner', {
    slug: 'negated-set',
    initialFlags: 'g',
    testCases: [
      { content: 'bat bet bit bot but', expectedMatches: ['bit', 'bot', 'but'] },
      { content: 'bot bat but', expectedMatches: ['bot', 'but'] },
    ],
    hints: [],
    solution: { regex: 'b[^ae]t', flags: 'g' },
  }),
  makeChallenge('beginner', {
    slug: 'digits',
    initialFlags: 'g',
    testCases: [
      { content: 'Order 42 costs 19 dollars', expectedMatches: ['42', '19'] },
      { content: 'Room 7, floor 103', expectedMatches: ['7', '103'] },
    ],
    hints: [],
    solution: { regex: '\\d+', flags: 'g' },
  }),
  makeChallenge('beginner', {
    slug: 'whitespace',
    initialFlags: 'g',
    testCases: [
      { content: 'one  two\tthree', expectedMatches: ['  ', '\t'] },
      { content: 'a b   c', expectedMatches: [' ', '   '] },
    ],
    hints: [],
    solution: { regex: '\\s+', flags: 'g' },
  }),
  makeChallenge('beginner', {
    slug: 'optional',
    initialFlags: 'g',
    testCases: [
      { content: 'color colour colouur', expectedMatches: ['color', 'colour'] },
      { content: 'colour color', expectedMatches: ['colour', 'color'] },
    ],
    hints: [],
    solution: { regex: 'colou?r', flags: 'g' },
  }),
  makeChallenge('beginner', {
    slug: 'star',
    initialFlags: 'g',
    testCases: [
      { content: 'bt bot boot boat', expectedMatches: ['bt', 'bot', 'boot'] },
      { content: 'boot bt bot', expectedMatches: ['boot', 'bt', 'bot'] },
    ],
    hints: [],
    solution: { regex: 'bo*t', flags: 'g' },
  }),
  makeChallenge('beginner', {
    slug: 'plus',
    initialFlags: 'g',
    testCases: [
      { content: 'bt bot boot boat', expectedMatches: ['bot', 'boot'] },
      { content: 'boot bt bot', expectedMatches: ['boot', 'bot'] },
    ],
    hints: [],
    solution: { regex: 'bo+t', flags: 'g' },
  }),
  makeChallenge('beginner', {
    slug: 'quantifier',
    initialFlags: 'g',
    testCases: [
      { content: 'Years: 99, 2024, 12345', expectedMatches: ['2024', '1234'] },
      { content: 'Code 0007 and 42', expectedMatches: ['0007'] },
    ],
    hints: [],
    solution: { regex: '\\d{4}', flags: 'g' },
  }),
  makeChallenge('beginner', {
    slug: 'anchors',
    initialFlags: 'gm',
    testCases: [
      { content: 'ERROR disk\nINFO ready\nERROR network', expectedMatches: ['ERROR', 'ERROR'] },
      { content: 'OK ERROR\nERROR timeout', expectedMatches: ['ERROR'] },
    ],
    hints: [],
    solution: { regex: '^ERROR', flags: 'gm' },
  }),
];

const intermediate: PracticeChallenge[] = [
  makeChallenge('intermediate', {
    slug: 'alternation',
    initialFlags: 'g',
    testCases: [
      { content: 'cat dog bird dog', expectedMatches: ['cat', 'dog', 'dog'] },
      { content: 'bird cat dog', expectedMatches: ['cat', 'dog'] },
    ],
    hints: [],
    solution: { regex: 'cat|dog', flags: 'g' },
  }),
  makeChallenge('intermediate', {
    slug: 'grouping',
    initialFlags: 'g',
    testCases: [
      { content: 'red car blue car red bike', expectedMatches: ['red car', 'blue car'] },
      { content: 'blue car green car', expectedMatches: ['blue car'] },
    ],
    hints: [],
    solution: { regex: '(red|blue) car', flags: 'g' },
  }),
  makeChallenge('intermediate', {
    slug: 'backreference',
    initialFlags: 'gi',
    testCases: [
      { content: 'go go stop now now', expectedMatches: ['go go', 'now now'] },
      { content: 'Yes yes no maybe', expectedMatches: ['Yes yes'] },
    ],
    hints: [],
    solution: { regex: '\\b(\\w+)\\s+\\1\\b', flags: 'gi' },
  }),
  makeChallenge('intermediate', {
    slug: 'non-capturing',
    initialFlags: 'g',
    testCases: [
      {
        content: 'https://site.com ftp://files.test mail://wrong.test',
        expectedMatches: ['https://', 'ftp://'],
      },
      { content: 'http://one.test ftp://two.test', expectedMatches: ['http://', 'ftp://'] },
    ],
    hints: [],
    solution: { regex: '(?:https?|ftp)://', flags: 'g' },
  }),
  makeChallenge('intermediate', {
    slug: 'boundaries',
    initialFlags: 'g',
    testCases: [
      { content: 'cat catalog bobcat cat', expectedMatches: ['cat', 'cat'] },
      { content: 'concatenate cat', expectedMatches: ['cat'] },
    ],
    hints: [],
    solution: { regex: '\\bcat\\b', flags: 'g' },
  }),
  makeChallenge('intermediate', {
    slug: 'escaping',
    initialFlags: 'g',
    testCases: [
      { content: '$12.50 costs 12x50 and $7.00', expectedMatches: ['$12.50', '$7.00'] },
      { content: '$0.99 $10x00', expectedMatches: ['$0.99'] },
    ],
    hints: [],
    solution: { regex: '\\$\\d+\\.\\d{2}', flags: 'g' },
  }),
  makeChallenge('intermediate', {
    slug: 'greedy',
    initialFlags: 'g',
    testCases: [
      { content: '<b>one</b><i>two</i>', expectedMatches: ['<b>one</b><i>two</i>'] },
      { content: '<p>a</p><p>b</p>', expectedMatches: ['<p>a</p><p>b</p>'] },
    ],
    hints: [],
    solution: { regex: '<.*>', flags: 'g' },
  }),
  makeChallenge('intermediate', {
    slug: 'lazy',
    initialFlags: 'g',
    testCases: [
      { content: '<b>one</b><i>two</i>', expectedMatches: ['<b>', '</b>', '<i>', '</i>'] },
      { content: '<p>a</p>', expectedMatches: ['<p>', '</p>'] },
    ],
    hints: [],
    solution: { regex: '<.*?>', flags: 'g' },
  }),
  makeChallenge('intermediate', {
    slug: 'case-insensitive',
    initialFlags: 'g',
    testCases: [
      { content: 'ERROR Error error warning', expectedMatches: ['ERROR', 'Error', 'error'] },
      { content: 'error OK ERROR', expectedMatches: ['error', 'ERROR'] },
    ],
    hints: [],
    solution: { regex: 'error', flags: 'gi' },
  }),
  makeChallenge('intermediate', {
    slug: 'multiline',
    initialFlags: 'gm',
    testCases: [
      { content: 'HOST=web\ninvalid line\nPORT=3000', expectedMatches: ['HOST=web', 'PORT=3000'] },
      { content: 'A=1\nB=two\n no=3', expectedMatches: ['A=1', 'B=two'] },
    ],
    hints: [],
    solution: { regex: '^\\w+=.+$', flags: 'gm' },
  }),
  makeChallenge('intermediate', {
    slug: 'filenames',
    initialFlags: 'gm',
    testCases: [
      {
        content: 'report.pdf\nmy-file.pdf\nphoto.png\nbad file.pdf',
        expectedMatches: ['report.pdf', 'my-file.pdf'],
      },
      { content: 'a.pdf\nb.PDF\nc-pdf', expectedMatches: ['a.pdf'] },
    ],
    hints: [],
    solution: { regex: '^[\\w-]+\\.pdf$', flags: 'gm' },
  }),
  makeChallenge('intermediate', {
    slug: 'urls',
    initialFlags: 'g',
    testCases: [
      {
        content: 'Visit https://example.com and http://test.dev/path.',
        expectedMatches: ['https://example.com', 'http://test.dev/path'],
      },
      { content: 'ftp://bad.test https://ok.io/a-b', expectedMatches: ['https://ok.io/a-b'] },
    ],
    hints: [],
    solution: { regex: 'https?://[\\w.-]+(?:/[\\w-]+)?', flags: 'g' },
  }),
];

const advanced: PracticeChallenge[] = [
  makeChallenge('advanced', {
    slug: 'positive-lookahead',
    initialFlags: 'g',
    testCases: [
      { content: '10 USD, 20 EUR, 35 USD', expectedMatches: ['10', '35'] },
      { content: '5 EUR 7 USD', expectedMatches: ['7'] },
    ],
    hints: [],
    solution: { regex: '\\d+(?= USD)', flags: 'g' },
  }),
  makeChallenge('advanced', {
    slug: 'negative-lookahead',
    initialFlags: 'gm',
    testCases: [
      { content: 'admin\nguest\neditor', expectedMatches: ['guest', 'editor'] },
      { content: 'member\nadmin', expectedMatches: ['member'] },
    ],
    hints: [],
    solution: { regex: '^(?!admin$)\\w+$', flags: 'gm' },
  }),
  makeChallenge('advanced', {
    slug: 'positive-lookbehind',
    initialFlags: 'g',
    testCases: [
      { content: '$10 €20 $35.50', expectedMatches: ['10', '35.50'] },
      { content: 'USD 9 $7', expectedMatches: ['7'] },
    ],
    hints: [],
    solution: { regex: '(?<=\\$)\\d+(?:\\.\\d{2})?', flags: 'g' },
  }),
  makeChallenge('advanced', {
    slug: 'negative-lookbehind',
    initialFlags: 'g',
    testCases: [
      { content: '$10 item 20 code 30', expectedMatches: ['20', '30'] },
      { content: '5 $7 9', expectedMatches: ['5', '9'] },
    ],
    hints: [],
    solution: { regex: '(?<!\\$)\\b\\d+\\b', flags: 'g' },
  }),
  makeChallenge('advanced', {
    slug: 'dates',
    initialFlags: 'g',
    testCases: [
      { content: 'Dates 2024-02-29, 24-02-29, 2023-7-1', expectedMatches: ['2024-02-29'] },
      { content: '2020-12-01 and 2020/12/01', expectedMatches: ['2020-12-01'] },
    ],
    hints: [],
    solution: { regex: '\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b', flags: 'g' },
  }),
  makeChallenge('advanced', {
    slug: 'emails',
    initialFlags: 'g',
    testCases: [
      {
        content: 'a.user@example.com bad@ x+y@test.dev',
        expectedMatches: ['a.user@example.com', 'x+y@test.dev'],
      },
      { content: 'me@site.io no spaces @bad.com', expectedMatches: ['me@site.io'] },
    ],
    hints: [],
    solution: { regex: '\\b[\\w.+-]+@[\\w.-]+\\.[A-Za-z]{2,}\\b', flags: 'g' },
  }),
  makeChallenge('advanced', {
    slug: 'ipv4',
    initialFlags: 'g',
    testCases: [
      { content: 'IPs 192.168.1.1 999.1.1.1 10.0.0.5', expectedMatches: ['192.168.1.1', '10.0.0.5'] },
      { content: '255.255.255.255 256.0.0.1', expectedMatches: ['255.255.255.255'] },
    ],
    hints: [],
    solution: {
      regex: '\\b(?:(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\b',
      flags: 'g',
    },
  }),
  makeChallenge('advanced', {
    slug: 'semver',
    initialFlags: 'g',
    testCases: [
      { content: '1.2.3 1.0 2.10.0-beta 3.0.1', expectedMatches: ['1.2.3', '2.10.0-beta', '3.0.1'] },
      { content: '0.0.1-alpha 1.2.3.4', expectedMatches: ['0.0.1-alpha', '1.2.3'] },
    ],
    hints: [],
    solution: { regex: '\\b\\d+\\.\\d+\\.\\d+(?:-[a-z]+)?\\b', flags: 'g' },
  }),
  makeChallenge('advanced', {
    slug: 'markdown-links',
    initialFlags: 'g',
    testCases: [
      {
        content: 'Read [Docs](https://example.com) or plain https://test.com',
        expectedMatches: ['[Docs](https://example.com)'],
      },
      { content: '[One](http://one.dev) [bad] no', expectedMatches: ['[One](http://one.dev)'] },
    ],
    hints: [],
    solution: { regex: '\\[[^\\]]+\\]\\(https?://[^\\s)]+\\)', flags: 'g' },
  }),
  makeChallenge('advanced', {
    slug: 'csv-quotes',
    initialFlags: 'g',
    testCases: [
      { content: 'one,"two, too",three,"four"', expectedMatches: ['"two, too"', '"four"'] },
      { content: '"a","b c",d', expectedMatches: ['"a"', '"b c"'] },
    ],
    hints: [],
    solution: { regex: '"[^"]*"', flags: 'g' },
  }),
  makeChallenge('advanced', {
    slug: 'server-errors',
    initialFlags: 'gm',
    testCases: [
      {
        content: '200 GET /\n503 GET /api\n404 GET /x\n500 POST /login',
        expectedMatches: ['503 GET /api', '500 POST /login'],
      },
      { content: '502 upstream\n302 redirect', expectedMatches: ['502 upstream'] },
    ],
    hints: [],
    solution: { regex: '^5\\d{2}\\s.+$', flags: 'gm' },
  }),
  makeChallenge('advanced', {
    slug: 'uuid',
    initialFlags: 'gi',
    testCases: [
      {
        content: 'IDs: 123e4567-e89b-12d3-a456-426614174000 and 123-not-valid',
        expectedMatches: ['123e4567-e89b-12d3-a456-426614174000'],
      },
      {
        content: 'ABCDEF12-3456-7890-ABCD-EF1234567890',
        expectedMatches: ['ABCDEF12-3456-7890-ABCD-EF1234567890'],
      },
    ],
    hints: [],
    solution: {
      regex: '\\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\b',
      flags: 'gi',
    },
  }),
];

export const practiceChallenges = [...beginner, ...intermediate, ...advanced];

export const getPracticeChallenges = (level: PracticeLevelId) =>
  practiceChallenges.filter(challenge => challenge.level === level);

export const isPracticeLevel = (level: string): level is PracticeLevelId =>
  practiceLevels.some(item => item.id === level);
