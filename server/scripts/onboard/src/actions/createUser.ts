import Neex from "@neex/core";

import inquirer from "inquirer";
import PasswdValidator from "../validators/PasswdValidator.js";
import session from "../lib/session.js";
import writeInEnv from "../lib/environment.js";

const { User, Cryptography } = Neex();

async function createUser() {
  console.log("\n");

  const { name, lastName, email, phone, passwd, gender } =
    await inquirer.prompt<{
      name: string;
      lastName: string;
      email: string;
      passwd: string;
      phone: string;
      gender: "Male" | "Female" | "Other";
    }>([
      {
        type: "input",
        name: "name",
        message: "First name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Last name:",
      },
      {
        type: "input",
        name: "email",
        message: "Email:",
      },
      {
        type: "input",
        name: "phone",
        message: "Phone:",
      },
      {
        type: "input",
        name: "phone",
        message: "Phone:",
      },
      {
        type: "password",
        name: "passwd",
        message: "Password:",
        mask: "*",
        validate: (value) => {
          const passwd = new PasswdValidator(value);

          return passwd.valid || "";
        },
      },
      {
        type: "select",
        name: "gender",
        message: "Gender:",
        choices: ["Male", "Female", "Other"],
      },
    ]);

  console.log("\nCreating user...");

  const user = await User.createNewUser(
    session,
    email,
    name,
    lastName,
    phone,
    await Cryptography.hash(passwd),
    gender,
    false,
  );

  writeInEnv({
    USER_ID: user.id,
  });

  console.log("User created.");

  return user;
}

export default createUser;
