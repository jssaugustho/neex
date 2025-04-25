interface iResponse {
  statusCode: number;
  output: {
    status: "Ok";
    message: string;
    sessionId?: string;
    token?: string;
    refreshToken?: string;
    data?: any | any[];
    info?: any;
  };
}

export default iResponse;
