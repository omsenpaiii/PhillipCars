import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCarByIdAction } from "@/app/actions/cars";
import { getCurrentUserAction } from "@/app/actions/auth";
import CarDetailClient from "@/components/CarDetailClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  // Fetch data on the server
  const carRes = await getCarByIdAction(id);
  if (!carRes.success || !carRes.car) {
    notFound();
  }

  const user = await getCurrentUserAction();

  return (
    <>
      <Header />
      <main style={{ marginTop: "120px" }}>
        <CarDetailClient car={carRes.car} user={user} />
      </main>
      <Footer />
    </>
  );
}
