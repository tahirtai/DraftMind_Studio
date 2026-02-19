import JSZip from 'jszip';
import { saveAs } from 'file-saver';
// @ts-ignore
import html2pdf from 'html2pdf.js';
// @ts-ignore
import { asBlob } from 'html-docx-js-typescript';

export interface ExportDocument {
    title: string;
    content: string;
}

// ─── Helpers ────────────────────────────────────────────────

/** Trigger file download in browser */
export const downloadFile = (blob: Blob, filename: string) => {
    saveAs(blob, filename);
};

/** Strip TipTap/ProseMirror editor-specific classes from HTML */
const stripEditorClasses = (html: string): string => {
    return html
        .replace(/\s*class="[^"]*ProseMirror[^"]*"/gi, '')
        .replace(/\s*class="[^"]*tiptap[^"]*"/gi, '')
        .replace(/\s*class="[^"]*is-editor-empty[^"]*"/gi, '')
        .replace(/\s*data-placeholder="[^"]*"/gi, '')
        .replace(/\s*contenteditable="[^"]*"/gi, '')
        .replace(/\s*data-pm-[a-z-]+="[^"]*"/gi, '');
};

/** Check if content is effectively empty */
const isContentEmpty = (html: string): boolean => {
    if (!html) return true;
    // Strip tags and whitespace
    const text = html.replace(/<[^>]*>/g, '').trim();
    return text.length === 0;
};

// ─── PDF Export ─────────────────────────────────────────────

/**
 * Generate PDF from TipTap HTML content.
 * Creates a temporary off-screen container, renders it with html2canvas,
 * then generates a multi-page PDF with jsPDF.
 */
export const generatePdf = async (htmlContent: string, filename: string): Promise<boolean> => {
    if (isContentEmpty(htmlContent)) {
        alert('Nothing to export — document is empty.');
        return false;
    }

    const cleanHtml = stripEditorClasses(htmlContent);

    // Create a temporary container for rendering
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = `
        <div class="pdf-export-wrapper" style="
            font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
            color: #000;
            background: #fff;
            padding: 48px 56px;
            width: 816px;
            line-height: 1.7;
        ">
            <style>
                .pdf-export-wrapper * { box-sizing: border-box; }
                .pdf-export-wrapper h1 { font-size: 28px; font-weight: 700; margin: 0 0 16px 0; color: #111; border-bottom: 2px solid #e5e5e5; padding-bottom: 12px; }
                .pdf-export-wrapper h2 { font-size: 22px; font-weight: 700; margin: 24px 0 12px 0; color: #222; }
                .pdf-export-wrapper h3 { font-size: 18px; font-weight: 600; margin: 20px 0 8px 0; color: #333; }
                .pdf-export-wrapper p { font-size: 13px; line-height: 1.8; margin: 0 0 12px 0; color: #111; }
                .pdf-export-wrapper ul, .pdf-export-wrapper ol { margin: 0 0 12px 0; padding-left: 24px; }
                .pdf-export-wrapper li { margin-bottom: 6px; font-size: 13px; line-height: 1.7; }
                .pdf-export-wrapper blockquote { border-left: 4px solid #d1d5db; padding: 8px 16px; color: #555; font-style: italic; margin: 16px 0; background: #fafafa; }
                .pdf-export-wrapper a { color: #2563eb; text-decoration: underline; }
                .pdf-export-wrapper code { background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-family: 'Consolas', monospace; font-size: 12px; }
                .pdf-export-wrapper pre { background: #f3f4f6; padding: 16px; border-radius: 6px; overflow-x: auto; margin: 12px 0; font-size: 12px; }
                .pdf-export-wrapper strong { font-weight: 700; }
                .pdf-export-wrapper em { font-style: italic; }
                .pdf-export-wrapper u { text-decoration: underline; }
            </style>
            <div class="pdf-content">${cleanHtml}</div>
        </div>
    `;

    // Position off-screen but still rendered (NOT display:none or visibility:hidden — 
    // html2canvas needs the element to be painted)
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.zIndex = '1';
    tempContainer.style.opacity = '1';
    tempContainer.style.pointerEvents = 'none';

    document.body.appendChild(tempContainer);

    const opt = {
        margin: [0.4, 0.5, 0.4, 0.5] as [number, number, number, number],
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false,
            windowWidth: 816,
        },
        jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
        // Give the browser time to paint the container
        await new Promise(resolve => setTimeout(resolve, 300));
        await html2pdf().set(opt).from(tempContainer.firstElementChild as HTMLElement).save();
        console.log('[Export] PDF generated successfully');
        return true;
    } catch (e) {
        console.error('[Export] PDF generation failed:', e);
        alert('Failed to generate PDF. Please try again.');
        return false;
    } finally {
        if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
        }
    }
};

// ─── DOCX Export ────────────────────────────────────────────

/**
 * Generate Word document from TipTap HTML.
 * Uses html-docx-js-typescript to convert styled HTML into .docx format.
 */
export const generateDocx = async (htmlContent: string, filename: string): Promise<boolean> => {
    if (isContentEmpty(htmlContent)) {
        alert('Nothing to export — document is empty.');
        return false;
    }

    const cleanHtml = stripEditorClasses(htmlContent);

    // Build a complete HTML document that html-docx-js-typescript expects
    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${filename.replace('.docx', '')}</title>
            <style>
                body {
                    font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
                    font-size: 12pt;
                    line-height: 1.6;
                    color: #000000;
                    background-color: #ffffff;
                    margin: 0;
                    padding: 0;
                }
                p { margin: 0 0 10pt 0; }
                h1 { font-size: 24pt; font-weight: bold; margin: 0 0 12pt 0; color: #000; }
                h2 { font-size: 18pt; font-weight: bold; margin: 16pt 0 8pt 0; color: #000; }
                h3 { font-size: 14pt; font-weight: bold; margin: 14pt 0 6pt 0; color: #222; }
                ul, ol { margin: 0 0 12pt 0; padding-left: 24pt; }
                li { margin-bottom: 4pt; }
                blockquote { border-left: 3pt solid #cccccc; padding-left: 12pt; color: #555555; font-style: italic; margin: 10pt 0; }
                a { color: #0563C1; text-decoration: underline; }
                code { font-family: 'Courier New', monospace; background-color: #f5f5f5; padding: 1pt 3pt; }
                pre { font-family: 'Courier New', monospace; background-color: #f5f5f5; padding: 8pt; margin: 10pt 0; }
                strong { font-weight: bold; }
                em { font-style: italic; }
                u { text-decoration: underline; }
            </style>
        </head>
        <body>${cleanHtml}</body>
        </html>
    `;

    try {
        const blob = await asBlob(fullHtml, {
            orientation: 'portrait',
            margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch margins in twips
        }) as Blob;

        // Fallback: if asBlob returned an empty/tiny blob, save as .doc (HTML-based Word file)
        if (!blob || blob.size < 100) {
            console.warn('[Export] asBlob returned empty blob, falling back to HTML-based .doc');
            const fallbackBlob = new Blob([fullHtml], { type: 'application/msword' });
            saveAs(fallbackBlob, filename.replace(/\.docx$/i, '.doc'));
            alert('Exported as .doc format (Word-compatible). If you need .docx, please try again.');
            console.log('[Export] DOCX fallback (.doc) generated successfully');
            return true;
        }

        saveAs(blob, filename);
        console.log('[Export] DOCX generated successfully');
        return true;
    } catch (e) {
        console.error('[Export] DOCX generation failed:', e);
        // Ultimate fallback: save the styled HTML as .doc so the user always gets content
        try {
            const fallbackBlob = new Blob([fullHtml], { type: 'application/msword' });
            saveAs(fallbackBlob, filename.replace(/\.docx$/i, '.doc'));
            alert('Exported as .doc format (Word-compatible). If you need .docx, please try again.');
            console.log('[Export] DOCX fallback (.doc) generated after error');
            return true;
        } catch {
            alert('Failed to generate Word document. Please try again.');
            return false;
        }
    }
};

// ─── HTML Export ────────────────────────────────────────────

/**
 * Generate standalone HTML file from TipTap content.
 * Produces a clean, readable HTML document with embedded styles.
 */
export const generateHtml = (htmlContent: string, filename: string): boolean => {
    if (isContentEmpty(htmlContent)) {
        alert('Nothing to export — document is empty.');
        return false;
    }

    const cleanHtml = stripEditorClasses(htmlContent);
    const docTitle = filename.replace('.html', '').replace(/_/g, ' ');

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${docTitle}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 3rem 2rem;
            line-height: 1.7;
            color: #1a1a1a;
            background: #ffffff;
        }
        h1 { font-size: 2em; font-weight: 700; margin: 0 0 0.8em 0; color: #111; border-bottom: 2px solid #eee; padding-bottom: 0.4em; }
        h2 { font-size: 1.5em; font-weight: 700; margin: 1.5em 0 0.5em 0; color: #222; }
        h3 { font-size: 1.25em; font-weight: 600; margin: 1.2em 0 0.4em 0; color: #333; }
        p { margin: 0 0 1em 0; }
        ul, ol { margin: 0 0 1em 0; padding-left: 1.5em; }
        li { margin-bottom: 0.3em; }
        blockquote { border-left: 4px solid #d1d5db; padding: 0.5em 1em; color: #555; font-style: italic; margin: 1em 0; background: #fafafa; }
        a { color: #2563eb; text-decoration: underline; }
        code { background: #f3f4f6; padding: 0.15em 0.4em; border-radius: 3px; font-family: 'Consolas', monospace; font-size: 0.9em; }
        pre { background: #f3f4f6; padding: 1em; border-radius: 6px; overflow-x: auto; margin: 1em 0; }
        img { max-width: 100%; height: auto; }
        strong { font-weight: 700; }
        em { font-style: italic; }
    </style>
</head>
<body>
${cleanHtml}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    saveAs(blob, filename);
    console.log('[Export] HTML generated successfully');
    return true;
};

// ─── ZIP Export ─────────────────────────────────────────────

export const generateZip = async (documents: ExportDocument[], filename: string) => {
    const zip = new JSZip();

    documents.forEach(doc => {
        const safeTitle = doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled';
        const cleanContent = stripEditorClasses(doc.content);
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${doc.title}</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.7; color: #1a1a1a; }
    </style>
</head>
<body>
    <h1>${doc.title}</h1>
    ${cleanContent}
</body>
</html>`;
        zip.file(`${safeTitle}.html`, fullHtml);
    });

    try {
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, filename);
    } catch (e) {
        console.error('[Export] ZIP generation failed:', e);
        alert('Failed to generate ZIP archive.');
    }
};

// ─── Share System ───────────────────────────────────────────

export interface ShareOptions {
    title: string;
    text?: string;
    url: string;
}

/** Copy link to clipboard */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        // Fallback: textarea approach
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    } catch {
        return false;
    }
};

/** Share via WhatsApp */
export const shareToWhatsApp = (data: ShareOptions) => {
    const message = `${data.title}\n${data.url}`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
};

/** Share via Gmail */
export const shareViaGmail = (data: ShareOptions) => {
    const subject = encodeURIComponent(data.title);
    const body = encodeURIComponent(`${data.text || 'Check out this document'}\n\n${data.url}`);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
};

/** Share via email (mailto) */
export const shareViaEmail = (data: ShareOptions) => {
    const subject = encodeURIComponent(data.title);
    const body = encodeURIComponent(`${data.text || 'Check out this document'}\n\n${data.url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
};

/** Try native Web Share API (mobile-friendly) */
export const shareNative = async (data: ShareOptions): Promise<boolean> => {
    const shareData: ShareData = {
        title: data.title,
        text: data.text,
        url: data.url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData);
            return true;
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('[Share] Native share failed:', error);
            }
            return false;
        }
    }
    return false;
};

// Legacy compat wrapper — kept for any code that still calls shareContent
export const shareContent = async (data: { title: string; text?: string; url?: string; files?: File[] }) => {
    const url = data.url || window.location.href;
    const success = await shareNative({ title: data.title, text: data.text, url });
    if (!success) {
        const copied = await copyToClipboard(url);
        if (copied) {
            alert('Link copied to clipboard!');
        }
    }
    return success;
};
