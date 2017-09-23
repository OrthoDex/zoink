/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
export declare type ImageOptionNames = "q" | "f" | "w" | "h";
export declare type ImageOptionValues = string | number;
export declare type ImageOptionPairs = Array<
  [ImageOptionNames, ImageOptionValues]
>;
declare const requestHandler: (
  req: IncomingMessage,
  res: ServerResponse
) => void;
export default requestHandler;
