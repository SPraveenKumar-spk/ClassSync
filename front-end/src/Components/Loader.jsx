import { ThreeCircles } from "react-loader-spinner";

export default function Loader() {
  return (
    <div className="loader">
      <ThreeCircles
        visible={true}
        height="70"
        width="70"
        color="#1F2937"
        ariaLabel="three-circles-loading"
        wrapperStyle={{}}
        wrapperclassName=""
      />
    </div>
  );
}
