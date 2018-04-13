(function() {
    angular
        .module('loc8rApp')
        .controller('aboutController', aboutController);

    function aboutController() {
        console.log('about controller');
        var vm = this;
        
        vm.pageHeader = {
            title: 'About Loc8r'
        };

        vm.main = {
            content: 'Loc8r was created to help people find places to sit down and get a bit of work done.\n\nIn the fictional universe of Star Trek, Starfleet Academy is where recruits to Starfleet\'s officer corps are trained. It was created in the year 2161, when the United Federation of Planets was founded. The Academy\'s motto is \"Ex astris, scientia\" – "From the stars, knowledge.\" This is derived from the Apollo 13 motto \"Ex luna, scientia\" – \"From the moon, knowledge.\" In turn, the Apollo 13 motto was inspired by \"Ex scientia, tridens,\" the motto of the United States Naval Academy, meaning \"From knowledge, seapower.\"'
        };
    }
})();