import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ChangeEvent } from 'react';
import { Country } from './model/country';
import './style.css';

const Cell = ({ ...props }) => <div className="cell" {...props} />;

const CountryRow = ({ c, ...props }: { c: Country }) => {
  const ccyDisplay = (code: string) => code === "(none)" ? "" : code ?? "";
  const curr = c.currencies.reduce<string>((acc, ccy) => acc === "" ? ccyDisplay(ccy?.code) : `${acc}, ${ccyDisplay(ccy?.code)}`, "")
  return <div className="rowContainer">
    <div style={{ marginTop: 2 }}>
      <img width={14} height={14} src={c.flag} alt='flag' />
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
  return !countries ? <div>loading...</div>
    : <div>{countries.map((c, i) => i > 0 ? <CountryRow key={c.alpha3Code} c={c} /> : <CountryRow key={c.alpha3Code} c={c} data-testid="first-row" />)}</div>;
}

type Order = "asc" | "desc" | undefined;
type ActiveField = keyof Pick<Country, "name" | "alpha2Code" | "alpha3Code">;

const getFilterValues = (word: string): [field: ActiveField, filter: string] => {
  const field: ActiveField = (word.includes('//') ? "alpha3Code" : word.includes('/') ? "alpha2Code" : "name");
  return [field, word.replaceAll('/', "")];
}

export const CountriesTable = ({ countries }: { countries: Country[] | undefined }): JSX.Element => {
  const [filtered, setFiltered] = useState<Country[]>();
  const [filterWord, setFilterWord] = useState("");
  const [order, setOrder] = useState<Order>();
  let textbox = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const [field, value] = getFilterValues(filterWord);
    const result = countries?.filter(c => c[field].toLowerCase().includes(value));
    let preFiltered = result;
    if (order) {
      preFiltered = preFiltered?.sort((a, b) => order === "asc" ? a.population - b.population : b.population - a.population);
    }
    setFiltered(preFiltered);
  }, [order, filterWord, countries]);

  const filterCountry = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if(val.split('/').length > 3)
      val = '//';
    setFilterWord(val.toLowerCase());
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setFilterWord("");
    }
  }

  const updateFilterWord = (e: ChangeEvent<HTMLSelectElement>) => {
    textbox.current?.focus();
    setFilterWord(e.target.value + filterWord.replaceAll('/', ''));
  }

  return <div>
    <div className='evenContainer' style={{ width: 718, marginBottom: 10 }}>
      <input ref={textbox}  onKeyDown={handleKeyPress} onChange={filterCountry} value={filterWord}
        placeholder="type to filter, press [Esc] to clear"
        style={{ width: 260, marginRight: 10 }} />
      <div>filter by</div>
      <select onChange={updateFilterWord} value={filterWord.replace(/[^/]+/i, "")}>
        <option value="">name</option>
        <option value="/">alpha2Code</option>
        <option value="//">alpha3Code</option>
      </select><div>sort by population</div>
      <button onClick={() => setOrder("asc")} disabled={order === "asc"}>asc</button>
      <button onClick={() => setOrder(undefined)} disabled={!order}>reset</button>
      <button onClick={() => setOrder("desc")} disabled={order === "desc"}>desc</button>
    </div>
    <CountriesTableImpl countries={filtered} />
  </div>
}
