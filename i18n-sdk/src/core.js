/**
 * 递归解析嵌套对象路径，例如 resolvePath(data, 'main.appName')
 */
export function resolvePath(obj, path) {
    if (!obj || typeof obj !== 'object')
        return null;
    const keys = path.split('.');
    let current = obj;
    for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
            current = current[k];
        }
        else {
            return null;
        }
    }
    return typeof current === 'string' ? current : null;
}
/**
 * 变量插值，例如 interpolate("Hello {name}", { name: 'Bob' }) -> "Hello Bob"
 */
export function interpolate(text, params) {
    if (!params)
        return text;
    return text.replace(/\{(\w+)\}/g, (_, key) => {
        return params[key] !== undefined ? String(params[key]) : `{${key}}`;
    });
}
