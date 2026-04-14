export interface Unit {
  id: string;
  orgId: string;
  name: string;
  symbol: string;
  type: string;
  baseUnit: string | null;
  conversionToBase: number;
  isBaseUnit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUnitDto {
  name: string;
  symbol: string;
  type: string;
  baseUnit?: string | null;
  conversionToBase?: number;
  isBaseUnit: boolean;
}

export interface UpdateUnitDto extends Partial<CreateUnitDto> {}
