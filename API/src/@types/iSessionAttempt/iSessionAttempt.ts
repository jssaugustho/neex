interface iSessionAttempts {
  [userId: string]: {
    attempts: number;
    timeStamp: number;
  };
}

export default iSessionAttempts;
