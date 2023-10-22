const renderPage = (res, view, options = {}) => {
    res.render('layout', { content: view, ...options });
};

module.exports = { renderPage };
