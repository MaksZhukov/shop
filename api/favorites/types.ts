import { Tire } from "api/tires/types";
import { Wheel } from "api/wheels/types";
import { SparePart } from "api/spareParts/types";

export interface Favorite {
  id: number;
  spareParts: SparePart[];
  wheels: Wheel[];
  tires: Tire[];
}
