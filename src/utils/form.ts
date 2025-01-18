export const createFormDataFromObject = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  formData.append('crisisData', JSON.stringify(data));
  return formData;
};

export const appendFilesToFormData = (formData: FormData, files: File[], fieldName: string): void => {
  files.forEach(file => {
    formData.append(fieldName, file);
  });
};