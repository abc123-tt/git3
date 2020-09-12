
  // “轮播” 的构造函数
  /**
   * @param $rotate：轮播图元素 
   * @param time：轮播时间
   */
  function rotate($rotate, time){
    this.showNum = 4; //显示数量，在手机端只显示一个
    this.itemNum = 0; // 元素的数量，会在初始化后重新赋值
    this.$rotate = $rotate; // 轮播的最外层元素
    this.status = 'right'; // 移动方向初始化
    this.index = 1; // 第几个元素
    this.time = time; // 定时器时间
  }
  // 圆点页码的生成
  rotate.prototype.dotPage = function(){
    let $inside = this.$rotate.getElementsByClassName('rotate__inside')[0]; // 获取需要滚动的元素
    let $item = $inside.getElementsByClassName('rotate__item') // 每一个成员

    let $dotUl = this.$rotate.getElementsByClassName('dotPage')[0]; // 获取圆点ul
    let itemNum = this.itemNum; // 获取成员数量
    let showNum = this.showNum; // 获取显示数量
    let pageNum = Math.floor((itemNum-1)/showNum); // 计算有多少页
    // 生成圆点页码
    if(pageNum > 0){
      var dots = ''
      for(let i=0;i<=pageNum;i++){
        if(i==0){
          dots += '<li class="active" data-type='+i+'></li>'
        }else{
          dots += '<li data-type='+i+'></li>'
        }
      }
      $dotUl.innerHTML = dots;
    }

    var that = this;
    // 圆点事件通过事件冒泡委托给父级元素ul
    $dotUl.onclick = function(ev){
      // 判断当前是否是圆点li点击，如果不是，则什么都不执行
      var target = ev.target || ev.srcElement;
      if(target.nodeName == 'LI'){
        // 获取当前圆点点击的索引值 —— 是第几个圆点
        let liIndex = target.getAttribute('data-type');
        // 获取所有圆点，循环取消激活class
        let $dotPages = this.getElementsByTagName('li');
        for(var t=0,len=$dotPages.length;t<len;t++){
          $dotPages[t].className = "";
        }
        // 为点击的圆点添加激活class
        $dotPages[liIndex].className = 'active';
        // 获取当前页需要移动到第几个成员，如果成员不满足一页，需要使用前面的成员顶替
        if((parseInt(liIndex)+1)*showNum > itemNum){
          var index = itemNum - showNum;
        }else{
          var index = liIndex * showNum;
        }
        // 修改对象中的索引
        that.index = index;
        // 移动元素
        var itemWidth = -($item[index].offsetLeft-3);
        $inside.style = 'transform: translate('+itemWidth+'px, 0);';
        
      }

    }
  } 
  // 初始化轮播
  rotate.prototype.init = function(){
    this.widthCheck();
    // 获取需要的数据
    let status = this.status; // 向右或向左的状态
    // let index = this.index; // 轮到第几个
    let $inside = this.$rotate.getElementsByClassName('rotate__inside')[0]; // 获取需要滚动的元素
    let $item = $inside.getElementsByClassName('rotate__item') // 每一个成员
    $inside.style = 'transform: translate(0, 0);';
    this.itemNum = $item.length;
    this.dotPage()

    let timerFun = function(){
      // 每一次轮播都去获取当前的索引，显示数量和成员数量
      let index = this.index; // 轮到第几个
      let showNum = this.showNum; // 显示数量
      let itemNum = this.itemNum; // 成员数量
      let $dotUl = this.$rotate.getElementsByClassName('dotPage')[0]; // 获取圆点父元素
      // 如果元素数量小于显示数量，则不需要进行移动，将元素回归原位即可
      if(itemNum > showNum ){
        // 每次移动时去修改圆点的激活状态
        let liIndex = Math.floor(index/showNum);
        let $dotPages = $dotUl.getElementsByTagName('li');
        for(var t=0,len=$dotPages.length;t<len;t++){
          $dotPages[t].className = "";
        }
        if(index + showNum>=itemNum){
          $dotPages[len-1].className = 'active';
        }else{
          $dotPages[liIndex].className = 'active';
        }

        // 如果是第一个元素，那么需要向右移动
        if(index == 0){
          status = 'right';
        }else if(index + showNum>=itemNum){
          // 如果是最后一个元素，需要向左移动
          status = 'left';
        }
        // 获取元素的距离父元素左边距并赋值给父元素
        var itemWidth = -($item[index].offsetLeft-3);
        $inside.style = 'transform: translate('+itemWidth+'px, 0);';
        // 如果是向右移动则加1，向左移动则减1
        this.index = status == 'right' ? index+1 : index-1;

      }else{
        $inside.style = 'transform: translate(0, 0);';
        $dotUl.innerHTML = '';
      }
    }.bind(this)

    // 将定时器赋值给对象，方便进行停止
    this.timer = setInterval(timerFun,this.time)
    // 下面的绑定事件中如果没有改变this指向，会无法取消定时器。所以要使用bind修改函数中的this，或者将前面的定时器同时使用变量存储
    $inside.addEventListener("mousemove",function(){clearInterval(this.timer);}.bind(this));
    $inside.addEventListener("mouseout",function(){clearInterval(this.timer);  this.timer = setInterval(timerFun,this.time); }.bind(this));
  
  }
  // 重新修改显示数量并重新生成圆点页码
  rotate.prototype.widthCheck = function(){
    let width = this.$rotate.offsetWidth;
    if(width >= 1180){
      this.showNum = 4;
      this.dotPage()
    }else if(width < 1180 && width > 748){
      this.showNum = 3;
      this.dotPage()
    }else if(width <= 748 && width >= 480){
      this.showNum = 2;
      this.dotPage()
    }else{
      this.showNum = 1;
      this.dotPage()
    }
  }

  var $rotate = document.getElementsByClassName('rotate__outer')
  // 项目开发
  var develop = new rotate($rotate[0],5000)
  develop.init()

  // 网络运维
  var network = new rotate($rotate[1],5000)
  network.init()

  window.onresize = function(){
    develop.widthCheck()
    network.widthCheck()
  }
  