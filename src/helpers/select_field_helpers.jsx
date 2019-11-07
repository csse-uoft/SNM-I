import _ from 'lodash';

export function newMultiSelectFieldValue(preValue,
                                         selectedOption,
                                         actionMeta) {
  let newValue;
  switch (actionMeta.action) {
    case 'pop-value':
    case 'remove-value':
       _.remove(preValue, (value) => {
        return value === actionMeta.removedValue.value
      });
      newValue = preValue
      break;
    case 'clear':
      newValue = []
      break;
    default:
      preValue.push(actionMeta.option.value)
      newValue = preValue
  }
  return newValue;
}
