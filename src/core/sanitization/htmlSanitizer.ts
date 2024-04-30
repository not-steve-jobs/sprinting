import xss from 'xss';

const xssOptions = {
  stripIgnoreTag: true,
  stripIgnoreTagBody: true,
};

export function sanitizeHtml(value: string): string {
  return xss(value, xssOptions);
}

export function sanitize(object: any, properties: string[]): any {
  properties.forEach((p) => {
    if (object[p]) {
      object[p] = sanitizeHtml(object[p]);
    }
  });

  return object;
}

export function sanitizeAll(object: any): any {
  Object.keys(object).forEach((p) => {
    if (object[p] && typeof object[p] === 'string') {
      object[p] = sanitizeHtml(object[p]);
    }
  });

  return object;
}
