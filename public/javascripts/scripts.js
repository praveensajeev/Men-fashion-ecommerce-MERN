$(function(){
$(".xzoom,.xz00m-gallery").xzoom({
    zoomWidth:400,
    tint:"#333",
    xoffset:15,
})
})



function addToCart(proId){
    $.ajax({
      url:'/add-to-cart/'+proId,
      method:'get',
      success:(response)=>{
          if(response.status){
              let count=$('#cart-count').html()
              count=parseInt(count)+1
              $("#cart-count").html(count)
          }
        
      }
    })
  }

// Data Picker Initialization
$('.datepicker').pickadate();  