export function isObject(something) {
    return typeof something === 'object' && something !== null;
}
export function hasTruthyKey(something, key) {
    return isObject(something) && key in something && Boolean(something[key]);
}
export function isRegExpExecArray(something) {
    if (!Array.isArray(something)) {
        return false;
    }
    if (typeof something[0] !== 'string') {
        return false;
    }
    if (!('index' in something && 'input' in something)) {
        return false;
    }
    return true;
}
// TODO: remove when .filter(o => o !== undefined) works.
export function filterNonNullable() {
    return (o) => o !== null && o !== undefined;
}
//# sourceMappingURL=generic-types.js.map