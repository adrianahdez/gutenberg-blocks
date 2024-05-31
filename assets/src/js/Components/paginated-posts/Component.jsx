import { useEffect, useState, useRef } from "react";
import { __ } from "@wordpress/i18n";
import Pagination from "./Pagination";
import Skeleton from "./Skeleton";
import GalleryModal from "../modal/GalleryModal";
import PostCard from "./PostCard";

export default function Component({ attributes, is_edit_mode, blockProps }) {
  const { cpt, perPage, textForReadMore, className, textForShowGalleryButton, showDate, isPaginated } = attributes;

  const [response, setResponse] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const scrollToRef = useRef();

  const useEffectProps = is_edit_mode ? [cpt, perPage] : [pageNum];
  useEffect(() => {
    const timeoutId = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timeoutId);
  }, useEffectProps)

  const hasGalleryStyle = (!is_edit_mode && className === 'is-style-custom-cpt') || (is_edit_mode && blockProps.className?.includes('is-style-custom-cpt'));

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const currentLang = getCurrentPageLanguageFromPolylang();

      // Fetch the posts from the given cpt and page.
      const apiUrl = `${customBlocks.api.root}/posts/`;
      const params = new URLSearchParams();
      if (cpt) params.append('post_type', cpt);
      if (perPage) params.append('per_page', perPage);
      if (pageNum) params.append('page', pageNum);
      if (currentLang) params.append('lang', currentLang);
      const postsResponse = await fetch(`${apiUrl}?${params.toString()}`);

      if (!postsResponse?.ok) {
        throw new Error("Failed to fetch posts");
      }
      const fetchedData = await postsResponse?.json();
      setResponse(fetchedData.details);
    } catch (error) {
      setResponse([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPageLanguageFromPolylang = () => {
    let currentLang = '';
    if (is_edit_mode) {
      // get the language of the current page where this block is being used
      currentLang = document.querySelector("#post_lang_choice option[selected=selected]")?.getAttribute("lang");
    } else {
      currentLang = document.querySelector("html").getAttribute("lang");
    }
    if (!currentLang) {
      return "";
    }

    // Get the first part of the language code (e.g. 'en-US' -> 'en' or 'en_US' -> 'es')
    currentLang = currentLang.split(/[-_]/).shift();

    return currentLang;
  }

  const handlePostClick = (e) => {
    if (!hasGalleryStyle || is_edit_mode) {
      return;
    }

    setModalData({
      idSelected: e.currentTarget.dataset.postId ? parseInt(e.currentTarget.dataset.postId) : 0,
      contentData: response.posts,
      handleCloseModal: () => setModalData(null)
    });
  }

  const renderData = () => {
    if (isLoading) {
      return (
        new Array(parseInt(perPage)).fill(null).map((_, index) => {
          return (<Skeleton key={index} />)
        })
      );
    }

    if (!response?.posts?.length && is_edit_mode) {
      return (
        <div className="single-post-container single-post-container--empty">
          <div className="single-post-container__heading">
            <span>⚠️</span>
            <div className="post-text-container">
              <p>{__('No posts found for the selected arguments. Please change the "CPT" or the "Posts per page" field from the right panel', "gutenberg-blocks")}</p>
            </div>
          </div>
        </div>
      );
    }

    if (!response?.posts?.length) {
      return null;
    }

    return response?.posts.map((post, index) => (
      <PostCard key={index} post={post} textForReadMore={textForReadMore} isEditMode={is_edit_mode} hasGalleryStyle={hasGalleryStyle} showDate={showDate} handlePostClick={handlePostClick} />
    ))
  }

  const renderPagination = () => {
    const showPagination = (isPaginated === true || isPaginated === "true") ? true : false;
    if (isLoading || !response || !showPagination || response.total_posts <= perPage) {
      return;
    }
    return (
      <Pagination perPage={perPage} page={pageNum} totalPosts={response?.total_posts} totalPages={response?.total_pages} isEditMode={is_edit_mode} setPage={setPageNum} scrollToRef={scrollToRef} />
    )
  }

  const renderButton = () => {
    if (!hasGalleryStyle || !textForShowGalleryButton || !response?.posts?.length) return null;

    return (

      <div className="wp-block-buttons wp-block-buttons--show-gallery">
        <div className="wp-block-button is-style-outline wp-block-button__outline-style--text">
          <button className="wp-block-button__link has-blue-color has-text-color has-link-color has-text-align-left wp-element-button" onClick={handlePostClick}>{textForShowGalleryButton}</button>
        </div>
      </div>

    )
  }

  return (
    <>
      {renderButton()}
      <ul className="wp-block-latest-posts__list is-grid columns-3 alignwide wp-block-latest-posts" ref={scrollToRef}>
        {renderData()}
      </ul>
      {renderPagination()}
      {modalData && (<GalleryModal {...modalData} />)}
    </>
  )
}