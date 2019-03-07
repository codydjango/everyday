const map = new WeakMap()
let index = 0;

export default function weakKey(obj) {
    let key = map.get(obj)
    if (key) return key

    key = 'weak-key-' + index++
    map.set(obj, key)

    return key
}
