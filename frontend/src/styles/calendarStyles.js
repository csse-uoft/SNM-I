import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";

export const Arrow = styled.button`
  appearance: none;
  user-select: none;
  outline: none !important;
  display: inline-block;
  position: relative;
  cursor: pointer;
  padding: 0;
  border: none;
  border-top: 1.6em solid transparent;
  border-bottom: 1.6em solid transparent;
  transition: all 0.25s ease-out;
`;

export const ArrowLeft = styled(Arrow)`
  border-right: 2.4em solid #ccc;
  left: 1.5rem;
  :hover {
    border-right-color: #06c;
  }
`;

export const ArrowRight = styled(Arrow)`
  border-left: 2.4em solid #ccc;
  right: 1.5rem;
  :hover {
    border-left-color: #06c;
  }
`;

export const CalendarContainer = styled.div`
  font-size: 5px;
  border: 2px solid #06c;
  border-radius: 5px;
  overflow: hidden;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template: repeat(7, auto) / repeat(7, auto);
`;

export const CalendarMonth = styled.div`
  font-weight: 500;
  font-size: 5em;
  color: #06c;
  text-align: center;
  padding: 0.5em 0.25em;
  word-spacing: 5px;
  user-select: none;
`;

export const CalendarCell = styled.div`
  text-align: center;
  align-self: center;
  letter-spacing: 0.1rem;
  padding: 0.6em 0.25em;
  user-select: none;
  grid-column: ${(props) => (props.index % 7) + 1} / span 1;
`;

export const CalendarDay = styled(CalendarCell)`
  font-weight: 600;
  font-size: 2.25em;
  color: #06c;
  border-top: 2px solid #06c;
  border-bottom: 2px solid #06c;
  border-right: ${(props) =>
    (props.index % 7) + 1 === 7 ? `none` : `2px solid #06c`};
`;

export const CalendarDate = styled(CalendarCell)`
  font-weight: ${(props) => (props.inMonth ? 500 : 300)};
  font-size: 4em;
  cursor: pointer;
  border-bottom: ${(props) =>
    (props.index + 1) / 7 <= 5 ? `1px solid #ddd` : `none`};
  border-right: ${(props) =>
    (props.index % 7) + 1 === 7 ? `none` : `1px solid #ddd`};
  color: ${(props) => (props.inMonth ? `#333` : `#ddd`)};
  grid-row: ${(props) => Math.floor(props.index / 7) + 2} / span 1;
  transition: all 0.4s ease-out;
  :hover {
    color: #06c;
    background: rgba(0, 102, 204, 0.075);
  }
`;

export const HighlightedCalendarDate = styled(CalendarDate)`
  color: #fff !important;
  background: #06c !important;
  position: relative;
  ::before {
    content: "";
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    border: 2px solid #06c;
  }
`;

export const TodayCalendarDate = styled(HighlightedCalendarDate)`
  color: #06c !important;
  background: transparent !important;
  ::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    border-bottom: 0.75em solid #06c;
    border-left: 0.75em solid transparent;
    border-top: 0.75em solid transparent;
  }
  :hover {
    color: #06c !important;
    background: rgba(0, 102, 204, 0.075) !important;
  }
`;

export const BlockedCalendarDate = styled(CalendarDate)`
  color: black !important;
  background: gray !important;
  position: relative;
  :hover {
    color: black !important;
    background: gray !important;
    border-color:gray;
        cursor:default;
  }
`;

import {
    FormGroup,
    Label,
    Input,
    Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
  } from "reactstrap";
  
  export const DatePickerContainer = styled.div`
    position: relative;
  `;
  
  export const DatePickerFormGroup = styled(FormGroup)`
    display: flex;
    justify-content: space-between;
    position: relative;
    width: 100%;
    border: 2px solid #06c;
    border-radius: 5px;
    overflow: hidden;
  `;
  
  export const DatePickerLabel = styled(Label)`
    margin: 0;
    padding: 0 2rem;
    font-weight: 600;
    font-size: 0.7rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #06c;
    border-right: 2px solid #06c;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 102, 204, 0.05);
  `;
  
  export const DatePickerInput = styled(Input)`
    font-weight: 500;
    font-size: 1rem;
    color: #333;
    box-shadow: none;
    border: none;
    text-align: center;
    letter-spacing: 1px;
    background: transparent !important;
    display: flex;
    align-items: center;
    ::placeholder {
      color: #999;
      font-size: 0.9rem;
    }
    width:100%;
    height:100%;
  `;
  
  export const DatePickerDropdown = styled(Dropdown)`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  `;
  
  export const DatePickerDropdownToggle = styled(DropdownToggle)`
    position: relative;
    width: 100%;
    height: 100%;
    background: transparent;
    opacity: 0;
    filter: alpha(opacity=0);
  `;
  
  export const DatePickerDropdownMenu = styled(DropdownMenu)`
    margin-top: 3rem;
    left: 0;
    width: 100%;
    height: 75vh !important;
    border: none;
    padding: 0;
    transform: none !important;
  `;
  
  export const DatePickerButton = styled(Button)`
    position: absolute;
    border: 2px solid #06c;
    margin-top:2%;
    right:50% !important;
    background: transparent;
    font-size: 1.2rem;
    color: #06c;
    :hover {
      border: white solid #06c;
      color: white !important;
      background:  #06c;
    }
  `;