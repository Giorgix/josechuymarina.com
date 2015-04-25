var weddingAppControllers = angular.module('weddingAppControllers', ['ui.bootstrap']);

weddingAppControllers.controller('collapseCtrl', function($scope) {
  $scope.isCollapsed = true;
})

weddingAppControllers.controller('rsvpCtrl', ['$scope', '$http', 'rsvpStorage','flash', 
    function($scope, $http, rsvpStorage, flash) {
      $scope.rsvps = [];
      $scope.sortField = '';
      $scope.langu = '';
      $scope.reverse = false;
      rsvpStorage.get()
                    .success(function(data) {
                      $scope.rsvps = data.reverse();
                    
                    })
                    .error(function(data) {
                      $scope.error = 'Error: ' + data;
                      console.log('Error: ' + data);
                    });


      $scope.addRsvp = function(form) {
        if(!$scope.firstName || !$scope.lastName || $scope.assistChoice === undefined){
          return;
        }
        if($scope.assistChoice == true) { 
          if($scope.busChoice === undefined || $scope.busChoice == '') {
            flash.to('rsvp-msg').error =  "¿Vienes andando?";
            return;
          }
        }
        if(!$scope.alergies) $scope.alergies = '';
        if(!$scope.kidsNumber) $scope.kidsNumber = 0;
        var newRsvp = {
          firstName: $scope.firstName.trim(),
          lastName: $scope.lastName.trim(),
          assist: $scope.assistChoice,
          busChoice: $scope.busChoice,
          kidsNumber: $scope.kidsNumber,
          alergies: $scope.alergies.trim()
        };
        console.log($scope.email);
        if($scope.email && $scope.email != '') {
          console.log($scope.email);
          newRsvp.email = $scope.email.trim();
        }
        
        rsvpStorage.post(newRsvp)
                      .success(function(data) {
                        $scope.firstName = '';
                        $scope.lastName = '';
                        $scope.email = '';
                        $scope.busChoice = '';
                        $scope.kidsNumber = '';
                        $scope.alergies = '';
                        $scope.rsvps = data;
                        
                        flash.to('rsvp-msg').success =  'Confirmación mandada! Gracias!';

                        form.$setPristine();
                        form.$setUntouched();
                      })
                      .error(function(data) {
                        flash.to('rsvp-msg').error =  'Error: ' + data;
                        console.log('Error: ' + data);
                      });
      }      

      $scope.getTotalKids = function() {
        var total = 0;
        for(var i = 0; i < $scope.rsvps.length; i++){
          var kidsNumber = $scope.rsvps[i].kidsNumber;
          total += kidsNumber;
        }
        return total; 
      }
      
      $scope.getTotalAssist = function() {
        var total = 0;
        for(var i = 0; i < $scope.rsvps.length; i++){
          if($scope.rsvps[i].assist == true) total += 1;
        }
        return total; 
      }
      
      $scope.getTotalNoAssist = function() {
        var total = 0;
        for(var i = 0; i < $scope.rsvps.length; i++){
          if($scope.rsvps[i].assist == false) total += 1;
        }
        return total; 
      }


      $scope.removeRsvp = function(itemId) {
        rsvpStorage.delete(itemId)
                      .success(function(data) {
                        $scope.rsvps = data;
                      })
                      .error(function(data) {
                        flash('danger', 'Error: ' + data);
                        console.log('Error: ' + data);
                      });        
      }
    
    }])

weddingAppControllers.controller('adviceCtrl', ['$scope', '$http', '$upload', '$timeout', 'adviceStorage','flash', 
    function($scope, $http, $upload, $timeout, adviceStorage, flash) {
      $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
      $scope.adviceList = [];
      $scope.limit = 3;
      $scope.langu = '';
      $scope.orderField = 'created.ISODate';
      adviceStorage.get()
                    .success(function(data) {
                      $scope.adviceList = data;
                    
                    })
                    .error(function(data) {
                      $scope.error = 'Error: ' + data;
                      console.log('Error: ' + data);
                    });
     
      $scope.generateThumb = function(file) {
        if (file != null) {
          if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            $timeout(function() {
              var fileReader = new FileReader();
              fileReader.readAsDataURL(file);
              fileReader.onload = function(e) {
                $timeout(function() {
                  file.dataUrl = e.target.result;
                });
              }
            });
          }
        }
      }
 
      $scope.addAdvice = function(form, files) {
        if(!$scope.name || !$scope.content){
          return;
        }

        if($scope.files && $scope.files.length) {
          $upload.upload({
            url: '/api/advice',
            file: $scope.files[0],
            fields: {
               name: $scope.name.trim(),
               content: $scope.content.trim(),
            }
          }).progress(function(evt) {
              $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total); 
          }).success(function(data) {
              $scope.name = '';
              $scope.content = '';
              $scope.adviceList = data;
              $scope.files = {};
              if($scope.langu === 'en') {
                flash.to('advice-msg').success =  'Advice sent!';
              } else {
                flash.to('advice-msg').success =  'Consejo mandado!';
              }
              form.$setPristine();
              form.$setUntouched();
            });

        } else {
          var newAdvice = {
            name: $scope.name.trim(),
            content: $scope.content.trim()
          };
          adviceStorage.post(newAdvice)
                        .success(function(data) {
                          $scope.name = '';
                          $scope.content = '';
                          $scope.adviceList = data;
                          if($scope.langu === 'en') {
                            flash.to('advice-msg').success =  'Advice sent!';
                          } else {
                            flash.to('advice-msg').success =  'Consejo mandado!';
                          }
                          form.$setPristine();
                          form.$setUntouched();
                        })
                        .error(function(data) {
                          flash.to('advice-msg').error =  'Error: ' + data;
                          console.log('Error: ' + data);
                        });
        }      
      }
      
      $scope.saveEditedAdvice = function(advice) {
        adviceStorage.patch(advice)
                     .success(function(data) {
                       $scope.adviceList = data;
                     })
                     .error(function(data) {
                       console.log('Error: ' + data);
                     })
      }


      $scope.removeAdvice = function(itemId) {
        adviceStorage.delete(itemId)
                      .success(function(data) {
                        $scope.adviceList = data;
                      })
                      .error(function(data) {
                        flash('danger', 'Error: ' + data);
                        console.log('Error: ' + data);
                      });        
      }
    
    }])

function youtube_parser(url){
  if(url != undefined) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[7].length==11){
      return match[7];
    } else {
      return 'URL Error';
    }
  }
}

weddingAppControllers.controller('musicCtrl', ['$scope', '$http', 'musicStorage','flash', 
    function($scope, $http, musicStorage, flash) {
      $scope.musicList = [];
      $scope.limit = 3;
      $scope.langu = 'en';
      $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      }
      musicStorage.get()
                    .success(function(data) {
                      $scope.musicList = data;
                    
                    })
                    .error(function(data) {
                      $scope.error = 'Error: ' + data;
                      console.log('Error: ' + data);
                    });


      $scope.addSong = function(form) {
        if(!$scope.name || !$scope.artist || !$scope.title){
          return;
        }
        if(youtube_parser($scope.videoUrl) === 'URL Error') {
          flash.to('music-msg').error =  'URL not valid';
          return;
        }
        var newSong = {
          name: $scope.name.trim(),
          artist: $scope.artist.trim(),
          title: $scope.title.trim(),
          videoID: youtube_parser($scope.videoUrl)
        };
        
        musicStorage.post(newSong)
                      .success(function(data) {
                        $scope.name = '';
                        $scope.artist = '';
                        $scope.title = '';
                        $scope.videoUrl = '';
                        $scope.musicList = data;
                        if($scope.langu === 'en') {
                          flash.to('music-msg').success =  'Song requested!';
                        } else {
                          flash.to('music-msg').success =  'Canción pedida!';
                        }
                        form.$setPristine();
                        form.$setUntouched();
                      })
                      .error(function(data) {
                        flash('danger', 'Error: ' + data);
                        flash.to('music-msg').error =  'Error: ' + data;
                        console.log('Error: ' + data);
                      });
      }      

      $scope.removeSong = function(itemId) {
        musicStorage.delete(itemId)
                      .success(function(data) {
                        $scope.musicList = data;
                      })
                      .error(function(data) {
                        flash('danger', 'Error: ' + data);
                        console.log('Error: ' + data);
                      });        
      }
    
}])

