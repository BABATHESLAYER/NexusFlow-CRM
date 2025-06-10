"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SunIcon, CloudIcon, CloudRainIcon, CloudSnowIcon, CloudLightningIcon, ThermometerIcon } from "lucide-react";
import { useState, useEffect } from 'react';

// Mock weather data
const weatherConditions = [
  { name: "Sunny", Icon: SunIcon, temp: "28°C" },
  { name: "Cloudy", Icon: CloudIcon, temp: "22°C" },
  { name: "Rainy", Icon: CloudRainIcon, temp: "18°C" },
  { name: "Snowy", Icon: CloudSnowIcon, temp: "0°C" },
  { name: "Stormy", Icon: CloudLightningIcon, temp: "15°C" },
];

export function WeatherWidget() {
  const [currentWeather, setCurrentWeather] = useState(weatherConditions[0]);
  const [location, setLocation] = useState("Current Location");

  useEffect(() => {
    // Simulate fetching weather data
    const randomIndex = Math.floor(Math.random() * weatherConditions.length);
    setCurrentWeather(weatherConditions[randomIndex]);

    // Attempt to get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Basic reverse geocoding (example, replace with a real API for production)
            // This is a placeholder and might not work reliably without an API key
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
            if (response.ok) {
              const data = await response.json();
              setLocation(data.address?.city || data.address?.town || data.address?.village || "Current Location");
            }
          } catch (error) {
            console.error("Error fetching location name:", error);
            setLocation("Current Location");
          }
        },
        () => {
          setLocation("Current Location"); // Geolocation denied or failed
        }
      );
    }
  }, []);

  const { Icon, name, temp } = currentWeather;

  return (
    <Card className="bg-card/70 backdrop-blur-md border rounded-xl shadow-lg dark:bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-body">Weather</CardTitle>
        <ThermometerIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Icon className="h-12 w-12 text-primary" />
          <div>
            <p className="text-2xl font-bold font-headline">{temp}</p>
            <p className="text-xs text-muted-foreground">{name} in {location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
