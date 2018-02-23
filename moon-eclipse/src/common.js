export function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

export function isSafari () {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export function isDiff(a, b) {
    if (a && b) {
        return a.toString() !== b.toString();
    }
    return false;
}
