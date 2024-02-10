import React, {useState} from 'react';
import Calendar from 'react-calendar';


const PersonalCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


  return (
      <div>

        <Calendar onChange={handleDateChange} value={selectedDate} onClickDay={(value) => alert(value)}/>

      </div>
  );
};

export default PersonalCalendar;