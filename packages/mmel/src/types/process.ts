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

export interface Subprocess {
  id: string;

  // XXX: Rename to “children”
  childs: SubprocessComponent[];

  edges: Edge[];
  data: SubprocessComponent[];
}

interface SubprocessComponent {
  element: Node | null;
  x: number;
  y: number;
}

interface Edge {
  id: string;
  from: SubprocessComponent | null;
  to: SubprocessComponent | null;
  description: string;
  condition: string;
}
