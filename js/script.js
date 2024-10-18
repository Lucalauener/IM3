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

    // Create a new container for the incoming page
    const newPage = document.createElement('div');
    newPage.classList.add('page', 'page-slide-in-over');
    document.body.appendChild(newPage);

    // Load the new page content into the container
    newPage.innerHTML = `<iframe src="${targetPage}?section=${section}" style="width:100%; height:100%; border:none;"></iframe>`;
}

// When the page loads, apply the slide-in animation
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const section = parseInt(params.get('section')) || 1;
    const sectionHeight = window.innerHeight;

    // Scroll to the saved section position
    window.scrollTo(0, (section - 1) * sectionHeight);
});
