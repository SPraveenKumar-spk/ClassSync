import styles from "../Styles/HandleDiary.module.css";
import { useEffect, useState } from "react";
export default function handleDiary() {
  const [entry, setEntry] = useState(false);
  const [past, setPast] = useState(false);
  const [textData, setData] = useState("");
  const handleEntry = () => {
    setEntry(true);
  };
  const handlePast = () => {
    setEntry(false);
    setPast((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchPast = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(``, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response) {
          const data = response.json();
          setData(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
  });

  return (
    <>
      <div className={styles.container}>
        <div className={styles.clickevents}>
          <div className={styles.item}>
            <button onClick={handleEntry}>New Entry</button>
          </div>
          <div className={styles.item}>
            <button onClick={handlePast}>Past Entries</button>
          </div>
        </div>
        {entry && (
          <div className={styles.newEntry}>
            <textarea
              name="data"
              id="data"
              cols="85"
              rows="20"
              placeholder="Enter the entry"
            />
            <div className={styles.btn}>
              <button>Submit</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
