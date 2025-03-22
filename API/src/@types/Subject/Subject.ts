import Observer from "../Observer/Observer.js";

interface Subject {
  observers: Observer[];
  registerObserver: (observer: Observer) => void;
  removeObserver: (observer: Observer) => void;
  notify: (data: any) => void;
  notifyObserver: (observer: Observer, data: any) => void;
}

export default Subject;
