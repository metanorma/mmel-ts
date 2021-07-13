import type Metadata from '../../types/Metadata';
import type { Dumper, Parser } from '../types';
import { removePackage, tokenizePackage } from '../tokenize';

export const parseMetadata: Parser = function (token) {
  const metadata: Metadata = {
    schema: '',
    author: '',
    title: '',
    edition: '',
    namespace: '',
  };

  if (token !== '') {
    const t: string[] = tokenizePackage(token);
    let i = 0;

    while (i < t.length) {
      const keyword: string = t[i++];
      if (i < t.length) {
        if (keyword === 'title') {
          metadata.title = removePackage(t[i++]);
        } else if (keyword === 'schema') {
          metadata.schema = removePackage(t[i++]);
        } else if (keyword === 'edition') {
          metadata.edition = removePackage(t[i++]);
        } else if (keyword === 'author') {
          metadata.author = removePackage(t[i++]);
        } else if (keyword === 'namespace') {
          metadata.namespace = removePackage(t[i++]);
        } else {
          throw new Error(
            'Parsing error: metadata. Unknown keyword ' + keyword
          );
        }
      } else {
        throw new Error(
          'Parsing error: metadata. Expecting value for ' + keyword
        );
      }
    }
  }

  return ctx => ({ ...ctx, metadata });
};

export const dumpMetadata: Dumper<Metadata> = function (meta) {
  let out = 'metadata {\n';
  out += '  title "' + meta.title + '"\n';
  out += '  schema "' + meta.schema + '"\n';
  out += '  edition "' + meta.edition + '"\n';
  out += '  author "' + meta.author + '"\n';
  out += '  namespace "' + meta.namespace + '"\n';
  out += '}\n';
  return out;
};
