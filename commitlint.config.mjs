// ts-check

export default {
    extends: ['@commitlint/config-conventional'],
    ignores: [(commit) => {
        return /\d+\.\d+\.\d+/.test(commit.split("\n").shift());
    }],
};
