const ghpages = require('gh-pages');

ghpages.publish('dist', function(err) {
    console.log('done')
    console.log((err) ? err : 'success')
});
