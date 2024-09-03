const truncateStr = (text: string, maxLength = 25, ellipsis = "…") =>
  text.length > maxLength ? `${text.slice(0, maxLength - 1)}${ellipsis}` : text;

export default truncateStr;
