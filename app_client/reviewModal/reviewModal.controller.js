(function(){
    angular
        .module('loc8rApp')
        .controller('reviewModalController', reviewModalController);

    reviewModalController.$inject = ['$uibModalInstance', 'loc8rData', 'locationData']
    function reviewModalController($uibModalInstance, loc8rData, locationData) {
        var vm = this;
        vm.locationData = locationData;

        vm.onSubmit = function() {
            vm.formError = "";
            if (!vm.formData.rating || !vm.formData.reviewText) {
                vm.formError = "All fields are required, please try again";
                return false;
            } else {
                vm.doAddReview(vm.locationData.locationId, vm.formData);
            }
        };

        vm.doAddReview = function(locationId, formData) {
            loc8rData.addReviewByLocationId(locationId, {
                rating: formData.rating,
                reviewText: formData.reviewText
            })
                .then(function successCallback(response) {
                    console.log(JSON.stringify(response));
                    vm.modal.close(response.data);
                }, function errorCallback(errorResponse) {
                    console.log(JSON.stringify(errorResponse));
                    vm.formError = "Your review has not been saved, try again";
                });

            return false;
        };

        vm.modal = {
            close: function(result) {
                $uibModalInstance.close(result);
            },
            cancel: function() {
                console.log('dismissed');
                $uibModalInstance.dismiss('cancel');
            }
        };
    }
})();