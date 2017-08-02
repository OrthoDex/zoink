import { IncomingMessage, ServerResponse } from "http";
import * as pathToRegexp from "path-to-regexp";
import * as validUrl from "valid-url";

/* types */
type ImageOpts = {
  q: number;
  f: string;
  w?: number;
  h?: number;
  [key: string]: string | number | undefined;
};
type ImageOptionNames = "q" | "f";
type ImageOptionKeys = Array<ImageOptionNames>;

/* regexes */
// https://regex101.com/r/NJd1Pc/1
const VALID_IMAGE_OPTION_PATH = /^(?:[a-z0-9]+_[a-z0-9]+,?)+/;
const ImageOptionsKeys: ImageOptionKeys = ["q", "f"];
const defaultImageOpts: ImageOpts = {
  q: 60,
  f: "auto"
};
const PATH_OPTS_REGEX = "/:imageOpts/:imagePath";
const re = pathToRegexp(PATH_OPTS_REGEX);

const getImageOptsFromPath = (imageOptsPath: string): ImageOpts => {
  const opts = imageOptsPath.split(",");
  return opts.reduce((acc, opt) => {
    const [imageKey, imageValue, ...remaining] = opt.split("_");
    const isSupportedOption = ImageOptionsKeys.includes(
      <ImageOptionNames>imageKey
    );
    const isValidOptionValue = imageValue || false;
    if (isSupportedOption && isValidOptionValue) acc[imageKey] = imageValue;
    return acc;
  }, defaultImageOpts);
};

const isValidImageOptions = (imageOptionsPath: string) =>
  VALID_IMAGE_OPTION_PATH.test(imageOptionsPath);

const extractOptsFromPath = (reqUrl: string) => {
  const pathParams = re.exec(reqUrl);
  if (pathParams === null) {
    throw Error(
      "badly formatted url path - should be of the form `/options/fetchUrl`"
    );
  }
  const [_, imageOptionsPath, encodedFetchImageUrl] = pathParams;

  const fetchImageUrl = decodeURIComponent(encodedFetchImageUrl);
  const isValidFetchImageUrl = validUrl.isWebUri(fetchImageUrl);
  if (!isValidFetchImageUrl) throw Error("no valid fetch image url was passed");
  return {
    imageOptionsPath,
    fetchImageUrl
  };
};

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  const { url } = req;
  const safeUrl = url || "";

  try {
    const { fetchImageUrl, imageOptionsPath } = extractOptsFromPath(safeUrl);
    const imageOpts = getImageOptsFromPath(imageOptionsPath);
    res.writeHead(200);
    res.write(JSON.stringify({ fetchImageUrl, imageOpts }));
    res.end();
  } catch (error) {
    console.error(error);
    res.writeHead(400);
    res.write(error.message);
    res.end();
    return;
  }
};

export default requestHandler;
