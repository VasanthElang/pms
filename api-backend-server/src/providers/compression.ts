import { compress, decompress } from 'compress-json';

export const pack = (actualJSON:Object) => compress(actualJSON);

export const unpack = (compressedJSON:any) => decompress(compressedJSON);
