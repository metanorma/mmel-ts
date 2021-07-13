import type {
  DumperConfiguration,
  ParserConfiguration,
  ResolverConfiguration,
} from '../types';

import { parseMetadata } from './metadata';
import { parseProcess, resolveProcess, dumpProcess } from './process';
import { parseProvision, resolveProvision, dumpProvision } from './provision';
import { parseRole, dumpRole } from './role';

export const PARSER_CONFIG: ParserConfiguration = {
  root: {
    parse: token => ctx => ({ ...ctx, root: token.trim() }),
  },

  metadata: {
    parse: parseMetadata,
  },

  role: {
    takesID: true,
    parse: parseRole,
  },

  provision: {
    takesID: true,
    parse: parseProvision,
  },

  process: {
    takesID: true,
    parse: parseProcess,
  },
};

export const RESOLVER_CONFIG: ResolverConfiguration = {
  provisions: {
    resolve: resolveProvision,
  },
  processes: {
    resolve: resolveProcess,
  },
};

export const DUMPER_CONFIG: DumperConfiguration = {
  roles: dumpRole,
  processes: dumpProcess,
  provisions: dumpProvision,

  // XXX: Define dumpers
  approvals: dumpApproval,
  events: dumpEvent,
  gateways: dumpGateway,
  enums: dumpEnum,
  dataclasses: dumpDataClass,
  regs: dumpRegistry,
  pages: dumpSubprocess,
  vars: dumpVariable,
  refs: dumpReference,
};
