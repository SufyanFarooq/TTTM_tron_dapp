import React, { useState, useEffect } from "react";
import "./responsivenav.css";
import language from "../asset/images/language.png";
import birtish from "../asset/images/birtish.png";
import chinese from "../asset/images/chinese.png";
import logo from "../asset/images/mainlogo.png";
import menuIcon from "../asset/images/menuIcon.png";
import { contractAddress } from "./constant";
import { Dropdown } from "react-bootstrap";
import audit from "../asset/docs/audit.pdf";
import Pdf from "../asset/docs/sample.pdf";
// import Pdf1 from "../asset/docs/sample1.pdf";
import Pdf2 from "../asset/docs/sample3.pdf";
import video1 from "../asset/b.mp4";
import video2 from "../asset/a.mp4";
// import video2 from "./video/vd2.ogv";
// import video3 from "./video/vd3.webm";

import { useTranslation } from "react-i18next";
function Navigatmenu() {
  const { t, i18n } = useTranslation();
  const [account, setAccount] = useState("Connect To Wallet");
  const [mainAccountDetails, setMainAccountDetails] = useState(null);

  function handleClick(lang) {
    i18n.changeLanguage(lang);
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
        if (mainAccount) {
          if (isConnected === true) {
            mainAccount = await window?.tronWeb?.defaultAddress?.base58;
            setAccount(mainAccount);
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
  useEffect(() => {
    setInterval(() => {
      loadWeb3();
    }, 4000);
  }, []);

  function isLocked() {
    if (window.tronWeb.defaultAddress.base58 == null) {
      // console.log("error null");
    } else if (window.tronWeb.defaultAddress.base58 === 0) {
      // console.log("TRON LINK is locked");
    } else {
      // console.log("TRON LINK is unlocked");
    }
  }
  const [showLinks, setShowLinks] = useState(false);
  return (
    <div className="container">
      <div className="Navbar" style={{ position: "relative", zIndex: "1" }}>
        <div className="rightSide">
          <a href="#home">
            <img className="logo" src={logo} alt="Logo" />
          </a>
        </div>
        <div className="leftSide">
          <div className="links" id={showLinks ? "hidden" : ""}>
            <a href="#home">{t("Home.1")}</a>
            <div class="dropdown">
              <span class="dropbtn">{t("whatistttm.1")}</span>
              <div class="dropdown-content">
                <a id="adlink1" href={Pdf} target="_blank">
                  {t("intrototttm.1")}
                </a>
                <a id="adlink2" href={video1} target="_blank">
                  {t("videoads.1")}
                </a>
                <a id="adlink3" href={video2} target="_blank">
                  {t("videointro.1")}
                </a>
                <a id="adlink4" href={Pdf2} target="_blank">
                  {t("howtouse.1")}
                </a>
              </div>
            </div>

            <a
              href={`https://tronscan.org/#/contract/${contractAddress}`}
              target="_blank"
            >
              {t("smartcontract.1")}
            </a>
            <a href={audit} target="_blank">
              {t("audit.1")}
            </a>
            <a href="https://t.me/trxttm" target="_blank">
              {t("telegram.1")}
            </a>
            <a>
              <button
                className="btn btn-primary"
                id="connect"
                onClick={loadWeb3}
              >
                {account}
              </button>
            </a>
            <div class="dropdown">
              <a href="#home">
                <img src={birtish} />
              </a>
              <div class="dropdown-content">
                <a className="btn" onClick={() => handleClick("en")}>
                  <img
                    className="listflags"
                    src={language}
                    style={{
                      height: "auto",
                      width: "30px",
                      padding: "0px 5px",
                    }}
                  />
                  {t("english.1")}
                </a>
                <a className="btn" onClick={() => handleClick("chi")}>
                  <img
                    className="listflags"
                    src={chinese}
                    style={{
                      height: "auto",
                      width: "30px",
                      padding: "0px 5px",
                    }}
                  />
                  {t("chinese.1")}
                </a>
              </div>
            </div>
          </div>
          <button onClick={() => setShowLinks(!showLinks)}>
            <img src={menuIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navigatmenu;
