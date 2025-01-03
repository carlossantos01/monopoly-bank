import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function inputMask (e: string) {
  const value = e.replace(/\D/g, ""); 
  const numericValue = parseFloat(value) / 100; 
  const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
  }).format(numericValue); 

  return formattedValue;
};

export function convertValueToAPI(value: string) {
  const number = value.replace(/\D/g, ""); 
  return parseFloat(number) / 100;
}

export function convertTimestampToDayMonthYear(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("pt-BR");
}