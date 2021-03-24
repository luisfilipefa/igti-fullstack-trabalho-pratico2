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

  await getCitiesLengthOfUf("SC");
  getFiveUfWithMoreCities();
  getFiveUfWithLessCities();
};

getData();
