/**
 * Teacher Platform Validation Logic (Phase 2)
 */

export interface TeacherData {
  hourly_rate?: number;
  phone?: string;
  bio?: string;
  subjects?: string[];
  districts?: string[];
  avatar_url?: string;
}

export const validateTeacherData = (data: TeacherData) => {
  const errors: Record<string, string> = {};

  // Price validation
  if (data.hourly_rate !== undefined && data.hourly_rate < 0) {
    errors.hourly_rate = "سعر الساعة لا يمكن أن يكون سالباً";
  }

  // Saudi Phone Validation (simplified: 05 followed by 8 digits)
  if (data.phone && !/^(05|5)([0-9]{8})$/.test(data.phone.replace(/\s/g, ''))) {
    errors.phone = "رقم الهاتف يجب أن يتبع التنسيق السعودي (05xxxxxxxx)";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const isProfileComplete = (profile: TeacherData) => {
  const hasBio = !!profile.bio && profile.bio.length >= 20;
  const hasPrice = !!profile.hourly_rate && profile.hourly_rate > 0;
  const hasSubjects = !!profile.subjects && profile.subjects.length > 0;
  const hasDistricts = !!profile.districts && profile.districts.length > 0;
  const hasAvatar = !!profile.avatar_url;

  return hasBio && hasPrice && hasSubjects && hasDistricts && hasAvatar;
};
