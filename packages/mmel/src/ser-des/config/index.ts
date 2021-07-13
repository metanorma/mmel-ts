import type {
  DumperConfiguration,
  ParserConfiguration,
  ResolverConfiguration,
} from '../types';
import { dumpApproval, parseApproval, resolveApproval } from './approval';
import { dumpDataClass, dumpEnum, dumpRegistry, dumpVariable, parseDataClass, parseEnum, parseRegistry, resolveDataClass, resolveRegistry } from './data';
import { dumpEvent, parseEndEvent, parseSignalCatchEvent, parseStartEvent, parseTimerEvent } from './event';
import { dumpGateway, parseExclusiveGate } from './gateway';

import { parseMetadata } from './metadata';
import { parseProcess, resolveProcess, dumpProcess, dumpSubprocess } from './process';
import { parseProvision, resolveProvision, dumpProvision } from './provision';
import { dumpReference } from './reference';
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

  approval: {    
    takesID: true,
    parse: parseApproval,
  },

  class: {
    takesID: true,
    parse: parseDataClass,
  },

  enum: {
    takesID: true,
    parse: parseEnum,
  },

  data_registry: {
    takesID: true,
    parse: parseRegistry,
  },

  exclusive_gateway: {
    takesID: true,
    parse: parseExclusiveGate,
  },

  start: {
    takesID: true,
    parse: parseStartEvent,
  },
  
  end: {
    takesID: true,
    parse: parseEndEvent,
  },
  
  signalcatch: {
    takesID: true,
    parse: parseSignalCatchEvent,
  },
  timer: {
    takesID: true,
    parse: parseTimerEvent,
  }
};

export const RESOLVER_CONFIG: ResolverConfiguration = {
  provisions: {
    resolve: resolveProvision,
  },
  processes: {
    resolve: resolveProcess,
  },
  approvals: {
    resolve: resolveApproval,
  },
  dataClasses: {
    resolve: resolveDataClass,
  },
  registers: {
    resolve: resolveRegistry,
  }
};

/*
  Parser & resolver implementation status

  Already done:
  if (keyword == "root") {
    ctx.root = token[i++].trim()
  } else if (keyword == "metadata") {
    m.meta = parseMetaData(token[i++])
  } else if (keyword == "role") {
    let r = parseRole(token[i++], token[i++])
    m.roles.push(r)
    map.roles.set(r.id, r)
  } else if (keyword == "provision") {
    let p = parseProvision(token[i++], token[i++])
    container.p_provisions.push(p)
    map.provisions.set(p.content.id, p.content)
  } else if (keyword == "process") {
    let p = parseProcess(token[i++], token[i++])
    container.p_processes.push(p)
    map.nodes.set(p.content.id, p.content)

  XXX: Migrate these:
  } else if (keyword == "class") {
    let p = parseDataClass(token[i++], token[i++])
    container.p_dataclasses.push(p)
    map.nodes.set(p.content.id, p.content)
    map.dcs.set(p.content.id, p.content)
  } else if (keyword == "data_registry") {
    let p = parseRegistry(token[i++], token[i++])
    container.p_regs.push(p)
    map.regs.set(p.content.id, p.content)
    map.nodes.set(p.content.id, p.content)
  } else if (keyword == "start_event") {
    let p = parseStartEvent(token[i++], token[i++])
    m.events.push(p)
    map.nodes.set(p.id, p)
  } else if (keyword == "end_event") {
    let p = parseEndEvent(token[i++], token[i++])
    m.events.push(p)
    map.nodes.set(p.id, p)
  } else if (keyword == "timer_event") {
    let p = parseTimerEvent(token[i++], token[i++])
    m.events.push(p)
    map.nodes.set(p.id, p)
  } else if (keyword == "exclusive_gateway") {
    let p = parseEGate(token[i++], token[i++])
    m.gateways.push(p)
    map.nodes.set(p.id, p)
  } else if (keyword == "subprocess") {
    let p = parseSubprocess(token[i++], token[i++])
    container.p_pages.push(p)
    map.pages.set(p.content.id, p.content)
  } else if (keyword == "reference") {
    let p = parseReference(token[i++], token[i++])
    m.refs.push(p)
    map.refs.set(p.id, p)
  } else if (keyword == "approval") {
    let p = parseApproval(token[i++], token[i++])
    container.p_approvals.push(p)
    map.nodes.set(p.content.id, p.content)
  } else if (keyword == "enum") {
    let p = parseEnum(token[i++], token[i++])
    m.enums.push(p)
  } else if (keyword == "measurement") {
    let v = parseVariable(token[i++], token[i++])
    m.vars.push(v)
  } else if (keyword == "signal_catch_event") {
    let e = parseSignalCatchEvent(token[i++], token[i++])
    m.events.push(e)
    map.nodes.set(e.id, e)
  } else {
    console.error("Unknown command " + keyword)
    break
  }

*/

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
