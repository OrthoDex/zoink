import * as request from "request";
import * as sharp from "sharp";
import * as fs from "fs";

const fetchImageStream = (imageUrl: string) => request(imageUrl);

const createImageTransformStream = () => sharp().resize(200, 200).png();

const writeImageToDisk = () => fs.createWriteStream("/.tmp/tmp-zoink.png");

const doIt = (imageUrl: string) => {
  return fetchImageStream(imageUrl).pipe(createImageTransformStream());
};

export { doIt };
