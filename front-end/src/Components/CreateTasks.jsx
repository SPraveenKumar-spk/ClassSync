import {useState,useEffect} from "react";
import styles from "../Styles/CreateTasks.module.css";
import { NavLink } from "react-router-dom";
function CreateTasks() {
  const [status, setStatus] = useState(false);
  const[tasks, setTasks] = useState(false);
  const[assigned,setAssigned] = useState([]);
  const[values, setValues] = useState({
    taskName: "",
    theme:"",
    description:"",
  })
  const handleSubmit = async(e) =>{
    e.preventDefault();
    try{
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/auth/assigntasks`,{
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization" : `Bearer${token}`
            },
            body:JSON.stringify(values),

        });
        if(response.ok){
            setValues({
                taskName :" ",
                theme:" ",
                description:" "
            });
            alert("Task assigned successfully");
        }
    }catch(error){
        console.log(error);
    }
  }

  const handleAssigned = () => {
    setStatus(prevState => !prevState);
  };

    useEffect(()=>{
        const fetchAssigned = async() =>{
            try{
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:5000/api/auth/assignedDetails`,{
                method : "GET",
                headers:{
                Authorization:`Bearer${token}`,
                }
                });
                if(response.ok){
                    const data = await response.json();
                    setAssigned(data)
                    setStatus(true);
                    setTasks(false);
                
                }

            }catch(error){
                console.log(error);
            }
        }
        if(status){
            fetchAssigned();
        }
       
    },[status])
  

  const handleTasks = async()=>{
      setTasks(prevState => !prevState)
      setStatus(false); 
  }
  const handleInputs = (e)=>{
    const {name,value} = e.target;
    setValues({...values,[name]:value})
  }
  return (
      <>
          <div className={styles.container}>
              <div className={styles.sidebar}>
                  <h1>ClassSync</h1>
                  <ul>
                      <NavLink className={styles.links} to='/projectshome'>Home</NavLink>
                      <NavLink className={styles.links} onClick={handleAssigned} >Assigned Tasks</NavLink>
                      <NavLink className={styles.links} onClick={handleTasks} >Assign Tasks</NavLink>
                      <NavLink className={styles.links} >Student Status</NavLink>
                  </ul>
                </ div>
              {tasks &&
              <div className={styles.taskcontainer}>
                    <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="taskName">Task Name : </label>
                        <input type="text" id = "taskName" name="taskName" value={values.taskName} onChange={handleInputs} required/>
                    </div>
                    <div>
                        <label htmlFor="theme">Theme : </label>
                        <input type="text" id = "theme" name="theme" value={values.theme} onChange={handleInputs}   required />
                    </div>
                    <div>
                        <label htmlFor="description">Description : </label>
                        <textarea id="description" name="description" rows="10" cols="65" placeholder="Describe about the task" value={values.description} onChange={handleInputs}     required />
                    </div>
                    <div className={styles.btn}>
                        <button>Submit</button>
                    </div>
                    </form>
                </div>
                }
            </div>
            {status &&
            <div className={styles.assignedContainer}>
              {assigned.length ?(assigned.map((task,index)=>(
            <div key={index} className={styles.templates}>
                <p><span>Task Name :</span> {task.taskName}</p>
                <p><span>Task theme :</span> {task.theme}</p>
                <p><span>Task Description :</span> {task.description}</p>
            </div>
            ))):(
            <h1>You haven't created any tasks..</h1>
            )}
            </div>
             } 
      </>
  );
}

export default CreateTasks;