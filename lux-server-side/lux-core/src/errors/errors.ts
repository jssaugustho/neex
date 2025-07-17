class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "InternalServerError";
    this.message = message;
  }
}

class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserError";
    this.message = message;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
    this.message = message;
  }
}

class TokenError extends Error {
  constructor(message) {
    super(message);
    this.name = "TokenError";
    this.message = message;
  }
}

class SessionError extends Error {
  constructor(message) {
    super(message);
    this.name = "SessionError";
    this.message = message;
  }
}

class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = "ClientError";
    this.message = message;
  }
}

export default {
  UserError,
  InternalServerError,
  AuthError,
  TokenError,
  SessionError,
  ClientError,
};
