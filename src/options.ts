export const imageTransformFormats = ["webp", "jpg", "png"];

// typescript does not pass
// any run time information :(
// @todo move to a typeof
export const imageOptions = [
  "q", //quality
  "f", //format
  "w", //width
  "h" //height
];

export const defaultImageOpts = {
  q: 80,
  f: "jpg"
};
