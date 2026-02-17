import JSZip from 'jszip';
import { saveAs } from 'file-saver';
// @ts-ignore
import html2pdf from 'html2pdf.js';
// @ts-ignore
import { asBlob } from 'html-docx-js-typescript';

export interface ExportDocument {
    title: string;
    content: string; // HTML content or text content
}

/**
 * Helper to trigger file download in browser
 */
export const downloadFile = (blob: Blob, filename: string) => {
    saveAs(blob, filename);
};

/**
 * Generate PDF from an HTML element or string
 */
export const generatePdf = async (elementOrContent: HTMLElement | string, filename: string) => {
    // Basic options for html2pdf
    const opt = {
        margin: 0.5, // single number is safer for types
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    let contentToRender: HTMLElement;
    let tempContainer: HTMLElement | null = null;

    if (typeof elementOrContent === 'string') {
        tempContainer = document.createElement('div');
        // We use a specific class to scope styles, but also apply base styles inline
        // to ensure they are picked up by html2canvas
        tempContainer.innerHTML = `
            <div class="pdf-wrapper" style="font-family: Arial, sans-serif; color: #000; background: #fff; padding: 40px; width: 800px;">
                <style>
                    /* Reset some browser defaults */
                    .pdf-wrapper * { box-sizing: border-box; }
                    .pdf-wrapper h1 { font-size: 28px; font-weight: bold; margin-bottom: 1em; color: #000; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                    .pdf-wrapper h2 { font-size: 22px; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.8em; color: #333; }
                    .pdf-wrapper h3 { font-size: 18px; font-weight: bold; margin-top: 1.2em; margin-bottom: 0.5em; color: #444; }
                    .pdf-wrapper p { font-size: 12pt; line-height: 1.6; margin-bottom: 1em; color: #000; }
                    .pdf-wrapper ul, .pdf-wrapper ol { margin-bottom: 1em; padding-left: 2em; }
                    .pdf-wrapper li { margin-bottom: 0.5em; font-size: 12pt; }
                    .pdf-wrapper blockquote { border-left: 4px solid #ccc; padding-left: 1em; color: #555; font-style: italic; margin: 1.5em 0; }
                    .pdf-wrapper a { color: #000; text-decoration: underline; }
                    .pdf-wrapper img { max-width: 100%; height: auto; }
                    .pdf-wrapper code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; font-family: monospace; }
                    .pdf-wrapper pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; margin: 1em 0; }
                </style>
                <div class="content">
                    ${elementOrContent}
                </div>
            </div>
        `;

        // Position fixed but visible
        tempContainer.style.position = 'fixed';
        tempContainer.style.top = '0';
        tempContainer.style.left = '0';
        tempContainer.style.zIndex = '-1000'; // Behind everything

        document.body.appendChild(tempContainer);
        contentToRender = tempContainer;
    } else {
        contentToRender = elementOrContent;
    }

    try {
        // slight delay to ensure rendering
        await new Promise(resolve => setTimeout(resolve, 100));
        await html2pdf().set(opt).from(contentToRender).save();
    } catch (e) {
        console.error('PDF generation failed', e);
        alert('Failed to generate PDF. Please try again.');
    } finally {
        if (tempContainer && document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
        }
    }
};

/**
 * Generate DOCX from HTML content
 */
export const generateDocx = async (htmlContent: string, filename: string) => {
    // Wrap content to ensure basic styling in Word
    // Word doesn't support generic CSS classes well, so we rely on tag names
    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${filename}</title>
             <style>
                body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000000; background-color: #ffffff; }
                p { margin-bottom: 12pt; }
                h1 { font-size: 24pt; font-weight: bold; margin-bottom: 12pt; }
                h2 { font-size: 18pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
                h3 { font-size: 14pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
                ul, ol { margin-bottom: 12pt; }
                li { margin-bottom: 6pt; }
                a { color: blue; text-decoration: underline; }
            </style>
        </head>
        <body>
            ${htmlContent}
        </body>
        </html>
    `;

    try {
        const blob = await asBlob(fullHtml);
        saveAs(blob as Blob, filename);
    } catch (e) {
        console.error('DOCX generation failed', e);
        alert('Failed to generate Word document.');
    }
};

/**
 * Generate HTML file
 */
export const generateHtml = (htmlContent: string, filename: string) => {
    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${filename}</title>
            <style>
                body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; color: #333; background: #fff; }
                img { max-width: 100%; height: auto; }
            </style>
        </head>
        <body>
            ${htmlContent}
        </body>
        </html>
    `;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    saveAs(blob, filename);
};

/**
 * Generate ZIP from multiple documents
 */
export const generateZip = async (documents: ExportDocument[], filename: string) => {
    const zip = new JSZip();

    documents.forEach(doc => {
        // Sanitize filename
        const safeTitle = doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled';
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${doc.title}</title>
                <style>
                     body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; color: #333; }
                </style>
            </head>
            <body>
                <h1>${doc.title}</h1>
                ${doc.content}
            </body>
            </html>
        `;
        zip.file(`${safeTitle}.html`, fullHtml);
    });

    try {
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, filename);
    } catch (e) {
        console.error('ZIP generation failed', e);
        alert('Failed to generate ZIP archive.');
    }
};

/**
 * Share content using Web Share API
 */
export const shareContent = async (data: { title: string; text?: string; url?: string; files?: File[] }) => {
    const shareData: ShareData = {
        title: data.title,
        text: data.text,
        url: data.url,
    };

    // Try Web Share API first
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData);
            return true;
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
            }
            return false;
        }
    }

    // Fallback: Copy to Clipboard
    // Note: This requires Secure Context (HTTPS or localhost)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        const textToCopy = data.url || data.text || '';
        if (textToCopy) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                alert('Link copied to clipboard!');
                return true;
            } catch (err) {
                console.error('Failed to copy text: ', err);
                // Fallback valid only if prompt is allowed?
                prompt('Copy this link:', textToCopy);
                return false;
            }
        }
    } else {
        // Fallback for insecure context or unsupported clipboard
        const textToCopy = data.url || data.text || '';
        prompt('Manually copy this link:', textToCopy);
        return false;
    }

    return false;
};
