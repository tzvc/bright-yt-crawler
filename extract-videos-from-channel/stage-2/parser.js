function convertLiteralToNumber(literal) {
  const regex = /[kmbt]$/i;
  const suffix = literal.match(regex);
  if (!suffix) return literal;
  let multiplier;
  switch (suffix[0].toLowerCase()) {
    case "k":
      multiplier = 1000;
      break;
    case "m":
      multiplier = 1000000;
      break;
    default:
      return literal;
  }
  const number = parseFloat(literal.replace(regex, ""));
  return number * multiplier;
}

function removeTimecodes(str) {
  return str.replace(/\d+:\d+/g, "");
}

return {
  title: $("#title > h1 > yt-formatted-string").text().trim(),
  description: $("#description-inline-expander > yt-formatted-string")
    .text()
    .trim(),
  view_count: convertLiteralToNumber(
    $("#info > span:nth-child(1)")
      .text()
      .replace(" views", "")
      .replace(/,/g, "")
  ),
  like_count: convertLiteralToNumber(
    $(
      "#segmented-like-button > ytd-toggle-button-renderer > yt-button-shape > button > div.cbox.yt-spec-button-shape-next--button-text-content"
    )
      .text()
      .replace(/,/g, "")
  ),
  comment_count: convertLiteralToNumber(
    $("#count > yt-formatted-string > span:nth-child(1)")
      .text()
      .replace(/,/g, "")
  ),
  published_date: $("#info > span:nth-child(3)").text(),
  transcript: removeTimecodes($("#segments-container").text()),
};
