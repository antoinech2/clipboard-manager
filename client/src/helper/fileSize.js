export function fileSize(size) {
    var i = Math.floor(Math.log(size) / Math.log(1024));
    return ((size / Math.pow(1024, i)).toFixed(2) * 1).toLocaleString("fr-Fr") + ' ' + ['o', 'Ko', 'Mo', 'Go', 'To'][i];
}