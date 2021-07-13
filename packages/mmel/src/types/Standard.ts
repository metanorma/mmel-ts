import type Approval from './Approval';
import type { DataClass, Enum, Registry, Variable } from './data';
import type Gateway from './Gateway';
import type Metadata from './Metadata';
import type Process from './process';
import type { Subprocess } from './process';
import type Provision from './Provision';
import type Reference from './Reference';
import type Role from './Role';

export default interface Standard {
  meta: Metadata;

  roles: Role[];
  provisions: Provision[];
  pages: Subprocess[];
  processes: Process[];
  dataclasses: DataClass[];
  regs: Registry[];
  events: Event[];
  gateways: Gateway[];
  refs: Reference[];
  approvals: Approval[];
  enums: Enum[];
  vars: Variable[];

  root: Subprocess | null;
}
