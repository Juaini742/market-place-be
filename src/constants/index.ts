import dotenv from "dotenv";
dotenv.config();

export interface UserAttributes {
  id: string;
  avatar: string;
  username: string;
  store_name: string | null;
}

export interface ColorAndSize {
  id: string;
  name: string;
}

export interface ProductAttributes {
  id: string;
  user_id: UserAttributes;
  product_name: string;
  colors_item: string[] | null;
  sizes_item: string[] | null;
  stock: number;
  category: string;
  sold: number;
  price: string;
  short_description: string;
  long_description: string;
  img: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartAttributes {
  id: string;
  user_id: UserAttributes;
  product_id: ProductAttributes;
  quantity: number;
  color: string;
  size: string;
  createdAt: string;
  updatedAt: string;
}

export interface DataAttributes {
  name: string;
  price: number;
  quantity: number;
}

export const dbUsername = process.env.DB_USERNAME;
export const dbPassword = process.env.DB_PASSWORD;
export const dbName = process.env.DB_NAME;
export const dbHost = process.env.DB_HOST;
export const midtransPublicClient = process.env.MIDTRANS_PUBLIC_CLIENT;
export const midtransPublicSecret = process.env.MIDTRANS_PUBLIC_SECRET;
export const midtransPublicApi = process.env.MIDTRANS_PUBLIC_API;
