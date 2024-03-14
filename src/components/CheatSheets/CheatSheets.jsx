import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import pdf from './Javascript PDF';

function CheatSheets() {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div>
            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(Array(numPages), (x, i) => i + 1).map(pageNumber => (
                    <Page 
                        key={pageNumber}
                        pageNumber={pageNumber} 
                        renderTextLayer={false} 
                        renderAnnotationLayer={false}
                    />
                ))}
            </Document>
            <p>
                Page {pageNumber} of {numPages}
            </p>
        </div>
    );
}

export default CheatSheets;
