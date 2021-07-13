import Node from './Node';
import Resolvable from './Resolvable';

export interface Subprocess {
  id: string;

  // TODO: Rename to “children”
  childs: SubprocessComponent[];

  edges: Edge[];
  data: SubprocessComponent[];
}

export type ResolvableSubprocess = Subprocess & {
  _relations: {
    childs: ResolvableSubprocessComponent[];
    edges: ResolvableEdge[];
    data: ResolvableSubprocessComponent[];
  };
};

export interface SubprocessComponent {
  element: Node | null;
  x: number;
  y: number;
}

export type ResolvableSubprocessComponent = Resolvable<
  SubprocessComponent,
  'element'
>;

export interface Edge {
  id: string;
  from: SubprocessComponent | null;
  to: SubprocessComponent | null;
  description: string;
  condition: string;
}

export type ResolvableEdge = Resolvable<Edge, 'from' | 'to'>;
