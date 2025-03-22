//types
import { EmailQueue } from "@prisma/client";
import Observer from "../../@types/Observer/Observer.js";

//db
import prisma from "../../controllers/db.controller.js";
import response from "../../response/response.js";
import errors from "../../errors/errors.js";

class Email {
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

  //core functions
  sendEmail(to: string, subject: string, body: string): Promise<EmailQueue> {
    return new Promise((resolve, reject) => {
      prisma.emailQueue
        .create({
          data: {
            to,
            subject,
            body,
            status: "pending",
          },
        })
        .then((email) => {
          return resolve(email);
        })
        .catch(() => reject(new errors.UserError(response.cannotSendEmail())));
    });
  }
}

export default new Email();
