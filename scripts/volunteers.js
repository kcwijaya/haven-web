
$(document).ready(function(){
  $('#volunteers').DataTable(
      {
        dom: '<"top"B<"space"l>f>rt<"bottom"ip>',
        buttons: [
            'copy', 'csv', 'excel', 'pdf'
        ],
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
      }
  );

});

      