// Stage 1 - Get Channels from Query

let colection_time = new Date(Date.now() + 6.2 * 60000);
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

let query = input.query;

let url = new URL(
  "https://www.youtube.com/results?search_query=" +
    query +
    "&sp=EgIQAQ%253D%253D"
);
navigate(url, { wait_until: "navigate" });
wait("ytd-video-renderer.ytd-item-section-renderer", { timeout: 60e3 });

let links = [];
wait("ytd-masthead #guide-icon");
if (el_exists("[guide-persistent-and-visible]"))
  click("ytd-masthead #guide-icon");

wait(5e3);
let length_before = 0;
let retry_count = 5;
while (retry_count > 0 && links.length < 100) {
  if (colection_time <= Date.now()) {
    break;
  }

  scroll_to("bottom", { immediate: true });
  wait_page_idle(2000, { timeout: 65000 });

  let links_ = parse().links;
  if (links_.length == length_before) retry_count--;
  length_before = links_.length;
  links = [...new Set([...links, ...links_])];
  console.log(links.length, links_.length);
}

for (let i of links) {
  next_stage({ url: "https://www.youtube.com" + i, query: input.query });
}
