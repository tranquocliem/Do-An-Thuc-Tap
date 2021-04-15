export const checkImage = (file) => {
  let err = "";

  if (!file) return (err = "Bạn chưa đưa hình ảnh lên");

  if (file.size > 1024 * 1024) err = "Hình ảnh đã lớn hơn 1mb";

  if (file.type !== "image/jpeg" && file.type !== "image/png")
    err = "Không hổ trợ file này";

  return err;
};

export const uploadImage = async (images) => {
  let arrImg = [];
  for (const item of images) {
    const formData = new FormData();

    if (item.camera) {
      formData.append("file", item.camera);
    } else {
      formData.append("file", item);
    }

    formData.append("upload_preset", "jaese6ch");
    formData.append("cloud_name", "tranquocliem");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/tranquocliem/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    arrImg.push({ public_id: data.public_id, url: data.secure_url });
  }
  return arrImg;
};
