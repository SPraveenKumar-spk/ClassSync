import {useState} from "react";
import styles from "../Styles/CreateTasks.module.css";
import { NavLink } from "react-router-dom";
function CreateTasks() {
  const [status, setStatus] = useState(false);

  const[tasks, setTasks] = useState(false);
  const handleStatus = () => {
    setStatus(prevState => !prevState);
  };
  const handleTasks = async()=>{
      try{
          const response = await fetch(``,{
              method: "POST",
              headers:{
                  "Content-Type":"application/json"
              },
              body:JSON.stringify(),

          });
          // if(response.ok){
          //     const data = response.json();
          //     print(data);
          // }
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
                      <NavLink className={styles.links} to='/projectshome'>Home</NavLink>
                      <NavLink className={styles.links}>Project Details</NavLink>
                      <NavLink className={styles.links} onClick={handleTasks} >Assign Tasks</NavLink>
                      <NavLink className={styles.links} onClick={handleStatus}>Student Status</NavLink>
                  </ul>
                  </ div>
              </div>
              <div className={styles.taskcontainer}>
                <div>
                <label htmlFor="task">Task Name</label>
                <input type="text" id = "task" name="task" />
                </div>
                <div>
                <label htmlFor="task">Task Name</label>
                <input type="text" id = "task" name="task" />
                </div>
              </div>
      </>
  );
}

export default CreateTasks;
