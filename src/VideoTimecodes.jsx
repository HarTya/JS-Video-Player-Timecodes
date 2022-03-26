import React, {useState, useEffect} from "react";
import "./Timecodes.scss";

const VideoTimecodes = ({ timecodeRewindConfirmation }) => {

  const [timecodeId, setTimecodeId] = useState(0);

  const [timecodeTimeInputValue, setTimecodeTimeInputValue] = useState("");
  const [timecodeTimeInputValueError, setTimecodeTimeInputValueError] = useState("");
  const [timecodeTimeInputValueValid, setTimecodeTimeInputValueValid] = useState(false);

  const [timecodeTitleInputValue, setTimecodeTitleInputValue] = useState("");

  const [timecodes, setTimecodes] = useState([]);

  const createTimecode = e => {
    e.preventDefault();

    const timecodeRegex = /(^[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]$)/;

    if (timecodeTimeInputValue.trim().length === 0) {
      setTimecodeTimeInputValueError("This field is required");
    } else if (!timecodeRegex.test(String(timecodeTimeInputValue).toLowerCase())) {
      setTimecodeTimeInputValueError('Incorrect timecode');
    } else if(timecodeRegex.test(String(timecodeTimeInputValue).toLowerCase())) {
      setTimecodeTimeInputValueError("");
      setTimecodeTimeInputValueValid(true);
    }
  };

  useEffect(() => {
    if(timecodeTimeInputValueValid) {
      const newTimecode = {
        id: timecodeId,
        time: timecodeTimeInputValue,
        title: timecodeTitleInputValue
      };

      setTimecodes([...timecodes, newTimecode]);

      setTimecodeId(timecodeId + 1);
      setTimecodeTimeInputValue("");
      setTimecodeTitleInputValue("");

      setTimecodeTimeInputValueValid(false);
    }
  }, [timecodeId, timecodeTimeInputValue, timecodeTimeInputValueValid, timecodeTitleInputValue, timecodes])

  const deleteTimecode = (timecode) => {
    setTimecodes(timecodes.filter(t => t.id !== timecode.id));
  };

  return (
    <section className="videoTimecodesSection">
      <div className="videoTimecodesSection__Form">
        <div className="videoTimecodesSection__Form-InputField">
          {timecodeTimeInputValueError && <div className="videoTimecodesSection__Form-InputField-error">{timecodeTimeInputValueError}</div>}
          <input
            className="videoTimecodesSection__Form-InputField-input"
            value={timecodeTimeInputValue}
            onChange={e => setTimecodeTimeInputValue(e.target.value)}
            placeholder="Time(s)"
          />
          {timecodeTimeInputValue.length
            ? <span className="videoTimecodesSection__Form-InputField-deleteButton" onClick={() => setTimecodeTimeInputValue("")} />
            : <></>
          }
        </div>
        <div className="videoTimecodesSection__Form-InputField">
          <input
            className="videoTimecodesSection__Form-InputField-input"
            value={timecodeTitleInputValue}
            onChange={e => setTimecodeTitleInputValue(e.target.value)}
            placeholder="Title"
            type="text"
          />
          {timecodeTitleInputValue.length
            ? <span className="videoTimecodesSection__Form-InputField-deleteButton" onClick={() => setTimecodeTitleInputValue("")} /> 
            : <></>
          }
        </div>
        <div onClick={createTimecode} className="videoTimecodesSection__Form-createButton">
          <span><p className="videoTimecodesSection__Form-createButton-text">Add timecode</p></span>
        </div>
      </div>

      <div>
        {timecodes.length
          ? <div className="videoTimecodesSection__timecodes">
              {timecodes.map((timecode, index) => 
                <div className="videoTimecodesSection__timecodes-item" key={++index}>
                  <div onClick={() => timecodeRewindConfirmation(timecode.time)} className="videoTimecodesSection__timecodes-item-content">
                    <h2 className="videoTimecodesSection__timecodes-item-content-title">{timecode.title}</h2>
                    <p className="videoTimecodesSection__timecodes-item-content-time">{timecode.time}s</p>
                  </div>
                  <span className="videoTimecodesSection__timecodes-item-deleteButton" onClick={() => deleteTimecode(timecode)} />
                </div>
              )}
            </div>
          : <h3 className="videoTimecodesSection__timecodes-ExistMessage">Timecodes doesn`t exist</h3>
        }
      </div>
    </section>
  );
};

export default VideoTimecodes;
