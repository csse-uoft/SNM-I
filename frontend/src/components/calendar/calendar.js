import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import * as Styled from "../../styles/calendarStyles";
import calendar, {
  isDate,
  isSameDay,
  isSameMonth,
  getDateISO,
  getNextMonth,
  getPreviousMonth,
  WEEK_DAYS,
  CALENDAR_MONTHS,
} from "../../helpers/calendarHelper";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Calendar({ date, onDateChanged }) {
  const [dateState, setDateState] = useState({
    current: new Date(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [today, setToday] = useState(new Date());

  useEffect(() => {
    addDateToState(date);
  }, []);

  const addDateToState = (date) => {
    const isDateObject = isDate(date);
    const _date = isDateObject ? date : new Date();
    setDateState({
      current: isDateObject ? date : null,
      month: _date.getMonth() + 1,
      year: _date.getFullYear(),
    });
  };

  const getCalendarDates = () => {
    const { current, month, year } = dateState;
    const calendarMonth = month || (current ? current.getMonth() + 1 : THIS_MONTH);
    const calendarYear = year || (current ? current.getFullYear() : THIS_YEAR);
    return calendar(calendarMonth, calendarYear);
  };

  const renderMonthAndYear = () => {
    const { month, year } = dateState;
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const formattedDate = formatter.format(dateState.current);

    // Resolve the month name from the CALENDAR_MONTHS object map
    const monthname = Object.keys(CALENDAR_MONTHS)[Math.max(0, Math.min(month - 1, 11))];
    return (
      <Styled.CalendarHeader>
        <Styled.ArrowLeft onClick={handlePrevious} title="Previous Month" />
        <Styled.CalendarMonth>
          {monthname} {year}
        </Styled.CalendarMonth>
        <Styled.ArrowRight onClick={handleNext} title="Next Month" />
      </Styled.CalendarHeader>
    );
  };

  const renderDayLabel = (day, index) => {
    // Resolve the day of the week label
    const daylabel = WEEK_DAYS[day].toUpperCase();
    return (
      <Styled.CalendarDay key={daylabel} index={index}>
        {daylabel}
      </Styled.CalendarDay>
    );
  };

  const renderCalendarDate = (date, index) => {
    const { current, month, year } = dateState;
    const _date = new Date(date.join("-"));

    // Check if calendar date is same day as today
    const isToday = isSameDay(_date, today);
    // Check if calendar date is same day as currently selected date
    const isCurrent = current && isSameDay(_date, current);
    // Check if calendar date is in the same month as the state month and year
    const inMonth =
      month && year && isSameMonth(_date, new Date([year, month, 1].join("-")));
    // The click handler
    const onClick = gotoDate(_date);
    const props = { index, inMonth, onClick, title: _date.toDateString() };

    const DateComponent = isCurrent
      ? Styled.HighlightedCalendarDate
      : isToday
      ? Styled.TodayCalendarDate
      : Styled.CalendarDate;

    return (
      <DateComponent key={getDateISO(_date)} {...props}>
        {_date.getDate()}
      </DateComponent>
    );
  };

  const gotoDate = (date) => (evt) => {
    evt && evt.preventDefault();
    const { current } = dateState;
    if (!(current && isSameDay(date, current))) {
      addDateToState(date);
      onDateChanged(date);
    }
  };

  const gotoPreviousMonth = () => {
    const { month, year } = dateState;
    const previousMonth = getPreviousMonth(month, year);
    setDateState({
      month: previousMonth.month,
      year: previousMonth.year,
      current: dateState.current,
    });
  };

  const gotoNextMonth = () => {
    const { month, year } = dateState;
    const nextMonth = getNextMonth(month, year);
    setDateState({
      month: nextMonth.month,
      year: nextMonth.year,
      current: dateState.current,
    });
  };

  const handlePrevious = (evt) => {
    gotoPreviousMonth();
  };

  const handleNext = (evt) => {
    gotoNextMonth();
  };

  return (
    <Styled.CalendarContainer>
      {renderMonthAndYear()}

      <Styled.CalendarGrid>
        <Fragment>
          {Object.keys(WEEK_DAYS).map(renderDayLabel)}
        </Fragment>
        <Fragment>
          {getCalendarDates().map(renderCalendarDate)}
        </Fragment>
      </Styled.CalendarGrid>
    </Styled.CalendarContainer>
  );
}

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func,
};




const gotoDate = (date) => (evt) => {
    evt && evt.preventDefault();
    const { current } = dateState;
    if (!(current && isSameDay(date, current))) {
      addDateToState(date);
      onDateChanged(date);
    }
  };
  const gotoPreviousMonth = () => {
    const { month, year } = dateState;
    const previousMonth = getPreviousMonth(month, year);
    setDateState({
      month: previousMonth.month,
      year: previousMonth.year,
      current: dateState.current,
    });
  };
  const gotoNextMonth = () => {
    const { month, year } = dateState;
    const nextMonth = getNextMonth(month, year);
    setDateState({
      month: nextMonth.month,
      year: nextMonth.year,
      current: dateState.current,
    });
  };
  const handlePrevious = (evt) => {
    gotoPreviousMonth();
  };
  const handleNext = (evt) => {
    gotoNextMonth();
  };

