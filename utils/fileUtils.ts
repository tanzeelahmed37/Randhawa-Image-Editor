
export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      
      const parts = result.split(',');
      if (parts.length !== 2) {
        reject(new Error("Invalid data URL format"));
        return;
      }
      
      const header = parts[0];
      const base64String = parts[1];

      const mimeMatch = header.match(/:(.*?);/);
      if (!mimeMatch || !mimeMatch[1]) {
        reject(new Error("Could not determine MIME type from data URL"));
        return;
      }
      const mimeType = mimeMatch[1];
      
      resolve({ base64: base64String, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};
