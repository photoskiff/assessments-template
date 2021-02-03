
import {Country} from "../model/country";

const url = "https://restcountries.eu/rest/v2/all?fields=name;capital;currencies;languages;flag;population;alpha3Code;alpha2Code";

export const getCounries = async () : Promise<Country[]> => {
    const response = await fetch(url)
    const result = await response.json() as Country[];
    return result;
}