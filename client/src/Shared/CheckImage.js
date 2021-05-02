export const checkImage = (file) => {
  let err = "";

  if (!file) return (err = "Bạn chưa đưa hình ảnh lên");

  if (file.size > 5 * 1024 * 1024) err = "Hình ảnh đã lớn hơn 1mb";

  if (file.type !== "image/jpeg" && file.type !== "image/png")
    err = "Không hổ trợ file này";

  return err;
};

export const uploadImage = async (images) => {
  const formData = new FormData();
  for (const item of images) {
    if (item.camera) {
      const b64toBlob = (b64Data, contentType, sliceSize) => {
        contentType = contentType || "";
        sliceSize = sliceSize || 512;
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (
          let offset = 0;
          offset < byteCharacters.length;
          offset += sliceSize
        ) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
      };
      const block = item.camera.split(";");
      const contentType = block[0].split(":")[1];
      const realData = block[1].split(",")[1];
      formData.append("file", b64toBlob(realData, contentType));
    } else {
      formData.append("file", item);
    }
  }
  const res = await fetch(`/api/post/uploadImage`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.data;
};

// Cách cũ
// export const uploadImage = async (images) => {
//   let arrImg = [];
//   for (const item of images) {
//     const formData = new FormData();

//     if (item.camera) {
//       formData.append("file", item.camera);
//     } else {
//       formData.append("file", item);
//     }

//     formData.append("upload_preset", "jaese6ch");
//     formData.append("cloud_name", "tranquocliem");

//     const res = await fetch(
//       "https://api.cloudinary.com/v1_1/tranquocliem/image/upload",
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const data = await res.json();
//     arrImg.push({ public_id: data.public_id, url: data.secure_url });
//   }
//   return arrImg;
// };
