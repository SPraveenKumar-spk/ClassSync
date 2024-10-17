import { useState } from "react";
import { useToast } from "../../store/ToastContext";
import { ImSpinner9 } from "react-icons/im";
import { useAuth } from "../../store/auth";

const NewDiaryEntry = () => {
  const { toast } = useToast();
  const { token, baseURL } = useAuth();
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: textData,
            date: dateOnly,
            time: time,
            dayOfWeek: dayOfWeek,
          }),
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
    <div className="container pt-5" style={{ marginTop: "5rem" }}>
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12">
          <form onSubmit={handleSubmit}>
            <textarea
              className="form-control border-3 border-secondary rounded-4"
              name="data"
              id="data"
              rows="12"
              value={textData}
              onChange={(e) => setTextData(e.target.value)}
              placeholder="Your diary entry.."
            />
            <div className="text-center mt-3">
              <button className="btn btn-primary fs-5" type="submit">
                {loading && <ImSpinner9 className="spinner m-2" size={20} />}
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewDiaryEntry;
