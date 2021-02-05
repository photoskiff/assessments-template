import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ChangeEvent } from 'react';
import { Modal } from './components/Modal';
import { Country } from './model/country';
import './style.css';

const numberWithCommas = (x: number) => x && x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const ccyDisplay = (code: string) => code === "(none)" ? "" : code ?? "";
const CountryRow = ({ c, showDetail, ...props }: { c: Country, showDetail: (d: Country) => void }) => {
  const curr = c.currencies.reduce<string>((acc, ccy) => acc === "" ? ccyDisplay(ccy?.code) : `${acc}, ${ccyDisplay(ccy?.code)}`, "")
  return <tr onClick={() => showDetail(c)}>
    <td style={{ marginTop: 2 }}>
      <img width={14} height={14} src={c.flag} alt='flag' />
    </td>
    <td>{c.name}</td>
    <td>{c.alpha2Code}</td>
    <td {...props}>{c.alpha3Code}</td>
    <td className="population">{numberWithCommas(c.population)}</td>
    <td className="ccy">{curr}</td>
    <td>{c.capital}</td>
  </tr>
}

const CountryDetail = ({ c, ...props }: { c: Country | undefined }) => {
  if (!c) return <></>;
  const curr = c.currencies.reduce<string>((acc, ccy) => acc === "" ? ccyDisplay(ccy?.code) : `${acc}, ${ccyDisplay(ccy?.code)}`, "");
  const lang = c.languages.reduce<string>((acc, lang) => acc === "" ? lang.name : `${acc}, ${lang.name}`, "");
  return <div style={{width:500}}>
    <h2>{c.name}</h2>
    <div className="evenContainer">
      <div style={{width:300}}>
        <h3>Capital</h3>
        <div>{c.capital}</div>
        <h3>{c.currencies.length < 2 ? "Currency" : "Currencies"}</h3>
        <div>{curr}</div>
        <h3>{c.languages.length < 2 ? "Language" : "Languages"}</h3>
        <div>{lang}</div>
      </div>
      <div>
        <img width={200} height={100} src={c.flag} alt='flag' />
      </div>
    </div>
  </div>
}

const CountriesTableImpl = ({ countries }: { countries: Country[] | undefined }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>();
  if (!countries) return <div>loading...</div>

  const showCountry = (c: Country) => {
    setSelectedCountry(c);
    showModal();
  }
  const getCountryRow = (c: Country, i: number) => i > 0 ? <CountryRow key={c.alpha3Code} c={c} showDetail={showCountry} />
    : <CountryRow key={c.alpha3Code} c={c} data-testid="first-row" showDetail={showCountry} />;
  const showModal = () => setShowDialog(true);
  const hideModal = () => setShowDialog(false);

  return <div>
    <Modal show={showDialog} onClose={hideModal}>
      <div style={{ width: 200, height: 200 }}><CountryDetail c={selectedCountry} /></div>
    </Modal>
    <table>
      <thead>
        <tr>
          <th></th><th>Name</th><th>Alpha2</th><th>Alpha3</th><th>Population</th><th>Currencies</th><th>Capital</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((c, i) => getCountryRow(c, i))}
      </tbody>
    </table>
  </div>
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
    prompt: `type to filter by ${field}, press 'Esc' to reset, '/' or '\\' to rotate filter`,
    func: getFilter(field)
  }
}

export const CountriesTable = ({ countries }: { countries: Country[] | undefined }): JSX.Element => {
  const [filtered, setFiltered] = useState<Country[]>();
  const [filterWord, setFilterWord] = useState("");
  const [order, setOrder] = useState<Order>();
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(createFilterCriteria("name"));
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
      <div className="headerText">filter by</div>
      <select onChange={updateFilter} value={filterCriteria.field}>
        {filterFields.map(f => <option value={f} key={f}>{f}</option>)}
      </select>
      <div className="headerText">sort by population</div>
      <button onClick={() => setOrder("asc")} disabled={order === "asc"}>asc</button>
      <button onClick={() => setOrder(undefined)} disabled={!order}>reset</button>
      <button onClick={() => setOrder("desc")} disabled={order === "desc"}>desc</button>
    </div>
    <CountriesTableImpl countries={filtered} />
  </div>
}
