import { Lang } from "@/providers/I18nProvider";
import { CountriesResponse } from "@/types/Country";
import axios from "axios";

export async function getCountries(lang: Lang = "en") {
  const response = await axios.get<CountriesResponse>(
    process.env.NEXT_PUBLIC_COUNTRY_API!,
    {
      params: { lang },  // ✅ correct
    }
  );
  return response.data;
}
