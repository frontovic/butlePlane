(function () {
    $(document).ready(function () {             
       
        $(".cel").mouseenter( function(){
           // console.log(this);
           $(this).addClass('color');
        } ).mouseleave( function(){
            $(this).removeClass('color');
        } );
        
        
    }); 

})();