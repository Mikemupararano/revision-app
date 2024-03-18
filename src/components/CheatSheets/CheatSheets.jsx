import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import pdf from "../../assets/Javascript.pdf"

function CheatSheets(props) {
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="CheatSheet-div">
            <p>
                Page {pageNumber} of {numPages}
                </p>
            <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.apply(null, Array(numPages))
                .map((x, i) => i + 1)
                .map((page) => {
                    return(
                <Page 
                pageNumber={page} 
                renderTexlayer={false} 
                renderAnnotationLayer={false} 
                />
                )
                })}
            </Document>
            
            
        </div>
    );
}

export default CheatSheets;