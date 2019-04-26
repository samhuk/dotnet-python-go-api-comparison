var apiBenchmark = require('api-benchmark');
var fs = require('fs');

// == program configuration ==
var services = {
    python: 'http://127.0.0.1:5002/',
    dotnet: 'http://127.0.0.1:5000/api/',
    go: 'http://127.0.0.1:8000/',
};
var routes = {
    users: { method: 'get', route: 'users' }
};
var options = { runMode: 'parallel', minSamples: 200 }
var concurrencyValues = [1,3,5,10,20,30,40,50,60,80,100];
var numRepeats = 4;
// =============================

// == program start ==
var timesOfServices_series = [];

var numConcurrencyValues = concurrencyValues.length;
var numServices = Object.keys(services).length;
(nextConcurrencyValue = (i) => {
    if (i < numConcurrencyValues) {
        console.log('Beginning benchmarking for concurrency ' + concurrencyValues[i] + '...');
        options.maxConcurrentRequests = concurrencyValues[i];
        var times_ms_means = [0,0,0];
        (nextRepeat = (j) => {
            if (j < numRepeats) {
                process.stdout.write('Beginning repeat ' + (j+1) + '...');
                apiBenchmark.measure(services, routes, options, (err, results) => {
                    if (err) {
                        console.log('Error: ', err)
                        exit(1)
                    } else {
                        console.log('Done!')
                        var times_ms = extractMeansFromResults(results);
                        for (var k = 0; k<numServices; k++) {
                            times_ms_means[k] += times_ms[k];
                        }
                    }
                    nextRepeat(j+1);
                });
            } else {
                for (var k = 0; k < numServices; k++) {
                    times_ms_means[k] = (times_ms_means[k]/numRepeats).toFixed(2);
                }
                timesOfServices_series.push(times_ms_means);
                nextConcurrencyValue(i+1);
            }
        })(0)
    } else {
        completed();
    }
})(0)

var completed = function() {
    writeResultsToFile();
}

var writeResultsToFile = function () {
    var fileString = '';
    fileString += '# Number of Repeats: ' + numRepeats + '\n';
    fileString += 'Concurrency Value, ' + Object.keys(services).join(' (ms), ') 
        + ', go vs python (%), ' + 'go vs dotnet (%)' + '\n';
    for(var i = 0; i < numConcurrencyValues; i++) {
        fileString += concurrencyValues[i].toString() + ', ' 
            + timesOfServices_series[i].join(',  ')
            + (timesOfServices_series[i][2] - timesOfServices_series[i][0]) + ',  '
            + (timesOfServices_series[i][2] - timesOfServices_series[i][1]) + '\n';
    }

    // calculate averages of differences between services 3 and 1 and services 3 and 2
    let sum31, sum32 = 0;
    for (var i = 0; i<numConcurrencyValues; i++) {
        sum31 += (timesOfServices_series[i][2] - timesOfServices_series[i][0]);
        sum32 += (timesOfServices_series[i][2] - timesOfServices_series[i][1]);
    }

    fileString += ',,,Mean Diff (%):,' + ((sum31/numConcurrencyValues)*100).toFixed(2) + ', ' + ((sum32/numConcurrencyValues)*100).toFixed(2);
    fs.writeFileSync('results.csv', fileString);
}

var extractMeansFromResults = function(results) {
    var services = Object.keys(results);
    var routes = Object.keys(results[services[0]]);
    var times_ms = [];
    for (var i = 0; i < services.length; i++) {
        let time_ms = results[services[i]][routes[0]].stats.singleMean * 1000;
        times_ms.push(parseFloat(time_ms.toFixed(2)));
    }
    return times_ms;
}