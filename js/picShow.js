$(function(){
   var data = [
      {"id":"0","imgName":"test_image.jpg","desc":"dfwedwedfew"},
      {"id":"1","imgName":"test_image1.jpg","desc":"regre"},
      {"id":"2","imgName":"test_image2.jpg","desc":"gnjfghng"},
      {"id":"3","imgName":"test_image3.jpg","desc":"qwerwffggrh"},
      {"id":"4","imgName":"test_image4.jpg","desc":"kryujtrdefrhtty"},
      {"id":"5","imgName":"test_image2.jpg","desc":"getgegre"},
      {"id":"0","imgName":"test_image.jpg","desc":"dfwedwedfew"},
      {"id":"1","imgName":"test_image1.jpg","desc":"regre"},
      {"id":"2","imgName":"test_image2.jpg","desc":"gnjfghng"},
      {"id":"3","imgName":"test_image3.jpg","desc":"qwerwffggrh"},
      {"id":"4","imgName":"test_image4.jpg","desc":"kryujtrdefrhtty"},
      {"id":"5","imgName":"test_image2.jpg","desc":"getgegre"},
      {"id":"3","imgName":"test_image3.jpg","desc":"qwerwffggrh"},
      {"id":"4","imgName":"test_image4.jpg","desc":"kryujtrdefrhtty"},
      {"id":"3","imgName":"test_image3.jpg","desc":"qwerwffggrh"},
      {"id":"4","imgName":"test_image4.jpg","desc":"kryujtrdefrhtty"},
      {"id":"5","imgName":"test_image2.jpg","desc":"getgegre"},
      {"id":"2","imgName":"test_image2.jpg","desc":"gnjfghng"},
      {"id":"3","imgName":"test_image3.jpg","desc":"qwerwffggrh"},
      {"id":"4","imgName":"test_image4.jpg","desc":"kryujtrdefrhtty"},
      {"id":"5","imgName":"test_image2.jpg","desc":"getgegre"},
      {"id":"0","imgName":"test_image.jpg","desc":"dfwedwedfew"},
      {"id":"1","imgName":"test_image1.jpg","desc":"regre"},
      {"id":"2","imgName":"test_image2.jpg","desc":"gnjfghng"},
      {"id":"3","imgName":"test_image3.jpg","desc":"qwerwffggrh"},
      {"id":"4","imgName":"test_image4.jpg","desc":"kryujtrdefrhtty"},
      {"id":"5","imgName":"test_image2.jpg","desc":"getgegre"}
   ];

   //右侧选择列表list
   var arr = [
     {"index":"0","name":"原件发票"},
     {"index":"1","name":"发票清单"},
     {"index":"2","name":"处方签"},
     {"index":"3","name":"而我为辅"},
     {"index":"4","name":"千万得"},
     {"index":"5","name":"瓦房店并未呢"},
     {"index":"6","name":"是法让我"},
     {"index":"7","name":"天涯海角"}
   ];

   var showNumber = 0,		//默认显示
	     groupNumber = 1,		//当前显示的组
	     groupSize = 12;		//每组的数量

   var deg = 0,
       flag = false;  //判断画选区开关是否开启

   var s = 0,
       S=0;

   var orig_w = 0,
       orig_h = 0,
       orig_l = 0,
       orig_t = 0;

   var oIndex = $('#page_status span').eq(0);  //显示当前第几页的那个span
   
   init();

   var wId = "w";
   var index = 0;
   var startX = 0, startY = 0;
   var btn = false;
   var retcLeft = "0px", retcTop = "0px", retcHeight = "0px", retcWidth = "0px";

   // $('#big_pic img').bind('mousewheel', function(event, delta) {  
   //    if(delta == '1'){
   //       scale('larger');
   //    }else{
   //       scale('smaller');
   //    }
   // });
   
   $('#wrapper').css({
      'position':'absolute',
      'left':200
   });


   //加载右侧选择列表
   showSideList(arr);

   //点击右侧加载不同图片列表
   $('#list').on('click','li',function(){
      $(this).addClass('active').siblings().removeClass('active');
      rebuildThumb($(this).attr('id'));
   });
   
   //处理开关点击事件
   $('#remark').click(function(){
      if($(this).attr('class') == 'on'){
         $(this).removeClass('on').html('关').css('color','#000');
         $('#big_pic img').css('cursor','auto');
         flag = false;
      }else{
         $(this).addClass('on').html('开').css('color','green');
         $('#big_pic img').css('cursor','crosshair');
         flag = true;
      }
   });

   $('#rotate_left').click(function(){
       rotate('left');
   });

   $('#rotate_right').click(function(){
       rotate('right');
   });
   
   function init(){

       showThumb(1); 

       //判断何时出现左右按钮
       dirBtn();

       //初始化开关
       $('#remark').removeClass('on').html('关').css('color','#000');

       //让图片居中
       centerImg($('#big_pic img'),$('#big_pic')); 

       //获取大图原始数据
       orig_w = $("#big_pic img").width();
       orig_h = $("#big_pic img").height();
       orig_l = $("#big_pic img").css('left');
       orig_t = $("#big_pic img").css('top');	

       //放大缩小
       $('#zoom_in').click(function(){
          scale('larger');
       });

       $('#zoom_out').click(function(){
          scale('smaller');
       }); 

       //1：1
       $('#zoom_zero').click(bigImgInit);

       //上一张下一张
       $('#prev').click(prev);
       $('#next').click(next); 

       //上一图片集、下一图片集
       $('.toRight').on('click',function(){
           nextThumb();  
       });

       $('.toLeft').on('click',function(){
           prevThumb();  
       });     


       $('#to_first').click(function(){
       	  toLimit('first');
       });  
       $('#to_last').click(function(){
       	  toLimit('last');
       }); 

       $('#to_any span').click(function(){
       	  var n = $('#to_any input').val();
       	  if(!isNaN(n) && n>0 && n<=data.length){             
         	   toAny(n);
       	  }else{
       	  	 alert('输入不规范');
       	  }
       });

       //拖拽画选区
       dragDraw();


       $(document).keyup(function(e){
          e = e || event;
          if(e.keyCode == 37){
            prev();
          }
          if(e.keyCode == 39){
            next();
          }
       });


   }


   function centerImg(obj,parent){
   	   //alert(parent.height());
       obj.css({
       	  left:(parent.width() - obj.width())/2
       });
   }


   function showThumb(group){  //group是显示的组数
	   var oBox = $("#small_pic_list");  //修改地方
	       oTotal = $('#page_status span').eq(1);
		     oBox.html('');
	   var start = (group-1)*groupSize;
	   var end = group*groupSize;

	   oTotal.html(data.length);


	   for(var i=start;(i<end && i<data.length);i++){
			    var aImgs = $('<img src="img/'+ data[i].imgName+'" id="thumb'+i+'" width="50" height="50"/>');			 
			 
			    oBox.append(aImgs);

	        oBox.find('img').eq(0).addClass('active');

	    }
      
      $('#big_pic').html('');  //加载之前先清空
      $('#big_pic').append($('<img src="img/'+ data[0].imgName +'" width="650px" />')); //加载第一张大图
      centerImg($('#big_pic img'),$('#big_pic'));

	    oBox.delegate("img","click",function(){
	    	$(this).addClass('active').siblings().removeClass('active');
        //alert(groupNumber);
	    	showNumber = $(this).index() + (groupNumber>1 ? (groupNumber-1)*12 : 0); 
        //alert(showNumber);
	    	oIndex.html(showNumber+1);       

			  showBig(showNumber);
		  });
   };

   function showBig(n){
   	  $("#big_pic img").attr('src',$("#thumb"+n).attr('src')).css('width',650);
      centerImg($('#big_pic img'),$('#big_pic'));
      bigImgInit();
   }

   function nextThumb(){
      if((groupNumber*groupSize) +1 <= data.length){
        showThumb(groupNumber+1);
        showNumber = groupNumber*groupSize;
        showBig(showNumber);
        oIndex.html(showNumber+1);
        groupNumber++;
      }
      //centerImg($('#big_pic img'),$('#big_pic')); 
   }

   function prevThumb(){
       if(groupNumber - 1>=1){
          showThumb(groupNumber-1);     
          groupNumber--;
          showNumber = groupNumber*groupSize-groupSize;  
          oIndex.html(showNumber+1); 
          showBig(showNumber);
       }
       //centerImg($('#big_pic img'),$('#big_pic')); 
   }

   function dirBtn(){
      if(data.length > 12){
          $('#small_pic').append("<b class='toRight'>></b>").find('b.toRight').css('float','right');
          $('#small_pic').prepend("<b class='toLeft'><</b>").find('b.toLeft').css('float','left');
      };
   }


   //放大缩小
   function scale(sc){
      if(sc == 'larger'){
         s++;
         S = Math.pow(1.2,s);  //放大1.2的s次幂

         if(s>=5){
            s = 5;
            S = Math.pow(1.2,5); 
         }

         $('#big_pic img').css({
           "transform":"scale("+S+")",
           "-webkit-transform":"scale("+S+")",
           "-o-transform":"scale("+S+")",
           "-moz-transform":"scale("+S+")"
         });
      }else if(sc == 'smaller'){
         s--;
         S = Math.pow(1.2,s);  //s小于零时自动取倒数，也就是自动会缩小

         if(s<=-5){
            s = -5;
            S = Math.pow(1.2,-5); 
         }

         $('#big_pic img').css({
           "transform":"scale("+S+")",
           "-webkit-transform":"scale("+S+")",
           "-o-transform":"scale("+S+")",
           "-moz-transform":"scale("+S+")"
         });
      }
   }

   // function scale(sc){
   //    if(sc == 'larger'){
   //       var S = (s+1)*1.2; 
   //       $('#big_pic img').css({
   //         "transform":"scale("+S+")",
   //         "-webkit-transform":"scale("+S+")",
   //         "-o-transform":"scale("+S+")",
   //         "-moz-transform":"scale("+S+")",
   //       });
   //       s +=1;
   //    }else if(sc == 'smaller'){
   //       var S = (s-1)*1.2;
   //       if((s-1) <= 0){
   //          S = 1;
   //       } 
   //       $('#big_pic img').css({
   //         "transform":"scale("+S+")",
   //         "-webkit-transform":"scale("+S+")",
   //         "-o-transform":"scale("+S+")",
   //         "-moz-transform":"scale("+S+")",
   //       });
   //       if(s>0){           
   //         s -=1;
   //       }else{
   //         s = 0;
   //       }
   //    }
   // }

   var shN = 0;
   function prev(){
        if(showNumber == ((groupNumber-1)*groupSize)){
            if(showNumber >=12){
                prevThumb();  
                shN = groupNumber*groupSize - 1; 

                oIndex.html(shN+1);
                $('#small_pic img').eq(shN % groupSize).addClass('active').siblings().removeClass('active');
                $("#big_pic img").attr('src',$("#thumb"+shN).attr('src')).css('width',650); 
                showNumber = shN; 
            };
                     
        }else if(showNumber >0){
            showNumber--;

            $('#small_pic img').eq(showNumber % groupSize).addClass('active').siblings().removeClass('active');
            $("#big_pic img").attr('src',$("#thumb"+showNumber).attr('src')).css('width',650); 
            oIndex.html(showNumber+1);
        }else{
        	  //alert('已是首页');
        }
        bigImgInit();
    }

    function next(){
        if(showNumber % groupSize == (groupSize-1)){
            nextThumb();
        }else if(showNumber >=0 && showNumber <data.length-1){
            showNumber++;
            //console.log(showNumber % groupSize);
            $('#small_pic img').eq(showNumber % groupSize).addClass('active').siblings().removeClass('active');
            $("#big_pic img").attr('src',$("#thumb"+showNumber).attr('src')).css('width',650);
            oIndex.html(showNumber+1); 
        }else{
        	  //alert('已是尾页');
        }
        bigImgInit();
    }

    function toLimit(dir){
    	if(dir == 'first'){
          //展示第一组图片集
          showThumb(1); 

          groupNumber = 1;

    	  	$('#small_pic img').eq(0).addClass('active').siblings().removeClass('active');
	        $("#big_pic img").attr('src',$("#thumb0").attr('src')).css('width',650);
	        oIndex.html('1');

          showNumber = 0; 

          centerImg($('#big_pic img'),$('#big_pic'));
    	}else if(dir == 'last'){

          showThumb(Math.floor(data.length/12)+1);

          groupNumber = Math.floor(data.length/12)+1;

          //alert(11-(groupNumber*12 - data.length));

          $('#small_pic img').eq(11-(groupNumber*12 - data.length)).addClass('active').siblings().removeClass('active');
	        $("#big_pic img").attr('src',$("#thumb"+(data.length-1)).attr('src')).css('width',650);
	        oIndex.html(data.length);

          showNumber = data.length - 1;

          centerImg($('#big_pic img'),$('#big_pic'));
    	}
      bigImgInit();
    }

    function toAny(n){
        groupNumber = Math.ceil(n/12);
        showThumb(Math.ceil(n/12));

        $('#small_pic img').eq(11-(groupNumber*12 - n)).addClass('active').siblings().removeClass('active');
        $("#big_pic img").attr('src',$("#thumb"+(n-1)).attr('src')).css('width',650);
        oIndex.html(n); 
        showNumber = (n-1);
        bigImgInit();
    }

    function rotate(dir){
        if(dir =='left'){
           //alert(deg%4);   0 1 2 3       
           var D = (deg%4-1)*90; 
           $("#big_pic img").css({
              'transform':'rotate('+D+'deg)',
              '-ms-transform':'rotate('+D+'deg)',
              '-webkit-transform':'rotate('+D+'deg)',
              '-0-transform':'rotate('+D+'deg)',
              '-moz-transform':'rotate('+D+'deg)'
           });          
           deg -=1;
        }else if(dir == 'right'){       
           var D = (deg%4+1)*90;  //90 180 270 360
           //alert(D);
           $("#big_pic img").css({
              'transform':'rotate('+D+'deg)',
              '-ms-transform':'rotate('+D+'deg)',
              '-webkit-transform':'rotate('+D+'deg)',
              '-0-transform':'rotate('+D+'deg)',
              '-moz-transform':'rotate('+D+'deg)'
           });          
           deg +=1;
        }
    }


    function bigImgInit(){
        //大图初始化
        // $("#big_pic img").css({
        //     "width": orig_w,
        //     "height": orig_h,
        //     "left": orig_l,
        //     "top": orig_t
        // });
        
        s = 0;  //清零
        S = 0;  //清零
        $("#big_pic img").css({
           "transform":"scale(1)",
           "-webkit-transform":"scale(1)",
           "-o-transform":"scale(1)",
           "-moz-transform":"scale(1)"
        });
    }

    function showSideList(list){
       var html = '';
       $(list).each(function(i,v){
          html += '<li id="'+list[i].index+'">'+list[i].name+'</li>';
       });
       $('#list').append(html);
       $('#list li').eq(0).addClass('active');
    }

    function rebuildThumb(id){      
       deg = 0;
       if(id == 1){
           data = [
              {"id":"0","imgName":"tour1.jpg","desc":"dfwedwedfew"},
              {"id":"1","imgName":"tour2.jpg","desc":"regre"},
              {"id":"2","imgName":"tour3.jpg","desc":"gnjfghng"},
              {"id":"3","imgName":"tour4.jpg","desc":"qwerwffggrh"},
              {"id":"4","imgName":"tour5.jpg","desc":"kryujtrdefrhtty"},
              {"id":"5","imgName":"tour6.jpg","desc":"asde"},
              {"id":"6","imgName":"tour7.jpg","desc":"tyjhryjhyr"},
              {"id":"7","imgName":"tour8.jpg","desc":"xwecewdcwe"},
              {"id":"8","imgName":"tour9.jpg","desc":"kyuksddda"}
           ];
       }else{
           data = [
              {"id":"0","imgName":"test_image.jpg","desc":"dfwedwedfew"},
              {"id":"1","imgName":"test_image1.jpg","desc":"regre"},
              {"id":"2","imgName":"test_image2.jpg","desc":"gnjfghng"},
              {"id":"3","imgName":"test_image3.jpg","desc":"qwerwffggrh"},
              {"id":"4","imgName":"test_image4.jpg","desc":"kryujtrdefrhtty"},
              {"id":"5","imgName":"test_image2.jpg","desc":"getgegre"}
           ];
       }    

       init();
    }


    function dragDraw(){
       //拖拽画选区
       $('#big_pic img').bind('mousedown',function(e){
          if(flag){        
             btn = true;
             var evt = window.event || e;
             startX = evt.clientX;
             startY = evt.clientY;

             index++;
             var div = $("<div>");
             div.attr('id',wId + index);
             div.attr('class',"div");
             div.css({
                "marginLeft": startX,
                "marginTop": startY
             });

             $('body').append(div);

             $(document).bind('mousemove',function(e){
                 move(e);
             });
             
             $(document).bind('mouseup',function(e){
                 up(e);             
             });

             return false;

             function move(e){
                 if(btn){
                     var evt = window.event || e;
                     retcLeft = (startX - evt.clientX > 0 ? evt.clientX : startX);
                     retcTop = (startY - evt.clientY > 0 ? evt.clientY : startY);
                     retcHeight = Math.abs(startY - evt.clientY);
                     retcWidth = Math.abs(startX - evt.clientX);
                     $('#'+ wId + index).css({
                        "marginLeft":retcLeft,
                        "marginTop": retcTop,
                        "width":retcWidth,
                        "height":retcHeight
                     });
                 }
             }

             function up(e){
                if(btn){
                   var evt = window.event || e;
                  
                   $('#'+wId + index).remove();
                   $('.' + $('.remarker').attr('id')).remove();
                   $('.remarker').remove();

                   var div = $("<div>");
                   div.attr('class','retc').css({
                      "marginLeft":retcLeft,
                      "marginTop": retcTop,
                      "width":retcWidth,
                      "height":retcHeight
                   }).addClass(wId + index);

                   var remark = $('<div class="remarker" id="'+wId + index+'"><div class="select"><label><input type="checkbox" value="主判断" name="chk"/>主诊断</label><label>&nbsp;<input type="checkbox" value="特别备注" name="chk"/>特别备注</label><br/><label><input type="checkbox" value="次诊断" name="chk"/>次诊断</label><br/><label><input type="checkbox" value="就诊日期" name="chk"/>就诊日期</label></div><textarea placeholder="这里是自由注释区"></textarea><div class="btns"><button id="close">取消</button><button id="save">保存</button></div></div>')
                   remark.css({
                      'marginLeft':retcLeft + retcWidth,
                      'marginTop': retcTop + retcHeight
                   });
                   $('body').append(remark);
                   $('body').append(div);



                    //阻止document.mouseup事件冒泡
                    $('.remarker').mouseup(function(e){
                        var evt = window.event || e;
                        e.stopPropagation();
                    });

                    $('#close').click(function(){
                        $(this).parents('.remarker').remove();
                        var className = $(this).parents('.remarker').attr('id');
                        $('.' + className).remove();
                    });

                    $('#save').click(function(){
                        var chk_val = [];
                        var par = $(this).parents('.remarker');
                        $('input[name="chk"]:checked').each(function(){ 
                           chk_val.push($(this).val()); 
                        }); 

                        //获取所填数据
                        // alert(chk_val);
                        // alert(par.find('textarea').val());
                        $('.' + wId + index).attr('title',chk_val + '     ' + par.find('textarea').val());
                        par.remove();
                    });

                   
                   btn = false;
                }

              
                $(document).unbind('mousemove',function(e){
                    move(e);
                });
                 
                $(document).unbind('mouseup',function(e){
                    up(e);             
                });
                
             }
          }

       });
    } 

});
