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
          resolve(user as iUser);
        })
        .catch((err) => {
          console.log(err);
          reject(new errors.UserError(response.userNotFound()));
        });
    });
  }

  createNewUser(
    email: string,
    name: string,
    lastName: string,
    phone: string,
    passwd: string,
    address: iLookup,
    fingerprint: string
  ): Promise<{ session: iSession; user: iUser }> {
    return new Promise(async (resolve, reject) => {
      const user = await prisma.user
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
          throw new errors.InternalServerError("Cannot create new User");
        });

      const session = await Session.createSession(
        user,
        fingerprint,
        address,
        true
      ).catch((err) => {
        throw err;
      });

      Verification.generateEmailToken(user, session).catch((err) => {
        throw err;
      });

      resolve({ user: user as iUser, session });
    });
  }
}

export default new Authentication();
