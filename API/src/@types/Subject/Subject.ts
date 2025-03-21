import Observer from "../Observer/Observer.js";

interface Subject {
  observers: Observer[];
  registerObserver: (observer: Observer) => void;
  removeObserver: (observer: Observer) => void;
  notify: () => void;
  notifyObserver: (observer: Observer) => void;
}

export default Subject;
