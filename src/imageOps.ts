import * as request from "request";
import * as sharp from "sharp";
import * as validUrl from "valid-url";
import {
  imageOptions,
  imageTransformFormats,
  defaultImageOpts
} from "./options";
import { isValidInt } from "./utils";
import {
  ImageOptionPairs,
  ImageOptionNames,
  ImageOptionPair,
  ImageOptionValues,
  FetchImageTypes,
  ImageTransformFormats
} from "./types";

const isValidImageFormat = (
  imageFormat: ImageOptionValues
): ImageTransformFormats => {
  // if ()
  if (imageTransformFormats.includes(String(imageFormat)))
    return <ImageTransformFormats>imageFormat;
  throw new Error("not a valid transform image format");
};

const isValidImageValue = (key: ImageOptionNames, value: ImageOptionValues) => {
  if (key === "q" && isValidInt(value)) return true;
  if (key === "f" && isValidImageFormat(value)) return true;
};

const getImageOptsFromPath = (imageOptsPath: string): ImageOptionPairs => {
  const opts = imageOptsPath.split(",");
  return opts.reduce((acc, opt) => {
    const [imageKey, imageValue, ...remaining] = opt.split("_");
    const isSupportedOption = imageOptions.includes(imageKey);
    const isValidOptionValue = imageValue || false;
    if (isSupportedOption && isValidOptionValue) {
      const tmpOption: ImageOptionPair = [
        <ImageOptionNames>imageKey,
        <ImageOptionValues>imageValue
      ];
      acc.push(tmpOption);
    }
    return acc;
  }, <ImageOptionPairs>[]);
};

const decodeAndValidateFetchImageUrl = (
  encodedFetchImageUrl: string
): string => {
  const fetchImageUrl = decodeURIComponent(encodedFetchImageUrl);
  const isValidFetchImageUrl = validUrl.isWebUri(fetchImageUrl);
  if (!isValidFetchImageUrl) throw Error("no valid fetch image url was passed");
  return fetchImageUrl;
};

const fetchImageStream = (imageUrl: string) => request(imageUrl);

// super hacky, but since we are using steams
// not easy way to figure out what the
// Content Tpe header is a priori
// For now use the approximation of the file
// name, which should be good enough for most
// use cases
// @todo - investigate any potential security
// vulns because of this
const getImageFormatFromUrl = (fetchImageUrl: string): FetchImageTypes => {
  if (fetchImageUrl.endsWith(".jpg") || fetchImageUrl.endsWith(".jpeg")) {
    return "jpeg";
  }
  if (fetchImageUrl.endsWith(".webp")) {
    return "webp";
  }
  if (fetchImageUrl.endsWith(".png")) {
    return "png";
  }
  throw new Error("Unsupported fetch image format");
};

const applyFormatChangeOption = (
  accSharpInstance: sharp.SharpInstance,
  toImageFormat: ImageOptionValues,
  currentImageFormat: ImageOptionValues
): sharp.SharpInstance => {
  if (toImageFormat === currentImageFormat) return accSharpInstance;
  if (toImageFormat === "jpg" || toImageFormat === "jpeg") {
    return accSharpInstance.jpeg();
  }
  if (toImageFormat === "webp") {
    return accSharpInstance.webp();
  }
  if (toImageFormat === "png") {
    return accSharpInstance.png();
  }
};

// For the transformations
// we create a pipeline of
// <sharp, format, operations>
// with preserving format, since
// some operations need to be aware
// of the format of the previous
// stage of the pipeline
const applySharpOptions = (
  accSharpInstance: sharp.SharpInstance,
  optionName: ImageOptionNames,
  optionValue: ImageOptionValues,
  currentImageFormat: FetchImageTypes
) => {};

const createImageTransformStream = (
  imageOpts: ImageOptionPairs,
  imageFormat: string
) =>
  imageOpts.reduce(
    ([s, format], [name, value]) => {
      return [s, format];
    },
    [sharp(), imageFormat]
  );

const zoink = (imageOptionsPath: string, fetchImageUrl: string) => {
  const imageOpts = getImageOptsFromPath(imageOptionsPath);
  const fetchImageFormat = getImageFormatFromUrl(fetchImageUrl);
  const imageTransformStream = createImageTransformStream(
    imageOpts,
    fetchImageFormat
  );
  return fetchImageStream(fetchImageUrl).pipe(imageTransformStream);
};

export { zoink, decodeAndValidateFetchImageUrl };
