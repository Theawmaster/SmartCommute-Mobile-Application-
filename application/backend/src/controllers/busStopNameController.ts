import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export interface BusStopDescription {
  description: string;
}

/**
 * Retrieves the bus stop description for a given bus stop code using the LTA bus stops XML.
 * The XML structure is assumed to have a root element with child <busstop> elements.
 * Each <busstop> element has a "name" attribute (the bus stop code), a <details> child for its description,
 * and <coordinates> if needed.
 *
 * @param busStopCode - The bus stop code (as a string) to look up.
 * @returns A Promise that resolves to an object containing the bus stop description.
 */
export async function getBusStopDetails(busStopCode: string): Promise<BusStopDescription> {
  // LTA bus stops XML URL
  const endpoint = 'https://www.lta.gov.sg/map/busService/bus_stops.xml';

  try {
    // Fetch the XML data
    const response = await axios.get(endpoint);
    const xmlData = response.data;

    // Parse the XML using fast-xml-parser
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: ""
    });
    const jsonObj = parser.parse(xmlData);

    // Assume the XML structure is something like:
    // <busstops>
    //   <busstop name="27261" wab="true">
    //     <details>Hall 4</details>
    //     <coordinates> ... </coordinates>
    //   </busstop>
    //   ...
    // </busstops>
    const busStops = jsonObj.busstops.busstop;

    // Find the busstop with the matching bus stop code (the attribute "name")
    const busStop = Array.isArray(busStops)
      ? busStops.find((bs: any) => bs.name === busStopCode)
      : busStops.name === busStopCode ? busStops : null;

    if (!busStop) {
      throw new Error("Bus stop not found");
    }

    // Return the description from the <details> element.
    return { description: busStop.details };
  } catch (error: any) {
    console.error("Error retrieving bus stop details:", error.response?.data || error.message);
    throw error;
  }
}
