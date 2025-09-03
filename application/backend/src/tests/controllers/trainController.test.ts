import { getNearbyTrainCrowdHandler, TrainCrowdData } from '../../controllers/trainController';
import * as trainUtils from '../../utils/trainUtils';

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('getNearbyTrainCrowdHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with train crowd data', async () => {
    const req: any = {
      query: {
        lat: '1.345',
        lon: '103.678',
        radius: '2'
      }
    };
    const res = mockResponse();
    const next = jest.fn();

    const fakeCrowdData: TrainCrowdData[] = [
      {
        station: 'Tampines',
        crowdLevel: 'High',
        latitude: 1.345,
        longitude: 103.678
      }
    ];

    jest
      .spyOn(trainUtils, 'getNearbyTrainCrowd')
      .mockResolvedValue(fakeCrowdData);

    await getNearbyTrainCrowdHandler(req, res, next);

    expect(trainUtils.getNearbyTrainCrowd).toHaveBeenCalledWith(1.345, 103.678, 2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeCrowdData);
  });

  it('should return 500 if getNearbyTrainCrowd throws', async () => {
    const req: any = { query: {} }; // fallback to defaults
    const res = mockResponse();
    const next = jest.fn();

    jest
      .spyOn(trainUtils, 'getNearbyTrainCrowd')
      .mockRejectedValue(new Error('API failure'));

    await getNearbyTrainCrowdHandler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to fetch nearby train crowd data'
    });
  });
});
