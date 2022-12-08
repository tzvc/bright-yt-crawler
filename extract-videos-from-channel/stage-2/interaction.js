// Stage 2 - Extract Video infos

let networkError;
function getYouTubeVideoId(url) {
  var regex = /[?&]v=([^&#]*)/;
  var results = regex.exec(url);
  return results && results[1] ? results[1] : null;
}
block([
  "*.png*",
  "*.jpg*",
  "*.mp4*",
  "*.mp3*",
  "*.svg*",
  "*.webp*",
  "*google.com*",
  "*facebook.com*",
]);
let ERR_SSL_PROTOCOL_ERROR_COUNTER = 0;
verify_requests(({ url, error, type, response }) => {
  if (url.includes("https://www.youtube.com/s/desktop/")) networkError = error;
  if (type == "ERR_SSL_PROTOCOL_ERROR") ERR_SSL_PROTOCOL_ERROR_COUNTER++;
  if (ERR_SSL_PROTOCOL_ERROR_COUNTER > 10)
    throw new Error("too many errors ERR_SSL_PROTOCOL_ERROR");
});

let url = input.url;
console.log("Navigating");
navigate(url, {
  wait_until: "navigate",
  referer: "https://www.youtube.com",
  timeout: 12e4,
});
console.log("Waiting for pl");

try {
  wait('[id="description"]', { timeout: 30000 });
} catch (e) {
  throw new Error("The page was not loaded successfully. " + networkError);
}
wait("#snippet", { timeout: 15000 });
click("#snippet");
wait_page_idle(1000);
click(
  "#button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill"
);
wait_page_idle(1000);
click(
  "#items > ytd-menu-service-item-renderer > tp-yt-paper-item > yt-formatted-string"
);
scroll_to("bottom");
wait_page_idle(1000);
parsed = parse();
collect({
  channel_id: input.channel_id,
  video_id: getYouTubeVideoId(input.url),
  thumbnail: input.thumbnail,
  title: parsed.title,
  description: parsed.description,
  view_count: parsed.view_count,
  like_count: parsed.like_count,
  comment_count: parsed.comment_count,
  transcript: parsed.transcript,
  published_date: parsed.published_date,
});
