import { useEffect, useState } from "react";
import { __ } from "@wordpress/i18n";
import Skeleton from "./Skeleton";

export default function Component({ attributes, setAttributes, is_edit_mode }) {
  const { pageID } = attributes;

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timeoutId);
  }, [pageID])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      let page = parseInt(pageID || 0);
      // if pageID attr is empty, pageID will be the current page ID.
      if (!page) {
        page = parseInt(wp.data.select("core/editor").getCurrentPostId());
        setAttributes({ pageID: page });
      }

      // Fetch the attached documents from the page.
      const apiUrl = `${customBlocks.api.root}/files/`;
      const params = new URLSearchParams();
      params.append('post_id', page);
      const filesResponse = await fetch(`${apiUrl}?${params.toString()}`);
      if (!filesResponse?.ok) {
        throw new Error("Failed to fetch attached documents");
      }
      const fetchedData = await filesResponse?.json();
      setResponse(fetchedData.details);
    } catch (error) {
      setResponse([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderData = () => {
    if (isLoading) {
      return (
        new Array(2).fill(null).map((_, index) => {
          return (<Skeleton key={index} />)
        })
      );
    }

    if (!response?.length && is_edit_mode) {
      return (
        <div className="single-file-container">
          <div className="single-file-container__heading">
            <span>⚠️</span>
            <div className="file-text-container">
              <p>
                {__(
                  "No files found for the selected page. Please change the page ID from the right panel",
                  "gutenberg-blocks"
                )}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return response?.map((file, index) => {
      const fileURL = is_edit_mode ? null : file.url;
      return (
        <div key={index} className="single-file-container">
          <div className="single-file-container__heading">
            {file.icon && <img loading="lazy" src={file.icon} alt="file-icon" />}
            {!file.icon && <span className="file-icon skeleton__content"></span>}
            <div className="file-text-container">
              <p>{file.title}</p>
            </div>
          </div>
          <div className="file__link-container wp-block-buttons">
            <div className="wp-block-button is-style-fill wp-block-button__clear-style--text-icon">
              <a href={fileURL} download target="_blank" rel="noopener noreferrer" className="wp-block-button__link has-blue-color has-transparent-background-color has-text-color has-background has-link-color has-text-align-left wp-element-button">
                <span>{__("Download", "gutenberg-blocks")}</span>
                <img style={{ width: "43px" }} src="/wp-content/plugins/gutenberg-blocks/assets/build/img/icons/download.svg"
                />
                <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="43" height="43" rx="21.5" fill="#FFE000" />
                  <path d="M21.5 27L16 22.2857M21.5 27L27 22.2857M21.5 27L21.5 16" stroke="#005DA1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <>
      <div className="files-container">
        {renderData()}
      </div>
    </>
  )
}