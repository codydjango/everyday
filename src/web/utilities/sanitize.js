import DOMPurify from 'dompurify'

export default function(html) {
    return DOMPurify.sanitize(html)
}
