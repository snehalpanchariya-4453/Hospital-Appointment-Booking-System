/**
 * Fallback avatars and image error handling for doctor profile pictures
 */

export const DEFAULT_DOCTOR_AVATAR =
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400';

export const FALLBACK_SVG_AVATAR =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23fce4ec'/><circle cx='100' cy='75' r='35' fill='%23f48fb1'/><path d='M40 180 c0-40 30-65 60-65 s60 25 60 65' fill='%23f06292'/></svg>";

/**
 * Robust image error handler that gracefully recovers to a default doctor portrait,
 * and if network is unavailable, falls back to an embedded baby-pink SVG avatar.
 */
export const handleImageError = (e) => {
  e.currentTarget.onerror = (secondErr) => {
    secondErr.currentTarget.onerror = null;
    secondErr.currentTarget.src = FALLBACK_SVG_AVATAR;
  };
  e.currentTarget.src = DEFAULT_DOCTOR_AVATAR;
};
