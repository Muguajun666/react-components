import Calendar from "./Calendar";
import "./App.css";
import dayjs from "dayjs";
import { useState } from "react";

function App() {
  const [value, setValue] = useState(dayjs("2024-11-08"));
  return (
    <div className="App">
      <Calendar
        value={value}
        onChange={(val) => {
          setValue(val);
        }}
      ></Calendar>
    </div>
  );
}

export default App;
