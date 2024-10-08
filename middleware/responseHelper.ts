interface ResponseMessage {
  message: string;
  data?: any;
}

interface StatusMap {
  success: number;
  created: number;
  badRequest: number;
  notFound: number;
}

const statusMap: StatusMap = {
  success: 200,
  created: 201,
  badRequest: 400,
  notFound: 404,
};

const successResponse = (data: any): ResponseMessage => ({
  message: 'Success',
  data,
});

const errorResponse = (message: string): ResponseMessage => ({
  message,
});

const notFoundResponse = (entity: string): ResponseMessage => ({
  message: `${entity} not found.`,
});

const invalidInputResponse = (details: string): ResponseMessage => ({
  message: `Invalid input: ${details}.`,
});

const customResponse = (message: string, data?: any): ResponseMessage => ({
  message,
  data,
});

const getStatus = (status: keyof StatusMap): number => {
  return statusMap[status];
};

export {
  successResponse,
  errorResponse,
  notFoundResponse,
  invalidInputResponse,
  customResponse,
  getStatus,
};
