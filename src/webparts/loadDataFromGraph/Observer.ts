export default class EventObserver {
  public observers;
  constructor() {
    this.observers = [];
  }

  public subscribe = (fn: Function) => {
    this.observers.push(fn);
  };

  public unsubscribe = (fn: Function) => {
    this.observers = this.observers.filter(subscriber => subscriber !== fn);
  };

  public broadcast = data => {
    this.observers.forEach(subscriber => subscriber(data));
  };
}

const observer = new EventObserver();
 observer;
