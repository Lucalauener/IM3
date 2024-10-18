function navigatePage(direction) {
    const currentPage = window.location.pathname;
    const currentScroll = window.scrollY;
    const sectionHeight = window.innerHeight;
    const section = Math.round(currentScroll / sectionHeight) + 1;

    let targetPage = '';

    if (direction === 'next') {
        if (currentPage.includes('index')) {
            targetPage = 'page2.html';
        } else if (currentPage.includes('page2')) {
            targetPage = 'page3.html';
        } else {
            targetPage = 'index.html';
        }
    } else if (direction === 'prev') {
        if (currentPage.includes('page3')) {
            targetPage = 'page2.html';
        } else if (currentPage.includes('page2')) {
            targetPage = 'index.html';
        } else {
            targetPage = 'page3.html';
        }
    }

    // Navigate to the target page directly
    window.location.href = `${targetPage}?section=${section}`;
}

// When the page loads, apply the slide-in animation
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const section = parseInt(params.get('section')) || 1;
    const sectionHeight = window.innerHeight;

    // Scroll to the saved section position
    window.scrollTo(0, (section - 1) * sectionHeight);

    // Add slide-in animation
    document.querySelector('.page').classList.add('page-slide-in');
});