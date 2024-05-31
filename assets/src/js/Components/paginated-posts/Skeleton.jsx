import { __ } from "@wordpress/i18n";

export default function Skeleton() {
  return (
    <li className="single-post-container single-post-container--skeleton skeleton-component">
      <div className="wp-block-latest-posts__featured-image">
        <span className="">
          <span className="skeleton__content"></span>
        </span>
      </div>
      <span className="wp-block-latest-posts__post-title" href="#" ><span className="skeleton__content"></span></span>
      <time className="wp-block-latest-posts__post-date">
        <span className="skeleton__content"></span>
      </time>
      <div className="wp-block-latest-posts__post-excerpt">
        <span className="skeleton__content"></span>
      </div>
      <div className="wp-block-buttons">
        <div className="wp-block-button is-style-fill wp-block-button__clear-style--text-icon">
          <span className="wp-block-button__link has-transparent-background-color has-text-align-left wp-element-button" >
            <span className="skeleton__content">{__("Read more", "gutenberg-blocks")}</span>
            {/* <span className="skeleton__content"></span> */}
            <svg viewBox="0 0 43 43" width="43" height="43" fill="none" xmlns="http://www.w3.org/2000/svg" ><rect width="43" height="43" rx="21.5" fill="#888" opacity={.15}></rect>
              <path d="M22.5 16V20.5H27V22.5H22.5V27H20.5V22.5H16V20.5H20.5V16H22.5Z" fill="#888" opacity={.4} ></path>
            </svg>
          </span>
        </div>
      </div>
    </li>
  )
}