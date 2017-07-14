



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


    // $("#add-ingredient").on("click", function(){
    //     $("#tr1").after("<tr><td><div class='input-group input-group-lg'><input type='text' class='form-control' placeholder='e.g. salt' aria-describedby='sizing-addon1'></div></td><td><div class='dropdown'><select class='form-control' data-toggle='dropdown'><option value='0' disabled>Teaspoons</option><option value='1'>1 t</option><option value='0' disabled>Tablespoons</option><option value='1'>1 T</option><option value='0' disabled>Cups</option><option value='1'>1 C</option><option value='2'>2 C</option><option value='3'>3 C</option><option value='4'>4 C</option><option value='0' disabled>Quarts</option><option value='1'>1 Q</option><option value='2'>2 Q</option><option value='3'>3 Q</option><option value='4'>4 Q</option></select></div></td><td><input type='button' class='btnX' name='x' value='x' /></td></tr>");
    // });

    // $(".btnX").on("click", function(){
    //     $(this).parents("tr").remove();
    // });

    var i=1;
     $("#add_row").click(function(){
      $('#addr'+i).html("<td>"+ (i+1) +"</td><td><input  name='measurement' type='text' placeholder='e.g. 2 cups'  class='form-control input-md'></td><td><input  name='ingredientName' type='text' placeholder='e.g. Monteray Jack Cheese'  class='form-control input-md'></td>");

      $('#tableRecipe').append('<tr id="addr'+(i+1)+'"></tr>');
      i++; 
     });

     $("#delete_row").click(function(){
    	 if(i>1){
		 $("#addr"+(i-1)).html('');
		 i--;
		 }
	 });

    $("#save-recipe").on("click", function(){
        // saves the entire recipe page and sends data to database.
    });
});

// $('#new-step').on('click',function() {
//     let newInstruction = $(`<textarea name='recipeInstructions' class='form-control' required></textarea>`)
//     $('#instructions').append(newInstruction);
    
// });