export const downloadFile = (uri: string, filename: string) => {
  const link = document.createElement('a');
  link.style.display = 'none';
  if (typeof link.download === 'string') {
    document.body.appendChild(link);
    link.download = filename;
    link.href = uri;
    link.click();
    document.body.removeChild(link);
  } else {
    location.replace(uri);
  }
};
