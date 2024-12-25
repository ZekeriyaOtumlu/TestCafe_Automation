fixture`request`;
const expectedDevices = require('../../devicesTask_serverApp/devices.json');
const apiEndpoint = 'http://localhost:3000';

test('Retrieve and verify devices from API', async t => {
    const response = await t.request(`${apiEndpoint}/devices`);
    await t
        .expect(response.status).eql(200)
        .expect(response.statusText).eql('OK')
        .expect(response.headers).contains({ 'content-type': 'application/json; charset=utf-8' })
        .expect(response.body).eql(expectedDevices);
});


// option 2 - without using the devices.json file
test('Retrieve and verify devices from API 2', async t => {
    const response = await t.request(`${apiEndpoint}/devices`);

    const expectedDevices = [
        { id: 'e8okoP2l5', system_name: 'DESKTOP-SMART', type: 'WINDOWS', hdd_capacity: '10' },
        { id: 'Th3ngERn9', system_name: 'MAC-LEADER', type: 'MAC', hdd_capacity: '2048' },
        { id: 'Q1JdBnE12', system_name: 'ARMANDO', type: 'WINDOWS', hdd_capacity: '256' },
        { id: 'e7ocoQ2n3', system_name: 'MIGUEL-PC', type: 'WINDOWS', hdd_capacity: '500' },
        { id: 'Jj5bn3G2H', system_name: 'FIRST-MAC', type: 'MAC', hdd_capacity: '180' },
        { id: 'GT556QGnk', system_name: 'GOOD-MAC', type: 'MAC', hdd_capacity: '500' },
        { id: 'ppRmcE9p8', system_name: 'JACK-GUEST', type: 'LINUX', hdd_capacity: '302' },
        { id: 'R5LdSnQhY', system_name: 'HOME-ONE', type: 'WINDOWS', hdd_capacity: '50' },
        { id: 'ab1coL2n9', system_name: 'GILBERT-COMPUTER', type: 'WINDOWS', hdd_capacity: '750' },
        { id: 'LM5dBnJ2G', system_name: 'MOON-SMART', type: 'WINDOWS', hdd_capacity: '256' },
        { id: 'Up5bcEQp4', system_name: 'JULIO-MAC-LOCAL', type: 'MAC', hdd_capacity: '512' },
        { id: 'Up5ncErp8', system_name: 'RYANN-HOST', type: 'LINUX', hdd_capacity: '220' }
    ];

    await t
        .expect(response.status).eql(200)
        .expect(response.statusText).eql('OK')
        .expect(response.headers).contains({ 'content-type': 'application/json; charset=utf-8' })
        .expect(response.body).eql(expectedDevices);
});

test('Verify a specific device by ID', async t => {
    const deviceId = 'e8okoP2l5';
    const response = await t.request(`${apiEndpoint}/devices/${deviceId}`);
    const expectedDevice = expectedDevices.find(device => device.id === deviceId);

    await t
        .expect(response.status).eql(200)
        .expect(response.body).eql(expectedDevice);
});


test('Delete device by ID', async t => {
    const lastDevice = expectedDevices[expectedDevices.length - 1];
    const deviceId = lastDevice.id;

    const response = await t.request({
        url: `${apiEndpoint}/devices/${deviceId}`,
        method: 'DELETE'
    });

    await t.expect(response.status).eql(200);

    // Verify device is deleted by checking if the response body is empty
    const res = await t.request(`${apiEndpoint}/devices/${deviceId}`);
    await t
        .expect(response.status).eql(200)
        .expect(res.body).eql('');
});