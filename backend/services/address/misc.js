const { getIndividualsInClass } = require('../dynamicForm');

let streetTypeOptions = null;
let streetDirectionOptions = null;
let stateOptions = null;

async function getAddressOptions() {
  streetTypeOptions = await getIndividualsInClass('ic:StreetType');
  streetDirectionOptions = await getIndividualsInClass('ic:StreetDirection');
  stateOptions = await getIndividualsInClass('schema:State');
}

/**
 * Convert the given address into a form in which it can be sent.
 * @param {Object} address - The address to convert
 * @returns The converted address.
 */
async function convertAddressForSerialization(address) {
  if (!streetTypeOptions || !streetDirectionOptions || !stateOptions) {
    await getAddressOptions();
  }

  if (address.streetType)
    address.streetType = streetTypeOptions[address.streetType];      
  if (address.streetDirection)
    address.streetDirection = streetDirectionOptions[address.streetDirection];
  if (address.state)
    address.state = stateOptions[address.state];

  return address;
}

/**
 * Convert the given address into a form in which it can be saved locally.
 * @param {Object} address - The address to convert
 * @returns The converted address.
 */
async function convertAddressForDeserialization(address) {
  if (!streetTypeOptions || !streetDirectionOptions || !stateOptions) {
    await getAddressOptions();
  }

  if (address.streetType)
    address.streetType = Object.keys(streetTypeOptions).find(option => streetTypeOptions[option] === address.streetType);
  if (address.streetDirection)
    address.streetDirection = Object.keys(streetDirectionOptions).find(option => streetDirectionOptions[option] === address.streetDirection);
  if (address.state)
    address.state = Object.keys(stateOptions).find(option => stateOptions[option] === address.state);

  if (address._uri)
    delete address._uri;
  if (address._id)
    delete address._id;

  return address;
}

module.exports = {convertAddressForSerialization, convertAddressForDeserialization}