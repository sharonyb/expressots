Setup jest:
1. add "jest" to "types" on tsconfig.base.json
2. see new jest.config.ts (not, for the purpose of checking )
3. npm install jest @types/jest ts-jest ts-node --save-dev
4. npm i 
5. Open Early Extension, if no coverage shows up reload window.

Tests were generated for all testable methods under core/src in jest format on sibling folders to the file with the tested methods.

Changes made to the project in order for some test to run and coverage to go further up:
1. there are generated tests on the middleware-service.ts file that requires 'npm install express' in order to work as they are importing objects from the express framework. If installing express is not an option lets figure out a workaround. without express the coverage on the project is 58%, with express installed it goes up to 74%
2. on base-contoller.ts, there are two protected methods, we changed them to public in order for the tests generated to run (and increase the coverage form 0 %to 100% )
    a. we are wokring on a solution to make this work without changing the method signiture to public
    b. it's a method to test private (and protected) functions. turn them to public, generate tests and test the methods, return them to become privatge (and skip or delete the tests)

With these changes the project coverage on core/src goes up to 76%.
Total tests generated: 
Green tests: 186
Red tests: 84 (some are good red tests)


## Setup Jest:
1. Add `"jest"` to `"types"` in `tsconfig.base.json`.
2. See the new `jest.config.ts` (Note: we ignored all existing tests because they are in vitest format and so we can isolate the coverage of Early's generated tests)
3. Run `npm install jest @types/jest ts-jest ts-node --save-dev`.
4. Run `npm i`.
5. Open Early Extension, and if no coverage shows up, reload the window.

Tests were generated for all testable methods under `core/src` in Jest format in sibling folders to the files with the tested methods.

## Changes made to the project to ensure tests run and increase coverage:
1. There are generated tests in the `src/middleware/middleware-service.ts` file that require running `npm install express` because they are imported objects from the Express framework. If installing Express is not an option, let's figure out a workaround. Without Express, the coverage on the project is 58%, but with Express installed, it increases to 74%.
   
2. In `base-controller.ts`, there are two protected methods that we changed to public to allow the generated tests to run and increase the coverage from 0% to 100% on that file.
   - We are working on a solution to make this work without changing the method signatures to public.
   - This way you can test private and protected functions: turn them public, generate tests and test the methods, then return them to private (and skip or delete the tests).

With these changes, the project coverage on `core/src` goes up to 76%.

## Total tests generated:
- **Green tests**: 186
- **Red tests**: 84 (some are valid red tests)



### About Early
Early leverages Generative AI to accelerate development, enhance code quality, and speed up time-to-market. Our AI-driven product generates automated, comprehensive, cost-effective working unit tests, and help catch bugs early, expanding code coverage, and improving overall quality


Learn more at http://www.startearly.ai or search for EarlyAI on VSCode marketplace, install and user EarlyAI extension to generate unit tests in a click.

Read more on our [blogs](https://www.startearly.ai/early-blog).