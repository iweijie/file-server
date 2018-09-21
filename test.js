// 时间格式化
var formatTime = function (timestamp, flag = 0, separator ="-") {
    var date = new Date(timestamp)
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    var d = date.getDate()
    var h = date.getHours()
    var min = date.getMinutes()
    if (m < 10) {
      m = '0' + m
    }
    if (d < 10) {
      d = '0' + d
    }
    if (h < 10) {
      h = '0' + h
    }
    if (min < 10) {
      min = '0' + min
    }
    if(flag === 1){
        return y + separator + m;
    }else if(flag === 2){
        return y + separator + m + separator + d + ' ' + h + ':' + min
    }
    return y + separator + m + separator + d;
  }
  console.log(formatTime(Date.now(),1))