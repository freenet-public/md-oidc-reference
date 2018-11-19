function removeQuery(uri) {
  const e = uri.indexOf('?', 8);

  return e !== -1 ? uri.substring(0, uri.indexOf('?', 8)) : uri;
}

export default removeQuery;
