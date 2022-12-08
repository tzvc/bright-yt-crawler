return {
  links: $("#video-title-link")
    .toArray()
    .map((e) => $(e).attr("href"))
    .filter((v) => v),
};
