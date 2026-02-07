const normalizeBasePath = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") {
    return "";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/+$/, "");
};

export const APP_BASE_PATH = normalizeBasePath(
  process.env.NEXT_PUBLIC_BASE_PATH
);

export function withBasePath(path: string) {
  if (!APP_BASE_PATH) {
    return path;
  }
  if (!path || path === "/") {
    return `${APP_BASE_PATH}/`;
  }
  return `${APP_BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

export function stripBasePath(pathname: string) {
  if (!APP_BASE_PATH) {
    return pathname;
  }
  if (pathname === APP_BASE_PATH) {
    return "/";
  }
  if (pathname.startsWith(`${APP_BASE_PATH}/`)) {
    return pathname.slice(APP_BASE_PATH.length);
  }
  return pathname;
}
