export type Currency = {
    code: string,
    name: string,
    symbol: string
}

export type Language = {
    name: string;
}

export type Country = {
    name: string,
    alpha2Code: string,
    alpha3Code: string,
    capital: string,
    population: number,
    languages: Language[],
    currencies: Currency[],
    flag: string
}