import { promises as fs } from "fs";

// let states = [];
// let cities = [];
// let mappedData = [];

// const getData = async () => {
//   states = JSON.parse(await fs.readFile("./db/Estados.json"));
//   cities = JSON.parse(await fs.readFile("./db/Cidades.json"));

//   formatData();
// };

// const formatData = () => {
//   mappedData = states.map((state) => {
//     let filteredCities = [];

//     filteredCities = cities
//       .filter((city) => {
//         return city.Estado === state.ID;
//       })
//       .map((city) => {
//         return city.Nome;
//       });

//     return {
//       uf: state.Sigla,
//       name: state.Nome,
//       cities: filteredCities,
//     };
//   });

//   writeMappedDataToNewFiles();
// };

// const writeMappedDataToNewFiles = async () => {
//   mappedData.forEach((item) => {
//     let data = JSON.stringify(item);
//     fs.appendFile(`./states/${item.uf}.json`, data);
//   });
// };

// getData();

const getInfo = async (uf) => {
  const file = JSON.parse(
    await fs.readFile(`./states/${uf.toUpperCase()}.json`)
  );
  const citiesLength = file.cities.length;
  console.log(`${file.uf} has ${citiesLength} cities`);
};

getInfo("PR");
