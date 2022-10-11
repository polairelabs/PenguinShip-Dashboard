// ** Types
import { ThemeColor } from "src/@core/layouts/types";

export type UserLayoutType = {
  id: string | undefined;
};

export type PackagesType = {
  id: number;
  name: string;
  weight: number;
  value: number;
  length: number;
  width: number;
  height: number;
};
