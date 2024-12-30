

const handler = (event: MouseEvent) => {
	// Check if the clicked element is a link
	const link = (event.target as Element).closest('a')
	if (!link) return

	const modifiers: ClickModifiers = {
			ctrl: event.ctrlKey,
			shift: event.shiftKey,
			alt: event.altKey,
			meta: event.metaKey,  // Command key on Mac
			button: event.button  // 0 for left click, 1 for middle click
	}	

	// Send the information to the service worker
	if (chrome.runtime) {
		chrome.runtime.sendMessage({
			type: 'LINK_CLICK',
			url: link.href,
			modifiers: modifiers
		})
	}
}

document.addEventListener('click', handler)
document.addEventListener('auxclick', handler)