// Via https://www.reddit.com/r/StableDiffusion/comments/15c3rf6/comment/jtvi4hd/

const sdxlTrainedResolutions = new Set([
  // SDXL Base resolution
  "1024x1024",
  // SDXL Resolutions, widescreen
  "2048x512",
  "1984x512",
  "1920x512",
  "1856x512",
  "1792x576",
  "1728x576",
  "1664x576",
  "1600x640",
  "1536x640",
  "1472x704",
  "1408x704",
  "1344x704",
  "1344x768",
  "1280x768",
  "1216x832",
  "1152x832",
  "1152x896",
  "1088x896",
  "1088x960",
  "1024x960",
  // SDXL Resolutions, portrait
  "960x1024",
  "960x1088",
  "896x1088",
  "896x1152",
  "832x1152",
  "832x1216",
  "768x1280",
  "768x1344",
  "704x1408",
  "704x1472",
  "640x1536",
  "640x1600",
  "576x1664",
  "576x1728",
  "576x1792",
  "512x1856",
  "512x1920",
  "512x1984",
  "512x2048",
]);

export default sdxlTrainedResolutions;
