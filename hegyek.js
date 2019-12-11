"use strict";

let hegyek = [];
let app = angular.module('myApp', []);

app.controller('myCtrl', ['$scope', '$http', function($scope, $http){
    $http.get('hegyekMo.txt')
    .then(function(response){
        $scope.szummamagassag = 0;
        $scope.legmagasabbhegynNev = "";
        $scope.legmagasabbhegyCsucs = "";
        $scope.legmagasabbhegyHegyseg = "";
        $scope.legmagasabbhegyMagassag = "";
        $scope.adatok = response.data;
        $scope.tomb = $scope.adatok.split('\n');
        for (let i = 1; i < $scope.tomb.length; i++) { 
            hegyek.push({
                'hegycsucs' : $scope.tomb[i].split(';')[0],
                'hegy' : $scope.tomb[i].split(';')[1],
                'magassag' : $scope.tomb[i].split(';')[2],
            });
            let magassag = Number($scope.tomb[i].split(';')[2]);
            $scope.szummamagassag += Number($scope.tomb[i].split(';')[2]);
            if ($scope.legmagasabbhegyMagassag < magassag) {
                $scope.legmagasabbhegyMagassag = magassag;
                $scope.legmagasabbhegynNev =  $scope.tomb[i].split(';')[0];
                $scope.legmagasabbhegyHegyseg = $scope.tomb[i].split(';')[1];
            }
        }
        $scope.darabszam = hegyek.length;
        $scope.atlagmagassag = $scope.szummamagassag / $scope.darabszam;

        let magasabbMint3000Lab = 0;

        for (let j = 1; j < hegyek.length; j++) {
            let labMagassag = Number(hegyek[j].magassag) * 3.28089895;
            if (labMagassag >= 3000) {
                magasabbMint3000Lab++;
            }
        }
        $scope.lab = magasabbMint3000Lab;

        $scope.hegyStatisztika = [];
        $scope.hegyStatisztika.push({
            'nev' : hegyek[0].hegy,
            'elemszam' : 1,
        });
        for (let k = 1; k < hegyek.length; k++) {
            let vane = false;
            for (let m = 0; m < $scope.hegyStatisztika.length; m++) {
                if (hegyek[k].hegy == $scope.hegyStatisztika[m].nev) {
                    $scope.hegyStatisztika[m].elemszam++;
                    vane = true;
                }
            }
            if (!vane) {
                $scope.hegyStatisztika.push({
                    'nev' : hegyek[k].hegy,
                    'elemszam' : 1,
                })
            }   
        }
    });
}]);

app.controller('myControl', ['$scope', function($scope){
    $scope.leker = function(){
    let magassag = document.getElementById('magassag').value;
    
    let vane = false;
    for (let i = 0; i < hegyek.length; i++) {
        if (hegyek[i].hegy == "Börzsöny" && Number(hegyek[i].magassag) > magassag) {
            vane = true;
            break;
        }
    }
    $scope.kiir = (vane ? `Van ${magassag}m-nél magasabb hegycsúcs a Börzsönyben` : `Nincs ${magassag}m-nél magasabb hegycsúcs a Börzsönyben`);   
    }  
}]);