import React from "react";
import {
  LineShareButton,
  LineIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  WeiboShareButton,
  WeiboIcon,
} from "react-share";

function ShareModal({ url }) {
  return (
    <div
      className="share-modal d-flex justify-content-between px-4 py-2 mt-2 mb-2"
      style={{ background: "#EEEEEE" }}
    >
      <FacebookShareButton url="https://www.facebook.com/tranquocliem99/">
        <FacebookIcon round={true} size={32} />
      </FacebookShareButton>
      <LineShareButton url={url}>
        <LineIcon round={true} size={32} />
      </LineShareButton>
      <TwitterShareButton url={url}>
        <TwitterIcon round={true} size={32} />
      </TwitterShareButton>
      <TelegramShareButton url={url}>
        <TelegramIcon round={true} size={32} />
      </TelegramShareButton>
      <WhatsappShareButton url={url}>
        <WhatsappIcon round={true} size={32} />
      </WhatsappShareButton>
      <WeiboShareButton url={url}>
        <WeiboIcon round={true} size={32} />
      </WeiboShareButton>
    </div>
  );
}

export default ShareModal;
