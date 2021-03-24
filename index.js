import { promises as fs } from "fs";

let states = [];
let cities = [];
let mappedData = [];

const getData = async () => {
  states = JSON.parse(await fs.readFile("./db/Estados.json"));
  cities = JSON.parse(await fs.readFile("./db/Cidades.json"));

  formatData();
};

const formatData = () => {
  mappedData = states.map((state) => {
    let filteredCities = [];

    filteredCities = cities
      .filter((city) => {
        return city.Estado === state.ID;
      })
      .map((city) => {
        return city.Nome;
      });

    return {
      uf: state.Sigla,
      name: state.Nome,
      cities: filteredCities,
    };
  });

  writeMappedDataToNewFiles();
};

const writeMappedDataToNewFiles = () => {
  mappedData.forEach((item) => {
    const data = JSON.stringify(item);
    fs.writeFile(`./states/${item.uf}.json`, data);
  });

  getInfo();
};

const getInfo = async () => {
  let ufAndCitiesAmount = [];
  let biggerCityNames = [];
  let smallerCityNames = [];

  const getCitiesLengthOfUf = async (uf) => {
    const file = JSON.parse(
      await fs.readFile(`./states/${uf.toUpperCase()}.json`)
    );
    const citiesLength = file.cities.length;
    console.log(`${file.uf} has ${citiesLength} cities`);
  };

  const getFiveUfWithMoreCities = (uf) => {
    ufAndCitiesAmount = mappedData
      .sort((a, b) => {
        if (a.cities.length > b.cities.length) {
          return -1;
        } else if (a.cities.length === b.cities.length) {
          if (a.uf > b.uf) {
            return -1;
          } else {
            return 1;
          }
        } else {
          return 1;
        }
      })
      .map((item) => ({ uf: item.uf, citiesLength: item.cities.length }));

    const fiveUfWithMoreCities = ufAndCitiesAmount.slice(0, 5).map((item) => {
      return `${item.uf}-${item.citiesLength}`;
    });
    console.log("The five UF with more cities in Brazil is");
    console.log(fiveUfWithMoreCities);
  };

  const getFiveUfWithLessCities = () => {
    const fiveUfWithLessCities = ufAndCitiesAmount.slice(-5).map((item) => {
      return `${item.uf}-${item.citiesLength}`;
    });
    console.log("The five UF with less cities in Brazil is");
    console.log(fiveUfWithLessCities);
  };

  const getFiveCitiesWithBiggerNames = () => {
    biggerCityNames = mappedData
      .map((state) => {
        const biggerCity = state.cities.reduce((acc, city) =>
          acc.length > city.length ? acc : city
        );

        return `${biggerCity}-${state.uf}`;
      })
      .sort((a, b) => a.localeCompare(b));

    console.log("The city with the bigger name for each UF is");
    console.log(biggerCityNames);
  };

  const getFiveCitiesWithSmallerNames = () => {
    smallerCityNames = mappedData
      .map((state) => {
        const smallerCity = state.cities.reduce((acc, city) =>
          acc.length < city.length ? acc : city
        );

        return `${smallerCity}-${state.uf}`;
      })
      .sort((a, b) => a.localeCompare(b));

    console.log("The city with the smaller name for each UF is");
    console.log(smallerCityNames);
  };

  const getBiggerCityName = () => {
    const biggerCityName = biggerCityNames.reduce((acc, city) =>
      city.split("-")[0].length < acc.split("-")[0].length ? acc : city
    );
    console.log("The city with the bigger name is");
    console.log(biggerCityName);
  };

  const getSmallerCityName = () => {
    const smallerCityName = smallerCityNames.reduce((acc, city) =>
      city.split("-")[0].length > acc.split("-")[0].length ? acc : city
    );
    console.log("The city with the smaller name is");
    console.log(smallerCityName);
  };

  await getCitiesLengthOfUf("SC");
  getFiveUfWithMoreCities();
  getFiveUfWithLessCities();
  getFiveCitiesWithBiggerNames();
  getFiveCitiesWithSmallerNames();
  getBiggerCityName();
  getSmallerCityName();
};

getData();
