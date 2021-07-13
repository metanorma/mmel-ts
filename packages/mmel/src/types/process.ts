import { Resolvable } from './Resolvable';
import { Registry } from './data';
import Node from './Node';
import Provision from './Provision';
import Role from './Role';

export default interface Process {
  // extends Node?
  id: string;
  name: string;
  modality: string;
  actor: Role | null;
  output: Registry[];
  input: Registry[];
  provision: Provision[];
  page: Subprocess | null;
  measure: string[];
}

export type ResolvableProcess = Resolvable<
  Process,
  'actor' | 'output' | 'input' | 'provision' | 'page'
>;

export interface Subprocess {
  id: string;

  // TODO: Rename to “children”
  childs: SubprocessComponent[];

  edges: Edge[];
  data: SubprocessComponent[];
}

export type ResolvableSubprocess = Resolvable<
  Subprocess,
  'childs' | 'edges' | 'data'
>;

export interface SubprocessComponent {
  element: Node | null;
  x: number;
  y: number;
}

export interface Edge {
  id: string;
  from: SubprocessComponent | null;
  to: SubprocessComponent | null;
  description: string;
  condition: string;
}
