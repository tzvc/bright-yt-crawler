return {
  links: $("#metadata yt-formatted-string#text > a")
    .toArray()
    .map((e) => $(e).attr("href"))
    .filter((v) => v),
};
