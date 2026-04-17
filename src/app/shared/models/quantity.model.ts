// ── Measurement types supported by the app ──────────────
export type MeasurementType = 'LENGTH' | 'WEIGHT' | 'VOLUME' | 'TEMPERATURE';

// ── A single quantity (value + unit + type) ──────────────
export interface QuantityDTO {
  value:           number;
  unit:            string;
  measurementType: MeasurementType;
}

// ── Input wrapper for multi-quantity operations ──────────
export interface QuantityInputDTO {
  thisQuantity:  QuantityDTO;
  thatQuantity?: QuantityDTO;
  targetUnit?:   string;
}

// ── What the backend returns for an operation ────────────
export interface QuantityMeasurementDTO {
  thisValue:           number;
  thisUnit:            string;
  thisMeasurementType: string;
  thatValue?:          number;
  thatUnit?:           string;
  thatMeasurementType?: string;
  operation:           string;
  resultString?:       string;
  resultValue?:        number;
  resultUnit?:         string;
  resultMeasurementType?: string;
  scalarResult?:       number;
  isError:             boolean;
  errorMessage?:       string;
  message?:            string;
}

// ── Auth DTOs ────────────────────────────────────────────

export interface LoginDTO {
  email:    string;
  password: string;
}

export interface RegisterDTO {
  fullName: string;
  email:    string;
  password: string;
  role:     'USER' | 'ADMIN';
}

// What the backend sends back after login/register
export interface AuthResponseDTO {
  token:     string;
  fullName:  string;
  email:     string;
  role:      string;
  message?:  string;
  isSuccess?: boolean;
}

// ── Available units per measurement type ─────────────────
// These must match exactly what the backend expects (uppercase strings)
export const UNITS: Record<MeasurementType, string[]> = {
  LENGTH:      ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
  WEIGHT:      ['KILOGRAM', 'GRAM', 'POUND'],
  VOLUME:      ['LITRE', 'MILLILITRE', 'GALLON'],
  TEMPERATURE: ['CELSIUS', 'FAHRENHEIT']
};