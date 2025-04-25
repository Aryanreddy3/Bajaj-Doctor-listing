export interface Doctor {
  id: string;
  name: string;
  specialties: string[];
  experience: number;
  fee: number;
  consultationMode: 'Video Consult' | 'In Clinic';
}

export interface FilterState {
  search: string;
  consultationMode: 'Video Consult' | 'In Clinic' | '';
  specialties: string[];
  sortBy: 'fees' | 'experience' | '';
}

export const SPECIALTIES = [
  'General Physician',
  'Dentist',
  'Dermatologist',
  'Paediatrician',
  'Gynaecologist',
  'ENT',
  'Diabetologist',
  'Cardiologist',
  'Physiotherapist',
  'Endocrinologist',
  'Orthopaedic',
  'Ophthalmologist',
  'Gastroenterologist',
  'Pulmonologist',
  'Psychiatrist',
  'Urologist',
  'Dietitian/Nutritionist',
  'Psychologist',
  'Sexologist',
  'Nephrologist',
  'Neurologist',
  'Oncologist',
  'Ayurveda',
  'Homeopath'
]; 