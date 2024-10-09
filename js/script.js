function navigatePage(direction) {
    const currentScroll = window.scrollY;
    const sectionHeight = window.innerHeight;
    const section = Math.round(currentScroll / sectionHeight) + 1; // Get the current section (1, 2, or 3)

    let targetPage = '';
    if (direction === 'next') {
        if (window.location.pathname.includes('index')) {
            targetPage = 'page2.html';
        } else if (window.location.pathname.includes('page2')) {
            targetPage = 'page3.html';
        } else {
            targetPage = 'index.html';
        }
    } else if (direction === 'prev') {
        if (window.location.pathname.includes('page3')) {
            targetPage = 'page2.html';
        } else if (window.location.pathname.includes('page2')) {
            targetPage = 'index.html';
        } else {
            targetPage = 'page3.html';
        }
    }

    // Redirect to the target page and pass the section information in the URL
    window.location.href = `${targetPage}?section=${section}`;
}

// On page load, scroll to the correct section if the "section" parameter is present in the URL
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    if (section) {
        const sectionHeight = window.innerHeight;
        window.scrollTo(0, (section - 1) * sectionHeight);
    }
});