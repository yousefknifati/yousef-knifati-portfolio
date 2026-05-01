import axios from "axios";

type CityItem = {
  en: string | null;
  de: string | null;
  ar: string | null;
};

type CitiesResponse = {
  error: boolean;
  code: string;
  countryQid: string;
  data: CityItem[];
};

export async function getCities(countryCode: string): Promise<CityItem[]> {
  const response = await axios.get<CitiesResponse>("/api/cities", {
    params: {
      code: countryCode,
    },
  });

  if (response.data.error) {
    throw new Error("Failed to load cities");
  }

  return response.data.data;
}