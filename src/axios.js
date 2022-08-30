import axios from 'axios';
export default axios.create({
     baseURL: "https://opendata.resas-portal.go.jp/api/",
     headers: {
         Accept: 'application/json',
         'X-API-KEY': 'fjQrQeOvFtBo8IJwqIkM7TCuToLWhZ616HjVYgRC'
     }
 })