export type Transmission = "auto" | "manual";

export interface FleetCar {
  id: string;
  name: string;
  type: string;
  image: string;
  price_per_day: string;
  rent_to_own_price: string;
  doors: number;
  passengers: number;
  bags: number;
  transmission: Transmission;
  status: "available" | "booked" | "maintenance" | string;
  features?: string[];
  host_id?: string;
}

export const SEED_FLEET: FleetCar[] = [
  {
    id: "87f4818c-233c-46af-b15d-6d9899c9c321",
    type: "sedan",
    name: "Toyota Yaris 2017",
    image: "/images/perfect-fleet-img-4.png",
    price_per_day: "220",
    rent_to_own_price: "650",
    passengers: 4,
    doors: 4,
    bags: 2,
    transmission: "auto",
    status: "available",
    features: ["Fuel Efficient", "Rear Camera", "Bluetooth Connection", "Climate Control"],
  },
  {
    id: "0f03beb1-ffcb-4388-baac-7a81bc528779",
    type: "sedan",
    name: "Mercedes E-Class 2020",
    image: "/images/luxury-collection-img-3.jpg",
    price_per_day: "260",
    rent_to_own_price: "780",
    passengers: 5,
    doors: 4,
    bags: 3,
    transmission: "auto",
    status: "available",
    features: ["Leather Seats", "GPS Navigation", "Bluetooth Connection", "Heated Seats"],
  },
  {
    id: "db2897bf-7d3a-4ffe-832d-81e2e9f45ecf",
    type: "luxury",
    name: "BMW M2 Car 2017",
    image: "/images/perfect-fleet-img-1.png",
    price_per_day: "280",
    rent_to_own_price: "850",
    passengers: 4,
    doors: 4,
    bags: 3,
    transmission: "auto",
    status: "available",
    features: ["Sports Mode", "Leather Seats", "GPS Navigation", "Rear Camera"],
  },
  {
    id: "740b8dbe-a6ad-4a4b-b996-b86f76ee70e6",
    type: "convertible",
    name: "BMW Z4 Roadster 2021",
    image: "/images/luxury-collection-img-2.jpg",
    price_per_day: "290",
    rent_to_own_price: "890",
    passengers: 2,
    doors: 2,
    bags: 2,
    transmission: "auto",
    status: "available",
    features: ["Convertible Roof", "Sports Mode", "Leather Seats", "Climate Control"],
  },
  {
    id: "6ef37e12-2bff-4bee-9189-5cdbf18311e4",
    type: "luxury",
    name: "Audi RS7 Car 2016",
    image: "/images/perfect-fleet-img-2.png",
    price_per_day: "320",
    rent_to_own_price: "950",
    passengers: 4,
    doors: 4,
    bags: 4,
    transmission: "auto",
    status: "available",
    features: ["Sports Mode", "Leather Seats", "GPS Navigation", "Premium Sound"],
  },
  {
    id: "70c26855-2fd5-44e8-8325-252a5642ec4a",
    type: "sport",
    name: "Porsche 911 Carrera",
    image: "/images/luxury-collection-img-1.jpg",
    price_per_day: "390",
    rent_to_own_price: "1200",
    passengers: 2,
    doors: 2,
    bags: 2,
    transmission: "manual",
    status: "available",
    features: ["Manual Gearbox", "Sports Mode", "Leather Seats", "Track Package"],
  },
  {
    id: "eff51c2e-e8e7-4707-a81e-2e8c2525e41b",
    type: "sport",
    name: "Ferrari F12 Car 2022",
    image: "/images/perfect-fleet-img-3.png",
    price_per_day: "450",
    rent_to_own_price: "1400",
    passengers: 2,
    doors: 2,
    bags: 2,
    transmission: "auto",
    status: "available",
    features: ["Sports Mode", "Carbon Interior", "Premium Sound", "Launch Control"],
  },
];

export function normalizeFleetCar(car: Partial<FleetCar>): FleetCar {
  return {
    id: String(car.id ?? ""),
    name: String(car.name ?? "Phillip Cars Fleet Vehicle"),
    type: String(car.type ?? "luxury").toLowerCase(),
    image: String(car.image ?? "/images/perfect-fleet-img-1.png"),
    price_per_day: String(car.price_per_day ?? "0"),
    rent_to_own_price: String(car.rent_to_own_price ?? "0"),
    doors: Number(car.doors ?? 4),
    passengers: Number(car.passengers ?? 4),
    bags: Number(car.bags ?? 2),
    transmission: car.transmission === "manual" ? "manual" : "auto",
    status: String(car.status ?? "available"),
    features: Array.isArray(car.features) ? car.features : [],
    host_id: car.host_id,
  };
}

export function findSeedCarById(id: string): FleetCar | undefined {
  return SEED_FLEET.find((car) => car.id === id);
}

export function mergeFleetCars(dbCars: Partial<FleetCar>[]): FleetCar[] {
  const byId = new Map<string, FleetCar>();

  SEED_FLEET.forEach((car) => {
    byId.set(car.id, car);
  });

  dbCars.forEach((car) => {
    const normalized = normalizeFleetCar(car);
    if (normalized.id) {
      byId.set(normalized.id, { ...byId.get(normalized.id), ...normalized });
    }
  });

  return Array.from(byId.values()).filter((car) => car.status === "available");
}

export function filterFleetCars(cars: FleetCar[], filters?: {
  type?: string;
  transmission?: string;
  maxPrice?: number;
  search?: string;
}) {
  const search = filters?.search?.trim().toLowerCase();

  return cars
    .filter((car) => {
      if (filters?.type && filters.type !== "all" && car.type !== filters.type) return false;
      if (filters?.transmission && filters.transmission !== "all" && car.transmission !== filters.transmission) return false;
      if (filters?.maxPrice && Number(car.price_per_day) > filters.maxPrice) return false;
      if (search && !`${car.name} ${car.type}`.toLowerCase().includes(search)) return false;
      return true;
    })
    .sort((a, b) => Number(a.price_per_day) - Number(b.price_per_day));
}
