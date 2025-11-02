import { createContext, useState } from "react";

export const UnitsContext = createContext();

export function UnitsProvider({ children }) {
  const [unitSystem, setUnitSystem] = useState("metric");
  const [selectedUnits, setSelectedUnits] = useState({
    temperature: "Celsius (°C)",
    wind: "km/h",
    precipitation: "Millimeters (mm)",
  });

  return (
    <UnitsContext.Provider value={{ 
      unitSystem, 
      setUnitSystem,
      selectedUnits,
      setSelectedUnits 
    }}>
      {children}
    </UnitsContext.Provider>
  );
}