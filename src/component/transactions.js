import React, { useState, useEffect } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

import "./transactions.css";
import bell from "../asset/images/logo.png";
import logo from "../asset/images/logo.jpg";
import { contractAddress } from "./constant";
import tronGrid from "trongrid";
import TronWeb from "tronweb";
import { useTranslation } from "react-i18next";
function Transactions() {
  const { t, i18n } = useTranslation();
  let interv = null;
  let userAccount;

  const [rows, setRows] = useState([]);
  const [rowsSell, setRowsSell] = useState([]);
  const [rowsWithdraw, setRowsWithdraw] = useState([]);

  const [account, setAccount] = useState("Connect To Wallet");
  const [mainAccountDetails, setMainAccountDetails] = useState(null);
  const [transactionsShow, setTransactionsShow] = useState(null);
  const [dataTable, setDataTable] = useState(null);

  function formatThousands(num) {
    var numbr = parseFloat(num.toFixed(6));
    var values = numbr.toString().split(".");
    return (
      values[0].replace(/.(?=(?:.{3})+$)/g, "$&,") +
      (values.length == 2 ? "." + values[1] : "")
    );
  }
  const loadWeb3 = async () => {
    let isConnected = false;
    let connection;
    let mainAccount;
    try {
      if (
        window.tronWeb &&
        window.tronWeb.defaultAddress.base58 === "undefined"
      ) {
        connection = "TROn LINK is not available";
        isConnected = false;
      } else {
        connection = "Connected to Tron LINK.";
        isConnected = true;
        mainAccount = await window.tronWeb.defaultAddress.base58;
        isLocked();
        // getUserInfor();
        // getTotalReward();
        let data = await loadBlockchainData();
        let ddata = await getContractTransferEventsByUser("Sell");
        setDataTable(data);
        setTransactionsShow(ddata);

        if (mainAccount) {
          if (isConnected === true) {
            mainAccount = await window?.tronWeb?.defaultAddress?.base58;
            setAccount(mainAccount);
            let accountDetails = null;
            localStorage.setItem("load", mainAccount);
            setMainAccountDetails(accountDetails);
            let ddata = await getContractTransferEventsByUser("Sell"); // setDataTable(data);
            setTransactionsShow(ddata);
          } else {
            //console.log("Tron Not Connected");
          }
        } else {
          // alert("Please login or install tron wallet!");
        }
      }
    } catch (error) {
      console.log("error0", error);
    }
  };

  function isLocked() {
    if (window.tronWeb.defaultAddress.base58 == null) {
      // console.log("error null");
    } else if (window.tronWeb.defaultAddress.base58 === 0) {
      // console.log("TRON LINK is locked");
    } else {
      // console.log("TRON LINK is unlocked");
    }
  }
  let stringOfDownload = [];
  const loadBlockchainData = async () => {
    // try {
    // console.log("contract called");
    let contract = await window?.tronWeb.contract().at(contractAddress);
    // sellPriceCalculation

    // console.log("calculatedMaxReward", rows);
    // console.log("calculatedMaxReward", rows[0]);
    // console.log("calculatedMaxReward", rows.nature);
    // console.log("calculatedMaxReward", rows[0]._buyer);
    // console.log("calculatedMaxReward", rows[0]._amounts);
    // console.log("calculatedMaxReward", rows[0]._tokens);

    return (
      <div>
        {" "}
        {rows &&
          rows.map((row) => (
            <div>
              <table className="container">
                <tr className="row">
                  <td className="col-3">
                    <span> {row[0].nature} </span>
                  </td>
                  <td className="col-md-3">
                    <span> {row[0].nature} </span>
                  </td>
                  <td className="col-md-3">
                    <span> {row[0].nature} </span>
                  </td>
                  <td className="col-md-3">
                    <span> {row[0].nature} </span>
                  </td>
                  <hr />
                </tr>
              </table>
            </div>
          ))}
      </div>
    );
  };
  // function numberWithCommas(x) {
  //   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // }
  const getContractTransferEventsByUser = async () => {
    let newArr = [];
    let newArrSell = [];
    let newArrWithdraw = [];
    let result = [];
    const tronWeb = new TronWeb({
      fullHost: "https://api.trongrid.io",
    });
    let trongrid = new tronGrid(tronWeb);
    try {
      let continueToken = "";
      let res = await trongrid.contract.getEvents(contractAddress, {
        only_confirmed: true,
        event_name: "Buy",
        limit: 30,
        filters: { id: account },
      });
      let resSell = await trongrid.contract.getEvents(contractAddress, {
        only_confirmed: true,
        event_name: "Sell",
        limit: 30,
        filters: { id: account },
      });
      let resWithdraw = await trongrid.contract.getEvents(contractAddress, {
        only_confirmed: true,
        event_name: "Withdraw",
        limit: 30,
        filters: { id: account },
      });
      //  console.log("calculatedMaxReward", res);
      //  console.log("calculatedMaxReward", resSell);
      //  console.log("calculatedMaxReward", resWithdraw);
      //  console.log("calculatedMaxReward", resWithdraw.data);
      //   console.log("getEvents", res.data[0].result[3]);
      let totalMaxReward = 0;
      await res.data.forEach((element) => {
        if (
          window?.tronWeb?.address?.fromHex(element?.result?.user) ===
          userAccount
        ) {
          // let amounT = element?.result?.amount;
          let nature = element?.result?.nature;
          let _amounts = element?.result?._amounts / 1000000;
          let _buyer = element?.result?._buyer;
          let _tokens = element?.result?._tokens / 1000000;
          let hashId = element?.transaction_id;

          // console.log("calculatedMaxReward", _amounts);
          // console.log("calculatedMaxReward", nature);
          // console.log("element?.amount", nature);
          // console.log("element?.amount", _amounts);
          // console.log("element?.amount", _buyer);
          // console.log("element?.amount", _tokens);
          let calculatedMaxReward = _amounts / 1000000;
          // console.log("calculatedMaxReward", calculatedMaxReward);

          totalMaxReward =
            parseFloat(totalMaxReward) + parseFloat(calculatedMaxReward);
          // newArr.push({
          //   transaction_id: element?.transaction_id,
          //   token: element?.result?.amount,
          //   duration: element?.result?.Duration,
          //   userId: window?.tronWeb?.address?.fromHex(element?.result?.user),
          //   timeStamp: element?.block_timestamp,
          //   maxReward: calculatedMaxReward,
          // });
          newArr.push({
            nature: nature,
            _buyer: _buyer,
            _amounts: formatThousands(_amounts),
            _tokens: formatThousands(_tokens),
            hashId: hashId,
          });
        }
      });
      // setTotalMaxRewards(totalMaxReward);
      let items = newArr.slice(0, 20);
      setRows([...items]);
      // setRows([...newArr]);
      await resSell.data.forEach((element) => {
        if (
          window?.tronWeb?.address?.fromHex(element?.result?.user) ===
          userAccount
        ) {
          // let amounT = element?.result?.amount;
          let nature = element?.result?.nature;
          let _amounts = element?.result?._amounts / 1000000;
          let _seller = element?.result?._seller;
          let _tokens = element?.result?._tokens / 1000000;
          let hashId = element?.transaction_id;
          // console.log("calculatedMaxReward", element?.result?.nature);
          // console.log("calculatedMaxReward", element?.result?._amounts);
          // console.log("calculatedMaxReward", element?.result?._seller);
          // console.log("calculatedMaxReward", element?.result?._tokens);

          newArrSell.push({
            nature: nature,
            _seller: _seller,
            _amounts: formatThousands(_amounts),
            _tokens: formatThousands(_tokens),
            hashId: hashId,
          });
        }
      });
      await resWithdraw.data.forEach((element) => {
        if (
          window?.tronWeb?.address?.fromHex(element?.result?.user) ===
          userAccount
        ) {
          // let amounT = element?.result?.amount;
          let nature = element?.result?.nature;
          let _amountWithDrawn = element?.result?._amountWithDrawn / 1000000;
          let _drawer = element?.result?._drawer;
          let hashId = element?.transaction_id;
          // let _tokens = element?.result?._tokens;
          //  console.log("calculatedMaxReward", _drawer);
          //  console.log("calculatedMaxReward", element?.result?._amounts);
          //  console.log("calculatedMaxReward", element?.result?._seller);
          //  console.log("calculatedMaxReward", element?.result?._tokens);
          newArrWithdraw.push({
            nature: nature,
            _drawer: _drawer,
            _amountWithDrawn: formatThousands(_amountWithDrawn),
            hashId: hashId,
          });
        }
      });
      let itemssell = newArrSell.slice(0, 20);
      setRowsSell([...itemssell]);
      let itemswithdraw = newArrWithdraw.slice(0, 20);
      setRowsWithdraw([...itemswithdraw]);
      // setRowsWithdraw([...newArrWithdraw]);
      //  console.log("newArrSell",newArr);
      // console.log("newArrSell", newArrSell);
    } catch (error) {
      console.error("getEvents", error);
      //   console.log("getEvents",error);
    } finally {
      return result;
    }
  };
  useEffect(async () => {
    setInterval(async () => {
      loadWeb3();
    }, 2500);
  }, []);

  // useEffect(() => {
  //     loadWeb3();

  //     interv = setInterval(() => {
  //         if (account) {
  //             loadWeb3();
  //         } else {
  //             loadWeb3();
  //         }
  //     }, 1000);
  // }, []);

  return (
    <div className="container-fluid" id="transactionscren">
      {/* //  <div className="container-fluid"> */}
      <div className="container">
        <div className="cradview">
          <div className="row">
            <div className="col">
              <h1 className="buyTransaction">
                {t("buytransactions.1")}
                {/* Buy Transactions */}
              </h1>
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              {t("transactions.1")}
              {/* Transactions */}
            </div>
            {/* <div className="col-2">
              Nature
               </div> */}
            <div className="col-4">
              {t("tokenamount.1")}
              {/* Token Amount */}
            </div>
            <div className="col-3">
              {t("TRX.1")}
              {/* TRX */}
            </div>
          </div>
          <hr />
          <div>
            {rows &&
              rows.map((row) => (
                <div>
                  <div className="row">
                    <div className="col-4">
                      <a
                        href={`https://tronscan.org/#/transaction/${row.hashId}`}
                        target="_blank"
                      >
                        <button
                          style={{
                            background: "transparent",
                            width: "130px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            border: "none",
                            textDecoration: "none",
                            color: "white",
                          }}
                        >
                          {row.hashId}
                        </button>
                      </a>
                    </div>
                    {/* <div className="col-2">
                    <span >{row.nature}</span>
                  </div> */}
                    <div className="col-4">
                      <span> {row._tokens} </span>
                      {/* <span className="buyer"> {row._buyer} </span> */}
                    </div>
                    <div className="col-3">
                      <button className="buyer" style={{ cursor: "text" }}>
                        {" "}
                        {row._amounts}{" "}
                      </button>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
          </div>
        </div>

        <div className="cradview">
          <div className="row">
            <div className="col">
              <h1 className="sellTransaction">
                {t("selltransactions.1")}
                {/* Sell Transactions  */}
              </h1>
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              {t("transactions.1")}
              {/* Transactions */}
            </div>
            {/* <div className="col-2">
              Nature
               </div> */}
            <div className="col-4">
              {t("tokenamount.1")}
              {/* Token Amount */}
            </div>
            <div className="col-3">
              {t("TRX.1")}
              {/* TRX */}
            </div>
          </div>
          <hr />
          <div>
            {rowsSell &&
              rowsSell.map((c) => (
                <div>
                  <div className="row">
                    <div className="col-4">
                      <a
                        href={`https://tronscan.org/#/transaction/${c.hashId}`}
                        target="_blank"
                      >
                        <button
                          style={{
                            background: "transparent",
                            width: "130px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            border: "none",
                            textDecoration: "none",
                            color: "white",
                          }}
                        >
                          {c.hashId}
                        </button>
                      </a>
                    </div>
                    {/* <div className="col-4">
                    <span >{c.nature}</span>
                  </div> */}
                    <div className="col-4">
                      <span> {c._amounts} </span>
                      {/* <span className="buyer"> {c._seller} </span> */}
                    </div>
                    <div className="col-3">
                      <button className="buyer" style={{ cursor: "text" }}>
                        {" "}
                        {c._tokens}{" "}
                      </button>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
          </div>
        </div>

        <div className="cradview">
          <div className="row">
            <div className="col">
              <h1 className="withdrawTransaction">
                {t("withdrawtransactions.1")}
                {/* Withdraw Transactions  */}
              </h1>
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              {t("transactions.1")}
              {/* Transactions */}
            </div>
            <div className="col-4">
              {t("nature.1")}
              {/* Nature */}
            </div>
            {/* <div className="col-4">
            Token Amount
               </div> */}
            <div className="col-3">
              {t("TRX.1")}
              {/* TRX */}
            </div>
          </div>
          <hr />
          <div>
            {rowsWithdraw &&
              rowsWithdraw.map((w) => (
                <div>
                  <div className="row">
                    <div className="col-4">
                      <a
                        href={`https://tronscan.org/#/transaction/${w.hashId}`}
                        target="_blank"
                      >
                        <button
                          style={{
                            background: "transparent",
                            width: "130px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            border: "none",
                            textDecoration: "none",
                            color: "white",
                          }}
                        >
                          {w.hashId}
                        </button>
                      </a>
                    </div>
                    <div className="col-4">
                      <span>
                        {t("withdraw.1")}
                        {/* {w.nature} */}
                      </span>
                    </div>
                    {/* <div className="col-5">
                  N/A
                     <span > {w._drawer} </span>                    
                </div> */}
                    <div className="col-3">
                      {/* <span className="buyer"> {w._amountWithDrawn} </span> */}
                      <button className="buyer" style={{ cursor: "text" }}>
                        {w._amountWithDrawn}{" "}
                      </button>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="footer">
        <p>
          {t("allrightsreseved.1")}
          {/* All Rights Reserved 2021 @ TTTM */}
        </p>
      </div>
    </div>
  );
}

export default Transactions;
