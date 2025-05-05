//types
import { TransacionalEmailQueue } from "@prisma/client";
import Observer from "../../@types/iObserver/iObserver.js";

//db
import prisma from "../../controllers/db.controller.js";

//external libs
import { render } from "@react-email/render";
import React from "react";

class Email {
  observers: Observer[] = [];

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
  sendEmail(
    to: string,
    subject: string,
    body: React.JSX.Element
  ): Promise<TransacionalEmailQueue> {
    return new Promise(async (resolve, reject) => {
      prisma.transacionalEmailQueue
        .create({
          data: {
            to,
            subject,
            body: await render(body),
            status: "pending",
          },
        })
        .then((email) => {
          return resolve(email);
        })
        .catch((err) => reject(err));
    });
  }
}

export default new Email();
