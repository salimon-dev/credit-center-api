import { Request, Response } from "express";

export default function specs(_: Request, res: Response) {
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
      fetch: "https://credit-api.salimon.io/apis/fetch",
      transfer: "https://credit-api.salimon.io/apis/transfer",
      transactions: "https://credit-api.salimon.io/apis/transactions",
      acceptTransaction: "https://credit-api.salimon/io/apis/transactions/accept",
      refuseTransaction: "https://credit-api.salimon/io/apis/transactions/refuse",
      subLink: "https://credit-api.salimon/io/apis/socket",
    },
    token: {
      price: 0.001,
      unit: "usd",
    },
  });
}
