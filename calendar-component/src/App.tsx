import Calendar from "./Calendar";
import "./App.css";
import dayjs from "dayjs";

function App() {
  return (
    <div className="App">
      <Calendar value={dayjs("2024-10-14")} onChange={(date) => {alert(date.format("YYYY-MM-DD"))}}></Calendar>
    </div>
  );
}

export default App;
