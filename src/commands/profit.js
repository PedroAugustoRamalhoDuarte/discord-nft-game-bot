import axios from "axios";

export const profitHandler = (gameToken, address) => {
  const url = `https://api1.poocoin.app/wallet-tx?address=${gameToken}&wallet=${address}`;

  let totalProfit = 0;
  axios.get(url).then((r) => r.data.map((transaction) => {
    totalProfit += transaction.usdAmountBuy;
    totalProfit -= transaction.usdAmountSell;
  })).catch((e) => console.log(e))

  return totalProfit;
}
