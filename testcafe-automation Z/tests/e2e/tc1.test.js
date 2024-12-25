const { retrieveDevices, compareDevices } = require('../../app/utils/DeviceUtils');

fixture`Ninja RMM Devices Client App`
    .page`http://localhost:3001`;

let devicesUI = [];

/**
 * Retrieving the list of All the Devices from API
 * Verify All Devices are display in UI.
 */

test('Retrieve list of devices from API and verify all devices are present in UI', async t => {

    // Retrieve the list of devices through API call
    const apiEndpoint = 'http://localhost:3000';
    const response = await t.request(`${apiEndpoint}/devices`);
    await t.expect(response.status).eql(200)
    const devicesAPI = response.body;

    // Retrieve the list of devices through UI
    devicesUI = await retrieveDevices();

    // Compare both lists
    compareDevices(devicesUI, devicesAPI);
});

test('Verify that all devices contain the edit and delete buttons', async t => {
    for (const device of devicesUI) {
        const hasEdit = device.hasEdit;
        const hasRemove = device.hasRemove;

        // assert that the device has an edit and remove button
        await t.expect(hasEdit).ok(`Device ${device.name} should have an edit button`);
        await t.expect(hasRemove).ok(`Device ${device.name} should have a remove button`);
    }
});