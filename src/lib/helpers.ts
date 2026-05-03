import { connectDB } from "@/lib/db";
import { Settings } from "@/lib/models/Settings";
import { Category } from "@/lib/models/Category";
import { MenuItem } from "@/lib/models/MenuItem";

export async function getOrCreateSettings() {
  await connectDB();
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

export async function isDiscountActive(chamber?: string): Promise<{ active: boolean; percent: number; type: string }> {
  const settings = await getOrCreateSettings();
  
  // Chamber discount takes priority if provided
  if (chamber && chamber.trim() && settings.chamberDiscountEnabled) {
    return { active: true, percent: settings.chamberDiscountPercent, type: "Chamber" };
  }
  
  if (settings.globalDiscountEnabled) {
    return { active: true, percent: settings.globalDiscountPercent, type: "Global" };
  }

  return { active: false, percent: 0, type: "None" };
}

export async function seedDefaultData() {
  await connectDB();

  const catCount = await Category.countDocuments();
  if (catCount === 0) {
    await Category.insertMany([
      { name: "Today's Specials", slug: "specials", icon: "⭐", order: 0 },
      { name: "Starters", slug: "starters", icon: "🥗", order: 1 },
      { name: "Wraps & Rolls", slug: "wraps", icon: "🌯", order: 2 },
      { name: "Main Course", slug: "mains", icon: "🍛", order: 3 },
      { name: "Beverages", slug: "beverages", icon: "🥤", order: 4 },
      { name: "Combos", slug: "combos", icon: "🎁", order: 5 },
    ]);
  }

  const itemCount = await MenuItem.countDocuments();
  if (itemCount === 0) {
    await MenuItem.insertMany([
      {
        name: "Chicken Tikka Wrap",
        description: "Grilled chicken tikka with mint chutney, onions, and peppers in a soft wrap",
        price: 8.99,
        category: "wraps",
        image: "",
        tags: ["Best Seller"],
        available: true,
        isSpecial: true,
        order: 0,
      },
      {
        name: "Samosa Chaat",
        description: "Crispy samosas topped with yoghurt, tamarind chutney and spices",
        price: 5.49,
        category: "starters",
        image: "",
        tags: ["Vegetarian"],
        available: true,
        isSpecial: false,
        order: 0,
      },
      {
        name: "Lamb Kati Roll",
        description: "Succulent minced lamb with caramelised onions in a paratha wrap",
        price: 9.49,
        category: "wraps",
        image: "",
        tags: ["Best Seller"],
        available: true,
        isSpecial: false,
        order: 1,
      },
      {
        name: "Paneer Tikka Starter",
        description: "Marinated cottage cheese grilled in tandoor with peppers",
        price: 6.99,
        category: "starters",
        image: "",
        tags: ["Vegetarian", "Special"],
        available: true,
        isSpecial: true,
        order: 1,
      },
      {
        name: "Butter Chicken",
        description: "Tender chicken in a rich, creamy tomato-based sauce",
        price: 11.99,
        category: "mains",
        image: "",
        tags: ["Best Seller"],
        available: true,
        isSpecial: false,
        order: 0,
      },
      {
        name: "Dal Makhani",
        description: "Slow-cooked black lentils in butter and cream",
        price: 9.49,
        category: "mains",
        image: "",
        tags: ["Vegetarian"],
        available: true,
        isSpecial: false,
        order: 1,
      },
      {
        name: "Mango Lassi",
        description: "Thick and creamy mango yoghurt drink",
        price: 3.49,
        category: "beverages",
        image: "",
        tags: ["Vegetarian"],
        available: true,
        isSpecial: false,
        order: 0,
      },
      {
        name: "Masala Chai",
        description: "Spiced Indian tea with milk",
        price: 2.49,
        category: "beverages",
        image: "",
        tags: [],
        available: true,
        isSpecial: false,
        order: 1,
      },
      {
        name: "Family Feast Combo",
        description: "2 mains + 4 wraps + 4 beverages — perfect for sharing",
        price: 39.99,
        category: "combos",
        image: "",
        tags: ["Best Seller", "Special"],
        available: true,
        isSpecial: true,
        order: 0,
      },
      {
        name: "Veg Combo",
        description: "Paneer tikka + Dal Makhani + 2 Mango Lassi",
        price: 22.99,
        category: "combos",
        image: "",
        tags: ["Vegetarian"],
        available: true,
        isSpecial: false,
        order: 1,
      },
    ]);
  }
}
