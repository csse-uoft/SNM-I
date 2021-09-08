export class BrowserStore {
  constructor(name, defaultValue) {
    this.name = name;
    const rawData = localStorage.getItem(name);
    this.store = rawData && JSON.parse(rawData) || defaultValue;
  }

  get value() {
    console.log('GET ', this.name, this.store);
    return this.store;
  }

  set value(newValue) {
    console.log('SET ', this.name, newValue);
    this.store = newValue;
    localStorage.setItem(name, JSON.stringify(newValue));
  }
}