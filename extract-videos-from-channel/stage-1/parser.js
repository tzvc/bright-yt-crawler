return {
  thumbnails: $("#thumbnail > yt-image > img")
    .toArray()
    .map((e) => $(e).attr("src")),
};
