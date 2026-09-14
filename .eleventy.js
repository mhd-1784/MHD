module.exports = function(eleventyConfig) {
    // Pass through static files
    eleventyConfig.addPassthroughCopy("src/_redirects");
    eleventyConfig.addPassthroughCopy("src/styles.css");
    eleventyConfig.addPassthroughCopy("src/script.js");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addPassthroughCopy("src/netlify");

    // Create a collection of articles sorted by date (newest first)
    eleventyConfig.addCollection("articles", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/articles/*.md")
            .sort((a, b) => b.date - a.date);
    });

    // Create a collection of gallery images sorted by date (newest first)
    eleventyConfig.addCollection("galleryImages", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/gallery-images/*.md")
            .sort((a, b) => b.date - a.date);
    });

    // Create a collection of events sorted by start date (soonest first), excluding past events
    eleventyConfig.addCollection("events", function(collectionApi) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return collectionApi.getFilteredByGlob("src/events/*.md")
            .filter(event => {
                const endDate = new Date(event.data.endDate || event.data.startDate);
                return endDate >= now;
            })
            .sort((a, b) => new Date(a.data.startDate) - new Date(b.data.startDate));
    });

    // Date formatting filter
    eleventyConfig.addFilter("dateFormat", function(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-GB', options);
    });

    // Excerpt filter (first 150 chars of content)
    eleventyConfig.addFilter("excerpt", function(content) {
        if (!content) return '';
        const text = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    });

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            data: "_data"
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk"
    };
};
