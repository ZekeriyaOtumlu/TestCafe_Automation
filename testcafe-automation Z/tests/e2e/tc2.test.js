const { retrieveDevices, createNewDevice, checkSingleDeviceExists } = require('../../app/utils/DeviceUtils');
import Device from '../../app/pojo/Device';

fixture`Ninja RMM Devices Client App`
    .page`http://localhost:3001`;

/**
 * Create new Device
 * Retrieve the list of All devices
 * Verify the new device display in the list
 */

test('Create, retrieve and verify new device visibility', async t => {

    const newDevice = new Device('Test Device', "MAC", '512 GB', true, true);

    // Create new device
    await createNewDevice(t, newDevice);

    // Retrieve the list of devices through UI
    const devicesUI = await retrieveDevices();

    // Verify the new device is visible
    const isDeviceVisible = await checkSingleDeviceExists(devicesUI, newDevice);
    await t.expect(isDeviceVisible).ok('The new device should be visible in the list of devices');
});