import {
  Edge,
  ResolvableEdge,
  ResolvableSubprocess,
  ResolvableSubprocessComponent,
  Subprocess,
  SubprocessComponent,
} from '../../types/flow';
import { resolveFromContext } from '../resolve';
import { removePackage, tokenizePackage } from '../tokenize';
import { Dumper, Parser, Resolver, SubprocessParseContext } from '../types';

// Parsers

export const parseSubprocess: Parser = function (id, data) {
  let result: SubprocessParseContext = {
    id: id,
    childs: [],
    edges: [],
    data: [],
    _relations: {
      childs: [],
      edges: [],
      data: [],
    },
    _components: {},
  };
  if (data !== '') {
    const t: string[] = tokenizePackage(data);
    let i = 0;
    while (i < t.length) {
      const keyword: string = t[i++];
      if (i < t.length) {
        if (keyword === 'elements') {
          result = parseElements(removePackage(t[i++]))(result);
        } else if (keyword === 'process_flow') {
          result = parseEdges(removePackage(t[i++]))(result);
        } else if (keyword === 'data') {
          result = parseData(removePackage(t[i++]))(result);
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
};

const parseElements: Parser<SubprocessParseContext> = function (data: string) {
  const t: string[] = tokenizePackage(data);
  const elements: Record<string, ResolvableSubprocessComponent> = {};
  let i = 0;
  while (i < t.length) {
    const name: string = t[i++];
    if (i < t.length) {
      const id = name.trim();
      elements[id] = readSubprocessComponent(id, t[i++]);
    } else {
      throw new Error(
        `Parsing error: elements in subprocess. Expecting value for ${name}`
      );
    }
  }
  return ctx => ({
    ...ctx,
    _components: { ...ctx._components, ...elements },
    _relations: { ...ctx._relations, childs: Object.values(elements) },
  });
};

const parseData: Parser<SubprocessParseContext> = function (data: string) {
  const t: string[] = tokenizePackage(data);
  const elements: Record<string, ResolvableSubprocessComponent> = {};
  let i = 0;
  while (i < t.length) {
    const name: string = t[i++];
    if (i < t.length) {
      const id = name.trim();
      elements[id] = readSubprocessComponent(id, t[i++]);
    } else {
      throw new Error(
        'Parsing error: data in subprocess. Expecting value for ' + name
      );
    }
  }
  return ctx => ({
    ...ctx,
    _components: { ...ctx._components, ...elements },
    _relations: { ...ctx._relations, data: Object.values(elements) },
  });
};

const parseEdges: Parser<SubprocessParseContext> = function (data: string) {
  const t: string[] = tokenizePackage(data);
  const edges: Record<string, ResolvableEdge> = {};
  let i = 0;
  while (i < t.length) {
    const id: string = t[i++].trim();
    if (i < t.length) {
      edges[id] = readEdge(id.trim(), t[i++]);
    } else {
      throw new Error(
        `Parsing error: edges in subprocess. Expecting value for ${id}`
      );
    }
  }
  return ctx => ({
    ...ctx,
    _relations: { ...ctx._relations, edges: Object.values(edges) },
  });
};

function readSubprocessComponent(
  elm: string,
  data: string
): ResolvableSubprocessComponent {
  const com: ResolvableSubprocessComponent = {
    element: null,
    x: 0,
    y: 0,
    _relations: {
      element: elm,
    },
  };

  const t: string[] = tokenizePackage(data);
  let i = 0;
  while (i < t.length) {
    const keyword: string = t[i++];
    if (i < t.length) {
      if (keyword === 'x') {
        com.x = parseFloat(t[i++]);
      } else if (keyword === 'y') {
        com.y = parseFloat(t[i++]);
      } else {
        throw new Error(
          'Parsing error: components in subprocess. Element ' +
            elm +
            ': Unknown keyword ' +
            keyword
        );
      }
    } else {
      throw new Error(
        'Parsing error: edges in subprocess. Expecting value for ' + keyword
      );
    }
  }
  return com;
}

function readEdge(id: string, data: string): ResolvableEdge {
  const edge: ResolvableEdge = {
    id: id,
    from: null,
    to: null,
    description: '',
    condition: '',
    _relations: {
      from: '',
      to: '',
    },
  };

  const t: string[] = tokenizePackage(data);
  let i = 0;
  while (i < t.length) {
    const command: string = t[i++];
    if (i < t.length) {
      if (command === 'from') {
        edge._relations.from = t[i++];
      } else if (command === 'description') {
        edge.description = removePackage(t[i++]);
      } else if (command === 'condition') {
        edge.condition = removePackage(t[i++]);
      } else if (command === 'to') {
        edge._relations.to = t[i++];
      } else {
        throw new Error(
          'Parsing error: process flow. ID ' +
            id +
            ': Unknown keyword ' +
            command
        );
      }
    } else {
      throw new Error(
        'Parsing error: process flow. ID ' +
          id +
          ': Expecting value for ' +
          command
      );
    }
  }
  return edge;
}

// Dumpers

export const dumpSubprocess: Dumper<Subprocess> = function (sub) {
  let out: string = 'subprocess ' + sub.id + ' {\n';
  out += '  elements {\n';
  sub.childs.forEach(x => {
    out += dumpSubprocessComponent(x);
  });
  out += '  }\n';
  out += '  process_flow {\n';
  sub.edges.forEach(e => {
    out += dumpEdge(e);
  });
  out += '  }\n';
  out += '  data {\n';
  sub.data.forEach(d => {
    out += dumpSubprocessComponent(d);
  });
  out += '  }\n';
  out += '}\n';
  return out;
};

function dumpSubprocessComponent(com: SubprocessComponent): string {
  if (com.element === null) {
    return '';
  }
  let out: string = '    ' + com.element.id + ' {\n';
  out += '      x ' + com.x + '\n';
  out += '      y ' + com.y + '\n';
  out += '    }\n';
  return out;
}

function dumpEdge(edge: Edge): string {
  let out: string = '    ' + edge.id + ' {\n';
  if (edge.from !== null && edge.from.element !== null) {
    out += '      from ' + edge.from.element.id + '\n';
  }
  if (edge.to !== null && edge.to.element !== null) {
    out += '      to ' + edge.to.element.id + '\n';
  }
  if (edge.description !== '') {
    out += '      description "' + edge.description + '"\n';
  }
  if (edge.condition !== '') {
    out += '      condition "' + edge.condition + '"\n';
  }
  out += '    }\n';
  return out;
}
