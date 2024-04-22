import { NavLink } from "react-router-dom";
import styles from "../Styles/Submissions.module.css";
import { useState } from "react";

function StudentSubmissions() {
    const [submissions, setSubmissions] = useState(false);

    const[tasks, setTasks] = useState(false);
    const handleSubmissions = () => {
        setSubmissions(prevState => !prevState);
    };
    const handleTasks = async()=>{
        try{
            const response = await fetch(``,{
                method: "GET",
                headers:{
                    "Content-Type":"application/json"
                }
            });
            if(response.ok){
                const data = response.json();
                print(data);
            }
        }catch(error){
            console.log(error);
        }
        setTasks(prevState => !prevState)
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <h1>ClassSync</h1>
                    <ul>
                        <NavLink className={styles.links} to='/studentshome'>Home</NavLink>
                        <NavLink className={styles.links} onClick={handleTasks} >Task details</NavLink>
                        <NavLink className={styles.links}>Drafts</NavLink>
                        <NavLink className={styles.links} onClick={handleSubmissions}>Submissions</NavLink>
                    </ul>
                </div>
                {submissions && (
                    <div className={styles.submitbtn}>
                        <input type="file"></input>
                    </div>
                )}
            </div>
            {/* {(tasks && tasks.length != 0)(
                <div className={styles.tasklist}>
                    <p></p>
                </div>
            )} */}
        </>
    );
}

export default StudentSubmissions;
