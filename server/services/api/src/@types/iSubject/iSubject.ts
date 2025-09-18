import Observer from "../iObserver/iObserver.js";

interface iSubject {
  observers: Observer[];
  registerObserver: (observer: Observer) => void;
  removeObserver: (observer: Observer) => void;
  notify: (data: any) => void;
  notifyObserver: (observer: Observer, data: any) => void;
}

export default iSubject;
