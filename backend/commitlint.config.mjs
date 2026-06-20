const commitlintConfig = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(message) => /^Bumps \[.+]\(.+\) from .+ to .+\.$/m.test(message)],
  rules: {
    'subject-case': [0, 'never'],
    'header-max-length': [2, 'always', 200],
  },
};

export default commitlintConfig;
