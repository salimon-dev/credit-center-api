import { Request, Response } from "express";

export default function specs(_: Request, res: Response) {
  const baseUrl = process.env.BASE_URL;
  res.send({
    name: "service name",
    version: 1,
    homePage: "https://credit.salimon.io",
    terms: "https://credit.salimon.io/terms",
    pages: [
      {
        title: "add credit",
        url: "https://credit.salimon.io/terms",
      },
    ],
    methods: {
      fetch: baseUrl + "/fetch",
      transfer: baseUrl + "/transfer",
      transactions: baseUrl + "/transactions",
      acceptTransaction: baseUrl + "/transactions/accept",
      refuseTransaction: baseUrl + "/transactions/refuse",
    },
    token: {
      price: 0.001,
      unit: "usd",
    },
  });
}
