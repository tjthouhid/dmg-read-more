/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import apiFetch from '@wordpress/api-fetch';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(5);

    const fetchPosts = (search = '', page = 1) => {
        const path = search
            ? `/wp/v2/posts?search=${search}&page=${page}&per_page=${perPage}`
            : `/wp/v2/posts?page=${page}&per_page=${perPage}`;

		apiFetch({ path, parse: false }) 
			.then(async (response) => {
				const data = await response.json(); // Parse the response body

				setSearchResults(data);
				
				// Extract total pages from headers
				const totalPagesHeader = response.headers.get('X-WP-TotalPages');
				if (totalPagesHeader) {
					setTotalPages(parseInt(totalPagesHeader, 10));
				} else {
					console.warn('X-WP-TotalPages header not found. Pagination might be inaccurate.');
				}
			})
			.catch((error) => {
				console.error('Error fetching posts:', error);
			});
		
    };

    useEffect(() => {
        fetchPosts(searchTerm, currentPage);
    }, [searchTerm, currentPage]);

    const selectPost = (post) => {
        setAttributes({ postId: post.id, postTitle: post.title.rendered, postLink: post.link });
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Post Selector', 'dmg-read-more')}>
                    <PanelRow>
                        <TextControl
                            label={__('Search Posts', 'dmg-read-more')}
                            value={searchTerm}
                            onChange={(term) => {
                                setSearchTerm(term);
                                setCurrentPage(1); // Reset to first page when search term changes
                            }}
                        />
                    </PanelRow>
                    {searchResults.map((post) => (
                        <PanelRow key={post.id}>
                            <Button isSecondary onClick={() => selectPost(post)}>
                                {post.title.rendered}
                            </Button>
                        </PanelRow>
                    ))}
                    <PanelRow>
                        <Button isSecondary onClick={handlePreviousPage} disabled={currentPage === 1}>
                            {__('Previous', 'dmg-read-more')}
                        </Button>
                        <Button isSecondary onClick={handleNextPage} disabled={currentPage >= totalPages}>
                            {__('Next', 'dmg-read-more')}
                        </Button>
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
            <p {...useBlockProps()} className="dmg-read-more">
                {attributes.postLink && (
                    <a href={attributes.postLink}>
                        {__('Read More: ', 'dmg-read-more')}{attributes.postTitle}
                    </a>
                )}
            </p>
        </>
    );
}
