// Proxy the native HTML FileList object from an <input type="file"> element to
// a model value in the element's angular scope.  At a minimum, register the
// directive with the "file-model" attribute.  This attribute and others may
// have optional values for additional behaviour:
//
//   file-model="model.file"        # registers directive and optionally one-way binds File object to a model variable
//   file-name="model.name"         # one-way binds the File object's name property to a model variable
//   file-data-uri="model.dataUri"  # one-way binds the File object as a data: URI to a model variable
//
// Note that one-way binding in this context means the file input element
// updates the model variables but not vice versa.
//
// Loosely based on snippet from:
//   https://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
(function(){
  'use strict';

  angular
    .module('file-model', [])
    .directive('fileModel', directive);

  directive.$inject = ['$parse', '$log'];

  function directive($parse, $log) {
    return {
      restrict: 'A',
      link: function (elementScope, element, attrs, ctrl) {
        var fileModel       = $parse(attrs.fileModel);
        var nameModel       = $parse(attrs.fileName);
        var uriModel        = $parse(attrs.fileDataUri);
        var fileModelSetter = fileModel.assign;
        var nameModelSetter = nameModel.assign;
        var uriModelSetter  = uriModel.assign;

        if (!fileModelSetter && !nameModelSetter && !uriModelSetter) {
          $log.error("<input file-model> without binding a model to any supported attribute is useless; ignoring this element");
          return;
        }

        if ('multiple' in attrs)
          $log.warn("<input file-model> doesn't support the 'multiple' attribute; using the first file");

        element.bind('change', function(){
          var file = element[0].files[0];

          function updateModel(scope, dataUri) {
            if (fileModelSetter)
              fileModelSetter(scope, file);
            if (nameModelSetter)
              nameModelSetter(scope, file ? file.name : null);
            if (uriModelSetter)
              uriModelSetter(scope, dataUri);
          }

          if (uriModelSetter && file) {
            // Read the file as a data: URI and then set the model only on success
            var reader = new FileReader();
            reader.onloadend = function(){
              var dataUri = this.result;
              elementScope.$apply(function(scope){
                updateModel(scope, dataUri);
              });
            };
            reader.onerror = function(){
              $log.error("Error reading file upload: ", this.error);
            };
            reader.readAsDataURL(file);
          } else {
            // No need to read the File object
            elementScope.$apply(updateModel);
          }
        });
      }
    };
  }

})();
