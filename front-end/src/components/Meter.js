import './Meter.css';

const Meter = (props) => {
  let barPercentage = '0%';
  if (props.max > 0)
    barPercentage = Math.round((props.monthly / props.max) * 100) + '%';

  return (
    <div className='meter'>
      <label>{props.month.slice(0, 3) + ' '}</label>
      <div className='bar'>
        <div
          className='percentage-responsive'
          style={{ height: barPercentage }}
        ></div>
        <div className='percentage' style={{ width: barPercentage }}></div>
      </div>
    </div>
  );
};

export default Meter;
