import "./LeadsTable.css";

import { useTable } from "react-table";
import { useMemo } from "react";

import { motion } from "framer-motion";

function LeadsTable({ data }) {
  const columns = useMemo(() => {
    if (data.length <= 0) return [];

    return Object.keys(data[0]).map((key) => ({
      Header: key.toUpperCase(),
      accessor: key,
    }));
  }, [data]);

  const { getTableProps, getTableHeadProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <motion.div
      className="content-box table-box"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <table {...getTableProps()} className="content-box table">
        <thead className="table-header">
          <tr className="table-headers">
            {headerGroups.map((headerGroup) => (
              <tr
                key={headerGroup.id}
                {...headerGroup.getHeaderGroupProps()}
                className="table-headers"
              >
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
                    {...column.getHeaderProps()}
                    className="table-header-title"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          <tr className="table-row">
            <td className="table-data">José Augustho</td>
            <td className="table-data">+55 34991918563</td>
            <td className="table-data">Ansiedade</td>
            <td className="table-data">Não</td>
            <td className="table-data">Sim</td>
          </tr>
          <tr className="table-row">
            <td className="table-data">José Augustho</td>
            <td className="table-data">+55 34991918563</td>
            <td className="table-data">Ansiedade</td>
            <td className="table-data">Não</td>
            <td className="table-data">Sim</td>
          </tr>
          <tr className="table-row">
            <td className="table-data">José Augustho</td>
            <td className="table-data">+55 34991918563</td>
            <td className="table-data">Ansiedade</td>
            <td className="table-data">Não</td>
            <td className="table-data">Sim</td>
          </tr>
          <tr className="table-row">
            <td className="table-data">José Augustho</td>
            <td className="table-data">+55 34991918563</td>
            <td className="table-data">Ansiedade</td>
            <td className="table-data">Não</td>
            <td className="table-data">Sim</td>
          </tr>
          <tr className="table-row">
            <td className="table-data">José Augustho</td>
            <td className="table-data">+55 34991918563</td>
            <td className="table-data">Ansiedade</td>
            <td className="table-data">Não</td>
            <td className="table-data">Sim</td>
          </tr>
          <tr className="table-row">
            <td className="table-data">José Augustho</td>
            <td className="table-data">+55 34991918563</td>
            <td className="table-data">Ansiedade</td>
            <td className="table-data">Não</td>
            <td className="table-data">Sim</td>
          </tr>
          <tr className="table-row">
            <td className="table-data">José Augustho</td>
            <td className="table-data">+55 34991918563</td>
            <td className="table-data">Ansiedade</td>
            <td className="table-data">Não</td>
            <td className="table-data">Sim</td>
          </tr>
          <tr className="table-row">
            <td className="table-data">José Augustho</td>
            <td className="table-data">+55 34991918563</td>
            <td className="table-data">Ansiedade</td>
            <td className="table-data">Não</td>
            <td className="table-data">Sim</td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
}

export default LeadsTable;
