import "bootstrap/dist/css/bootstrap.min.css";
import Responsivenav from "../component/Responsivenav";
import Header from "../component/header";
import Maincontent from "../component/maincontent";
import Transactions from "../component/transactions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { useTranslation } from 'react-i18next';


function App() {
  const { t, i18n } = useTranslation();



  return (
    <div className="front-body">
     
      <ToastContainer />
      <Responsivenav />
      <Header />
      <Maincontent />
      <Transactions />
    </div>
  );
}

export default App;
