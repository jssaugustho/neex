import iRequest from "../../@types/iRequest/iRequest.js";
import errors from "../../errors/errors.js";
import response from "../../response/response.js";

class Validation {
  body: object;
  obrigatoryParams: string[];
  lostParams: string[] = [];

  constructor(req: iRequest, obrigatoryParams: string[]) {
    this.body = req.body;
    this.obrigatoryParams = obrigatoryParams;
    this.validate();
  }

  private validate() {
    this.obrigatoryParams.forEach((key) => {
      if (!this.body[key]) this.lostParams.push(key);
    });

    //verify lost params and throw error
    if (this.lostParams.length > 0) {
      throw new errors.UserError(response.obrigatoryParam(this.lostParams));
    }
  }

  getParams(): object {
    return this.body;
  }
}

export default Validation;
