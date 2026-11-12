const GROUP_NAME = /^[\p{ID_Start}$_][\p{ID_Continue}$\u200C\u200D]*$/u;

export function assertGroupName(name) {
  if (!GROUP_NAME.test(name)) {
    throw `Invalid capture group name: ${name}`;
  }
}
