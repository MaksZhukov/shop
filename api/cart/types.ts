import { SparePart } from "api/spareParts/types";
import { Tire } from "api/tires/types";
import { Wheel } from "api/wheels/types";

export interface ShoppingCartItem {
  id: number;
  spareParts: SparePart[];
  wheels: Wheel[];
  tires: Tire[];
}
