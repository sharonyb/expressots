import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: [
        'packages/core/src'
    ],
    testRegex: '.*\\.test\\.ts$',
    collectCoverageFrom: [
        'packages/core/src/**/*.ts',
        '!**/*.test.ts',
        '!**/*.spec.ts',
    ],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.base.json',
        },
    },
    moduleNameMapper: {
        "^@src/(.*)$": "<rootDir>/$1",
    },
    setupFiles: ["reflect-metadata"],
};
export default config;
