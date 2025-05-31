import "./Leads.css";

import { motion } from "framer-motion";

import useLeads from "../../hooks/useLeads/useLeads";

import ContentWarning from "../ContentWarning/ContentWarning";
import LeadsTable from "./LeadsTable/LeadsTable.jsx";
import CustomSelect from "../ui.components/CustomSelect/CustomSelect.jsx";

function Leads() {
  const quizOptions = [
    {
      value: "quiz",
      placeholder: "Quiz",
    },
    {
      value: "quiz2",
      placeholder: "Quiz2",
    },
    {
      value: "quiz3",
      placeholder: "Quiz3",
    },
  ];

  return (
    <motion.div
      className="content-box content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="content-box header">
        <ContentWarning>
          A nossa interface é incompatível com o seu dispositivo, entre pelo
          desktop para obter uma melhor experiência.
        </ContentWarning>
        <h1 className="small-headline align-left">Leads</h1>
        <div className="inline-flex-center mini-gap">
          <p className="paragraph">Dashboard</p>
          <p className="paragraph">{">"}</p>
          <p className="paragraph">Leads</p>
        </div>
      </header>

      <section className="section">
        <div className="flex-row-center controls">
          <CustomSelect options={quizOptions} defaultValue={quizOptions[0]} />
        </div>
        {/* <LeadsTable data={data} /> */}
      </section>
    </motion.div>
  );
}

export default Leads;
