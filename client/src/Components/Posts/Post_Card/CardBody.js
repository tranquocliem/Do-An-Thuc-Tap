/* eslint-disable no-control-regex */
import React, { useState } from "react";
import FbGridImages from "../FbImageGrid";

function CardBody(props) {
  const [readMore, setReadMore] = useState(false);

  const images = props.post ? props.post.images : [];
  let arrImage = [];
  images.map((image) => arrImage.push(image.url));
  const content =
    props.post &&
    props.post.content.replace(new RegExp("\r?\n", "g"), "<br />");
  return (
    <div className="card-body">
      <div className="card_body_content" style={{ marginTop: "-15px" }}>
        <span
          dangerouslySetInnerHTML={{
            __html:
              props.post && content.length < 189
                ? content
                : readMore
                ? content + " "
                : props.post && content.slice(0, 189) + "......",
          }}
        />
        {props.post &&
          props.post.content.length > 189 &&
          (readMore ? (
            <p onClick={() => setReadMore(!readMore)} className="readMore">
              Ẩn bớt
            </p>
          ) : (
            <span onClick={() => setReadMore(!readMore)} className="readMore">
              Xem thêm
            </span>
          ))}
      </div>
      <FbGridImages renderOverlay={() => "Xem ảnh"} images={arrImage} />
    </div>
  );
}

export default CardBody;
