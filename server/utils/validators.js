export const validateCrisisData = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  }

  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  }

  if (!data.severity) {
    errors.severity = 'Severity is required';
  } else if (!['low', 'medium', 'high', 'critical'].includes(data.severity)) {
    errors.severity = 'Invalid severity level';
  }

  if (!data.location?.address?.trim()) {
    errors.location = 'Location is required';
  }

  return Object.keys(errors).length > 0 ? { message: 'Validation failed', details: errors } : null;
};