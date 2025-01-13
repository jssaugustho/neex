function BigLoadSpinner() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="42"
        height="42"
        display="block"
        preserveAspectRatio="xMidYMid"
        style={{ background: "0 0" }}
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="var(--sub-text-color)"
          strokeDasharray="164.93361431346415 56.97787143782138"
          strokeWidth="8"
        >
          <animateTransform
            attributeName="transform"
            dur="2.272727272727273s"
            keyTimes="0;1"
            repeatCount="indefinite"
            type="rotate"
            values="0 50 50;360 50 50"
          ></animateTransform>
        </circle>
      </svg>
    </>
  );
}

export default BigLoadSpinner;
