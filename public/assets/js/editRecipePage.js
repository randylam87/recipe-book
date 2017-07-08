



$(document).ready( function() {
    $(document).on('change', '.btn-file :file', function() {
    var input = $(this),
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [label]);
    });

    $('.btn-file :file').on('fileselect', function(event, label) {
        
        var input = $(this).parents('.input-group').find(':text'),
            log = label;
        
        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }
    
    });
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#img-upload').attr('src', e.target.result);
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imgInp").change(function(){
        readURL(this);
    });


    $("#add-ingredient").on("click", function(){
        $("#tr1").after("<tr><td><div class='input-group input-group-lg'><input type='text' class='form-control' placeholder='e.g. salt' aria-describedby='sizing-addon1'></div></td><td><div class='dropdown'><button class='btn btn-primary dropdown-toggle' id='units' data-toggle='dropdown'>Units <span class='caret'></span></button><ul class='dropdown-menu'><li class='dropdown-header'>Teaspoon</li><li class='text-center'>1</li><li class='dropdown-header'>Tablespoon</li><li class='text-center'>1</li><li class='dropdown-header'>Cups</li><li class='text-center'>1</li><li class='text-center'>2</li><li class='text-center'>3</li><li class='text-center'>4</li><li class='dropdown-header'>Quarts</li><li class='text-center'>1</li><li class='text-center'>2</li><li class='text-center'>3</li><li class='text-center'>4</li></ul></div></td></tr>");
    });

    $("#remove-ingredient").on("click", function(){
    })
});

