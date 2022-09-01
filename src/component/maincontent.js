import React, { useState, useEffect } from "react";
// import "./index.css";
import bell from "../asset/images/logo.png";
import logo from "../asset/images/mainlogo.png";
import tronlogo from "../asset/images/tronlogo.png";
import { contractAddress, refDefaultAddress } from "./constant";
import { ToastContainer, toast } from "react-toastify";

import { useTranslation } from "react-i18next";
function formatThousands(num) {
  var numbr = parseFloat(num.toFixed(6));
  var values = numbr.toString().split(".");
  return (
    values[0].replace(/.(?=(?:.{3})+$)/g, "$&,") +
    (values.length == 2 ? "." + values[1] : "")
  );
}
function Maincontent() {
  const { t, i18n } = useTranslation();

  let interv = null;
  let getDirectFromUrl;
  let userAccount;
  let tronbalance;
  let tronbalanceinusd;
  let ttmblnc;
  let trxbalan = 0;
  let sellpric = 0;
  let ttmblncinusd;
  let mainAccount;
  let trbalance;
  let cryptoPirce;

  const [account, setAccount] = useState("Connect To Wallet");
  const [mainAccountDetails, setMainAccountDetails] = useState(null);
  const [tttmbalance, setTttmbalance] = useState(0);
  const [trxbalance, setTrxbalance] = useState(0);
  const [trxPrice, setTrxPrice] = useState(0);
  const [tronValue, setTronValue] = useState(0);
  const [buyprice, setBuyprice] = useState(0);
  const [trxtotttm, setTrxtotttm] = useState(0);
  const [sellprice, setSellprice] = useState(0);
  const [tttmtotrx, setTttmtotrx] = useState(0);
  const [totaldeposit, setTotalDeposit] = useState(0);
  const [totaltronWithdrawn, setTotaltronWithdrawn] = useState(0);
  const [trx, setTrx] = useState(0);
  const [trxTokens, setTrxTokens] = useState(0);
  const [tttm, setTttm] = useState(0);
  const [tttmSell, setTttmSell] = useState(0);

  const loadWeb3 = async () => {
    let isConnected = false;
    let connection;
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
        setAccount(mainAccount);
        userAccount = mainAccount;
        loadBlockchainData();
        tttmtoTrx();
        getreferralAddress();
        if (mainAccount) {
          if (isConnected === true) {
            mainAccount = await window?.tronWeb?.defaultAddress?.base58;
            setAccount(mainAccount);
            userAccount = mainAccount;
            getBalanceOfAccount();
            let accountDetails = null;
            localStorage.setItem("load", mainAccount);
            setMainAccountDetails(accountDetails);
          } else {
            // console.log("Tron Not Connected");
          }
        } else {
          // console.log("Please login or install tron wallet!");
        }
      }
    } catch (error) {
      console.log("error0", error);
    }
  };

  const getBalanceOfAccount = async () => {
    try {
      // let data = await window.tronWeb.trx.getAccount(mainAccount);
      // await window.tronWeb.trx.getBalance(mainAccount, function (err, res) {
      //   var blnc = parseInt(res) / 1000000;
      //   tronbalance = blnc;
      //   //     let vlaueinTron = ttmblnc * sellpric * cnv;
      //   //   });
      // });
      // var tradeobj = await window.tronWeb.trx
      //   .getAccount(contractAddress)
      //   .then((output) => {
      //     const tbalance = output.balance / 1000000;
      //   });
    } catch (e) {
      console.log("blnc", e);
    }
  };
  const loadBlockchainData = async () => {
    try {
      let contract = await window?.tronWeb.contract().at(contractAddress);

      const balanceof = await contract.balanceOf(userAccount).call();
      var price = parseFloat(balanceof) / 10 ** 6;
      var tronv = price * parseFloat(sellpric);
      setTronValue(formatThousands(tronv));
      setTttmbalance(formatThousands(price));
      const sponsor = await contract.users(userAccount).call();
      var price = parseInt(sponsor.totalTRXDeposited) / 10 ** 6;
      setTotalDeposit(formatThousands(price));
      var price = parseFloat(sponsor.totalWithdrawn) / 10 ** 6;
      setTotaltronWithdrawn(formatThousands(price));
      var totalbalane = parseFloat(
        await contract.myDividends(userAccount).call()
      );
      var price = totalbalane / 10 ** 6;
      setTrxbalance(formatThousands(price));
      let e = require("crypto-price");
      e.getCryptoPrice("USD", "TRX")
        .then((obj) => {
          cryptoPirce = obj.price;
        })
        .catch((err) => {
          console.log(err);
        });
      setTrxPrice(formatThousands(price * cryptoPirce));
      const buyPrice = await contract.calculateTokensReceived(1000000).call();
      var price = parseFloat(buyPrice) / 10 ** 6;
      setBuyprice(formatThousands(price));
      const trxto = await contract.TrxToTTTM().call();
      var price = parseFloat(trxto) / 10 ** 6;
      setTrxtotttm(formatThousands(price));
      const sellPrice = await contract.calculateTrxReceived(1000000).call();
      var price = parseFloat(sellPrice) / 10 ** 6;
      sellpric = price;
      setSellprice(formatThousands(price));
    } catch (e) {
      console.log(e);
    }
  };

  const tttmtoTrx = async () => {
    try {
      let contract = await window?.tronWeb.contract().at(contractAddress);
      const noOfFiles = await contract.TTTMtoTrx().call();
      var price = parseFloat(noOfFiles) / 10 ** 6;
      setTttmtotrx(formatThousands(price));
    } catch (e) {
      console.log(e);
    }
  };
  const withDraw = async () => {
    try {
      let contract = await window?.tronWeb.contract().at(contractAddress);
      const noOfFiles = await contract
        .withdraw()
        .send({
          shouldPollResponse: true,
        })
        .then((output) => {
          toast.success("Transaction is complete");
        })
        .catch((e) => {
          toast.error(e.message);
        });
      var price = parseFloat(noOfFiles) / 10 ** 6;
    } catch (e) {
      toast.error("Check Your Wallet");
    }
  };

  const sellTron = (e) => {
    try {
      var tttmtokens = sellprice * e.target.value;
      var tttm = 1000000 * e.target.value;
      setTttm(formatThousands(tttmtokens));
      setTttmSell(tttm);
    } catch (e) {
      console.log(e);
    }
  };

  const buyPrice = async (e) => {
    try {
      let contract = await window?.tronWeb.contract().at(contractAddress);
      const buyActualPrice = await contract
        .calculateTokensReceived(e.target.value * 1000000)
        .call();
      let priceOf = parseInt(buyActualPrice) / 1000000;
      setTrx(formatThousands(priceOf));
      setTrxTokens(e.target.value * 1000000);
    } catch (e) {
      console.log(e);
    }
  };

  const getreferralAddress = () => {
    try {
      let url = window.location.href;
      if (url.includes("?ref=")) {
        let getAddress = window.location.href.split("?ref=")[1];
        let final = getAddress.slice(0, 42);
        getDirectFromUrl = final;
      }
    } catch (e) {
      console.log(e);
    }
  };
  const buyTokens = async (e) => {
    try {
      let url = window.location.href;
      if (url.includes("?ref=")) {
        let getAddress = window.location.href.split("?ref=")[1];
        let final = getAddress.slice(0, 42);
        getDirectFromUrl = final;
      }
      getDirectFromUrl = getDirectFromUrl
        ? getDirectFromUrl
        : refDefaultAddress;
      let contract = await window?.tronWeb.contract().at(contractAddress);
      let upline = await contract.users(account).call();
      if (totaldeposit == 0) {
        const noOfFiles = await contract
          .buyToken(getDirectFromUrl)
          .send({
            callValue: trxTokens,
            shouldPollResponse: true,
          })
          .then((output) => {
            toast.success("Transaction is complete");
          })
          .catch((e) => {
            toast.error(e.message);
          });
        var price = parseFloat(noOfFiles) / 10 ** 6;
      } else {
        const noOfFiles = await contract
          .buyToken(window.tronWeb.address.fromHex(upline._upline))
          .send({
            callValue: trxTokens,
            shouldPollResponse: true,
          })
          .then((output) => {
            toast.success("Transaction is complete");
          })
          .catch((e) => {
            toast.error(e.message);
          });
        var price = parseFloat(noOfFiles) / 10 ** 6;
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const sellTokens = async (e) => {
    try {
      let contract = await window?.tronWeb.contract().at(contractAddress);
      const noOfFiles = await contract
        .sellToken(tttmSell.toString())
        .send({
          shouldPollResponse: true,
        })
        .then((output) => {
          toast.success("Transaction is complete");
        })
        .catch((e) => {
          console.log("error", e);
          toast.error(e.message);
        });
      var price = parseFloat(noOfFiles) / 10 ** 6;
    } catch (e) {
      console.log("error", e);
      toast.error(e.message);
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
  useEffect(() => {
    setInterval(() => {
      loadWeb3();
    }, 3500);
  }, []);
  return (
    <div className="container-fluid">
      <div className="container">
        <div className="row centralcontent">
          <div className="col-lg  main-content">
            <div className="main-design">
              <div className="row">
                <div
                  className="col-md-4 main-design-small"
                  style={{
                    backgroundColor: "#0a1930",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "20px",
                    alignItems: "center",
                    justifyItems: "center",
                  }}
                >
                  <h5
                    className="col"
                    style={{
                      fontSize: "12pt",
                      padding: "0px 30px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {t("tttmbalance.1")}
                    {/* TTTM Balance: */}
                  </h5>

                  <div
                    className="col"
                    style={{
                      padding: "0px 30px",
                      display: "flex",
                      flexDirection: "row",
                      fontWeight: "700",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        padding: "0",
                        margin: "0",
                        display: "flex",
                        fontSize: "22pt",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      {tttmbalance}{" "}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: "10pt",
                      display: "flex",
                      flexDirection: "column",
                      height: "85%",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        display: "flex",
                        flexDirection: "column",
                        padding: "0px 5px",
                        justifyContent: "center",
                      }}
                    >
                      {tronValue}
                      {t("TRX.1")}
                      {/* TRX */}
                    </span>
                  </div>
                </div>
                <div
                  className="col-md-4 main-design-small"
                  style={{
                    backgroundColor: "#0a1930",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "20px",
                    alignItems: "center",
                    justifyItems: "center",
                  }}
                >
                  <h5
                    className="col"
                    style={{
                      fontSize: "12pt",
                      padding: "0px 30px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {t("trxbalance.1")}
                    {/* TRX Balance: */}
                  </h5>

                  <div
                    className="col"
                    style={{
                      padding: "0px 30px",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      fontWeight: "700",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        padding: "0",
                        margin: "0",
                        display: "flex",
                        fontSize: "22pt",
                        alignItems: "flex-end",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      {trxbalance}
                      {t("TRX.1")}
                      {/* TRX */}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "10pt",
                        display: "flex",
                        flexDirection: "column",
                        height: "85%",
                        justifyContent: "flex-end",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10pt",
                          display: "flex",
                          alignItems: "flex-end",
                          padding: "0px 5px",
                        }}
                      >
                        ${trxPrice}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-info botbtn withdrawbtn"
                    onClick={withDraw}
                  >
                    {t("withdraw.1")}
                    {/* Withdraw */}
                  </button>
                </div>
              </div>

              <div
                className="row"
                style={{
                  margin: "0px 0px 20px 0px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="col">
                  <div className="row statistics">
                    <span className="col-md-6 depostdiv">
                      {t("totaltrxdeposit.1")}
                      {/* Total TRX Deposited  */}:
                    </span>
                    <span className="col-md-6">{totaldeposit}</span>
                  </div>
                  {/* <hr /> */}
                  <div className="row statistics">
                    <span className="col-md-6 depostdiv">
                      {t("totaltrxwithdrawn.1")}
                      {/* Total TRX Withdrawn : */}
                    </span>
                    <span className="col-md-6">{totaltronWithdrawn}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6  main-content">
            <div
              className="main-design"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "white",
                padding: "30px",
              }}
            >
              <h4
                style={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "center",
                  padding: "2px",
                }}
              >
                {t("tttmbuyingprice.1")}
                {/* TTTM Buying Price */}
              </h4>
              <h3>
                <span>
                  {/* {buyprice}  */}
                  {trxtotttm}
                </span>
                <span> TRX/TTTM </span>
              </h3>

              <div
                class="input-group"
                style={{
                  padding: "10px 10px 10px",
                }}
              >
                <span
                  class="input-group-addon"
                  style={{
                    display: "flex",
                    borderRadius: "2px",
                    borderTopLeftRadius: "15px",
                    borderBottomLeftRadius: "15px",

                    alignItems: "center",
                  }}
                >
                  <img
                    src={tronlogo}
                    style={{
                      height: "32px",
                      width: "auto",
                      padding: "0px 10px 0px 10px",
                    }}
                  />
                </span>
                <input
                  id="buy"
                  type="number"
                  class="form-control"
                  name="password"
                  placeholder="Enter Number of Tron"
                  onChange={buyPrice}
                />
                <span
                  class="input-group-addon"
                  style={{
                    display: "flex",
                    borderTopRightRadius: "15px",
                    borderBottomRightRadius: "15px",

                    padding: "0px 10px 0px 10px",
                    alignItems: "center",
                    color: "",
                  }}
                >
                  {t("TRX.1")}
                  {/* TRX */}
                </span>
              </div>
              <h3>
                <span>
                  {t("youwillreceive.1")}
                  {/* You Will Receive  */}
                </span>
                <span> {trx} </span>
                <span> TTTM</span>
              </h3>
              <button
                className="btn btn-warning"
                style={{
                  margin: "20px 0px 0px 0px",
                }}
                onClick={buyTokens}
              >
                {t("buytttm.1")}
                {/* Buy TTTM */}
              </button>
            </div>
          </div>
          <div className="col-lg-6  main-content">
            <div
              className="main-design"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "white",
                padding: "30px",
              }}
            >
              <h4
                style={{
                  color: "rgb(255, 255, 255)",
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "center",
                  padding: "2px",
                }}
              >
                {t("tttmsellingprice.1")}
                {/* TTTM Selling Price */}
              </h4>
              <h3>
                <span> {tttmtotrx} </span>
                <span> TRX/TTTM </span>
              </h3>
              <div
                class="input-group"
                style={{
                  padding: "10px 10px 10px",
                }}
              >
                <span
                  class="input-group-addon"
                  style={{
                    display: "flex",
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",

                    alignItems: "center",
                  }}
                >
                  <img
                    src={logo}
                    style={{
                      height: "32px",
                      width: "auto",
                      padding: "0px 10px 0px",
                    }}
                  />
                </span>
                <input
                  id="sell"
                  type="number"
                  class="form-control"
                  name="password"
                  placeholder="Enter Number of TTTM"
                  onChange={sellTron}
                />
                <span
                  class="input-group-addon"
                  style={{
                    display: "flex",
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px",

                    padding: "0px 10px 0px",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  TTTM
                </span>
              </div>
              <h3>
                <span>
                  {t("youwillreceiv.1")}
                  {/* You Will Receive */}
                </span>
                <span> {tttm} </span>
                <span>
                  {t("TRX.1")}
                  {/* TRX */}
                </span>
              </h3>
              <button
                className="btn btn-success"
                style={{
                  margin: "20px 0px 0px 0px",
                }}
                onClick={sellTokens}
              >
                {t("selltttm.1")}
                {/* Sell TTTM */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Maincontent;
