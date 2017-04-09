$(document).ready(function () {
	load();
    var info=[];
	
	var rowCount = 0;
    /*******************************************************************************************************************************************
    
                                         OUR FUNCTIONS made by Marwan Tammam & Muhammed Essam
    
    *******************************************************************************************************************************************/
	var archive=0 , completed=0, inprogress=0 ;
    var editedRow = -1;
    //dummy inputs
    /*add("Task18", "2016-04-14", "This is the description for this task.");
	add("Task2", "2016-04-11", "This is the description for this task.");
	add("Task3", "2016-04-01", "This is the description for this task.");*/
	// delete all button they want it to appear if at least 1 check box is checked so we will hide it at the beginning
    $("#deleteAll").hide();
    showAndHide("tr.completed , tr.inProgress","tr.archive");
	// add function
	function add(title, date, description) {
		//load();
        description = description.split("\n").join("<br/>");
		rowCount++;
        info.push({
            name : title,
            time : date,
            data : description,
            status : 1
                  });
		//updateArray();
		var newRow="";
		newRow += "<tr class=\"inProgress\">";
		newRow += "  <td>";
		newRow += "    <div class=\"checkbox\">";
		newRow += "      <label><input type=\"checkbox\" value=\"\"><\/label>";
		newRow += "    <\/div>";
		newRow += "  <\/td>";
		newRow += "  <td><time>";
	newRow += date;
		newRow += "  <\/time><\/td>";
		newRow += "  <td class=\"viewDetails\" data-toggle=\"collapse\" data-parent=\".accordion\" href=\"#collapse";
	newRow += rowCount;
		newRow += "\">";
		newRow += "    <div class=\"accordion\">";
		newRow += "      <div class=\"panel\">";
		newRow += "        <div class=\"panel-heading\">";
		newRow += "          <h4 class=\"panel-title\"><a>";
	newRow += title;
		newRow += "          <\/a><\/h4>";
		newRow += "	<\/div>";
		newRow += "        <div id=\"collapse"
	newRow += rowCount;
		newRow += "\" class=\"panel-collapse collapse \">";
		newRow += "          <div class=\"panel-body\">    ";
	newRow += description;
		newRow += "          <\/div>";
		newRow += "        <\/div>";
		newRow += "      <\/div>";
		newRow += "    <\/div>";
		newRow += "  <\/td>";
		newRow += "  <td align=\"right\">";
		newRow += "    <div class=\"dropdown\">";
		newRow += "      <button class=\"btn btn-primary dropdown-toggle\" style=\"display: none\" type=\"button\" data-toggle=\"dropdown\">";
		newRow += "      <span class=\"caret\"><\/span><\/button>";
		newRow += "      <ul class=\"dropdown-menu\">";
		newRow += "        <li id=\"edit\" data-toggle=\"modal\" data-target=\"#myModal\"><a href=\"#\" >Edit<\/a><\/li>";
		newRow += "        <li id=\"completed\"><a href=\"#\">Set as completed<\/a><\/li>";
		newRow += "        <li id=\"remove\"><a href=\"#\">Remove<\/a><\/li>";
		newRow += "        <li id=\"archive\"><a href=\"#\">Archive<\/a><\/li>";
        newRow += "        <li id=\"inProgress\"><a href=\"#\">Set as In Progress<\/a><\/li>";
		newRow += "      <\/ul>";
		newRow += "    <\/div>";
		newRow += "  <\/td>";
		newRow += "<\/tr>";

        inprogress++;
	    $("#table").append(newRow);
        $("#table").find("tr:last>").find("ul>li#inProgress").hide();
        
        updateBadges();
	}
	
	function updateArray() {
		var dat = null;
		var name = $("#username").text();
		if (info.length > 0){
			dat = { tasks: info, name: name };
		}
		else {
			dat = {tasks: "null", name: name };
		}
		$.ajax({
			type: 'POST',
			data: dat,
			url: '/ajaxRequest2',
			success: function(data) {
						//console.log('success');
						//alert(data);
					}	
		});
		
        
	}
	
	function load(){
		
    $.ajax({
        type: 'POST',
        url: '/ajaxRequest',
		success: function(data) {	
					info = data[0];
					$("#username").text($("#username").text() + data[1]);
					for (var k = 0, LENGTH = info.length; k < LENGTH; k++) {	
						add(info[k].name, info[k].time, info[k].data);
						var row = $("table tbody").find("tr:last")
						if (info[k].status == 1){
							row.addClass("inProgress");
							row.find("ul>li#completed").show();
							row.find("ul>li#archive").show();
							row.find("ul>li#inProgress").hide();
						}
						else if (info[k].status == 2){
							row.removeClass("inProgress");
							row.addClass("completed");
							row.addClass("done");
							inprogress--;
							completed++;
							row.find("ul>li#completed").hide();
							row.find("ul>li#archive").show();
							row.find("ul>li#inProgress").show();
						}
						else if (info[k].status == 3){
							row.removeClass("inProgress");
							row.addClass("archive");
							inprogress--;
							archive++;
							row.find("ul>li#archive").hide();
							row.find("ul>li#completed").show();
							row.find("ul>li#inProgress").show();
						}
						info.pop();
						
					}
					updateArray();
					updateBadges();
					$("li:eq(1)").click();
					$("#menu").click();
                }			
          });
    }
    $("#logout").click(function(e){
        //e.preventDefault();
		$('#logoutform').unbind('submit');
		$("#logoutform").submit();
    });
    function updateBadges(){
        $("#ALL-B").text(inprogress + completed);
        $("#C-B").text(completed);
        $("#A-B").text(archive);
        $("#P-B").text(inprogress);
        //updateArray();
        
    }

	// adding a task 
	$("#newTask").click(function(){
        if ($('#title').val() != "") {
            if (editedRow == -1) {
    		    add($('#title').val(), $('#date').val(), $('#details').val());
                $("li:eq(1)").click();
                $("#menu").click();
            }
            else {
                info[editedRow].name=$('#title').val();
                info[editedRow].data=$('#details').val();
                info[editedRow].time=$('#date').val();
                var currentRow = $('#table tr').eq(editedRow+1);
                currentRow.find("td:eq(2) a").text($('#title').val());
                currentRow.find("td:eq(1) time").text($('#date').val());
                currentRow.find("td:eq(2) .panel-body").html($('#details').val().split("\n").join("<br/>"));
                editedRow = -1;
            }
            $('#myModal').modal('toggle');
			updateArray();			
        } 
        
	});
	// remove an element from tasks using the button in the table row
    $("#table").on('click','#remove',function(e){
        e.preventDefault();
        if (confirm("Are you sure you want to delete this item ?!") == true) {
            if($(this).closest("tr").hasClass("inProgress")){
                info.splice($(this).closest("tr").index(), 1);
                inprogress--;
            }
            else if ($(this).closest("tr").hasClass("archive")){
                info.splice($(this).closest("tr").index(), 1);
                archive--;
            }
            else{
                info.splice($(this).closest("tr").index(), 1);
                completed--;
            }
            $(this).closest("tr").remove(); 
        }
        updateBadges();
        updateArray();
        
        
    });
    // when selecting set as completed the class would change to completed
    $("#table").on('click','#completed',function(e){
        e.preventDefault();
        var row = $(this).closest("tr");
        if(row.hasClass("archive")){
            archive--;
        }
        else if (row.hasClass("inProgress")){
            inprogress--;
        }

        if ($("h1").text() != "COMPLETED" && $("h1").text() != "ALL TASKS")
           {
               row.hide();
           }

        info[row.index()].status= 2;
        updateArray();
        row.removeClass("archive");
        row.removeClass("inProgress");
        row.addClass("completed");
        row.toggleClass("done");
        row.find("ul>li#completed").hide();
        row.find("ul>li#archive").show();
        row.find("ul>li#inProgress").show();
        completed++;

        updateBadges();
    });
    // when selecting archive the class would change to archive 
    $("#table").on('click','#archive',function(e){
        e.preventDefault();
        row = $(this).closest("tr"); 
        if(row.hasClass("completed")){
            completed--;
            row.removeClass("done");
        }
        else if (row.hasClass("inProgress")){
            inprogress--;
        }

        if ($("h1").text() != "ARCHIVE")
            row.hide();

        info[row.index()].status= 3;
        row.removeClass("inProgress");
        row.removeClass("completed");
        row.addClass("archive");
        archive++;
        row.find("ul>li#completed").show();
        row.find("ul>li#inProgress").show();
        row.find("ul>li#archive").hide(); 

        updateBadges();
        updateArray();
    });
    $("#table").on('click','#inProgress',function(e){
        e.preventDefault();
        row = $(this).closest("tr"); 
        if(row.hasClass("completed")){
            completed--;
            //$("#sidebar-wrapper").filter("li:eq(2)").has("span").text(completed);
            row.removeClass("done");
        }
        else if (row.hasClass("archive")){
            archive--;
            //$("#sidebar-wrapper .sidebar-nav").filter("li:eq(3)").has("span").text(inprogress);
        }

        if ($("h1").text() != "IN PROGRESS" && $("h1").text() != "ALL TASKS")
            row.hide();

        info[row.index()].status= 1;
        row.addClass("inProgress");
        row.removeClass("completed");
        row.removeClass("archive");
        inprogress++;
        row.find("ul>li#completed").show();
        row.find("ul>li#inProgress").hide();
        row.find("ul>li#archive").show(); 
        
        updateBadges();
        updateArray();
    });

     $("#table").on('click','#edit',function(e){
        e.preventDefault();
        var currentRow = $(this).closest("tr");
        $('#title').val(currentRow.find("td:eq(2) a").text().trim()) ;
        $('#date').val(currentRow.find("td:eq(1) time").text().trim()) ;
        $('#details').val(currentRow.find("td:eq(2) .panel-body").text().trim());
        editedRow = currentRow.index();
         
     updateArray();
    });
    // when mouse be on the table row
	$("#table").on('mouseenter','tr',function(){

		var id = $(this).closest("tr").find('button');
			id.show();
        
		});
    //when mouse leaves the table row
    $("#table").on('mouseleave','tr',function(){
			var id = $(this).closest("tr").find('button');
            id.hide();

	});
    // slider when we chosse all tasks
    $("#sidebar-wrapper").on("click","li:eq(1)",function(e){
        e.preventDefault();
        $("#menu").click();
        $("table").find("input[type=checkbox]").each(function(){ 
            this.checked = false;
        });
        $("#deleteAll").hide();
        $("#addNewTask").show();
        $("h1").text("ALL TASKS");
        showAndHide("tr.completed , tr.inProgress","tr.archive");

    });
    // when we chosse completed
    $("#sidebar-wrapper").on("click","li:eq(2)",function(e){
        e.preventDefault();
        $("#menu").click();
        $("table").find("input[type=checkbox]").each(function(){ 
            this.checked = false;
        });
        $("#deleteAll").hide();
        $("#addNewTask").show();
        $("h1").text("COMPLETED");
        showAndHide("tr.completed","tr.inProgress , tr.archive");
    
    }); 
    // when we chosse in progress
    $("#sidebar-wrapper").on("click","li:eq(3)",function(e){
        e.preventDefault();
        $("#menu").click();
        $("table").find("input[type=checkbox]").each(function(){ 
            this.checked = false;
        });
        $("#deleteAll").hide();
        $("#addNewTask").show();
        $("h1").text("IN PROGRESS");
        showAndHide("tr.inProgress","tr.completed , tr.archive");

    });
    // when we choose archive
    $("#sidebar-wrapper").on("click","li:eq(4)",function(e){
        e.preventDefault();
        $("#menu").click();
        $("table").find("input[type=checkbox]").each(function(){ 
            this.checked = false;
        });
        $("#deleteAll").hide();
        $("#addNewTask").show();
        $("h1").text("ARCHIVE");  
        showAndHide("tr.archive","tr.completed , tr.inProgress");
  
    });
    function showAndHide(show,hide){
    $("table").find(show).each(function(){
            $(this).show(); 
        });
        $("table").find(hide).each(function(){
            $(this).hide(); 
        }); 
    }
    $("#table").on('click',"input[type='checkbox']",function(){

        if($('tbody').find("input[type='checkbox']:checked").length > 0){
                $("#deleteAll").show();
                $("#addNewTask").hide();
        }else{
                 $("#deleteAll").hide();
                 $("#addNewTask").show();

        }
    });
      $("#deleteSelected").click(function(){
        
            $("tbody").find("input[type=checkbox]:checked").each(function(){ 
                if ($(this).closest("tr").is(":visible")){
                    if($(this).closest("tr").hasClass("inProgress")){
                        removeFromArray($(this).closest("tr").find("h4").text().trim() ,1);
                        inprogress--;
                    }
                    else if ($(this).closest("tr").hasClass("archive")){
                        archive--;
                        removeFromArray($(this).closest("tr").find("h4").text().trim() ,3);
                    }
                    else {
                        removeFromArray($(this).closest("tr").find("h4").text().trim() ,2);
                        completed--;
                    }

                    $(this).closest("tr").remove();
                }
            });
            updateBadges();

            $("table").find("input[type=checkbox]").each(function(){ 
                this.checked = false;
            });
              $("#deleteAll").hide();
          updateArray();
        $("#addNewTask").show();
    });

    $("#selectAll").on("click", function(){
        if ($('tbody').find("tr:visible").length > 0)
            {
            var t = this.checked;
            $("tbody").find("input[type=checkbox]").each(function(){ 
                this.checked = t;
            });
        }

    });

    // clear contents of newTask model
    $("#addNewTask").on("click", function(){
        $('#title').val("");
        $('#date').val("") ;
        $('#details').val("");
    });
    $("#cancel").on("click", function(){
        editedRow = -1;
    });


    function search(sender){
        // determine symbol we're searching for
        var query = sender;

        // iterate over each row in the table
        $('#table tbody tr').each(function(e) {
 
            // check if the symbol cell contains the query
            if (!query || $(this).find("td:eq(2) a").text().trim().toLowerCase().indexOf(query) > -1)
            {
                if ($("h1").text() == "ARCHIVE" && $(this).hasClass("archive")){
                    $(this).show();
                }
                else if ($("h1").text() == "ALL TASKS" && !$(this).hasClass("archive")){
                    $(this).show();
                }
                else if ($("h1").text() == "COMPLETED" && $(this).hasClass("completed")){
                    $(this).show();
                }
                else if ($("h1").text() == "IN PROGRESS" && $(this).hasClass("inProgress")){
                    $(this).show();
                }
            }
            // no match, so hide row
            else
                $(this).hide();
        });
    }
    function removeFromArray(name , status){
            for(var i =0;i<info.length;i++){
                    if(info[i].status == status){
                            if(info[i].name == name/*$(this).closest("tr").find("h4").text().trim()*/){
                                info.splice(i, 1);
                            }
                        }
                    }
    }

    $("form").submit(function(e){
        e.preventDefault();
    });

    // search tasks
    $('#search').on('keyup', function() {
        search($(this).val());
        
    });
    $("#clearSearch").on("click", function(){
        $('#table tbody tr').each(function(e) {
                $(this).show();
        });
        $("#search").val("");
        if ($("h1").text() == "ALL TASKS")
            $("li:eq(1)").click();
        if ($("h1").text() == "COMPLETED")
            $("li:eq(2)").click();
        if ($("h1").text() == "IN PROGRESS")
            $("li:eq(3)").click();
        if ($("h1").text() == "ARCHIVE")
            $("li:eq(4)").click();
        $("#menu").click();
    });
    
    $("thead th:odd").on('click',"a",function(e){
        e.preventDefault();
         var i = 1;
        var j = 0 ;
        if ($("h1").text() == "ALL TASKS")
            j=0;
        if ($("h1").text() == "COMPLETED")
            j=1;    
        if ($("h1").text() == "IN PROGRESS")
            j=2;
        if ($("h1").text() == "ARCHIVE")
            j=3;
        info.sort(infoSortDate);
        $("table tbody").find("tr").each(function(){
            inprogress--;
            i=1;
            if(info[0].status != 1 ){
                i = info[0].status;
            }        
                $(this).remove();
                add(info[0].name,info[0].time,info[0].data);
                info.shift();
                var row = $("table tbody").find("tr:last");
            if(j==0){     
                if(i==2){
                    row.addClass("completed");
                    row.removeClass("inProgress");
                    row.addClass("done");
                    row.find("ul>li#completed").hide();
                    row.find("ul>li#archive").show();
                    row.find("ul>li#inProgress").show();
                    info[info.length-1].status = 2;
            }else if (i==3){       
                    row.addClass("archive");
                    row.removeClass("inProgress");
                    row.find("ul>li#completed").show();
                    row.find("ul>li#inProgress").show();
                    row.find("ul>li#archive").hide();   
                    info[info.length-1].status = 3; 
                    row.hide();
            }
            }else if (j==1){
                if(i==2){   
                    row.addClass("completed");
                    row.removeClass("inProgress");
                    row.addClass("done");
                    row.find("ul>li#completed").hide();
                    row.find("ul>li#archive").show();
                    row.find("ul>li#inProgress").show();
                    info[info.length-1].status = 2;
            }else if (i==3){   
                    row.addClass("archive");
                    row.removeClass("inProgress");
                    row.find("ul>li#completed").show();
                    row.find("ul>li#inProgress").show();
                    row.find("ul>li#archive").hide();   
                    info[info.length-1].status = 3; 
                    row.hide();
            }else if (i==1){
                row.hide();
            }
                
            }else if (j==2 ){
                if(i==2){  
                    row.addClass("completed");
                    row.removeClass("inProgress");
                    row.addClass("done");
                    row.find("ul>li#completed").hide();
                    row.find("ul>li#archive").show();
                    row.find("ul>li#inProgress").show();
                    info[info.length-1].status = 2;
                    row.hide();
            }else if (i==3){ 
                    row.addClass("archive");
                    row.removeClass("inProgress");
                    row.find("ul>li#completed").show();
                    row.find("ul>li#inProgress").show();
                    row.find("ul>li#archive").hide();   
                    info[info.length-1].status = 3; 
                    row.hide();
            }
                
            }else if (j==3){
                if(i==2){
                    row.addClass("completed");
                    row.removeClass("inProgress");
                    row.addClass("done");
                    row.find("ul>li#completed").hide();
                    row.find("ul>li#archive").show();
                    row.find("ul>li#inProgress").show();
                    info[info.length-1].status = 2;
                    row.hide();
            }else if (i==3){
                    
                    row.addClass("archive");
                    row.removeClass("inProgress");
                    row.find("ul>li#completed").show();
                    row.find("ul>li#inProgress").show();
                    row.find("ul>li#archive").hide();   
                    info[info.length-1].status = 3; 
            }else if(i==1){
                    row.hide();
                }
                
            }
        });     
    });
    $("thead th:even").on('click',"a",function(e){
        e.preventDefault()
        info.sort(infoSortName);
		
        var i = 1;
        var j = 0 ;
        if ($("h1").text() == "ALL TASKS")
            j=0;
        if ($("h1").text() == "COMPLETED")
            j=1;    
        if ($("h1").text() == "IN PROGRESS")
            j=2;
        if ($("h1").text() == "ARCHIVE")
            j=3;
        $("table tbody").find("tr").each(function(){ 
            inprogress--;
            $(this).remove();
            i = info[0].status;
            add(info[0].name,info[0].time,info[0].data);
            info.shift();
            var row = $("table tbody").find("tr:last");
            if(j==0){     
                if(i==2){
                    row.addClass("completed");
                    row.removeClass("inProgress");
                    row.addClass("done");
                    row.find("ul>li#completed").hide();
                    row.find("ul>li#archive").show();
                    row.find("ul>li#inProgress").show();
                    info[info.length-1].status = 2;
            }else if (i==3){       
                    row.addClass("archive");
                    row.removeClass("inProgress");
                    row.find("ul>li#completed").show();
                    row.find("ul>li#inProgress").show();
                    row.find("ul>li#archive").hide();   
                    info[info.length-1].status = 3; 
                    row.hide();
            }
            }else if (j==1){
                if(i==2){   
                    row.addClass("completed");
                    row.removeClass("inProgress");
                    row.addClass("done");
                    row.find("ul>li#completed").hide();
                    row.find("ul>li#archive").show();
                    row.find("ul>li#inProgress").show();
                    info[info.length-1].status = 2;
            }else if (i==3){   
                    row.addClass("archive");
                    row.removeClass("inProgress");
                    row.find("ul>li#completed").show();
                    row.find("ul>li#inProgress").show();
                    row.find("ul>li#archive").hide();   
                    info[info.length-1].status = 3; 
                    row.hide();
            }else if (i==1){
                row.hide();
            }
                
            }else if (j==2 ){
                if(i==2){  
                    row.addClass("completed");
                    row.removeClass("inProgress");
                    row.addClass("done");
                    row.find("ul>li#completed").hide();
                    row.find("ul>li#archive").show();
                    row.find("ul>li#inProgress").show();
                    info[info.length-1].status = 2;
                    row.hide();
            }else if (i==3){ 
                    row.addClass("archive");
                    row.removeClass("inProgress");
                    row.find("ul>li#completed").show();
                    row.find("ul>li#inProgress").show();
                    row.find("ul>li#archive").hide();   
                    info[info.length-1].status = 3; 
                    row.hide();
            }
                
            }else if (j==3){
                if(i==2){
                    row.addClass("completed");
                    row.removeClass("inProgress");
                    row.addClass("done");
                    row.find("ul>li#completed").hide();
                    row.find("ul>li#archive").show();
                    row.find("ul>li#inProgress").show();
                    info[info.length-1].status = 2;
                    row.hide();
            }else if (i==3){
                    
                    row.addClass("archive");
                    row.removeClass("inProgress");
                    row.find("ul>li#completed").show();
                    row.find("ul>li#inProgress").show();
                    row.find("ul>li#archive").hide();   
                    info[info.length-1].status = 3; 
            }else if(i==1){
                    row.hide();
                }
                
            }
            
        });     
    });
    
var infoSortDate = function (info1, info2) {
  if(info1.status==1&&info2.status==1){        
  if(info1.time==""||info2.time=="") return -1 ;
  if (info1.time > info2.time) return 1;
  if (info1.time < info2.time) return -1;
  return 0;
    }
    if(info1.status < info2.status) return -1 ;
    if(info1.status==info2.status){
        if(info1.time > info2.time) return 1 ;
        if(info1.time < info2.time) return -1 ;
            return 0 ;
    } 
    return 1 ;
        
};
var infoSortName = function (info1, info2) {
  if(info1.status==1&&info2.status==1){        
  if(info1.name==""||info2.name=="") return -1 ;
  if (info1.name.toString().toLowerCase() > info2.name.toString().toLowerCase()) return 1;
  if (info1.name.toString().toLowerCase() < info2.name.toString().toLowerCase()) return -1;
        return 0;
    }
    else if(info1.status<info2.status) return -1;
    else if(info1.status==info2.status){
        if(info1.name > info2.name) return 1 ;
        if(info1.name < info2.name) return -1 ;
            return 0 ;
    }
    return 1 ;
};
    

	// not our functions
    var trigger = $('.hamburger'),
    overlay = $('.overlay'),
    isClosed = false;
    trigger.click(function () {
      hamburger_cross();      
    });
    function hamburger_cross() {

      if (isClosed == true) {          
        overlay.hide();
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = false;
      } else {   
        overlay.show();
          
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = true;
      }
  }
  
  $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
  });
});