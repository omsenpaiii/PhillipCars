"use client";
import React, { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FleetCard from "@/components/FleetCard";
import BrandedLoader from "@/components/BrandedLoader";
import { getCarsAction } from "../actions/cars";
import type { FleetCar } from "@/lib/fleet-data";
import { MELBOURNE_LOCATIONS } from "@/lib/australia";
import { parseVehicleSearch, serializeVehicleSearch, validateVehicleSearch, type VehicleSearchCriteria } from "@/lib/vehicle-search";

const types = [["all","All vehicles"],["luxury","Luxury"],["sport","Performance"],["convertible","Convertible"],["sedan","Sedan"],["caravan","Caravan Hire"]];
function CarsContent() {
  const params = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const [criteria, setCriteria] = useState<VehicleSearchCriteria>(() => parseVehicleSearch(params));
  const [cars, setCars] = useState<FleetCar[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { const next = parseVehicleSearch(params); getCarsAction({ type: next.type, transmission: next.transmission, maxPrice: next.maxPrice, search: next.search, pickupDate: next.pickupDate, returnDate: next.returnDate, sort: next.sort }).then((result) => { setCars(result.cars || []); setLoading(false); }); }, [params]);
  function update(patch: Partial<VehicleSearchCriteria>, immediate = true) { const next = { ...criteria, ...patch }; setCriteria(next); if (immediate) router.replace(`${pathname}?${serializeVehicleSearch(next)}`, { scroll: false }); }
  function submit(event: React.FormEvent) { event.preventDefault(); const validation = validateVehicleSearch(criteria); if (validation) return setError(validation); setError(""); router.push(`${pathname}?${serializeVehicleSearch(criteria)}`); }
  const context = serializeVehicleSearch(criteria).toString();
  return <main className="container fleet-search-page">
    <form className="journey-search-bar" onSubmit={submit}>
      <label>Pickup<select value={criteria.pickup} onChange={(e)=>update({pickup:e.target.value},false)}>{MELBOURNE_LOCATIONS.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}</select></label>
      <label>Return<select value={criteria.dropoff} onChange={(e)=>update({dropoff:e.target.value},false)}>{MELBOURNE_LOCATIONS.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}</select></label>
      <label>Pickup date<input type="date" value={criteria.pickupDate} onChange={(e)=>update({pickupDate:e.target.value},false)} /></label>
      <label>Return date<input type="date" value={criteria.returnDate} onChange={(e)=>update({returnDate:e.target.value},false)} /></label>
      <button className="btn-default">Update search</button>{error && <p role="alert">{error}</p>}
    </form>
    <div className="fleet-results-layout"><aside className="fleet-filter-panel">
      <h3>Refine your journey</h3><label className="filter-label">Search<input className="form-control" value={criteria.search} onChange={(e)=>update({search:e.target.value},false)} onBlur={()=>update({})} placeholder="Make or model" /></label>
      <div className="fleet-filter-group"><h4>Vehicle style</h4><div className="vehicle-type-grid">{types.map(([value,label])=><button key={value} type="button" aria-pressed={criteria.type===value} className={criteria.type===value?"is-selected":""} onClick={()=>update({type:value})}>{label}</button>)}</div></div>
      <div className="fleet-filter-group"><h4>Transmission</h4><div className="transmission-toggle">{[["all","Any"],["auto","Automatic"],["manual","Manual"]].map(([value,label])=><button key={value} type="button" className={criteria.transmission===value?"is-selected":""} onClick={()=>update({transmission:value})}>{label}</button>)}</div></div>
      <label className="filter-label">Maximum daily rate <strong>${criteria.maxPrice}</strong><input type="range" min="100" max="500" step="10" value={criteria.maxPrice} onChange={(e)=>update({maxPrice:Number(e.target.value)})} /></label>
    </aside><section className="fleet-results"><div className="results-toolbar"><div><span>Available for your dates</span><h2>{cars.length} {cars.length===1?"vehicle":"vehicles"}</h2></div><select aria-label="Sort results" value={criteria.sort} onChange={(e)=>update({sort:e.target.value as VehicleSearchCriteria["sort"]})}><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name-asc">Name: A–Z</option></select></div>
      {loading?<BrandedLoader label="Checking availability…" fullScreen={false}/>:cars.length?<div className="row">{cars.map(car=><div key={car.id} className="col-md-6 mb-4"><FleetCard car={car} showRentToOwn searchParams={context}/></div>)}</div>:<div className="empty-results"><h3>No vehicles match this journey</h3><p>Try different dates or broaden your filters.</p><button className="btn-default" onClick={()=>update({type:"all",transmission:"all",maxPrice:500,search:""})}>Clear filters</button></div>}
    </section></div>
  </main>;
}
export default function CarsPage(){return <><Header/><div className="page-header bg-section fleet-page-header"><div className="container"><h1>Find your Zoomli</h1><p>Compare quality vehicles available for your Melbourne journey.</p></div></div><Suspense fallback={<BrandedLoader label="Preparing your search…"/>}><CarsContent/></Suspense><Footer/></>}
