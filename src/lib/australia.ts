export const MELBOURNE_LOCATIONS = [
  { value: "melbourne_cbd", label: "Melbourne CBD" },
  { value: "melbourne_airport", label: "Melbourne Airport (Tullamarine)" },
  { value: "avalon_airport", label: "Avalon Airport" },
  { value: "southbank", label: "Southbank" },
  { value: "st_kilda", label: "St Kilda" },
  { value: "richmond", label: "Richmond" },
  { value: "dandenong", label: "Dandenong" },
  { value: "geelong", label: "Geelong" },
] as const;

export const DEFAULT_MELBOURNE_LOCATION = MELBOURNE_LOCATIONS[0].value;
