import React, { FunctionComponent, KeyboardEvent, useEffect, useState } from 'react';
import { ChangeEvent } from 'react';
import { Country } from './model/country';
import './style.css';

const Cell: FunctionComponent<any> = ({ ...props }) => <div className="cell" {...props}></div>;

const CountryRow = ({ c, ...props }: { c: Country }) => {
  const ccyDisplay = (code:string) => code === "(none)" ? "" : code ?? "";
  const curr = c.currencies.reduce<string>((acc, ccy) => acc === "" ? ccyDisplay(ccy?.code) : `${acc}, ${ccyDisplay(ccy?.code)}`, "")
  //const currTitle = c.currencies.length < 2 ? "currency" : "currencies";
  return <div className="rowContainer">
    <div style={{marginTop:2}}>
      <img width={14} height={14} src={c.flag} alt='flag'/>
    </div>
    <Cell style={{ width: 350 }}>{c.name}</Cell>
    <Cell style={{ width: 50 }}>{c.alpha2Code}</Cell>
    <Cell {...props} style={{ width: 50 }}>{c.alpha3Code}</Cell>
    <Cell style={{ width: 120, textAlign: "end" }}>{c.population}</Cell>
    <Cell style={{ width: 120, textAlign: "end" }}>{curr}</Cell>
    <Cell style={{ width: 300, marginLeft: 20 }}>{c.capital}</Cell>
  </div>
}

const CountriesTableImpl = ({ countries }: { countries: Country[] | undefined }) => {
  if (!countries)
    return <div>loading...</div>;
  return <div>{countries.map((c, i) => i > 0 ? <CountryRow  key={c.alpha3Code} c={c} /> : <CountryRow key={c.alpha3Code} c={c} data-testid="first-row"/>)}</div>;
}

type Order = "asc" | "desc" | undefined;

export const CountriesTable = ({ countries }: { countries: Country[] | undefined }) => {
  const [filtered, setFiltered] = useState<Country[]>();
  const [filterWord, setFilterWord] = useState("");
  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    let field: keyof Pick<Country, "name" | "alpha2Code" | "alpha3Code"> = "name";
    let value = filterWord;
    if (value.includes('//')) {
      field = "alpha3Code";
      value = value.substr(2);
    } else if (value.includes('/')) {
      field = "alpha2Code";
      value = value.substr(1);
    }
    const result = countries?.filter(c => c[field].toLowerCase().includes(value));
    let preFiltered = result;
    if (order) {
      preFiltered = preFiltered?.sort((a, b) => order === "asc" ? a.population - b.population : b.population - a.population);
    }
    setFiltered(preFiltered);
  }, [order, filterWord, countries]);

  const filterCountry = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterWord(e.target.value.toLowerCase());
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setFiltered(countries);
      setFilterWord("");
    }
  }

  return <div>
    <div className='rowContainer' style={{ width: 600, marginBottom: 10 }}>
      <input onKeyDown={handleKeyPress} onChange={filterCountry} value={filterWord}
        placeholder="[text] - filter by name, [/text] - by alpha2, [//text] - by alpha3 [Esc] - clear"
        style={{ width: 440 }} />
      <button onClick={() => setOrder("asc")} disabled={order === "asc"}>asc</button>
      <button onClick={() => setOrder(undefined)} disabled={!order}>reset</button>
      <button onClick={() => setOrder("desc")} disabled={order === "desc"}>desc</button>
    </div>

    <CountriesTableImpl countries={filtered} />
  </div>
}
