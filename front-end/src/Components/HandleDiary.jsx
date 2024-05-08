import styles from "../Styles/HandleDiary.module.css";
export default function handleDiary() {
  return (
    <>
      <div className={sty}>
        <div className={styles.item}>
          <button>New Entry</button>
        </div>
        <div className={styles.item}>
          <button>Past Entries</button>
        </div>
      </div>
    </>
  );
}
