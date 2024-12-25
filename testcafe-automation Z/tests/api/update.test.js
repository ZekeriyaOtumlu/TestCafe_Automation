fixture`request`;
const expectedDevices = require('../../devicesTask_serverApp/devices.json');

const apiEndpoint = 'http://localhost:3000';
let id;

test('Update device', async t => {
    const lastDevice = expectedDevices[0];
    id = lastDevice.id;

    const response = await t.request({
        url: `${apiEndpoint}/devices/${id}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            system_name: 'Renamed Device',
            type: 'WINDOWS',
            hdd_capacity: '500'
        }
    });

    await t.expect(response.status).eql(200);
});

test('Verify updated device system name', async t => {
    const res = await t.request(`${apiEndpoint}/devices/${id}`);
    await t
        .expect(res.status).eql(200)
        .expect(res.body.system_name).eql('Renamed Device');

});

test('Clean-Up', async t => {
    const response = await t.request({
        url: `${apiEndpoint}/devices/${id}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            system_name: 'MIGUEL-PC',
            type: 'WINDOWS',
            hdd_capacity: '500'
        }
    });

    await t.expect(response.status).eql(200);
});