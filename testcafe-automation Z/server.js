const { exec } = require('child_process');
const createTestCafe = require('testcafe');
const net = require('net');

let testcafe = null;

function checkPort(port) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();

        server.once('error', err => {
            if (err.code === 'EADDRINUSE') {
                reject(new Error(`Port ${port} is already in use`));
            } else {
                reject(err);
            }
        });

        server.once('listening', () => {
            server.close();
            resolve();
        });

        server.listen(port);
    });
}

async function startTests() {
    try {
        await checkPort(3000);
        await checkPort(3001);

        // Start the server app
        const serverApp = exec('npm start', { cwd: 'devicesTask_serverApp' });

        serverApp.stdout.on('data', data => {
            console.log(`serverApp stdout: ${data}`);
        });

        serverApp.stderr.on('data', data => {
            console.error(`serverApp stderr: ${data}`);
        });

        serverApp.on('close', code => {
            console.log(`serverApp process exited with code ${code}`);
        });

        // Start the client app
        const clientApp = exec('npm start', { cwd: 'devices-clientapp' });

        clientApp.stdout.on('data', data => {
            console.log(`clientApp stdout: ${data}`);
        });

        clientApp.stderr.on('data', data => {
            console.error(`clientApp stderr: ${data}`);
        });

        clientApp.on('close', code => {
            console.log(`clientApp process exited with code ${code}`);
        });

        // Wait for both servers to start before running tests
        setTimeout(() => {
            createTestCafe('localhost', 1337, 1338)
                .then(tc => {
                    testcafe = tc;
                    return testcafe.createRunner();
                })
                .then(runner => {
                    return runner
                        .browsers(['chrome'])
                        // .src(['tests/e2e/tc1.test.js', 'tests/e2e/tc2.test.js']) 
                        .src(['tests/e2e/*.test.js']) 
                        .reporter(['spec', {
                            name: 'html',
                            output: 'report.html'
                        }])
                        .run();
                })
                .then(failedCount => {
                    console.log('Tests failed: ' + failedCount);
                    testcafe.close();
                    serverApp.kill();
                    clientApp.kill();
                })
                .catch(error => {
                    console.error(error);
                    serverApp.kill();
                    clientApp.kill();
                });
        }, 10000); // Adjust the timeout as necessary to ensure both servers are up
    } catch (error) {
        console.error(error.message);
    }
}

startTests();