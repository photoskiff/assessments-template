const sampleJson = `[
      {
        "currencies": [
          {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
          }
        ],
        "languages": [
          {
            "iso639_1": "fr",
            "iso639_2": "fra",
            "name": "French",
            "nativeName": "français"
          }
        ],
        "flag": "https://restcountries.eu/data/fra.svg",
        "name": "France",
        "alpha2Code": "FR",
        "alpha3Code": "FRA",
        "capital": "Paris",
        "population": 66710000
      },
      {
        "currencies": [
          {
            "code": "GBP",
            "name": "British pound",
            "symbol": "£"
          },
          {
            "code": "(none)",
            "name": "Guernsey pound",
            "symbol": "£"
          }
        ],
        "languages": [
          {
            "iso639_1": "en",
            "iso639_2": "eng",
            "name": "English",
            "nativeName": "English"
          },
          {
            "iso639_1": "fr",
            "iso639_2": "fra",
            "name": "French",
            "nativeName": "français"
          }
        ],
        "flag": "https://restcountries.eu/data/ggy.svg",
        "name": "Guernsey",
        "alpha2Code": "GG",
        "alpha3Code": "GGY",
        "capital": "St. Peter Port",
        "population": 62999
      },      
      {
        "currencies": [
          {
            "code": "EUR",
            "name": "Euro",
            "symbol": "€"
          }
        ],
        "languages": [
          {
            "iso639_1": "nl",
            "iso639_2": "nld",
            "name": "Dutch",
            "nativeName": "Nederlands"
          },
          {
            "iso639_1": "fr",
            "iso639_2": "fra",
            "name": "French",
            "nativeName": "français"
          },
          {
            "iso639_1": "de",
            "iso639_2": "deu",
            "name": "German",
            "nativeName": "Deutsch"
          }
        ],
        "flag": "https://restcountries.eu/data/bel.svg",
        "name": "Belgium",
        "alpha2Code": "BE",
        "alpha3Code": "BEL",
        "capital": "Brussels",
        "population": 11319511
      },
      {
        "currencies": [
          {
            "code": "RUB",
            "name": "Russian ruble",
            "symbol": "₽"
          }
        ],
        "languages": [
          {
            "iso639_1": "ru",
            "iso639_2": "rus",
            "name": "Russian",
            "nativeName": "Русский"
          }
        ],
        "flag": "https://restcountries.eu/data/rus.svg",
        "name": "Russian Federation",
        "alpha2Code": "RU",
        "alpha3Code": "RUS",
        "capital": "Moscow",
        "population": 146599183
      }
]`;

 export const sampleData = JSON.parse(sampleJson);
