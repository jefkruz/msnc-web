const SHARE_KEYS = ['auth', 'authRole', 'roles', 'permissions', 'menu', 'impersonation', 'appName', 'branding'];

let lastShare = null;

export function rememberShare(props) {
  if (!props?.auth) {
    return;
  }
  lastShare = {};
  SHARE_KEYS.forEach((key) => {
    lastShare[key] = props[key];
  });
}

export function readShare() {
  return lastShare;
}

export function clearShare() {
  lastShare = null;
}
