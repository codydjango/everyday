export default function(fn, duration) {
    let timer = false
    return function(...args) {
        if (timer) return
        fn(...args)
        timer = true
        setTimeout(() => (timer = false), duration)
    }
}
