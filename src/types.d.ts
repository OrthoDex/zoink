/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
export declare type ImageOpts = {
  q: number;
  f: string;
  w?: number;
  h?: number;
  [key: string]: string | number | undefined;
};
declare const requestHandler: (
  req: IncomingMessage,
  res: ServerResponse
) => void;
export default requestHandler;
