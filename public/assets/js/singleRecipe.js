$(document).ready(function () {
    let makeRows = () => {
        let currentRows = $(".ingredientRow").length - 1;
        let tableRow = $('<tr class="ingredientRow">');
        tableRow.append("<td>" + (currentRows + 2) + "</td>");
        tableRow.append('<td><input type="text" name="measurement" placeholder="e.g. 2 cups"  class="form-control" required/></td>');
        tableRow.append('<td><input type="text" name="ingredientName" placeholder="e.g. chopped onions" class="form-control" required/></td>');
        $(".ingredientsTable").append(tableRow);
    };

    let deleteRows = () => {
        let currentRows = $(".ingredientRow").length - 1;
        if (currentRows + 1 > 1) {
            $($(".ingredientRow")[currentRows]).remove();
        }
    };

    $("#add_row").click(function () {
        makeRows();
    });

    $("#delete_row").click(function () {
        deleteRows();
    });

});
