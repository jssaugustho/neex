import { isValidObjectId } from "mongoose";
class ObjectIdValidator {
  id: string | null;
  valid: boolean = false;

  constructor(id: string) {
    this.id = id;
    this.valid = this.validate();
  }

  validate() {
    return isValidObjectId(this.id);
  }

  getValue() {
    return this.id;
  }
}

export default ObjectIdValidator;
