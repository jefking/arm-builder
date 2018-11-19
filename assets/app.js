'use strict';

var libraryApp = angular.module('libraryApp'
    , ['ApplicationInsightsModule']
);

libraryApp.config(function ($routeProvider, $locationProvider, applicationInsightsServiceProvider) {
    applicationInsightsServiceProvider.configure('ce23aecf-911b-4d57-b023-c7e0b4dafdc8', { appName: 'serverless-library' });
});

libraryApp.controller('arm', ['$scope', '$http', function ($scope, $http) {
    require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' } });

    $http.get('assets/data/arm-input.js').success(function (data) {
        $scope.data = data;

        require(['vs/editor/editor.main'], function () {
            $scope.editor = monaco.editor.create(document.getElementById('container'), {
                value: JSON.stringify(data, null, 2),
                language: 'json',
                readOnly: true
            });
        });
    });

    $scope.urlChange = function () {
        $scope.editor.setValue(JSON.stringify($scope.data, null, 2));
    };
}]);