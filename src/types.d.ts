/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
declare type Quality = ["q", number];
declare type Format = ["f", ImageTransformFormats];
declare type Width = ["w", number];
declare type Height = ["h", number];
export declare type ImageOptionNames = "q" | "f" | "w" | "h";
export declare type ImageOptionValues = string | number;
export declare type ImageOptionPair = Quality | Format | Width | Height;
export declare type ImageOptionPairs = Array<ImageOptionPair>;
export declare type FetchImageTypes = "webp" | "jpeg" | "jpg" | "png";
export declare type ImageTransformFormats = "webp" | "jpg" | "png";
declare const requestHandler: (
  req: IncomingMessage,
  res: ServerResponse
) => void;
export default requestHandler;
