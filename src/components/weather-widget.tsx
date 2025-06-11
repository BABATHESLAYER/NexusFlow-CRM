
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SunIcon, CloudIcon, CloudRainIcon, CloudSnowIcon, CloudLightningIcon } from "lucide-react";
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

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
  const [location, setLocation] = useState("Loading..."); // Changed initial state

  useEffect(() => {
    // Simulate fetching weather data
    const randomIndex = Math.floor(Math.random() * weatherConditions.length);
    setCurrentWeather(weatherConditions[randomIndex]);

    // Attempt to get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
            if (response.ok) {
              const data = await response.json();
              setLocation(data.address?.city || data.address?.town || data.address?.village || "Location");
            } else {
              setLocation("Location");
            }
          } catch (error) {
            console.error("Error fetching location name:", error);
            setLocation("Location");
          }
        },
        () => {
          setLocation("Location"); // Geolocation denied or failed
        }
      );
    } else {
      setLocation("Location"); // Geolocation not supported
    }
  }, []);

  const { Icon, name, temp } = currentWeather;

  return (
    <Card className="w-auto shadow-xl backdrop-blur-md bg-card/80 dark:bg-card/70 border rounded-lg">
      <CardContent className="p-2">
        <div className="flex items-center space-x-2">
          <Icon className="h-6 w-6 text-primary flex-shrink-0" />
          <div className="overflow-hidden">
            <p className="text-base font-bold font-headline truncate">{temp}</p>
            <p className="text-xs text-muted-foreground truncate" title={`${name} in ${location}`}>{name} - {location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
