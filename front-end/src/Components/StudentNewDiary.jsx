import React, { useState } from "react";
import { useToast } from "../store/ToastContext";
import { ImSpinner9 } from "react-icons/im";
const NewDiaryEntry = () => {
  const { toast } = useToast();
  const [textData, setTextData] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const projectCode = sessionStorage.getItem("projectCode");
      const currentDate = new Date();
      const dateOnly = currentDate.toISOString().split("T")[0];
      const optionsTime = {
        timeZone: "Asia/Kolkata",
        timeStyle: "medium",
      };
      const time = currentDate.toLocaleTimeString("en-IN", optionsTime);
      const dayOfWeek = currentDate.toLocaleDateString("en-IN", {
        weekday: "long",
      });

      const response = await fetch(
        `${baseURL}/api/auth/diaryentry?projectCode=${projectCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: textData,
            date: dateOnly,
            time: time,
            dayOfWeek: dayOfWeek,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setTextData("");
        toast.success("Your diary entry has been saved successfully.");
        setLoading(false);
      } else {
        toast.error("Error saving diary entry.");
      }
    } catch (error) {
      console.error("Error submitting diary entry:", error);
    }
  };

  return (
    <div
      className="row "
      style={{
        position: "absolute",
        top: "50%",
        left: "55%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <form onSubmit={handleSubmit}>
        <textarea
          className="form-control border-3 border-secondary rounded-4"
          name="data"
          id="data"
          cols="85"
          rows="15"
          value={textData}
          onChange={(e) => setTextData(e.target.value)}
          placeholder="Your diary entry.."
        />
        <div className="text-center mt-3">
          <button className="btn btn-primary fs-5">
            {" "}
            {loading && <ImSpinner9 className="spinner m-2" size={20} />}Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewDiaryEntry;
