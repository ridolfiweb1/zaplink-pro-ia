
/**
 * Sanitizes phone number to contain only digits
 */
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Formats a raw phone string into a more readable format for display
 */
export const formatDisplayPhone = (phone: string): string => {
  const cleaned = cleanPhoneNumber(phone);
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Generates the WhatsApp link
 */
export const generateWhatsAppLink = (phone: string, message: string): string => {
  const cleanedPhone = cleanPhoneNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
};
