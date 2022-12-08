// Stage 3 - Get video count

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

let url = `https://www.youtube.com/@${input.channel_id}/videos`;

navigate(url, {
  wait_until: "navigate",
  referer: "https://www.youtube.com",
  timeout: 12e4,
});
wait_page_idle(2000);
try {
  wait('[id="contents"]', { timeout: 12e4 });
} catch (e) {
  throw new Error("The page was not loaded successfully. " + networkError);
}

let length_before = 0;
let retry_count = 5;
let links = [];
while (retry_count > 0) {
  scroll_to("bottom", { immediate: true });
  wait_page_idle(2000, { timeout: 65000 });

  let links_ = parse().links;
  if (links_.length == length_before) retry_count--;
  length_before = links_.length;
  links = [...new Set([...links, ...links_])];
  console.log(links.length, links_.length);
}

collect({
  tet: "yes",
  name: input.name,
  channel_id: input.channel_id,
  subscribers_count: input.subscribers_count,
  view_count: input.view_count,
  about: input.about,
  joined_date: input.joined_date,
  query: input.query,
  video_count: links.length,
});
