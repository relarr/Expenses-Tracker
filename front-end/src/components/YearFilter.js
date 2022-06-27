import './YearFilter.css';
const years = ['2020', '2021', '2022'];

const YearFilter = (props) => {
  return (
    <select
      className='year-filter'
      value={props.currYear}
      onChange={(event) => props.getYear(event.target.value)}
    >
      {years.map((year) => (
        <option key={year}>{year}</option>
      ))}
    </select>
  );
};

export default YearFilter;
