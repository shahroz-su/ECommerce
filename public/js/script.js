
$(document).ready(function(){
    $("#submitBtn").click(function(){        
        $("#myForm").submit(function(event) {
     event.preventDefault();
    $.ajax({
      url : "/comment",
      type : "POST",
      success : function(response){
        /*getAll();*/
        alert(response);
      }
    });
    return false;
});
});
  });
/*  $("form").submit(function(event) {
    event.preventDefault();
    alert("helo World");
    $.ajax({
      url : "/comment",
      type : "POST",
      success : function(response){
        getAll();
        alert(response);
      }
    });
    return false;

  });*/

        function doComment(form){
              $.ajax({
                  url : "/comment",
                  method : "POST",
                  data : { commentTxt : form.commentTxt.value } ,
                  success : function(response){
                    alert("Commented Successfully");
                  }
                });
                return false;
        }




$(document).ready(function(){
    $("#submitBtn").click(function(){        
    event.preventDefault();
    alert("Hello World");
    $.ajax({
      url : "/comment",
      method : "POST",
      data : { commentTxt : form.commentTxt.value } ,
      success : function(response){
        alert("Successfully Commented..");
      }
    });
    return false ;
});
});




<% if(comment.length>0) {%>
<% if(comment = comment.reverse() );%>
<% comment.forEach(function(row){ %>
<div class="row comment-box p-1 pt-3 pr-4">
      <div class="col-lg-2 col-3 user-img text-center">
            <img src="/images/avatar9.jpg" class="main-cmt-img rounded-circle" alt="">
      </div>
      <div class="col-10 col-9 user-comment bg-light rounded pb-1">
            <div class="media-body">
                <h4 class="mt-0"> <%= row.name %> </h4>
                <p class="para"> <%= row.commentTxt %> </p>
                <p class="para1"> Date : <%= row.date %> </p>
            </div>
     </div>
</div>
<br>
<% })} %>





<script>   

$(document).ready(function(){
    $("#submitBtn").click(function(){  
    $("#myForm").submit(function(event) {
     event.preventDefault();      
    const commentst = $("#commentTxt").val();
    if ($.trim(commentst) != "") {
            $.ajax({
                  url : "/comment",
                  method : "POST",
                  data : { commentTxt : commentst } ,
                  success : function(response){
                    $("#commentTxt").val("");
                        $('#response').load("comente.ejs");
                              alert("Commented Successfully");
                  }
                });
            }
          });
        });

});
</script>