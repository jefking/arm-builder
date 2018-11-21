'use strict';

var libraryApp = angular.module('libraryApp',
    []
);

libraryApp.controller('arm', ['$scope', '$http', function ($scope, $http) {
    require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' } });

    $http.get('assets/arm-input.js').success(function (data) {
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