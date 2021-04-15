import React from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import "./emoji.css";

function Emoji(props) {
  const addEmoji = (e) => {
    props.addEmoji(e);
  };
  return (
    <>
      <span className="my-emoji">
        <Picker
          onSelect={addEmoji}
          set="facebook"
          title="𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵"
          emoji="point_up"
          theme="dark"
          style={{
            top: "25%",
            left: "100%",
            position: "revert",
            outline: "none",
            zIndex: "8",
            width: "100%",
          }}
          i18n={{
            search: "Tìm kiếm",
            clear: "Clear",
            notfound: "Không tìm thấy",
            categories: {
              search: "Kết quả tìm kiếm",
              recent: "Gần đây",
              smileys: "Cảm xúc",
              people: "Cảm xúc & Người",
              nature: "Động vật & thiên nhiên",
              foods: "Đồ ăn uống",
              activity: "Hoạt động",
              places: "Du lịch",
              objects: "Đồ vật",
              symbols: "Ký hiệu",
              flags: "Cờ",
              custom: "Custom",
            },
          }}
        />
      </span>
    </>
  );
}

export default Emoji;
