import * as request from "request";
import * as sharp from "sharp";
import * as validUrl from "valid-url";
import { ImageOptionPairs, ImageOptionNames, ImageOptionValues } from "./types";

const defaultImageOpts = {
  q: 80,
  f: "jpg"
};

const imageOptions = [
  "q", //quality
  "f", //format
  "w", //width
  "h" //height
];

const getImageOptsFromPath = (imageOptsPath: string): ImageOptionPairs => {
  const opts = imageOptsPath.split(",");
  return opts.reduce((acc, opt) => {
    const [imageKey, imageValue, ...remaining] = opt.split("_");
    const isSupportedOption = imageOptions.includes(imageKey);
    const isValidOptionValue = imageValue || false;
    if (isSupportedOption && isValidOptionValue)
      acc.push([<ImageOptionNames>imageKey, <ImageOptionValues>imageValue]);
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

const createImageTransformStream = (imageOpts: ImageOptionPairs) => {
  const imageTransformer = sharp();
  return imageTransformer;
};

const zoink = (imageOptionsPath: string, fetchImageUrl: string) => {
  const imageOpts = getImageOptsFromPath(imageOptionsPath);
  const imageTransformStream = createImageTransformStream(imageOpts);
  return fetchImageStream(fetchImageUrl).pipe(imageTransformStream);
};

export { zoink, decodeAndValidateFetchImageUrl };
