import { getThumbnailFromVideo } from "../../Services/CommonBlockFunctions";
import VideoCover from "../common-frontend/VideoCover";
import { __ } from "@wordpress/i18n";

export default function PostCard({ post, textForReadMore, isEditMode, hasGalleryStyle, showDate, handlePostClick }) {
  // if block has the gallery block style, or we are on Editor then the post.url will be null.
  const postURL = hasGalleryStyle || isEditMode ? null : post.url;

  const media = (post) => {
    if (post.videoEmbed) {
      const videoThumbnail = getThumbnailFromVideo(post.videoEmbed);
      return (
        <VideoCover videoThumbnail={videoThumbnail} imgAlt={post.title} />
      )
    }

    if (post.image) {
      return (
        <img loading="lazy" width="350" height="197" srcSet={post.srcset ? post.srcset : ''} src={post.image} className="attachment-large size-large wp-post-image" alt={post.title} />
      )
    }

    return (
      <span href="#" className="">
        <span className="skeleton__content"></span>
      </span>
    )
  };

  return (
    <li data-post-id={post.id} className="single-post-container" onClick={handlePostClick}>
      <div className={`wp-block-latest-posts__featured-image`}>
        <a href={postURL} aria-label={post.title} target="_self" rel="noopener noreferrer">
          {media(post)}
        </a>
      </div>
      <a className="wp-block-latest-posts__post-title" href={postURL} target="_self" rel="noopener noreferrer" >
        {post.title}
      </a>
      {(showDate === true || showDate === "true") && (
        <time dateTime={post.date} className="wp-block-latest-posts__post-date">
          {post.date}
        </time>
      )}
      <div className="wp-block-latest-posts__post-excerpt">
        {post.excerpt}
      </div>
      {(textForReadMore) && (
        <div className="wp-block-buttons">
          <div className="wp-block-button is-style-fill wp-block-button__clear-style--text-icon">
            <a className="wp-block-button__link has-blue-color has-transparent-background-color has-text-color has-background has-link-color has-text-align-left wp-element-button" href={postURL} target="_self" rel="noopener noreferrer" >
              <span>{textForReadMore}</span>
              <img decoding="async" style={{ width: "43px" }} src="/wp-content/plugins/gutenberg-blocks/assets/build/img/icons/Plus-blue-1.svg" />
              <svg viewBox="0 0 43 43" width="43" height="43" fill="none" xmlns="http://www.w3.org/2000/svg" ><rect width="43" height="43" rx="21.5" fill="#FFE000"></rect>
                <path d="M22.5 16V20.5H27V22.5H22.5V27H20.5V22.5H16V20.5H20.5V16H22.5Z" fill="#005DA1" ></path>
              </svg>
            </a>
          </div>
        </div>
      )}
    </li>
  )
}