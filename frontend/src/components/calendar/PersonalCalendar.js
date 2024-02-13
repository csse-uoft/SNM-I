import React, {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import {fetchCalendarAppointments} from '../../api/calendarAPI';

function convertDate(date) {
  // Convert date to ISO string
  // Which has the format of "2024-02-22T00:00:00Z"
  return date.toISOString();
}


const PersonalCalendar = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date().toISOString());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date().toISOString());

  const [appointments, setAppointments] = useState([]);

  // Fetch appointments from the API
  const fetchAppointments = async () => {
    const data = await fetchCalendarAppointments({startDate: selectedStartDate, endDate: selectedEndDate});
    setAppointments(data.data);
    console.log(data.data)
  };

  // Fetch appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Update the selected start and end date when a day is clicked
  function UpdateClickedDay(day) {
    day.setHours(0, 0, 0, 0)
    setSelectedStartDate(convertDate(day));
    day.setDate(day.getDate() + 1);
    setSelectedEndDate(convertDate(day));

    fetchAppointments();
  }

  return (
    <div>

      <Calendar onChange={(date) => {}} value={selectedStartDate}
                onClickDay={(date) => UpdateClickedDay(date)}/>

      {selectedStartDate ? (<p>{selectedStartDate}</p>) : (<p>No date selected</p>)}
      {selectedEndDate ? (<p>{selectedEndDate}</p>) : (<p>No date selected</p>)}

      {appointments ? (
        // Check if appointments is defined before mapping
        appointments.map((appointment) => (
          <p>{appointment._uri}</p>
        ))
      ) : (
        // Render a loading message or handle the case when appointments is undefined
        <p>Loading appointments...</p>
      )}

    </div>
  );
};

export default PersonalCalendar;
