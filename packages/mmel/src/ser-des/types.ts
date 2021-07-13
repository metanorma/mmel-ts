import type Resolvable from '../types/Resolvable';
import type { DataClass, Registry } from '../types/data';
import type Metadata from '../types/Metadata';
import type { ResolvableProcess, ResolvableSubprocess } from '../types/process';
import type { ResolvableProvision } from '../types/Provision';
import type Reference from '../types/Reference';
import type Role from '../types/Role';
import Standard from '../types/Standard';

export type DumperConfiguration = {
  [key in keyof Omit<Standard, 'meta' | 'root'>]: Dumper<Standard[key][number]>;
};

export type Dumper<T> = (obj: T) => string;

/* Collects state during initial parsing.
   Is updated by keyword parser functions,
   and later is used by object resolver functions. */
export interface ParseContext {
  root: string;
  metadata: Metadata | null;
  roles: Record<string, Role>;

  provisions: Record<string, ResolvableProvision>;
  processes: Record<string, ResolvableProcess>;
  pages: Record<string, ResolvableSubprocess>;

  // XXX: Make resolvable
  registers: Record<string, Registry>;
  references: Record<string, Reference>;
  dataClasses: Record<string, DataClass>;
  events: Record<string, Event>;
}

/* Maps an MMEL keyword to parser function. */
export interface ParserConfiguration {
  [keyword: string]: {
    takesID?: true;
    parse: Parser;
  };
}

/* Parser function takes tokens and returns a function that updates parse context.
   The number of tokens depends on takesID value in its ParserConfiguration entry. */
export type Parser = (
  ...tokens: string[]
) => (ctx: ParseContext) => ParseContext;

/* Maps an item type to corresponding resolver function. */
export type ResolverConfiguration = Partial<
  Record<
    keyof ParseContext,
    {
      resolve: Resolver<any, any>;
    }
  >
>;

/* Resolver function takes finalized parse context and an incomplete object,
   and replaces any references from the incomplete object with full referenced objects. */
export type Resolver<T, R extends Resolvable<T, any>> = (
  ctx: ParseContext,
  resolvableObject: R
) => T;
