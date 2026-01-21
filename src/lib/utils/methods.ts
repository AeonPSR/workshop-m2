

export async function getThumbnailURL(image: File, size = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(image);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);

      const dataUrl = canvas.toDataURL("image/png");
      resolve(dataUrl);
    };


    img.onerror = () => reject("Erreur lors du chargement de l'image");
  });
}
