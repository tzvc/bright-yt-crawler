// Stage 2 - Get Channel Info

let networkError;
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
for (let s of [
  "/featured",
  "/videos",
  "/playlists",
  "/community",
  "/channels",
]) {
  if (url?.endsWith(s)) url = url.replace(s, "/about");
}
if (!url?.endsWith("/about")) url += "/about";

navigate(url, {
  wait_until: "navigate",
  referer: "https://www.youtube.com",
  timeout: 12e4,
});
wait_page_idle(2000);
try {
  wait('[id="description"]', { timeout: 12e4 });
} catch (e) {
  throw new Error("The page was not loaded successfully. " + networkError);
}
wait_page_idle(2000);
parsed = parse();
next_stage({
  name: parsed.name,
  channel_id: input.url.split("/")[3].replace("@", ""),
  subscribers_count: parsed.subscribers,
  video_count: 0,
  view_count: parsed.views,
  about: parsed.description,
  joined_date: parsed.date_joined,
  query: input.query,
});
