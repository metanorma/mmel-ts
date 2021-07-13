import parse from './parse';
import resolve from './resolve';
import _dump from './dump';
import Standard from '../types/Standard';
import { PARSER_CONFIG, RESOLVER_CONFIG, DUMPER_CONFIG } from './config';

export function load(mmelString: string): Standard {
  const context = parse(mmelString, PARSER_CONFIG);
  return resolve(context, RESOLVER_CONFIG);
}

export function dump(standard: Standard): string {
  return _dump(standard, DUMPER_CONFIG);
}
