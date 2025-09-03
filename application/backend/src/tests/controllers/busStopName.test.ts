import axios from 'axios';
import { getBusStopDetails, BusStopDescription } from '../../controllers/busStopNameController';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getBusStopDetails', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return description when bus stop is found', async () => {
    const mockXml = `
      <busstops>
        <busstop name="27261">
          <details>Hall 4</details>
          <coordinates>
            <lat>1.345</lat>
            <long>103.678</long>
          </coordinates>
        </busstop>
      </busstops>
    `;

    mockedAxios.get.mockResolvedValue({ data: mockXml });

    const result: BusStopDescription = await getBusStopDetails('27261');
    expect(result).toEqual({ description: 'Hall 4' });
  });

  it('should throw error if bus stop is not found', async () => {
    const mockXml = `
      <busstops>
        <busstop name="99999">
          <details>Wrong Stop</details>
        </busstop>
      </busstops>
    `;

    mockedAxios.get.mockResolvedValue({ data: mockXml });

    await expect(getBusStopDetails('27261')).rejects.toThrow('Bus stop not found');
  });

  it('should throw error if axios request fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    await expect(getBusStopDetails('27261')).rejects.toThrow('Network error');
  });
});
