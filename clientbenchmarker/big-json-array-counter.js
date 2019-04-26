var fs = require('fs');
const StreamArray = require('stream-json/streamers/StreamArray');

const pipeline = fs.createReadStream('packages.json')
  .pipe(StreamArray.withParser());

var i = 0;

pipeline.on('data', data => {
    i++;
    if (i % 10000 == 0) {
        console.log('Read ', i, ' packages. Sample keyval:', data.value);
    }
});

pipeline.on('end', () => {
    console.log(i, ' packages read.');
});