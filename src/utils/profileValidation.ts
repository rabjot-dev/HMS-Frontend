
export type ValidationErrors = Partial<Record<string, string>>;

const LETTERS_ONLY = /^[A-Za-z\s'-]+$/;
const DIGITS_10    = /^\d{10}$/;

export function validateName(value: string, fieldLabel: string): string | null {
  if (!value.trim())              return `${fieldLabel} is required.`;
  if (!LETTERS_ONLY.test(value.trim())) return `${fieldLabel} must contain only letters.`;
  return null;
}

export function validatePhone(value: string, fieldLabel = "Phone"): string | null {
  if (!value.trim())          return `${fieldLabel} is required.`;
  if (!DIGITS_10.test(value)) return `${fieldLabel} must be exactly 10 digits.`;
  return null;
}

export function validateEmail(value: string): string | null {
  if (!value.trim()) return "Email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return "Enter a valid email address.";
  return null;
}

export function validateRequired(value: string, fieldLabel: string): string | null {
  if (!value.trim()) return `${fieldLabel} is required.`;
  return null;
}

// Validate Personal Info section
export function validatePersonalForm(form: {
  firstName: string; lastName: string;
  gender: string; bloodGroup: string; maritalStatus: string; dateOfBirth: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};
  const fn = validateName(form.firstName, "First Name");         if (fn) errors.firstName = fn;
  const ln = validateName(form.lastName, "Last Name");           if (ln) errors.lastName = ln;
  const g  = validateRequired(form.gender, "Gender");            if (g)  errors.gender = g;
  const bg = validateRequired(form.bloodGroup, "Blood Group");   if (bg) errors.bloodGroup = bg;
  const ms = validateRequired(form.maritalStatus, "Marital Status"); if (ms) errors.maritalStatus = ms;
  const db = validateRequired(form.dateOfBirth, "Date of Birth"); if (db) errors.dateOfBirth = db;
  return errors;
}

// Validate Contact Info section
export function validateContactForm(form: {
  phone: string; address: string; city: string;
  state: string; pincode: string; country: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};
  const ph = validatePhone(form.phone);                              if (ph) errors.phone = ph;
  const ad = validateRequired(form.address, "Address");              if (ad) errors.address = ad;
  const ci = validateRequired(form.city, "City");                    if (ci) errors.city = ci;
  const st = validateRequired(form.state, "State");                  if (st) errors.state = st;
  const pi = validateRequired(form.pincode, "Pincode");              if (pi) errors.pincode = pi;
  const co = validateRequired(form.country, "Country");              if (co) errors.country = co;
  return errors;
}

// Validate Emergency Contact section
export function validateEmergencyForm(form: {
  emergencyContactName: string; emergencyContactPhone: string; relationship: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};
  const en = validateName(form.emergencyContactName, "Contact Name");
  if (en) errors.emergencyContactName = en;
  const ep = validatePhone(form.emergencyContactPhone, "Contact Phone");
  if (ep) errors.emergencyContactPhone = ep;
  const re = validateRequired(form.relationship, "Relationship");
  if (re) errors.relationship = re;
  return errors;
}