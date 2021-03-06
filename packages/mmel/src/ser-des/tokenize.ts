export default function tokenize(x: string): string[] {
  const set: string[] = [];
  let t = '';
  let i = 0;
  while (i < x.length) {
    let char: string = x.charAt(i);
    if (!isWhiteSpace(char)) {
      t += char;
      i++;
      if (char === '"') {
        while (i < x.length && x.charAt(i) !== '"') {
          t += x.charAt(i);
          i++;
        }
        t += x.charAt(i);
        i++;
      } else if (char === '{') {
        let count = 1;
        while (i < x.length && count > 0) {
          char = x.charAt(i);
          if (char === '{') {
            count++;
          }
          if (char === '}') {
            count--;
          }
          t += char;
          i++;
        }
        i++;
      } else {
        while (i < x.length && !isWhiteSpace(x.charAt(i))) {
          t += x.charAt(i);
          i++;
        }
      }
      set.push(t);
      t = '';
    } else {
      i++;
    }
  }
  return set;
}

export function tokenizePackage(x: string): Array<string> {
  return tokenize(removePackage(x));
}

export function removePackage(x: string): string {
  if (x.length >= 2) {
    return x.substr(1, x.length - 2);
  } else {
    return x;
  }
}

export function tokenizeAttributes(x: string): Array<string> {
  x = removePackage(x);
  const set: Array<string> = [];
  let t = '';
  let i = 0;
  while (i < x.length) {
    let char: string = x.charAt(i);
    if (!isWhiteSpace(char)) {
      t += char;
      i++;
      if (char === '{') {
        let count = 1;
        while (i < x.length && count > 0) {
          char = x.charAt(i);
          if (char === '{') {
            count++;
          }
          if (char === '}') {
            count--;
          }
          t += char;
          i++;
        }
        i++;
      } else {
        while (i < x.length && x.charAt(i) !== '{') {
          t += x.charAt(i);
          i++;
        }
      }
      set.push(t);
      t = '';
    } else {
      i++;
    }
  }
  return set;
}

function isWhiteSpace(x: string): boolean {
  return /\s/.test(x);
}
