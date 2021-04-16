import React from "react";
import FbGridImages from "../FbImageGrid";
// import FbImageLibrary from "react-fb-image-grid";
// import {} from "../FbImageGrid/index"

function CardBody(props) {
  const images = props.post.images;
  let arrImage = [];
  images.map((image) => arrImage.push(image.url));
  return (
    <div>
      <div className="mx-2">{props.post.content}</div>
      <FbGridImages renderOverlay={() => "Xem ảnh"} images={arrImage} />
    </div>
  );
}

export default CardBody;
