import React, { useState, useEffect } from "react";

import "./index.css";
import bell from "../asset/images/logo.png";
import logo from "../asset/images/logo.jpg";
import trx from "../asset/images/trx.png";
import { contractAddress } from "./constant";
import { PageItem } from "react-bootstrap";
import copy from "../asset/images/documentscopy.png";

import { useTranslation } from "react-i18next";
import axios from "axios";
function Header() {
  const { t, i18n } = useTranslation();

  let interv = null;
  var cnv;
  let cryptoPirce;
  let userAccount;
  const [account, setAccount] = useState("Connect To Wallet");
  const [mainAccountDetails, setMainAccountDetails] = useState(null);
  const [tttmprice, setTttmprice] = useState(0);
  const [tttmmarketcap, setTttmmarketcap] = useState(0);
  const [tttmmarketcapinusd, setTttmmarketcapinusd] = useState(0);
  const [circulatingsupply, setCirculatingsupply] = useState(0);
  const [trxPrice, setTrxPrice] = useState(0);
  const [refferalAddress, setRefferalAddress] = useState("....");
  const [tttmbalance, setTttmbalance] = useState(0);

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
        await isLocked();
        loadBlockchainData();
        if (mainAccount) {
          if (isConnected === true) {
            mainAccount = await window?.tronWeb?.defaultAddress?.base58;
            setAccount(mainAccount);
            userAccount = mainAccount;
            let accountDetails = null;
            localStorage.setItem("load", mainAccount);
            setMainAccountDetails(accountDetails);
          } else {
            console.log("Tron Not Connected");
          }
        } else {
          console.log("Please login or install tron wallet!");
        }
      }
    } catch (error) {
      console.log("error0", error);
    }
  };

  function isLocked() {
    let price = require("crypto-price");
    price
      .getCryptoPrice("USD", "TRX")
      .then((obj) => {
        setTrxPrice(obj.price);
        cryptoPirce = obj.price;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const loadBlockchainData = async () => {
    try {
      let contract = await window?.tronWeb.contract().at(contractAddress);
      const circulatingSupply = await contract.circulatingSupply().call();
      var supplly = parseFloat(circulatingSupply) / 10 ** 6;
      setCirculatingsupply(formatThousands(supplly));
      const noOfFiles = await contract.calculateTrxReceived(1000000).call();
      var price = parseFloat(noOfFiles) / 10 ** 6;
      setTttmprice(formatThousands(price));
      const marketCap = await contract.marketCap().call();
      var cap = parseFloat(marketCap) / 10 ** 6;
      setTttmmarketcap(formatThousands(cap));
      let valueInUsd = cap * cryptoPirce;
      setTttmmarketcapinusd(formatThousands(valueInUsd));
      const balanceof = await contract.balanceOf(userAccount).call();
      var price = parseFloat(balanceof) / 10 ** 6;
      setTttmbalance(formatThousands(price));
    } catch (e) {
      console.log("error", e);
    }
  };

  const copyReferralLink = () => {
    try {
      let get = document.getElementById("refer").select();
      document.execCommand("copy");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setInterval(() => {
      loadWeb3();
    }, 2000);
  }, []);

  return (
    <div className="container">
      <div className="row" id="nav">
        <div className="col-md-6 header-content">
          <h1
            className="trx-icon-text"
            id="tttm"
            style={{
              color: "rgb(237,219,0)",
              padding: "1em 0em 0.5em 0em",
              margin: "0px",
            }}
          >
            {t("h1.1")}
          </h1>
          <p
            style={{
              padding: "0px",
              margin: "0px",
              color: "white",
              lineHeight: "1",
            }}
          >
            {t("p.1")}
          </p>

          <div className="main-design my-referel">
            <span
              className="trx-icon-small"
              style={{
                display: "flex",
                padding: "2px 0px",
                margin: "0",
                fontSize: "15pt",
                color: "white",
              }}
            >
              {t("spanmyreferal.1")}
            </span>
            <span
              style={{
                color: "white",
                fontWeight: "400",
                padding: "0px 10px 0px 0px",
              }}
            >
              {t("spanreferal.1")}
            </span>
            <input
              id="refer"
              value={`${window.location.protocol}//${window.location.host}/login?ref=${account}`}
              style={{
                padding: "0.25em 1em",
                width: "auto",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                color: "white",
                backgroundColor: "#0a1930",
                border: " 1px transparent solid",
                borderRadius: "5px",
                fontWeight: "400",
              }}
            />
            <a onClick={copyReferralLink}>
              <img src={copy} className="copy" title="copy" />
            </a>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-lg-5 paragon">
              <div
                className="trx-icon-small"
                style={{
                  display: "flex",
                  fontSize: "12pt",
                  color: "rgb(88, 88, 88)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={trx}
                  style={{
                    height: "25px",
                    width: "auto",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  alt="icon"
                />
              </div>
              <div
                className="trx-icon-text"
                style={{
                  color: "black",
                  padding: "0px",
                  margin: "0px",
                  display: "flex",
                  flexDirection: "row",
                  alignSelf: "center",
                }}
              >
                <span
                  style={{
                    padding: "0 0 0 5px",
                    margin: "0px",
                  }}
                >
                  {" "}
                  ${" "}
                </span>
                <span
                  style={{
                    padding: "0",
                    margin: "0",
                  }}
                >
                  {trxPrice}
                </span>
              </div>
            </div>
            <div className="col-lg-5 paragon">
              <div
                className="trx-icon-small"
                style={{
                  display: "flex",
                  fontSize: "12pt",
                  color: "black",
                  fontWeight: "600",
                  padding: "0",
                  margin: "0",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <span>{t("tttmmarketcap.1")}</span>
              </div>
              <div
                className="trx-icon-text"
                style={{
                  color: "black",
                  padding: "0px",
                  margin: "0px",
                  display: "flex",
                  flexDirection: "row",
                  alignSelf: "center",
                }}
              >
                <span
                  style={{
                    padding: "0",
                    margin: "0",
                  }}
                >
                  {tttmmarketcap}
                </span>
                <span
                  style={{
                    padding: "0 0 0 2px",
                    margin: "0px",
                    fontSize: "10pt",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    fontWeight: "500",
                  }}
                >
                  {" "}
                  TRX{" "}
                </span>
              </div>
              <div
                className="trx-icon-small"
                style={{
                  fontSize: "12pt",
                  color: "red",
                  display: "flex",
                  flexDirection: "row",
                  alignSelf: "center",
                  fontWeight: "600",
                }}
              >
                $ {tttmmarketcapinusd}
              </div>
            </div>

            <div className="col-lg-5 paragon">
              <div
                className="trx-icon-small"
                style={{
                  fontSize: "12pt",
                  color: "black",
                  fontWeight: "500",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <span>{t("tttmmarketcirculationupply.1")}</span>
              </div>
              <div
                className="trx-icon-text"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignSelf: "center",
                }}
              >
                <span
                  style={{
                    paddingRight: "2px",
                  }}
                >
                  {circulatingsupply}
                </span>
                <span
                  style={{
                    fontSize: "10pt",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    fontWeight: "500",
                  }}
                >
                  TTTM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
