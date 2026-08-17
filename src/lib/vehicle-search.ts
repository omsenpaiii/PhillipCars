import { DEFAULT_MELBOURNE_LOCATION, MELBOURNE_LOCATIONS } from "@/lib/australia";

export type VehicleSort = "price-asc" | "price-desc" | "name-asc";

export interface VehicleSearchCriteria {
  pickup: string;
  dropoff: string;
  pickupDate: string;
  returnDate: string;
  type: string;
  search: string;
  transmission: string;
  maxPrice: number;
  sort: VehicleSort;
}

const LOCATION_VALUES = new Set<string>(MELBOURNE_LOCATIONS.map((location) => location.value));
const SORT_VALUES = new Set<VehicleSort>(["price-asc", "price-desc", "name-asc"]);

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getDefaultSearchDates(now = new Date()): { pickupDate: string; returnDate: string } {
  const pickup = new Date(now);
  pickup.setHours(12, 0, 0, 0);
  pickup.setDate(pickup.getDate() + 1);
  const returned = new Date(pickup);
  returned.setDate(returned.getDate() + 3);
  return { pickupDate: formatDate(pickup), returnDate: formatDate(returned) };
}

export function getDefaultVehicleSearch(now = new Date()): VehicleSearchCriteria {
  return {
    pickup: DEFAULT_MELBOURNE_LOCATION,
    dropoff: DEFAULT_MELBOURNE_LOCATION,
    ...getDefaultSearchDates(now),
    type: "all",
    search: "",
    transmission: "all",
    maxPrice: 500,
    sort: "price-asc",
  };
}

function readParam(source: URLSearchParams, key: string): string {
  return source.get(key)?.trim() || "";
}

export function parseVehicleSearch(source: URLSearchParams, now = new Date()): VehicleSearchCriteria {
  const defaults = getDefaultVehicleSearch(now);
  const pickup = readParam(source, "pickup");
  const dropoff = readParam(source, "dropoff");
  const maxPrice = Number(readParam(source, "maxPrice"));
  const sort = readParam(source, "sort") as VehicleSort;

  return {
    pickup: LOCATION_VALUES.has(pickup) ? pickup : defaults.pickup,
    dropoff: LOCATION_VALUES.has(dropoff) ? dropoff : LOCATION_VALUES.has(pickup) ? pickup : defaults.dropoff,
    pickupDate: readParam(source, "from") || defaults.pickupDate,
    returnDate: readParam(source, "until") || defaults.returnDate,
    type: readParam(source, "type") || defaults.type,
    search: readParam(source, "q"),
    transmission: readParam(source, "transmission") || defaults.transmission,
    maxPrice: Number.isFinite(maxPrice) && maxPrice >= 100 && maxPrice <= 500 ? maxPrice : defaults.maxPrice,
    sort: SORT_VALUES.has(sort) ? sort : defaults.sort,
  };
}

export function serializeVehicleSearch(criteria: VehicleSearchCriteria): URLSearchParams {
  const params = new URLSearchParams();
  params.set("pickup", criteria.pickup);
  params.set("dropoff", criteria.dropoff);
  params.set("from", criteria.pickupDate);
  params.set("until", criteria.returnDate);
  if (criteria.type !== "all") params.set("type", criteria.type);
  if (criteria.search) params.set("q", criteria.search);
  if (criteria.transmission !== "all") params.set("transmission", criteria.transmission);
  if (criteria.maxPrice !== 500) params.set("maxPrice", String(criteria.maxPrice));
  if (criteria.sort !== "price-asc") params.set("sort", criteria.sort);
  return params;
}

export function validateVehicleSearch(criteria: VehicleSearchCriteria, now = new Date()): string | null {
  const today = formatDate(now);
  if (!LOCATION_VALUES.has(criteria.pickup) || !LOCATION_VALUES.has(criteria.dropoff)) return "Choose a valid Melbourne service location.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(criteria.pickupDate) || !/^\d{4}-\d{2}-\d{2}$/.test(criteria.returnDate)) return "Choose valid pickup and return dates.";
  if (criteria.pickupDate < today) return "Pickup date cannot be in the past.";
  if (criteria.returnDate <= criteria.pickupDate) return "Return date must be after pickup date.";
  return null;
}

export function locationLabel(value: string): string {
  return MELBOURNE_LOCATIONS.find((location) => location.value === value)?.label || value;
}
