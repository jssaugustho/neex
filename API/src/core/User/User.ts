//db
import prisma from "../../controllers/db.controller.js";

//errors & response
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

//types
import { User as iUser, Session as iSession } from "@prisma/client";
import Subject from "../../@types/iSubject/iSubject.js";
import Observer from "../../@types/iObserver/iObserver.js";
import SendVerificationCode from "../../observers/VerificationCode/SendVerificationCode.js";

//external libs
import Session from "../Session/Session.js";
import iLookup from "../../@types/iLookup/iLookup.js";
import EmailNewUserAdmin from "../../observers/NotificateAdmin/EmailNewUserAdmin.js";
import Verification from "../Verification/Verification.js";

class Authentication implements Subject {
  observers: Observer[] = [];

  constructor() {
    this.registerObserver(EmailNewUserAdmin);
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
  verifySupport(supportEmail: string, userId: string): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      return resolve(true);
    });
  }

  getUserById(id: string): Promise<iUser> {
    return new Promise<iUser>((resolve, reject) => {
      prisma.user
        .findUniqueOrThrow({
          where: {
            id,
          },
        })
        .then((user) => {
          resolve(user as iUser);
        })
        .catch(() => {
          reject(new errors.UserError(response.userNotFound()));
        });
    });
  }

  getUserByEmail(email: string): Promise<iUser> {
    return new Promise<iUser>((resolve, reject) => {
      prisma.user
        .findUniqueOrThrow({
          where: {
            email,
          },
        })
        .then((user) => {
          return resolve(user as iUser);
        })
        .catch((err) => {
          return reject(new errors.UserError(response.userNotFound()));
        });
    });
  }

  createNewUser(
    session: iSession,
    email: string,
    name: string,
    lastName: string,
    phone: string,
    passwd: string
  ): Promise<iUser> {
    return new Promise(async (resolve, reject) => {
      const user = (await prisma.user
        .create({
          data: {
            email,
            name,
            lastName,
            phone,
            passwd,
          },
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError("Cannot create new User")
          );
        })) as iUser;

      await Verification.generate2faLink(user, session, true);

      resolve(user);
    });
  }
}

export default new Authentication();
