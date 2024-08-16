import { Elemental } from '@prisma/client';

export type HopType = {
  [key in Elemental]: string[];
};

export type CurrentHopType = {
  [key in Elemental]: string;
};
