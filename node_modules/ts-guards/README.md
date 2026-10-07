# Type Guards

A collection of generic type guards to check runtime variables in TypeScript.

## How-to?

- Install the [npm package ts-guards](https://www.npmjs.com/package/ts-guards)
  ```bash
  npm i ts-guards
  ```
- Use the package
  ```javascript
  import { asserts, primitiveType } from 'ts-guards';

  let x = "a string";

  // Type of x inferred inside the if statement as: let x: string
  if(primitiveType.isString(x)) { console.log(x); }

  // Type of x inferred after the call as: 
  // Throws an error if type doesn't match
  asserts.isString(x);

  // Properties of object inferred (if object does not have an x and a y property, it throws an error)
  asserts.areObjectPropertiesOf({ x: "y", y: "x" }, ["x", "y"]);

  // Type of x inferred inside the if statement as: let x: string
  if(isLiteral(x, "x" as const)) { x }

  // Type of x inferred inside the if statement as: let x: "x" | 1 | "y" | "z"
  if(isLiteralType(x, new Set([ "x", 1, "y", "z" ] as const))) { x }
  ```

## Why?

TypeScript helps only with compile time validation, you need to check anything coming from IO at runtime. TypeScript runtime validation relies upon [type guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types).

Type guards take a parameter `x as unknown`, denoting [variables whose type we do not know](https://www.typescriptlang.org/docs/handbook/basic-types.html#unknown).

There are two styles of validation: one relying on `x is T`; another relying on `asserts x is T`.

The former can be used in conditional cases (returns a boolean), the latter for input validation (throws an error).

One might consider that functions given a wrong parameter can’t answer the question they’re supposed to, hence they should throw an error, hence the `asserts x is T` style (error throwing).

All of `asserts x is T` style functions rely upon and have a `x is T` counterpart. Both validation styles trigger TypeScript type inference.

In some cases, type guards may take a parameter `x: T` to catter for output type inference.
