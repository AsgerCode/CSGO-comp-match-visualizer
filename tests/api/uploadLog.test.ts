import { NextApiRequest, NextApiResponse } from "next";
import uploadLog from "../../src/pages/api/uploadLog";
import { createMocks, RequestMethod, createRequest } from 'node-mocks-http';

function mockRequestResponse(method: RequestMethod = 'POST') {
  const { req, res }: { req: NextApiRequest & ReturnType<typeof createRequest>; res: NextApiRequest & ReturnType<typeof createRequest> } = createMocks({ method });
  return { req, res };
};

const { req, res } = mockRequestResponse();

describe('API Test', () => {
  it('correctly returns with a 200 status code and the log ID', async () => {
    req.body = "hello";
    await uploadLog(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().message).toBeDefined();
  });
  
  it('correctly returns with a 500 status code when no body is provided', async () => {
    req.body = undefined;
    await uploadLog(req, res);
    expect(res.statusCode).toBe(500);
  });
});