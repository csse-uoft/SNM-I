export class BrowserStore {
  constructor(name, defaultValue) {
    this.name = name;
    const rawData = localStorage.getItem(this.name);
    this.store = rawData && JSON.parse(rawData) || defaultValue;
  }

  get value() {
    console.log('GET ', this.name, this.store);
    return this.store;
  }

  set value(newValue) {
    console.log('SET ', this.name, newValue);
    this.store = newValue;
    localStorage.setItem(this.name, JSON.stringify(newValue));
  }

  save() {
    localStorage.setItem(this.name, JSON.stringify(this.store));
  }
}

export class BrowserCounterStore {
  constructor(name, startNumber = 0) {
    this.name = name + '-cnt';
    this.store = Number(localStorage.getItem(this.name)) || (startNumber - 1);
  }

  get nextCnt() {
    this.store++;
    localStorage.setItem(this.name, this.store);
    return this.store;
  }
}
