import { Dayjs } from "dayjs";

interface HeaderProps {
  curMonth: Dayjs;
  prevMonthHandler: () => void;
  nextMonthHandler: () => void;
}

function Header(props: HeaderProps) {
  const { curMonth, prevMonthHandler, nextMonthHandler } = props;

  return (
    <div className="calendar-header">
      <div className="calendar-header-left">
        <div className="calendar-header-icon" onClick={prevMonthHandler}>&lt;</div>
        <div className="calendar-header-value">{curMonth.format("YYYY 年 MM 月")}</div>
        <div className="calendar-header-icon" onClick={nextMonthHandler}>&gt;</div>
        <button className="calendar-header-btn">今天</button>
      </div>
    </div>
  );
}

export default Header;
