import { IncomingMessage, ServerResponse } from "http";
import * as pathToRegexp from "path-to-regexp";
import { zoink, decodeAndValidateFetchImageUrl } from "./imageOps";

// https://regex101.com/r/NJd1Pc/1
const VALID_IMAGE_OPTION_PATH = /^(?:[a-z0-9]+_[a-z0-9]+,?)+/;
const PATH_OPTS_REGEX = "/:imageOpts/:imagePath";
const re = pathToRegexp(PATH_OPTS_REGEX);

const isValidImageOptions = (imageOptionsPath: string) =>
  VALID_IMAGE_OPTION_PATH.test(imageOptionsPath);

const extractPathParams = (reqUrl: string) => {
  const pathParams = re.exec(reqUrl);
  if (pathParams === null) {
    throw Error(
      "badly formatted url path - should be of the form `/options/fetchUrl`"
    );
  }
  return pathParams;
};

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  const { url } = req;
  const safeUrl = url || "";

  try {
    const pathParams = extractPathParams(safeUrl);
    const [_, imageOptionsPath, encodedFetchImageUrl] = pathParams;
    const fetchImageUrl = decodeAndValidateFetchImageUrl(encodedFetchImageUrl);
    // no errors so far - inputs are valid
    res.writeHead(200);
    zoink(imageOptionsPath, fetchImageUrl).pipe(res);
  } catch (error) {
    console.error(error);
    res.writeHead(400);
    res.write(error.message);
    res.end();
    return;
  }
};

export default requestHandler;
