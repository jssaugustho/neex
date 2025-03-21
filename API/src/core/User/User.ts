//db
import prisma from "../../controllers/db.controller.js";

//errors & response
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

//types
import { User } from "@prisma/client";
import Subject from "../../@types/Subject/Subject.js";
import Observer from "../../@types/Observer/Observer.js";
import TokenPayload from "../../@types/TokenPayload/TokenPayload.js";

class Authentication implements Subject {
  observers: Observer[] = [];

  constructor() {
    return this;
  }

  //observer functions
  registerObserver(observer: Observer) {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data?: any) {
    this.observers.forEach((observer) => observer.update(data));
  }

  notifyObserver(observer: Observer, data?: any) {
    observer.update(data);
  }

  //core
  getUserByToken(payload: TokenPayload): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      prisma.user
        .findUnique({
          where: {
            id: payload.id,
          },
        })
        .then((user) => {
          resolve(user as User);
        })
        .catch(() => {
          reject(new errors.UserError(response.userNotFound()));
        });
    });
  }
}

export default new Authentication();
