"use server";

import { query } from "@/lib/db";
import {
  filterFleetCars,
  findSeedCarById,
  mergeFleetCars,
  normalizeFleetCar,
  type FleetCar,
} from "@/lib/fleet-data";

export interface CarFilters {
  type?: string;
  transmission?: string;
  maxPrice?: number;
  search?: string;
}

export async function getCarsAction(filters?: CarFilters) {
  try {
    const res = await query<FleetCar>("SELECT * FROM public.cars WHERE status = 'available' ORDER BY price_per_day ASC");
    return { success: true, cars: filterFleetCars(mergeFleetCars(res.rows), filters) };
  } catch (err: unknown) {
    console.error("Error fetching cars:", err);
    return { success: true, cars: filterFleetCars(mergeFleetCars([]), filters) };
  }
}

export async function getCarByIdAction(id: string) {
  try {
    const res = await query<FleetCar>("SELECT * FROM public.cars WHERE id = $1", [id]);
    if (res.rows.length > 0) {
      return { success: true, car: normalizeFleetCar(res.rows[0]) };
    }

    const seedCar = findSeedCarById(id);
    if (seedCar) {
      return { success: true, car: seedCar };
    }

    return { success: false, error: "Car not found." };
  } catch (err: unknown) {
    console.error("Error fetching car by ID:", err);
    const seedCar = findSeedCarById(id);
    if (seedCar) {
      return { success: true, car: seedCar };
    }
    return { success: false, error: "Failed to fetch car details." };
  }
}

import { getSessionUser } from "@/lib/auth";

export async function listCarAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "You must be logged in to list a car." };
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const image = formData.get("image") as string;
  const pricePerDay = parseFloat(formData.get("price_per_day") as string);
  const rentToOwnPrice = parseFloat(formData.get("rent_to_own_price") as string);
  const doors = parseInt(formData.get("doors") as string) || 4;
  const passengers = parseInt(formData.get("passengers") as string) || 4;
  const bags = parseInt(formData.get("bags") as string) || 2;
  const transmission = (formData.get("transmission") as string) || "auto";
  const featuresString = formData.get("features") as string;
  const features = featuresString ? featuresString.split(",").map(f => f.trim()).filter(Boolean) : [];

  if (!name || !type || !image || isNaN(pricePerDay) || isNaN(rentToOwnPrice)) {
    return { success: false, error: "Please fill in all required fields with valid values." };
  }

  try {
    await query(
      `INSERT INTO public.cars (name, type, image, price_per_day, rent_to_own_price, doors, passengers, bags, transmission, features, host_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        name,
        type,
        image,
        pricePerDay,
        rentToOwnPrice,
        doors,
        passengers,
        bags,
        transmission,
        features,
        user.id
      ]
    );

    return { success: true };
  } catch (err: unknown) {
    console.error("Error listing car:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to submit car listing." };
  }
}
