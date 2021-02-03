import React, { useEffect, useState } from 'react';
import { CountriesTable } from './CountriesTable';
import { Country } from './model/country';
import './style.css';

const App = ({service}: {service: () => Promise<Country[]>}) => {
  const [countries, setCountries] = useState<Country[]>();
  useEffect(() => {
    const getData = async () => {
      const data = await service();
      setCountries(data);
    }
    getData();
  }, [service]);

  return (<div className='content'>
    <h1>World Countries</h1>
    <CountriesTable countries={countries} />
  </div>)
}

export default App;
