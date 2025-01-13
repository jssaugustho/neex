import "./objectParser.css";

function objectParser(params) {
  function listItem(key, name, value) {
    if (typeof value == "object") return null;

    return (
      <li className="text" key={key}>
        <span className="bold">{`${name}: `}</span>
        {`${value}`}
      </li>
    );
  }

  return (
    <ul className="list">
      {Object.keys(params).map((name, i) => {
        return listItem(i, name, params[name]);
      })}
    </ul>
  );
}

export default objectParser;
