import parse from './parse';
import resolve from './resolve';
import Standard from '../types/Standard';
import { PARSER_CONFIG, RESOLVER_CONFIG } from './config';

export function load(mmelString: string): Standard {
  const context = parse(mmelString, PARSER_CONFIG);
  return resolve(context, RESOLVER_CONFIG);
}
