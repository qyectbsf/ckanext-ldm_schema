ckan.module('umls-autocomplete', function ($, _) {
  return {
    initialize: function () {
      var el = this.el; // The keyword input field

      // Ensure the script is actually loaded
      console.log("UMLS Autocomplete initialized on:", el);

      // jQuery UI Autocomplete is built into CKAN
      el.autocomplete({
        source: function(request, response) {
          $.ajax({
            url: '/api/umls/search',
            data: { q: request.term },
            success: function(data) {
              response(data);
            }
          });
        },
        minLength: 3, // Start searching after 3 characters
        select: function(event, ui) {
          // 1. Set the keyword field to the human-readable text
          el.val(ui.item.value);
          
          // 2. Find the adjacent UMLS CUI field in the same repeating row
          // We look up the DOM tree to the parent container, then find the target class
          var parentContainer = el.closest('fieldset, .form-group, .control-group');
          var cuiField = parentContainer.find('.umls-cui-target');
          
          if (cuiField.length) {
            cuiField.val(ui.item.cui);
          } else {
            console.error("Could not find the CUI target field!");
          }
          
          return false; // Prevent default action
        }
      });
    }
  };
});
