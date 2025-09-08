/**
 * Creates a programmatic link click to avoid Safari blocking window.open()
 * This is more reliable than window.open() and works consistently across all browsers
 */
export function createProgrammaticLink(url: string, target: string = '_blank'): void {
	// Create a temporary link element
	const link = document.createElement('a');
	link.href = url;
	link.target = target;
	link.rel = 'noopener noreferrer';

	// Add to DOM temporarily (required for some browsers)
	document.body.appendChild(link);

	// Programmatically click the link
	link.click();

	// Clean up - remove the temporary link
	document.body.removeChild(link);
}
