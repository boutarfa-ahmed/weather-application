import { useState, useEffect, useRef, useContext } from "react";
import { UnitsContext } from "../context/UnitsContext";
import "./header.css";
import applogo from "../assets/images/logo.svg";
import icon_units from "../assets/images/icon-units.svg";
import icon_dropdown from "../assets/images/icon-dropdown.svg";

function Header() {
  const [open, setOpen] = useState(false);
  const { unitSystem, setUnitSystem, selectedUnits, setSelectedUnits } = useContext(UnitsContext);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    {
      title: "Temperature",
      type: "temperature",
      metric: "Celsius (°C)",
      imperial: "Fahrenheit (°F)",
    },
    {
      title: "Wind Speed",
      type: "wind",
      metric: "km/h",
      imperial: "mph",
    },
    {
      title: "Precipitation",
      type: "precipitation",
      metric: "Millimeters (mm)",
      imperial: "Inches (in)",
    },
  ];

  // Toggle full system (global)
  const toggleSystem = () => {
    setUnitSystem((prev) => {
      const newSystem = prev === "metric" ? "imperial" : "metric";
      const updatedUnits = {};
      options.forEach((opt) => {
        updatedUnits[opt.type] = opt[newSystem];
      });
      setSelectedUnits(updatedUnits);
      return newSystem;
    });
  };

  // Select one unit manually (local only)
  const handleSelect = (type, value) => {
    setSelectedUnits((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <header className="header">
      <div className="header__logo">
        <img src={applogo} alt="Weather Now" />
      </div>

      <div className="header__units" ref={menuRef}>
        <button className="header__btn" onClick={() => setOpen(!open)}>
          <img src={icon_units} alt="Units" width="18" />
          Units
          <img src={icon_dropdown} alt="Dropdown" width="12" />
        </button>

        {open && (
          <div id="header__menu" className="header__menu">
            <h4 onClick={toggleSystem} className="header__toggle">
              Switch to {unitSystem === "metric" ? "Imperial" : "Metric"}
            </h4>

            {options.map((opt, i) => (
              <div className="header__group" key={i}>
                <p className="header__group-title">{opt.title}</p>
                <ul className="header__options">
                  <li
                    className={`option-item ${
                      selectedUnits[opt.type] === opt.metric ? "active" : ""
                    }`}
                    onClick={() => handleSelect(opt.type, opt.metric)}
                  >
                    {opt.metric}
                    {selectedUnits[opt.type] === opt.metric && (
                      <span className="tick">✓</span>
                    )}
                  </li>
                  <li
                    className={`option-item ${
                      selectedUnits[opt.type] === opt.imperial ? "active" : ""
                    }`}
                    onClick={() => handleSelect(opt.type, opt.imperial)}
                  >
                    {opt.imperial}
                    {selectedUnits[opt.type] === opt.imperial && (
                      <span className="tick">✓</span>
                    )}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;