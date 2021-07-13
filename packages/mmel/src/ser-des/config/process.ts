import Process, { Edge, ResolvableProcess, ResolvableSubprocess, Subprocess, SubprocessComponent } from '../../types/process';
import { resolveFromContext } from '../resolve';
import { removePackage, tokenizePackage } from '../tokenize';
import { Dumper, Parser, Resolver } from '../types';

export const parseSubprocess: Parser = function (id, data) {
  const result: ResolvableSubprocess = {    
    id: id,
    childs: [],
    edges: [],
    data: [],
    _relations: {
      childs: [],
      edges: [],
      data: [],
    }      
  };
  if (data != "") {
    const t: Array<string> = tokenizePackage(data);
    let i: number = 0;
    while (i < t.length) {
      let keyword: string = t[i++];
      if (i < t.length) {
        if (keyword == "elements") {
          readElements(result, removePackage(t[i++]));
        } else if (keyword == "process_flow") {
          readEdges(result, removePackage(t[i++]));            
        } else if (keyword == "data") {
          readData(result, removePackage(t[i++]));
        } else {
          throw new Error(
            `Parsing error: subprocess. ID ${id}: Unknown keyword ${keyword}`
          );
        }
      } else {
        throw new Error(
          `Parsing error: subprocess. ID ${id}: Expecting value for ${keyword}`
        );
      }
    }
  }
  return ctx => ({ ...ctx, pages: { ...ctx.pages, [id]: result } });
}

function readElements(sub:ResolvableSubprocess, data: string) {
  const t: Array<string> = tokenizePackage(data);
  let i: number = 0;
  while (i < t.length) {
    const name: string = t[i++];
    if (i < t.length) {
      const id = name.trim();
      const nc = parseSubprocessComponent(id, t[i++]);
      sub.p_childs.push(nc);
    } else {
      throw new Error(
        `Parsing error: elements in subprocess. Expecting value for ${name}`
      );
    }
  }
}

function readData(sub:ResolvableSubprocess, data: string) {
  const t: Array<string> = tokenizePackage(data);
  let i: number = 0;
  while (i < t.length) {
    const name: string = t[i++];
    if (i < t.length) {
      let id = name.trim();
      let nc = parseSubprocessComponent(id, t[i++]);
      sub.p_data.push(nc);
      sub.map.set(id, nc.content);
    } else {
      throw new Error('Parsing error: data in subprocess. Expecting value for ' + name)
    }
  }
}

function readEdges(sub:ResolvableSubprocess, data: string) {
  let t: Array<string> = tokenizePackage(data);
  let i: number = 0;
  while (i < t.length) {      
    let id: string = t[i++];
    if (i < t.length) {
      sub.p_edges.push(parseEdge(id.trim(), t[i++]));
    } else {
      throw new Error('Parsing error: edges in subprocess. Expecting value for ' + id);
    }
  }
}

export const parseProcess: Parser = function (id, data) {
  const result: ResolvableProcess = {
    id: id,
    name: '',
    modality: '',
    actor: null,
    output: [],
    input: [],
    provision: [],
    page: null,
    measure: [],
    _relations: {
      actor: '',
      output: [],
      input: [],
      provision: [],
      page: '',
    },
  };

  if (data !== '') {
    const t: string[] = tokenizePackage(data);
    let i = 0;
    while (i < t.length) {
      const keyword: string = t[i++];
      if (i < t.length) {
        if (keyword === 'modality') {
          result.modality = t[i++];
        } else if (keyword === 'name') {
          result.name = removePackage(t[i++]);
        } else if (keyword === 'actor') {
          result._relations.actor = t[i++];
        } else if (keyword === 'subprocess') {
          result._relations.page = t[i++];
        } else if (keyword === 'validate_provision') {
          result._relations.provision = tokenizePackage(t[i++]);
        } else if (keyword === 'validate_measurement') {
          result.measure = tokenizePackage(t[i++]).flatMap(x =>
            removePackage(x)
          );
        } else if (keyword === 'output') {
          result._relations.output = tokenizePackage(t[i++]);
        } else if (keyword === 'reference_data_registry') {
          result._relations.input = tokenizePackage(t[i++]);
        } else {
          throw new Error(
            `Parsing error: process. ID ${id}: Unknown keyword ${keyword}`
          );
        }
      } else {
        throw new Error(
          `Parsing error: process. ID ${id}: Expecting value for ${keyword}`
        );
      }
    }
  }
  return ctx => ({ ...ctx, processes: { ...ctx.processes, [id]: result } });
};

export const resolveProcess: Resolver<Process, ResolvableProcess> = function (
  ctx,
  unresolved
) {
  const p = { ...unresolved };
  for (const id of unresolved._relations.output) {
    p.output.push(resolveFromContext(ctx, 'registers', id));
  }
  for (const id of unresolved._relations.input) {
    p.input.push(resolveFromContext(ctx, 'registers', id));
  }
  for (const id of unresolved._relations.provision) {
    p.provision.push(resolveFromContext(ctx, 'provisions', id));
  }
  if (unresolved._relations.actor !== '') {
    p.actor = resolveFromContext(ctx, 'roles', unresolved._relations.actor);
  }
  if (unresolved._relations.page !== '') {
    p.page = resolveFromContext(ctx, 'pages', unresolved._relations.page);
  }
  return p;
};

export const dumpProcess: Dumper<Process> = function (process) {
  let out: string = 'process ' + process.id + ' {\n';
  out += '  name "' + process.name + '"\n';
  if (process.actor !== null) {
    out += '  actor ' + process.actor.id + '\n';
  }
  if (process.modality !== '') {
    out += '  modality ' + process.modality + '\n';
  }
  if (process.input.length > 0) {
    out += '  reference_data_registry {\n';
    for (const dr of process.input) {
      out += '    ' + dr.id + '\n';
    }
    out += '  }\n';
  }
  if (process.provision.length > 0) {
    out += '  validate_provision {\n';
    for (const r of process.provision) {
      out += '    ' + r.id + '\n';
    }
    out += '  }\n';
  }
  if (process.measure.length > 0) {
    out += '  validate_measurement {\n';
    for (const v of process.measure) {
      out += '    "' + v + '"\n';
    }
    out += '  }\n';
  }
  if (process.output.length > 0) {
    out += '  output {\n';
    for (const c of process.output) {
      out += '    ' + c.id + '\n';
    }
    out += '  }\n';
  }
  if (process.page !== null) {
    out += '  subprocess ' + process.page.id + '\n';
  }
  out += '}\n';
  return out;
};

export const dumpSubprocess: Dumper<Subprocess> = function (sub) {
  let out: string = "subprocess " + sub.id + " {\n";
  out += "  elements {\n";
  sub.childs.forEach((x) => {
    out += dumpSubprocessComponent(x);
  });
  out += "  }\n";
  out += "  process_flow {\n";
  sub.edges.forEach((e) => {
    out += dumpEdge(e);
  })
  out += "  }\n";
  out += "  data {\n";
  sub.data.forEach((d) => {
    out += dumpSubprocessComponent(d);
  });
  out += "  }\n";
  out += "}\n";
  return out;  
}

function dumpSubprocessComponent(com:SubprocessComponent): string {
  if (com.element == null) {
    return "";
  }
  let out: string = "    " + com.element.id + " {\n";
  out += "      x " + com.x + "\n";
  out += "      y " + com.y + "\n";
  out += "    }\n";
  return out;
}

function dumpEdge(edge:Edge):string {
  let out: string = "    " + edge.id + " {\n";
  if (edge.from != null && edge.from.element != null) {
    out += "      from " + edge.from.element.id + "\n";
  }
  if (edge.to != null && edge.to.element != null) {
    out += "      to " + edge.to.element.id + "\n";
  }
  if (edge.description != "") {
    out += "      description \"" + edge.description + "\"\n";
  }
  if (edge.condition != "") {
    out += "      condition \"" + edge.condition + "\"\n";
  }
  out += "    }\n";
  return out;
}