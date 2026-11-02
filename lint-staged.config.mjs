/**
 * lint-staged configuration.
 *
 * Uses the function form so the staged file list is NOT spliced onto the
 * command line. Passing 100+ paths to `eslint`/`prettier` exceeds the Windows
 * command-line length limit ("The command line is too long"). Instead we lint
 * and format the whole project, which is fast enough for a pre-commit hook and
 * sidesteps the limit entirely.
 *
 * ESLint is scoped to staged JS/TS files (by running `eslint` project-wide with
 * its own ignore rules); Prettier formats staged source files project-wide.
 */
const config = {
  "*.{ts,tsx}": () => ["eslint --fix .", "prettier --write ."],
  "*.{js,mjs,cjs,json,css,md}": () => ["prettier --write ."],
};

export default config;
