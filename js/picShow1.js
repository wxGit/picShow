jQuery(document).ready(function ($) {
    //获取我们要操作图片对象
    var img=$('#big_pic').children('img');
    //获取原始大小的点击对象
    var proportion=$('#zoom_zero');
    //存储初始化时候图片的height和width值
    var original_h=parseInt(img.height());
    var original_w=parseInt(img.width());
    //存储初始化时候图片的top和left值
    var img_top=parseInt(img.css('top'));
    var img_left=parseInt(img.css('left'));
    //存储显示的比例
    var p=1;
    //缩小的时候存储没缩小之前的top和left值
    var y=img_top;
    var x=img_left;
    //放大
    $('#zoom_in').click(function(){
        if(p<32){
            p=p*2;
            img.height(function(){
                var h=$(this).height();
                return h*2;
            });
            img.width(function(){
                var w= $(this).width();
                return w*2;
            });
            img.css({
                top:function(){
                    var ht=Number(img.height())/2;
                    return img_top-ht+(original_h/2);
                },
                left: function () {
                    var wt=Number(img.width())/2;
                    return img_left-wt+(original_w/2);
                }
            });
            if(p==1){
                y=img_top;
                x=img_left;
            }
        }
    });
    //缩小
    $('#zoom_out').click(function(){
        if(p>0.5){
            p=p/2;
            img.height(function(){
                h=$(this).height();
                return h/2;
            });
            img.width(function(){
                w = $(this).width();
                return w/2;
            });
            if(p<1){
                img.css({
                    top: function () {
                        var ht=Number(img.height())/2;
                        y=y+ht;
                        return y;
                    },
                    left: function () {
                        var wt=Number(img.width())/2;
                        x=x+wt;
                        return x;
                    }
                });
            }else if(p==1){
                img.css({top:img_top,left:img_left});
                y=img_top;
                x=img_left;
            } else if(p>1){
                img.css({
                    top: function () {
                        var ht=Number(img.height())/2;
                        return img_top-ht+(original_h/2);
                    },
                    left: function () {
                        var wt=Number(img.width())/2;
                        return img_left-wt+(original_w/2);
                    }
                });
            }
        }
    });
    //原比例
    proportion.click(function () {
        p=1;
        y=img_top;
        x=img_left;
        img.width(original_w);
        img.height(original_h);
        img.css({top:img_top,left:img_left});
    });
});