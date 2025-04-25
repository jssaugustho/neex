//types
import iValidateString from "../../@types/iValidateString/iValidateString.js";

//errors
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

//db
import prisma from "../../controllers/db.controller.js";

class EmailType implements iValidateString {
  regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  value: string;

  constructor(email: string) {
    if (!email) throw new errors.UserError(response.obrigatoryParam("email"));

    if (!this.regex.test(email) || typeof email != "string")
      throw new errors.UserError(response.invalidParam("email"));

    this.value = email;
  }

  avaible(): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      //query user data
      let findEmail = await prisma.user
        .findUnique({
          where: {
            email: this.value,
          },
        })
        .catch((err) => {
          return reject(
            new errors.InternalServerError(
              "Cannot verify disponibility of email."
            )
          );
        });

      //verify if email exists
      if (findEmail) {
        return reject(new errors.UserError(response.emailInUse()));
      }

      //check if email exists
      resolve(true);
    });
  }

  getValue() {
    return this.value;
  }
}

export default EmailType;
