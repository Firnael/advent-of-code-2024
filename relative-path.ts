import * as path from 'https://deno.land/std@0.102.0/path/mod.ts';
export {path};

export const mainModuleDir = path.dirname(path.fromFileUrl(Deno.mainModule));