import cheatsheet from './cheatsheet.json';
import general from './general.json';
import landing from './landing.json';
import learn from './learn.json';
import lessons from './lessons.json';
import regexForSeo from './lessons/regexForSeo.json';
import practice from './practice.json';

const messages = {
  ...cheatsheet,
  ...general,
  ...landing,
  ...learn,
  ...lessons,
  ...regexForSeo,
  ...practice,
};

export default messages;
