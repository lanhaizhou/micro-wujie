/**
 * 递归解析嵌套对象路径，例如 resolvePath(data, 'main.appName')
 */
export declare function resolvePath(obj: any, path: string): string | null;
/**
 * 变量插值，例如 interpolate("Hello {name}", { name: 'Bob' }) -> "Hello Bob"
 */
export declare function interpolate(text: string, params?: Record<string, any>): string;
