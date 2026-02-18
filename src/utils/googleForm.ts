import { ContactFormData } from '../components/ContactForm';

const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeETmoJyXmPx9OGIPyxZp-In_WOHPD66FdtpG3BpyD7mC8eeQ/formResponse';

export const GOOGLE_FORM_ENTRY_IDS = {
  contactMethod: 'entry.1347626950',
  fullName: 'entry.322434648',
  email: 'entry.1351031180',
  phone: 'entry.1561356873',
  offerSummary: 'entry.1768961017'
} as const;

export interface LeadSubmissionPayload extends ContactFormData {
  offerSummary: string;
}

const normalizeValue = (value: string) => value.trim();

const mapContactMethod = (method: ContactFormData['contactMethod']) =>
  method === 'phone' ? 'Llamada telefónica' : 'WhatsApp';

export async function submitLeadToGoogleForm(payload: LeadSubmissionPayload): Promise<void> {
  const formData = new FormData();

  formData.append(GOOGLE_FORM_ENTRY_IDS.contactMethod, mapContactMethod(payload.contactMethod));
  formData.append(GOOGLE_FORM_ENTRY_IDS.fullName, normalizeValue(payload.name));
  formData.append(GOOGLE_FORM_ENTRY_IDS.email, normalizeValue(payload.email));
  formData.append(GOOGLE_FORM_ENTRY_IDS.phone, normalizeValue(payload.phone));
  formData.append(GOOGLE_FORM_ENTRY_IDS.offerSummary, normalizeValue(payload.offerSummary));

  await fetch(GOOGLE_FORM_ACTION_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  });
}
