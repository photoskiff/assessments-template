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
type ActiveField = keyof Pick<Country, "name" | "alpha2Code" | "alpha3Code" | "currencies">;
const filterFields: ActiveField[] = ["name", "alpha2Code", "alpha3Code", "currencies"];


type FieldFilter = ((word: string, country: Country) => boolean) | undefined;
const simpleFilter = (word: string, field: string) => field?.toLowerCase().includes(word.toLowerCase());

const getFilter = (field: ActiveField): FieldFilter => {
  if (!field) return undefined;
  if (field !== "currencies") return (word, country) => simpleFilter(word, country[field]);
  else if (field === "currencies") return (word, country) => country.currencies.some(c => simpleFilter(word, c?.code));
  return undefined;
}

type FilterCriteria = {
  field: ActiveField,
  prompt: string
  func: FieldFilter;
}

const createFilterCriteria = (field: ActiveField) => {
  return {
    field,
    prompt: `type to filter by ${field}, press 'Esq' to reset, '/' or '\\' to rotate filter`,
    func: getFilter(field)
  }
}

export const CountriesTable = ({ countries }: { countries: Country[] | undefined }): JSX.Element => {
  const [filtered, setFiltered] = useState<Country[]>();
  const [filterWord, setFilterWord] = useState("");
  const [order, setOrder] = useState<Order>();
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(createFilterCriteria("name"))
  let textbox = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fieldFilter = filterCriteria.func;
    const result = !fieldFilter ? countries : countries?.filter(c => fieldFilter(filterWord, c));
    let preFiltered = result;
    if (order) {
      preFiltered = preFiltered?.sort((a, b) => order === "asc" ? a.population - b.population : b.population - a.population);
    }
    setFiltered(preFiltered);
    textbox.current?.focus();
  }, [order, filterWord, countries, filterCriteria]);

  const updateFilterCriteria = (field: ActiveField) => {
    setFilterWord("");
    setFilterCriteria(createFilterCriteria(field));
  }

  const rotateFilterCriteria = (val: string) => {
    if (!"\\/".includes(val)) return false;
    let max = filterFields.length - 1;
    let index = filterFields.indexOf(filterCriteria.field);
    if (val === '/')
      index = index === max ? 0 : index + 1;
    else
      index = index === 0 ? max : index - 1;
    updateFilterCriteria(filterFields[index]);
    return true;
  }

  const filterCountry = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    rotateFilterCriteria(val) || setFilterWord(val);
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setFilterWord("");
    }
  }

  const updateFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    const field = e.target.value as ActiveField;
    updateFilterCriteria(field);
  }

  return <div>
    <div className='evenContainer' style={{ width: 730, marginBottom: 10 }}>
      <input ref={textbox} onKeyDown={handleKeyPress} onChange={filterCountry} value={filterWord}
        placeholder={filterCriteria.prompt}
        style={{ width: 310, marginRight: 10 }} />
      <div>filter by</div>
      <select onChange={updateFilter} value={filterCriteria.field}>
        {filterFields.map(f => <option value={f} key={f}>{f}</option>)}
      </select><div>sort by population</div>
      <button onClick={() => setOrder("asc")} disabled={order === "asc"}>asc</button>
      <button onClick={() => setOrder(undefined)} disabled={!order}>reset</button>
      <button onClick={() => setOrder("desc")} disabled={order === "desc"}>desc</button>
    </div>
    <CountriesTableImpl countries={filtered} />
  </div>
}
