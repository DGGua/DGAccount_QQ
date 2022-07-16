import axios from "axios";
import dayjs from "dayjs";
import { response } from "express";
import { globalResponse, 资金变动 } from "./accountType";

const targetURL = "http://dgacb.dggua.top";
// const targetURL = "http://127.0.0.1:4523/m1/1283532-0-default";

axios.interceptors.response.use(
  (response) => response,
  (error) => console.log(error)
);

export const accountService = {
  listToday: (qq: number) => {
    const today = dayjs();
    return axios.get<globalResponse<资金变动[]>>("/billing/list", {
      baseURL: targetURL,
      data: {
        userId: qq,
        dateEnd: today.date(),
        dateStart: today.date(),
        monthEnd: today.month() + 1,
        monthStart: today.month() + 1,
      },
    });
  },
  addBilling: (qq: number, category: string, amount: number) => {
    return axios.post<globalResponse<number>>(targetURL + "/billing/add", {
      userId: qq,
      category,
      price: amount,
    });
  },
};
