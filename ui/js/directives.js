'use strict';

/* Directives */
treeherder.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});

treeherder.directive('thJobButton', function (thResultStatusInfo) {

    var getHoverText = function(job) {
        var duration = Math.round((job.end_timestamp - job.submit_timestamp) / 60);
        var status = job.result;
        if (job.state != "completed") {
            status = job.state;
        }
        return job.job_type_name + " - " + status + " - " + duration + "mins";
    };

    return {
        restrict: "E",
        link: function(scope, element, attrs) {
            var resultState = scope.job.result;
            if (scope.job.state != "completed") {
                resultState = scope.job.state;
            }
            scope.job.display = thResultStatusInfo(resultState);
            scope.hoverText = getHoverText(scope.job);
        },
        templateUrl: 'partials/thJobButton.html'
    };


});


// allow an input on a form to request focus when the value it sets in its
// ``focus-me`` directive is true.  You can set ``focus-me="focusInput"`` and
// when ``$scope.focusInput`` changes to true, it will request focus on
// the element with this directive.
treeherder.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusMe, function(value) {
        if(value === true) {
          $timeout(function() {
            element[0].focus();
            scope[attrs.focusMe] = false;
          }, 0);
        }
      });
    }
  };
});

treeherder.directive('thStar', function ($parse, thStarTypes) {
    return {
        scope: {
            starId: "="
        },
        link: function(scope, element, attrs) {
            scope.$watch('starId', function(newVal) {
                if (newVal !== undefined) {
                    scope.starType = thStarTypes[newVal];
                    scope.badgeColorClass=scope.starType.star;
                    scope.hoverText=scope.starType.name;
                }
            });
        },
        template: '<span class="label {{ badgeColorClass}}" ' +
                        'title="{{ hoverText }}">' +
                        '<i class="glyphicon glyphicon-star-empty"></i>' +
                        '</span>'
    };
});

treeherder.directive('thShowJobs', function ($parse, thResultStatusInfo) {
    return {
        link: function(scope, element, attrs) {
            scope.$watch('resultSeverity', function(newVal) {
                if (newVal) {
                    var rsInfo = thResultStatusInfo(newVal)
                    scope.resultsetStateBtn = rsInfo.btnClass;
                    scope.icon = rsInfo.showButtonIcon;
                }
            });
        },
        template: '<a class="btn {{ resultsetStateBtn }} th-show-jobs-button pull-left" ' +
                       'ng-click="isCollapsedResults = !isCollapsedResults">' +
                       '<i class="{{ icon }}"></i> ' +
                       '{{ \' jobs\' | showOrHide:isCollapsedResults }}</a>'
    };
});

treeherder.directive('thRevision', function($parse) {

    return {
        restrict: "E",
        link: function(scope, element, attrs) {
            scope.revisionUrl = scope.currentRepo.url + "/rev/" + scope.revision.revision;
        },
        templateUrl: 'partials/thRevision.html'
    };
});


treeherder.directive('resizablePanel', function($document, $log) {
    return {
        restrict: "E",
        link: function(scope, element, attr) {
            var startY = 0
            var container = $(element.parent());

            element.css({
                position: 'absolute',
                cursor:'row-resize',
                top:'-2px',
                width: '100%',
                height: '5px',
                'z-index': '100'

            });

            element.on('mousedown', function(event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                $log.log(event.pageY)
                startY = event.pageY;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                $log.log('mousemove');
                var y = startY - event.pageY;
                startY = event.pageY;
                container.height(container.height() + y);

            }

            function mouseup() {
                $log.log('mouseup');
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);

            }

        }
    };
});

