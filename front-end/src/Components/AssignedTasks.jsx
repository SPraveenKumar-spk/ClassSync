import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignedTasks = () => {
  const { baseURL } = useAuth();
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

  const notifySuccess2 = () => {
    toast.success('Task deleted successfully');
  };

  const notifyError = () => {
    toast.error('Failed to delete task');
  };

  useEffect(() => {
    const fetchAssigned = async () => {
      setLoading(true);
      try {
        const projectCode = sessionStorage.getItem('projectCode');
        const response = await fetch(`${baseURL}/api/auth/assignedDetails?projectCode=${projectCode}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setAssigned(data);
          setStatus(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (!status) {
      fetchAssigned();
    }
  }, [status, baseURL]);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/deletetask`, {
        method: 'DELETE',
        body: JSON.stringify({ taskId }),
        credentials: 'include',
      });
      if (response.ok) {
        setAssigned((prevAssigned) =>
          prevAssigned.filter((task) => task.taskId !== taskId)
        );
        notifySuccess2();
      } else {
        notifyError();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)' }}>
        {!loading && assigned.length ? (
          assigned.map((task, index) => (
            <div key={index} className="p-2 rounded bg-secondary fs-5 min-w-50 h-50">
              <p>
                <span className="text-dark">Task Name :</span>{' '}
                <span className="text-white">{task.taskName}</span>
              </p>
              <p>
                <span className="text-dark">Task theme :</span>{' '}
                <span className="text-white">{task.theme}</span>
              </p>
              <p>
                <span className="text-dark">Description :</span>{' '}
                <span className="text-white">{task.description}</span>
              </p>
              <p>
                <span className="text-dark">Last Date :</span>{' '}
                <span className="text-white">{task.deadline}</span>
              </p>
              <div className="d-flex justify-content-around mt-3">
                <div className="me-2">
                  <button className="btn btn-warning">Edit</button>
                </div>
                <div>
                  <button className="btn btn-danger" onClick={() => handleDelete(task.taskId)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="fs-3 w-50">
            <p className="alert alert-danger">You haven't created any tasks..</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AssignedTasks;
