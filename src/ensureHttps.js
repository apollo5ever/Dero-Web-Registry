export default function ensureHttps(url) {
    if (!url.startsWith('http')) {
      return 'http://' + url;
    }
    return url;
  }
