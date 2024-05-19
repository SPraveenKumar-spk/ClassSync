import React from "react";
import styles from "../Styles/Loader.module.css";
import { ThreeCircles } from "react-loader-spinner";

export default function Loader() {
  return (
    <div className={styles.loader}>
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
