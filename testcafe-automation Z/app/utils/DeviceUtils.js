import { Selector, t} from 'testcafe';
import Device from '../pojo/Device';

/**
 * Retrieves the list of devices.
 * @returns {Array} List of devices.
 */
async function retrieveDevices() {

    const deviceMainBox = Selector('.device-main-box');
    const deviceInfo = deviceMainBox.find('.device-info');
    const deviceOptions = deviceMainBox.find('.device-options');
    const deviceEdit = deviceOptions.find('.device-edit');
    const deviceRemove = deviceOptions.find('.device-remove');
    const deviceCount = await deviceMainBox.count;
    const devices = [];

    for (let i = 0; i < deviceCount; i++) {
        const name = await deviceInfo.nth(i).find('.device-name').innerText;
        const type = await deviceInfo.nth(i).find('.device-type').innerText;
        const capacity = await deviceInfo.nth(i).find('.device-capacity').innerText;
        const hasEdit = await deviceEdit.nth(i).exists;
        const hasRemove = await deviceRemove.nth(i).exists;

        const device = new Device(name, type, capacity, hasEdit, hasRemove);
        devices.push(device);
    }

    return devices;
}

async function compareDevices(devicesUI, devicesAPI) {
    for (const device of devicesUI) {
        const apiDevice = devicesAPI.find(d => d.system_name === device.name);
        if (apiDevice) {
            const isTypeMatch = apiDevice.type === device.type;
            const isCapacityMatch = apiDevice.hdd_capacity === device.capacity.split(' ')[0];
            // console.log(`System name match: ${device.name}`);
            // console.log(`Type match: ${isTypeMatch}`);
            // console.log(`Capacity match: ${isCapacityMatch}`);

            // assertions
            await t.expect(isTypeMatch).ok(`Device ${device.name} type should match`);
            await t.expect(isCapacityMatch).ok(`Device ${device.name} capacity should match`);
        } else {
            console.log(`Device: ${device.name} not found in API array`);
        }
    }
}

async function createNewDevice(t, device) {
    const addDeviceButton = Selector('a.submitButton');
    const saveButton = Selector('button.submitButton');
    const input_Name = Selector('input#system_name');
    const input_Capacity = Selector('input#hdd_capacity');
    const input_Type = Selector('select#type');
    const option = input_Type.find(`option[value="${device.type}"]`);

    await t
        .click(addDeviceButton)
        .typeText(input_Name, device.name)
        .click(input_Type)
        .click(option)
        .typeText(input_Capacity, device.capacity.split(' ')[0])
        .click(saveButton);
}

async function checkSingleDeviceExists(devicesUI, newDevice) {
    for (const device of devicesUI) { 
        if (device.name === newDevice.name && device.type === newDevice.type && device.capacity === newDevice.capacity) {
            return true;
        }
    }
    return false;
}

module.exports = {
    retrieveDevices,
    compareDevices,
    createNewDevice,
    checkSingleDeviceExists
};