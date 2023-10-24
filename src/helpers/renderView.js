const renderView = (res, view, options = {}) => {
    res.render('layout', { content: view, ...options});
}

module.exports = { renderView };