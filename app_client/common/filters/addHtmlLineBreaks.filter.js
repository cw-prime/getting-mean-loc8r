(function() {
    angular
        .module('loc8rApp')
        .filter('addHtmlLineBreaks', addHtmlLineBreaks);

    function addHtmlLineBreaks() {
        return function(text) {
            var output;
            if (!text) {
                output = text;
            } else {
                output = text.replace(/\n/g, '<br/>');
            }
            return output;
        };
    }
})();