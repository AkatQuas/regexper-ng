const ICONS = {
  code: require('lucide/dist/esm/icons/code.js').default,
  download: require('lucide/dist/esm/icons/download.js').default,
  document: require('lucide/dist/esm/icons/file-text.js').default,
  github: require('lucide/dist/esm/icons/github.js').default,
  gitlab: require('lucide/dist/esm/icons/gitlab.js').default,
  link: require('lucide/dist/esm/icons/link.js').default,
  list: require('lucide/dist/esm/icons/list.js').default,
  warning: require('lucide/dist/esm/icons/triangle-alert.js').default,
};

const DEFAULT_ATTRS = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  'aria-hidden': 'true',
};

const STROKE_ATTRS = {
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};

const FILL_ATTRS = {
  fill: 'currentColor',
  stroke: 'none',
};

function escapeAttr(value) {
  return String(value).replace(/"/g, '&quot;');
}

function isClosedPath(d) {
  return /z\s*$/i.test(String(d).trim());
}

function resolvePathAttrs(pathAttrs) {
  const style = isClosedPath(pathAttrs.d) ? FILL_ATTRS : STROKE_ATTRS;

  return { ...pathAttrs, ...style };
}

function serializeNode([tag, attrs, children]) {
  const resolvedAttrs = tag === 'path' ? resolvePathAttrs(attrs) : attrs;
  const attrStr = resolvedAttrs
    ? Object.entries(resolvedAttrs)
        .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
        .join(' ')
    : '';

  if (!children || children.length === 0) {
    return attrStr ? `<${tag} ${attrStr}/>` : `<${tag}/>`;
  }

  return `<${tag} ${attrStr}>${children.map(serializeNode).join('')}</${tag}>`;
}

function iconNodeToSvg(iconNode, customAttrs = {}) {
  const attrs = { ...DEFAULT_ATTRS, ...customAttrs };
  const attrStr = Object.entries(attrs)
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(' ');
  const inner = iconNode.map(serializeNode).join('');

  return `<svg ${attrStr}>${inner}</svg>`;
}

function icon(name) {
  const iconNode = ICONS[name];

  if (!iconNode) {
    throw new Error(`Unknown icon: ${name}`);
  }

  return iconNodeToSvg(iconNode);
}

module.exports = { icon, iconNodeToSvg, ICONS };
