export default function() {
    // 16-05-2015 09:50
    const d = new Date()
    const datestring = ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1 )).slice(-2) + '-' +
    d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);

    return datestring
}
