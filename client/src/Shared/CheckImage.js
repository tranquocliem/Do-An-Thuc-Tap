export const checkImage = (file) => {
  let err = "";

  if (!file) return (err = "Bạn chưa đưa hình ảnh lên");

  if (file.size > 1024 * 1024) err = "Hình ảnh đã lớn hơn 1mb";

  if (file.type !== "image/jpeg" && file.type !== "image/png")
    err = "Không hổ trợ file này";

  return err;
};
