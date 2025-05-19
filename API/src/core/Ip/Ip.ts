//db
import prisma from "../../controllers/db.controller.js";

import {
  User as iUser,
  Session as iSession,
  Attempt as iAttempt,
  Ip as iIp,
} from "@prisma/client";

//errors
import errors from "../../errors/errors.js";
import { getMessage } from "../../locales/getMessage.js";

//observers
import IncrementSessionAttempts from "../../observers/SessionAttempts/IncrementSessionAttempts.js";

//types
import iObserver from "../../@types/iObserver/iObserver.js";
import iSubject from "../../@types/iSubject/iSubject.js";
import iLookup from "../../@types/iLookup/iLookup.js";
import iSessionPayload from "../../@types/iSessionPayload/iSessionPayload.js";

//external libs
import { UAParser } from "ua-parser-js";
import { create } from "domain";
import iIpPayload from "../../@types/iIpPayload/iIpPayload.js";

class Ip implements iSubject {
  observers: iObserver[] = [];

  //observer functions
  registerObserver(observer: iObserver) {
    this.observers.push(observer);
  }

  removeObserver(observer: iObserver) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data?: { user: iUser; token: string }) {
    this.observers.forEach((observer) => observer.update(data));
  }

  notifyObserver(observer: iObserver, data?: any) {
    observer.update(data);
  }

  upsertIp(lookup: iLookup): Promise<iIpPayload> {
    return new Promise(async (resolve, reject) => {
      let ip = (await prisma.ip.findUnique({
        where: {
          address: lookup.ip,
        },
        include: {
          Attempt: true,
          authorizedUsers: true,
        },
      })) as iIpPayload;

      if (!ip)
        ip = (await prisma.ip.create({
          data: {
            address: lookup.ip,
            city: lookup.city,
            region: lookup.region,
            country: lookup.country,
            timeZone: lookup.timezone,
            ll: lookup.ll,
          },
          include: {
            Attempt: true,
            authorizedUsers: true,
          },
        })) as iIpPayload;
      else
        ip = (await prisma.ip.update({
          where: {
            address: lookup.ip,
          },
          data: {
            updatedAt: new Date(),
            address: lookup.ip,
            city: lookup.city,
            region: lookup.region,
            country: lookup.country,
            timeZone: lookup.timezone,
            ll: lookup.ll,
          },
          include: {
            Attempt: true,
            authorizedUsers: true,
          },
        })) as iIpPayload;

      resolve(ip);
    });
  }
}

export default new Ip();
