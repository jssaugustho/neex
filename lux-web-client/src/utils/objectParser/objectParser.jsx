import "./objectParser.css";

function objectParser(params) {
  function listItem(key, name, value) {
    if (typeof value == "object") return null;

    return (
      <li className="paragraph params-item align-left" key={key}>
        <span className="param-name">{`${name}: `}</span>
        {`${value}`}
      </li>
    );
  }

  return (
    <ul className="content-box params-list align-left small-gap">
      {Object.keys(params).map((name, i) => {
        return listItem(i, name, params[name]);
      })}
    </ul>
  );
}

export default objectParser;
