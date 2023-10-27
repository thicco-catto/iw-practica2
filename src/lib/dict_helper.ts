export function ArraysEqual<T>(a: Array<T>, b: Array<T>) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    a.sort();
    b.sort();
  
    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

export function HasAllKeys(obj: object, keys: string[]) {
    const keysInObj: string[] = [];

    for (const key in obj) {
        keysInObj.push(key);
    }

    return ArraysEqual(keys, keysInObj);
}