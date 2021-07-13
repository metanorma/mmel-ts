import Standard from '../types/Standard';
import { ParseContext, ResolverConfiguration } from './types';
import { Resolvable } from '../types/Resolvable';

export function resolveFromContext(
  ctx: ParseContext,
  field: keyof ParseContext,
  id: string
) {
  const item = ctx[field][id];
  if (item !== undefined) {
    if (item._relations) {
      throw new Error(
        `Error in resolving ${field}::${id}: related item unresolved`
      );
    }
    return item;
  } else {
    throw new Error(`Error in resolving ${field}::${id}: not found`);
  }
}

export default function resolve(
  ctx: ParseContext,
  resolvers: ResolverConfiguration
): Standard {
  function resolveRelations<T>(
    partName: keyof typeof resolvers,
    id: string,
    item: Resolvable<T, any>
  ): T {
    const resolvedItem = resolvers[partName].resolve(ctx, item);
    // Mark item as resolved
    delete resolvedItem._relations;
    // Update context with resolved item
    ctx[partName][id] = resolvedItem;
    return resolvedItem;
  }

  const standard: Standard = {
    meta: ctx.metadata,
    roles: [],
    provisions: [],
    pages: [],
    processes: [],
    dataclasses: [],
    regs: [],
    events: [],
    gateways: [],
    refs: [],
    approvals: [],
    enums: [],
    vars: [],
    root: null,
  };

  for (const [id, item] of Object.entries(ctx.provisions)) {
    standard.provisions.push(resolveRelations('provisions', id, item));
  }

  return standard;
}
