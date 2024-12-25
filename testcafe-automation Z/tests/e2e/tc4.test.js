import { Selector } from 'testcafe';

fixture`request`;
const apiEndpoint = 'http://localhost:3000';
let l_id, name;

/**
 * Delete the last device from the list
 * Verify deleted device is not display in the Device's list
 */

test('Delete the last device through API call', async t => {

    // retrieve the last device from the list
    const res = await t.request(`${apiEndpoint}/devices`);
    let devicesAPI = res.body;
    let lastDevice = devicesAPI[devicesAPI.length - 1];

    l_id = lastDevice.id;
    name = lastDevice.system_name;

    console.log("Device to be deleted:");
    console.log(devicesAPI[devicesAPI.length - 1])

    // delete the device 
    const response = await t.request({
        url: `${apiEndpoint}/devices/${l_id}`,
        method: 'DELETE'
    });

    await t.expect(response.body).eql(1); // verify device deleted successfully
});

fixture`Ninja RMM Devices Client App`
    .page`http://localhost:3001`;

test('Verify deleted device is not listed in Client app', async t => {

    const deviceNames = Selector('.device-name');
    const deviceCount = await deviceNames.count;

    let deviceNameList = [];
    for (let i = 0; i < deviceCount; i++) {
        deviceNameList.push(await deviceNames.nth(i).innerText);
    }

    await t.expect(deviceNameList).notContains(name);

});