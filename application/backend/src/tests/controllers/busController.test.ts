import { getBusStopDetailsHandler } from '../../controllers/busController';
import * as busStopNameController from '../../controllers/busStopNameController';
import { BusStopDescription } from '../../controllers/busStopNameController'; 

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('getBusStopDetailsHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should respond with bus stop details when busStopCode is provided', async () => {
    const req: any = { params: { busStopCode: '27261' } };
    const res = mockResponse();

    const fakeDetails: BusStopDescription = {
        description: 'Hall 4',
      };

    jest
      .spyOn(busStopNameController, 'getBusStopDetails')
      .mockResolvedValue(fakeDetails);

    await getBusStopDetailsHandler(req, res);

    expect(busStopNameController.getBusStopDetails).toHaveBeenCalledWith('27261');
    expect(res.json).toHaveBeenCalledWith(fakeDetails);
  });

  it('should respond with 400 if busStopCode is missing', async () => {
    const req: any = { params: {} };
    const res = mockResponse();

    await getBusStopDetailsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'BusStopCode is required' });
  });

  it('should respond with 500 on error', async () => {
    const req: any = { params: { busStopCode: '27261' } };
    const res = mockResponse();

    jest
      .spyOn(busStopNameController, 'getBusStopDetails')
      .mockRejectedValue(new Error('DB error'));

    await getBusStopDetailsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
  });
});
