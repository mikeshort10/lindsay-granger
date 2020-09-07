import { between, ordNumber, max, leq, geq } from "fp-ts/lib/Ord";
import { pipe } from "fp-ts/lib/pipeable";
import { A, O, NEA } from ".";
import { strictEqual } from "fp-ts/lib/Eq";
import { MoveCode, ValidCode } from "../types";
import { Predicate, Endomorphism } from "fp-ts/lib/function";

export const isBetween = between(ordNumber);

const compareArrays = <T>(fn: (a: T, b: T) => boolean) => {
  return (arr1: T[]) => (arr2: T[]) => {
    return (
      arr1.length === arr2.length &&
      arr1.reduce((acc, curr, i) => acc && fn(arr2[i], curr), true)
    );
  };
};

export const curry2 = <A, B, C>(fn: (a: A, b: B) => C) => {
  return (a: A) => (b: B): C => fn(a, b);
};

export const isMoveCode = (code: ValidCode): code is MoveCode => code !== 65;

export const equalOrdArray = compareArrays(strictEqual);

export const lessThanOrEqualArray = compareArrays(leq(ordNumber));

export const greatThanOrEqualArray = compareArrays(geq(ordNumber));

export const modifyWhere = <K, T = Record<string, K>>(
  condition: Predicate<T>,
  mod: Endomorphism<T>
) => {
  return (ts: T[]) => {
    return pipe(
      ts,
      A.findIndex(condition),
      O.chain((i) => A.modifyAt(i, mod)(ts))
    );
  };
};

export const atLeastZero = (n: number) => max(ordNumber)(0, n);

export const trace = <T>(fn?: (x: T) => any) => (x: T) => {
  console.log(fn);
  fn ? console.log(fn(x)) : console.log(x);
  return x;
};

console.assert({ ...new Map() } instanceof Map, "Not an instance of Map");

export const isNonEmptyArray = <T>(arr: T[]): arr is NEA.NonEmptyArray<T> =>
  arr[0] != null;

export const foldPredicates = <A>(fas: Array<(a?: A) => boolean>) => {
  return (a: A): boolean => {
    if (!isNonEmptyArray(fas)) {
      return true;
    } else if (fas[0](a) === false) {
      return false;
    }
    return foldPredicates(fas.slice(1))(a);
  };
};

console.assert(
  !foldPredicates([(a?: number) => a === 1, (a?: number) => a === 2])(1)
);
console.assert(
  foldPredicates([(a?: number) => a === 1, (a?: number) => a === 1])(1)
);
console.assert(
  !foldPredicates([(a?: number) => a === 2, (a?: number) => a === 2])(1)
);

export const chainFromPredicate = <A>(p: Predicate<A>) =>
  O.chain(O.fromPredicate(p));
