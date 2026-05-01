export type CountriesResponse = {
  error: boolean;
  msg: string;
  data: {
    name: string;
    lat: number;
    long: number;
  }[];
};
