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
  bannerMessage: string;
}

const SettingsSchema = new Schema<ISettings>(
  {
    globalDiscountEnabled: { type: Boolean, default: false },
    globalDiscountPercent: { type: Number, default: 10, min: 0, max: 100 },
    chamberDiscountEnabled: { type: Boolean, default: false },
    chamberDiscountPercent: { type: Number, default: 20, min: 0, max: 100 },
    restaurantName: { type: String, default: "Southall Kitchen" },
    restaurantPhone: { type: String, default: "+91 98765 43210" },
    restaurantAddress: { type: String, default: "Southall, London" },
    bannerMessage: { type: String, default: "Fresh food, fast service" },
  },
  { timestamps: true }
);

delete models.Settings;
export const Settings = models.Settings || model("Settings", SettingsSchema);
