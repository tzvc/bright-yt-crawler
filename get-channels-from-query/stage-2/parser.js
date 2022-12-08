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

let subscribers =
  $("#subscriber-count")
    .text()
    .trim()
    ?.match(/\d+\.?\d+[A-Z]?/)?.[0] ||
  $("#subscriber-count").text().trim()?.match(/\d+/)?.[0] ||
  "hidden subscribers";

return {
  name: $("div#channel-header-container div#container div#tooltip")
    .text()
    .trim(),
  subscribers: convertLiteralToNumber(subscribers.trim()),
  description: $("div#description-container > #description").text().trim(),
  date_joined: $(
    "div#right-column > .style-scope.ytd-channel-about-metadata-renderer > span"
  )
    .text()
    .trim()
    .replace("Joined ", ""),
  views: convertLiteralToNumber(
    $(
      "div#right-column .style-scope.ytd-channel-about-metadata-renderer[no-styles]"
    )
      .text()
      .trim()
      .replace(" views", "")
      .replace(/,/g, "")
  ),
};
