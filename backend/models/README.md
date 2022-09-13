## Find Examples

```js
const {regexBuilder} = require('../../utils/graphdb');
```

### Find with `$and`

```js
await GDBClientModel.find({
  characteristicOccurrences: {
    $and: [
      {occurrenceOf: ":characteristic_14", dataStringValue: 'lester'},
      {occurrenceOf: ":characteristic_15", dataStringValue: 'lyu'}
    ]
  }
});
```

### Find with `$and` and `$regex`

```js
await GDBClientModel.find({
  characteristicOccurrences: {
    $and: [
      {occurrenceOf: ":characteristic_14", dataStringValue: {$regex: regexBuilder('le', 'i')}},
      {occurrenceOf: ":characteristic_15", dataStringValue: 'lyu'}
    ]
  }
});
```

### Find with `$and`, `$regex`, `$gt`, `$lt`

```js
await GDBClientModel.find({
  characteristicOccurrences: {
    $and: [
      {occurrenceOf: ":characteristic_14", dataStringValue: {$regex: regexBuilder('le', 'i')}},
      {occurrenceOf: ":characteristic_15", dataNumberValue: {$lt: 123, $gt: 2}}
    ]
  }
});
```