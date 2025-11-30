export function hash(password: string): Promise<string>;
export function verify(password: string, hashStr: string): Promise<boolean>;
