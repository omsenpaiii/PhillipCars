"use server";

import { query } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getCarByIdAction } from "@/app/actions/cars";

export interface BookingPayload {
  carId: string;
  pickupLocation: string;
  pickupDate: string;
  returnLocation: string;
  returnDate: string;
  type: "rent" | "rent_to_own";
}

interface BookingRow {
  id: string;
}

export interface UserBooking {
  id: string;
  user_id: string;
  car_id: string;
  pickup_location: string;
  pickup_date: string | Date;
  return_location: string;
  return_date: string | Date;
  type: "rent" | "rent_to_own";
  status: string;
  total_price: string;
  car_name: string;
  car_image: string;
  car_type: string;
}

export async function createBookingAction(payload: BookingPayload) {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "You must be logged in to book a car." };
  }

  const { carId, pickupLocation, pickupDate, returnLocation, returnDate, type } = payload;

  if (!carId || !pickupLocation || !pickupDate || !returnLocation || !returnDate || !type) {
    return { success: false, error: "All booking details are required." };
  }

  try {
    // Fetch car pricing
    const carRes = await getCarByIdAction(carId);
    if (!carRes.success || !carRes.car) {
      return { success: false, error: "Car not found." };
    }
    const car = carRes.car;

    const pick = new Date(pickupDate);
    const ret = new Date(returnDate);

    if (ret <= pick) {
      return { success: false, error: "Return date must be after pickup date." };
    }

    const diffTime = Math.abs(ret.getTime() - pick.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    let totalPrice = 0;
    if (type === "rent") {
      totalPrice = diffDays * parseFloat(car.price_per_day);
    } else {
      // Rent to own has a monthly base rate, let's charge proportionally based on a 30-day month
      const dailyRate = parseFloat(car.rent_to_own_price) / 30;
      totalPrice = diffDays * dailyRate;
    }

    const bookingId = crypto.randomUUID();

    await query(
      `INSERT INTO public.bookings (id, user_id, car_id, pickup_location, pickup_date, return_location, return_date, type, status, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        bookingId,
        user.id,
        carId,
        pickupLocation,
        pick.toISOString(),
        returnLocation,
        ret.toISOString(),
        type,
        "confirmed", // Automatically confirm for instant booking experience
        totalPrice.toFixed(2),
      ]
    );

    return { success: true, bookingId };
  } catch (err: unknown) {
    console.error("Booking error:", err);
    return { success: false, error: err instanceof Error ? err.message : "An error occurred during booking." };
  }
}

export async function getUserBookingsAction() {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Not logged in." };
  }

  try {
    const res = await query<UserBooking>(
      `SELECT b.*, c.name as car_name, c.image as car_image, c.type as car_type
       FROM public.bookings b
       JOIN public.cars c ON b.car_id = c.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [user.id]
    );
    return { success: true, bookings: res.rows };
  } catch (err: unknown) {
    console.error("Fetch user bookings error:", err);
    return { success: false, error: "Failed to fetch bookings." };
  }
}

export async function cancelBookingAction(bookingId: string) {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Not logged in." };
  }

  try {
    const res = await query<BookingRow>(
      "UPDATE public.bookings SET status = 'cancelled' WHERE id = $1 AND user_id = $2 RETURNING id",
      [bookingId, user.id]
    );
    if (res.rows.length === 0) {
      return { success: false, error: "Booking not found or not owned by you." };
    }
    return { success: true };
  } catch (err: unknown) {
    console.error("Cancel booking error:", err);
    return { success: false, error: "Failed to cancel booking." };
  }
}
