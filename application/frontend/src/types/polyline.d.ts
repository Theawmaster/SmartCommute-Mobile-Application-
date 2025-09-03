declare module '@mapbox/polyline' {
    interface PolylineStatic {
      decode(encoded: string, precision?: number): number[][];
      encode(coordinates: number[][], precision?: number): string;
    }
  
    const polyline: PolylineStatic;
    export default polyline;
  }
  