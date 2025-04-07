//db
import prisma from "../../controllers/db.controller.js";

//errors & response
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

//external libs

class Support {
  requestSupportByEmail(email: string): Promise<Support> {
    return new Promise(async (resolve, reject) => {
      // let support = await prisma.support.create({
      //     data: {
      //     }
      // }).catch((err)=>{
      //     reject(new errors.InternalServerError("Cannot create support relation.");
      // });
      // if (!support) reject(new errors.UserError(response.invalidSupport()));
      // resolve(support);
    });
  }
}
