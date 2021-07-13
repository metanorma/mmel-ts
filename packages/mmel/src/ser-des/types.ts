import type Resolvable from '../types/Resolvable';
import type { DataClass, Enum, Registry, Variable } from '../types/data';
import type Metadata from '../types/Metadata';
import type { ResolvableProcess } from '../types/process';
import type { ResolvableSubprocess } from '../types/flow';
import type { ResolvableProvision } from '../types/Provision';
import type { ResolvableApproval } from '../types/Approval';
import type Reference from '../types/Reference';
import type Role from '../types/Role';
import type Standard from '../types/Standard';
import type Gateway from '../types/Gateway';
import type EventNode from '../types/events';


// Configuration

/* Maps an MMEL keyword to parser function. */
export interface ParserConfiguration {
  [keyword: string]: {
    takesID?: true;
    parse: Parser;
  };
}

/* Maps an item type to corresponding resolver function. */
export type ResolverConfiguration = Partial<
  Record<
    keyof ParseContext,
    {
      resolve: Resolver<any, any>;
    }
  >
>;

/* Maps a standard property to dumper function. */
export type DumperConfiguration = {
  // TODO: Handle meta and root the same generic way.
  [key in keyof Omit<Standard, 'meta' | 'root'>]: Dumper<Standard[key][number]>;
};


// Functions

/* Parser function takes tokens and returns a function that updates parse context.
   The number of tokens depends on takesID value in its ParserConfiguration entry. */
export type Parser<C = ParseContext> =
  (...tokens: string[]) => (ctx: C) => C;

/* Resolver function takes finalized parse context and an incomplete object,
   and replaces any references from the incomplete object with full referenced objects. */
export type Resolver<T, R extends Resolvable<T, any>, C = ParseContext> =
  (ctx: C, resolvableObject: R) => T;

/* Dumper function takes any structure and returns a string. */
export type Dumper<T> = (obj: T) => string;


// Helper types

/* Collects the entire standard state during initial parsing.
   Is updated by keyword parser functions,
   and later is used by object resolver functions. */
export interface ParseContext {
  root: string;
  metadata: Metadata | null;
  roles: Record<string, Role>;

  approvals: Record<string, ResolvableApproval>;
  provisions: Record<string, ResolvableProvision>;
  processes: Record<string, ResolvableProcess>;
  pages: Record<string, ResolvableSubprocess>;

  // XXX: Make resolvable
  registers: Record<string, Registry>;
  references: Record<string, Reference>;
  dataClasses: Record<string, DataClass>;
  events: Record<string, EventNode>;
  enums: Record<string, Enum>;
  gateways: Record<string, Gateway>;
  variables: Record<string, Variable>;
}
