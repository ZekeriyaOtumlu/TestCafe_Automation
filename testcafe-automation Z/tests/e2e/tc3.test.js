import { Selector } from 'testcafe';

fixture`request`;
const apiEndpoint = 'http://localhost:3000';
let f_id, f_type, f_capacity, newDeviceName;

test('Rename first device through API call', async t => {

    // retrieve the first device from the list
    const res = await t.request(`${apiEndpoint}/devices`);
    let devicesAPI = res.body;
    let firstDevice = devicesAPI[0];

    f_id = firstDevice.id;
    newDeviceName = 'Renamed Device';
    f_type = firstDevice.type;
    f_capacity = firstDevice.hdd_capacity;

    // update the device name
    const response = await t.request({
        url: `${apiEndpoint}/devices/${f_id}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            system_name: newDeviceName,
            type: f_type,
            hdd_capacity: f_capacity
        }
    });
    await t.expect(response.status).eql(200);

    const updatedDeviceResponse = await t.request(`${apiEndpoint}/devices/${f_id}`);
    const updatedDevice = updatedDeviceResponse.body;
    await t.expect(updatedDevice.system_name).eql(newDeviceName);

    // Output for debugging/demo purposes
    console.log("Device before update:");
    console.log(firstDevice);
    console.log("Device after update:");
    console.log(updatedDevice);

});

fixture`Ninja RMM Devices Client App`
    .page`http://localhost:3001`;

test('Retrieve first device from UI and verify updated device info', async t => {
    const deviceInfo = Selector('.device-info');
    const name = await deviceInfo.nth(0).find('.device-name').innerText;
    const type = await deviceInfo.nth(0).find('.device-type').innerText;
    const capacity = await deviceInfo.nth(0).find('.device-capacity').innerText;

    await t.expect(name).eql(newDeviceName);
    await t.expect(type).eql(f_type);
    await t.expect(capacity.split(' ')[0]).eql(f_capacity);
});