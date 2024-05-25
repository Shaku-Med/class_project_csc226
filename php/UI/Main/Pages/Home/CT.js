const replaceURLsWithLinks = (html) => {
    const regex = /&(amp|lt|gt|quot|apos);|(https?:\/\/[^\s'"]+)|(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b)|(\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b)|(\n)|(<([^>]+)>)/g;
    return html.replace(regex, (match, entity, url, email, phone, newline, tag) => {
        if (entity) {
            const entities = {
                'amp': '&',
                'lt': '<',
                'gt': '>',
                'quot': '"',
                'apos': "'"
            };
            return entities[entity];
        } else if (url) {
            return `<a href='${url}' target='_blank' rel='noopener noreferrer' class='link link-primary'>${url}</a>`;
        } else if (email) {
            return `<a href='mailto:${email}' target='_blank' rel='noopener noreferrer' class='link link-primary'>${email}</a>`;
        } else if (phone) {
            return `<a href='tel:${phone}' target='_blank' rel='noopener noreferrer' class='link link-primary'>${phone}</a>`;
        } else if (newline) {
            return '<br>';
        } else if (tag) {
            const innerText = tag.replace(/<[^>]*>?/gm, '');
            return innerText;
        }
        return match;
    });
};

const TextWithLinks = ({ text }) => {

    let detectHTML = (tx) => {
        var htmlPattern = /<[^>]*>/g;
        // var cleanText = tx.replace(htmlPattern, '');
        // return cleanText;
        return tx.match(htmlPattern) ? true : false;
    };

    const createMarkup = (html) => {
        const cleanHTML = DOMPurify.sanitize(replaceURLsWithLinks(html));
        return { __html: cleanHTML };
    };

    return (
        <>
            {
                detectHTML(text) ?
                    <>{text}</> :
                    <div dangerouslySetInnerHTML={createMarkup(text)} />
            }
        </>
    );
};