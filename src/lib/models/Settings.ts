import { Schema, models, model } from "mongoose";

export interface ISettings {
  _id: string;
  globalDiscountEnabled: boolean;
  globalDiscountPercent: number;
  chamberDiscountEnabled: boolean;
  chamberDiscountPercent: number;
  restaurantName: string;
  restaurantPhone: string;
  restaurantAddress: string;
  restaurantEmail: string;
  instagramUrl: string;
  googleMapsUrl: string;
  bannerMessage: string;
}

const SettingsSchema = new Schema<ISettings>(
  {
    globalDiscountEnabled: { type: Boolean, default: false },
    globalDiscountPercent: { type: Number, default: 10, min: 0, max: 100 },
    chamberDiscountEnabled: { type: Boolean, default: false },
    chamberDiscountPercent: { type: Number, default: 20, min: 0, max: 100 },
    restaurantName: { type: String, default: "Southall Kitchens" },
    restaurantPhone: { type: String, default: "+91 98765 43210" },
    restaurantAddress: { type: String, default: "Southall, London" },
    restaurantEmail: { type: String, default: "hello@southallkitchens.com" },
    instagramUrl: { type: String, default: "https://instagram.com/southallkitchens" },
    googleMapsUrl: { type: String, default: "https://maps.google.com" },
    bannerMessage: { type: String, default: "Treat the Buds" },
  },
  { timestamps: true }
);

export const Settings = models.Settings || model("Settings", SettingsSchema);
