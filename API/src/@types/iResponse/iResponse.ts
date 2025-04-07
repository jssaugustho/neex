interface iResponse {
  statusCode: number;
  output: {
    status: "Ok";
    message: string;
    data?: any | any[];
    info?: any;
  };
}

export default iResponse;
