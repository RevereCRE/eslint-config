const { ESLint } = require('eslint');
const revereConfig = require('./index');

function lint(text) {
  const eslint = new ESLint({
    baseConfig: {
      ...revereConfig,
      parserOptions: { project: ['./tsconfig.test.json'] },
      rules: {
        ...revereConfig.rules,
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  });

  return eslint
    .lintText(text, { filePath: 'test.ts' })
    .then((results) => results[0]);
}

test('no errors', async () => {
  const result = await lint(`interface MyInterface { value: string; }`);
  expect(result.messages).toEqual([]);
});

test('no-implicit-any-catch', async () => {
  const result = await lint(`
    try {
      NaN.toString();
    } catch (e) {
      void e;
    }`);

  expect(result.messages.length).toBe(1);
  expect(result.messages[0].ruleId).toBe(
    '@typescript-eslint/no-implicit-any-catch'
  );
});

test('consistent-type-definitions', async () => {
  const result = await lint(`type MyType = { value: string }`);
  expect(result.messages.length).toBe(1);
  expect(result.messages[0].ruleId).toBe(
    '@typescript-eslint/consistent-type-definitions'
  );
});

test('guard-for-in', async () => {
  const result = await lint(`for (const key in {}) { void key; }`);
  expect(result.messages.length).toBe(1);
  expect(result.messages[0].ruleId).toBe('guard-for-in');
});

test('no-for-in-array', async () => {
  const result = await lint(`for (const key in []) { void key; }`);
  expect(result.messages.length).toBe(2);
  expect(result.messages[0].ruleId).toBe('@typescript-eslint/no-for-in-array');
  expect(result.messages[1].ruleId).toBe('guard-for-in');
});

test('no-floating-promises', async () => {
  const result = await lint(`
    async function sleep() {
      await new Promise(r => setTimeout(t, 5000));
    }

    sleep();`);

  expect(result.messages.length).toBe(1);
  expect(result.messages[0].ruleId).toBe(
    '@typescript-eslint/no-floating-promises'
  );
});

test('guard-for-in', async () => {
  const result = await lint(`const str: string = 'my string';`);
  expect(result.messages.length).toBe(1);
  expect(result.messages[0].ruleId).toBe(
    '@typescript-eslint/no-inferrable-types'
  );
});

test('await-thenable', async () => {
  const result = await lint(`const str = await 'my string';`);
  expect(result.messages.length).toBe(1);
  expect(result.messages[0].ruleId).toBe('@typescript-eslint/await-thenable');
});

describe('return-await', () => {
  test('outside try-catch', async () => {
    const result = await lint(`
      async function fn() {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        return await Promise.resolve('done');
      }`);

    expect(result.messages.length).toBe(1);
    expect(result.messages[0].ruleId).toBe('@typescript-eslint/return-await');
  });

  test('inside try-catch', async () => {
    const result = await lint(`
      async function fn() {
        try {
          // eslint-disable-next-line @typescript-eslint/await-thenable
          return await Promise.resolve('done');
        } catch (error: unknown) {
          return 'yes';
        }
      }`);

    expect(result.messages.length).toBe(0);
  });
});

test('promise-function-async', async () => {
  const result = await lint(`
    function iAmReturnPromise() {
      return Promise.resolve('done');
    }`);

  expect(result.messages.length).toBe(1);
  expect(result.messages[0].ruleId).toBe(
    '@typescript-eslint/promise-function-async'
  );
});

test('prefer-includes', async () => {
  const result = await lint(`const hasValue = [].indexOf('value') !== -1`);
  expect(result.messages.length).toBe(1);
  expect(result.messages[0].ruleId).toBe('@typescript-eslint/prefer-includes');
});

test('prefer-for-of', async () => {
  const result = await lint(`
    const arr = [];
    for (let i = 0; i < arr.length; i++) { void arr[i]; }`);

  expect(result.messages.length).toBe(1);
  expect(result.messages[0].ruleId).toBe('@typescript-eslint/prefer-for-of');
});

describe('eqeqeq', () => {
  test('nullish comparison', async () => {
    const result = await lint(`
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const isEq = 7 == null;`);

    expect(result.messages.length).toBe(0);
  });

  test('non-nullish comparison', async () => {
    const result = await lint(`
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const isEq = 7 == 8;`);

    expect(result.messages.length).toBe(1);
    expect(result.messages[0].ruleId).toBe('eqeqeq');
  });
});

describe('no-console', () => {
  test('console.log usage', async () => {
    const result = await lint(`console.log('hello world');`);
    expect(result.messages.length).toBe(1);
    expect(result.messages[0].ruleId).toBe('no-console');
  });
});

describe('fontawesome imports', () => {
  test('import faCoffee', async () => {
    const result = await lint(
      `import { faCoffee, faTimes } from '@fortawesome/free-solid-svg-icons';`
    );

    expect(result.messages.length).toBe(1);
    expect(result.messages[0].ruleId).toBe(
      '@reverecre/fontawesome/shakeable-imports'
    );
    expect(result.messages[0].suggestions.length).toBe(1);
    expect(result.messages[0].suggestions[0].fix.text).toBe(
      `import { faCoffee } from '@fortawesome/free-solid-svg-icons/faCoffee';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';`
    );
  });
});

describe('naming-convention', () => {
  test('interface name', async () => {
    const result = await lint(`
      // eslint-disable-next-line @typescript-eslint/no-empty-interface
      interface lowerCase {}`);
    expect(result.messages.length).toBe(1);
    expect(result.messages[0].ruleId).toBe(
      '@typescript-eslint/naming-convention'
    );
  });

  test('type alias', async () => {
    const result = await lint(`
      // eslint-disable-next-line @typescript-eslint/no-empty-interface
      type t = number`);
    expect(result.messages.length).toBe(1);
    expect(result.messages[0].ruleId).toBe(
      '@typescript-eslint/naming-convention'
    );
  });

  test('enum name', async () => {
    const result = await lint(`enum lowerCase {}`);
    expect(result.messages.length).toBe(1);
    expect(result.messages[0].ruleId).toBe(
      '@typescript-eslint/naming-convention'
    );
  });

  test('enum member', async () => {
    const result = await lint(`enum MyEnum { member }`);
    expect(result.messages.length).toBe(1);
    expect(result.messages[0].ruleId).toBe(
      '@typescript-eslint/naming-convention'
    );
  });
});

describe('comma operator', () => {
  test('chained expressions', async () => {
    const result = await lint(`
      async function main() {
        await Promise.resolve(Date.now()),
        await Promise.resolve(Date.now())
      }
    `);

    expect(result.messages.length).toBe(1);
    expect(result.messages[0].ruleId).toBe('no-sequences');
  });
});

describe('type imports', () => {
  test('type only imports', async () => {
    const result = await lint(`
      import { type File } from 'node:fs';
    `);

    expect(result.messages.length).toBe(1);
    expect(result.messages[0].ruleId).toBe(
      '@typescript-eslint/no-import-type-side-effects'
    );
  });

  test('type imports', async () => {
    const result = await lint(`
      import type { File } from 'node:fs';
    `);

    expect(result.messages.length).toBe(0);
  });

  test('unused value imports', async () => {
    const result = await lint(`
      import { File } from 'node:fs';

      export function processFile(f: File) {
        void f;
      }
    `);

    expect(result.messages.length).toBe(1);
  });

  test('unused type imports', async () => {
    const result = await lint(`
      import type { File } from 'node:fs';

      export function processFile(f: unknown) {
        void f;
      }
    `);

    expect(result.messages.length).toBe(0);
  });
});
