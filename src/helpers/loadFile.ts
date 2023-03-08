import { readFile } from "fs/promises"

/** Loads a file from the filesystem and returns a base64 encoded data URL. */
export const loadFile = async (path: string) => {
  const mimeType = guessMimeType(path)
  const content = await readFile(path, "base64")
  return `data:${mimeType};base64,${content}`
}

const guessMimeType = (path: string) => {
  const extension = path.split(".").pop()
  const mimeTypesByExtension = {
    "aac": "audio/aac",
    "abw": "application/x-abiword",
    "arc": "application/octet-stream",
    "avi": "video/x-msvideo",
    "azw": "application/vnd.amazon.ebook",
    "bin": "application/octet-stream",
    "bz": "application/x-bzip",
    "bz2": "application/x-bzip2",
    "csh": "application/x-csh",
    "css": "text/css",
    "csv": "text/csv",
    "doc": "application/msword",
    "epub": "application/epub+zip",
    "gif": "image/gif",
    "htm": "text/html",
    "html": "text/html",
    "ico": "image/x-icon",
    "ics": "text/calendar",
    "jar": "application/java-archive",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "application/javascript",
    "json": "application/json",
    "mid": "audio/midi",
    "midi": "audio/midi",
    "mpeg": "video/mpeg",
    "mp3": "audio/mpeg",
    "mp4": "video/mp4",
    "mpkg": "application/vnd.apple.installer+xml",
    "odp": "application/vnd.oasis.opendocument.presentation",
    "ods": "application/vnd.oasis.opendocument.spreadsheet",
    "odt": "application/vnd.oasis.opendocument.text",
    "oga": "audio/ogg",
    "ogv": "video/ogg",
    "ogx": "application/ogg",
    "pdf": "application/pdf",
    "ppt": "application/vnd.ms-powerpoint",
    "rar": "application/x-rar-compressed",
    "rtf": "application/rtf",
    "sh": "application/x-sh",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tar": "application/x-tar",
    "tif": "image/tiff",
    "tiff": "image/tiff",
    "ttf": "font/ttf",
    "vsd": "application/vnd.visio",
    "wav": "audio/x-wav",
    "weba": "audio/webm",
    "webm": "video/webm",
    "webp": "image/webp",
    "woff": "font/woff",
    "woff2": "font/woff2",
    "xhtml": "application/xhtml+xml",
    "xls": "application/vnd.ms-excel",
    "xml": "application/xml",
    "xul": "application/vnd.mozilla.xul+xml",
    "zip": "application/zip",
    "3gp": "video/3gpp",
    "3g2": "video/3gpp2",
    "7z": "application/x-7z-compressed",
  } as Record<string, string | undefined>

  const typeByExtension = mimeTypesByExtension[extension ?? ""]

  if (typeByExtension) {
    return typeByExtension
  }

  return "application/octet-stream"
}
