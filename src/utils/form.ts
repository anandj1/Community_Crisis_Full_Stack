export const createFormDataFromObject = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  // Convert the data object to a string, excluding File objects
  const sanitizedData = { ...data };
  if (sanitizedData.media) {
    delete sanitizedData.media;
  }
  
  formData.append('crisisData', JSON.stringify(sanitizedData));
  return formData;
};

export const appendFilesToFormData = (
  formData: FormData, 
  files: File[], 
  fieldName: string = 'media'
): void => {
  files.forEach(file => {
    if (file instanceof File) {
      formData.append(fieldName, file);
    }
  });
};