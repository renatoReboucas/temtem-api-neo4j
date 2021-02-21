const puppeteer = require("puppeteer");
const db = require("../connection");
const neo4j = require("neo4j-driver");
const { format, compareAsc } = require("date-fns");
const querys = require('../query')

exports.roboTemtem = async function (req, res) {
  const url = "https://temtem.gamepedia.com/Temtem_Species";
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  const temtemList = await page.evaluate(() => {
    const nodeList = Array.from(document.querySelectorAll("tbody  tr"));
    const img = Array.from(document.querySelectorAll("tbody > tr > td > a.image > img"));
    
    const listArray = [...nodeList];

    const dataList = listArray.map((item, index) => {
      const text = item.innerText;
      const split = text.split(/\s/);
      // console.log(split);
      if (split.length === 12) {
        let data = {
          // id: index,
          n: split[0],
          name: split[2],
          type_one: split[3],
          type_two: "-",
          hp: split[4],
          sta: split[5],
          spd: split[6],
          atk: split[7],
          def: split[8],
          spatk: split[9],
          spdef: split[10],
          total: split[11],
        };
        return data;
      } else {
        let data = {
          // id: index,
          n: split[0],
          name: split[2],
          type_one: split[3],
          type_two: split[4],
          hp: split[5],
          sta: split[6],
          spd: split[7],
          atk: split[8],
          def: split[9],
          spatk: split[10],
          spdef: split[11],
          total: split[12],
        };
        return data;
      }
    });
    let imgCurrentSrc = img.map((item) => {
      return item.currentSrc.split(/\?\w*\=\d*/);

    });
    let newData;
    for (let i = 0; i < dataList.length; i++) {

      dataList[i]["img"] = imgCurrentSrc[i]
    }
    // console.log(dataList);
    return dataList;
  });
  const query = querys.querys.createTemtens
  for( let itens of temtemList ){
    // console.log(itens.n);

    const params = {
      n: itens.n || '-',
      name: itens.name || '-',
      type_one: itens.type_one || '-',
      type_two: itens.type_two || '-',
      hp: itens.hp || "-",
      sta: itens.sta || "-",
      spd: itens.spd || "-",
      atk: itens.atk || "-",
      def: itens.def || "-",
      spatk: itens.spatk || "-",
      spdef: itens.spdef || "-",
      total: itens.total || "-",
    };
    const resultQuery =  await db.db.execute({ cypher: query, params: params });
 
  }
  // console.log(resultQuery);
  await browser.close();
  res.json(temtemList);
}

exports.getTemtem = async function (req, res) {
  try {
    const driver = neo4j.default.driver(
      db.neo4j_driver.url_bolt,
      db.neo4j_driver.auth,
      { disableLosslessIntegers: true },
    );
    const session = driver.session();
    const query = querys.querys.getTemtem;
    const resultado = await session.run(query);
    res.json(resultado.records[0]._fields[0]);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};