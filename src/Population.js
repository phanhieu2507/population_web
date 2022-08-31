import { useEffect, useState } from "react";
import axios from "./axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label
} from "recharts";
import "./index.css"
const Population = () => {
  const [name,setName]  = useState('0');
  const [linedata,setLineData]=useState([0]);
  const [cityName, setCityName] = useState([]);
  const [cityChoosed, setcityChoosed] = useState([]);
  useEffect(() => {
    const getCity = async () => {
      const response = await axios.get(`v1/prefectures`);
      localStorage.clear();
      setCityName(response.data.result);
      localStorage.setItem('cityname',JSON.stringify(response.data.result));
      for (let i = 1; i < 48; i++) {
        await axios
          .get(`v1/population/composition/perYear?cityCode=-&prefCode=${i}`)
          .then((res) => {
            localStorage.setItem(
              i.toString(),
              JSON.stringify(res.data.result.data[0].data)
            );
          });
      }
    };
    getCity();
  }, []);
  const handleChange = (e) => {
    if (e.target.checked) {
      setcityChoosed([...cityChoosed, e.target.value]);
    } else {
      setcityChoosed(cityChoosed.filter((item) => item !== e.target.value));
    }
  };
  const cityList = () => {
    const citytable = cityName?.map((item) => {
      return (
        <div>
          <input
            type="checkbox"
            value={item.prefCode}
            id={item.prefName}
            onChange={handleChange}
          />
          <label>{item.prefName}</label>
        </div>
      );
    });

    return (
      <div className="container">
        <table border={"1px solid"} >
          <td>{citytable.slice(0, 12)}</td>
          <td>{citytable.slice(12, 24)}</td>
          <td>{citytable.slice(24, 36)}</td>
          <td>{citytable.slice(36, 47)}</td>
        </table>
      </div>
    );
  };
  const xaxis = () => {
    const data = [...Array(48).keys()];
    const data2 = data.slice(2, 48)?.map((item) => {
      return <XAxis dataKey="year" xAxisId={item.toString()} hide={true} />;
    });

    return data2;
  };
  const yaxis = () => {
    const data = [...Array(48).keys()];
    const data2 = data.slice(1, 48).map((item) => {
      if(JSON.parse(localStorage.getItem('cityname'))[item-1]?.prefName&&JSON.parse(localStorage.getItem(item.toString()))){
      return (
        <Line
          name={JSON.parse(localStorage.getItem('cityname'))[item-1]?.prefName}
          data={JSON.parse(localStorage.getItem(item.toString()))}
          dataKey="value"
          stroke="#8884d8"
          activeDot={{ r: 10 }}
          xAxisId={item.toString()}
          hide={!cityChoosed.includes(item.toString())}
        />
      );}
    });
    return data2;
  };
  return (
    <div >
      <table className="table">
        <tr>
          <td className="chart">
            <LineChart
              width={700}
              height={300}
              margin={{
                top: 30,
                right: 100,
                left: 60,
                bottom: 30,
              }
            }
            >
              <CartesianGrid strokeDasharray="5 5" />
              <XAxis dataKey="year" xAxisId={"1"}  >
              <Label value="年度" offset={-20} position="insideBottom" />
              </XAxis>
              {xaxis()}

              <YAxis
                ticks={[
                  1000000, 4000000, 7000000, 10000000, 13000000, 16000000,
                ]}
                
              >
                 <Label value="人口数" offset={-25} position="insideTop" />
                </YAxis>
              <Tooltip/>
              {yaxis()}
            </LineChart>
          </td>
          <td></td>
          <td>
            <div >
            <div className="tittle">都道府県</div>
            <div className="list">{cityList()}</div>
            </div>
          </td>
          </tr>
      </table>
      </div>
  );
};
export default Population;
