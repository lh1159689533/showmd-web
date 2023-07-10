export const download = (fileName: string, data: Blob | string): void => {
  const blob = new Blob([data]);
  const elink = document.createElement('a');
  elink.download = fileName;
  elink.style.display = 'none';
  elink.href = URL.createObjectURL(blob);
  elink.click();
  URL.revokeObjectURL(elink.href);
};