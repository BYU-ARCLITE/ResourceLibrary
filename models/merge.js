
/*
 * This merges src into target
 */
function merge(target, src) {
    if (target instanceof Array) {

        // Array merge
        // For now just overwrite
        target = src;
        return target;
    } else {

        // Object merge
        Object.keys(src).forEach(function (key) {
            if (target.hasOwnProperty(key) && typeof target[key] === "object") {
                target[key] = merge(target[key], src[key]);
            } else {
                target[key] = src[key];
            }
        });
        return target;
    }
}

module.exports = merge;