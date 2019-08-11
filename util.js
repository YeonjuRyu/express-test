//Add1. 시간데이터 인덱싱을 통해 원하는 구간만 자르기 위한 함수
function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
    if (n.length < digits) {
       for (i = 0; i < digits - n.length; i++)
       zero += '0';
     }
    return zero + n;
 }
 
 //Add2. 현재 시간을 가져오는 함수
 function getTimeStamp() {
    var d = new Date();
    var ampm;
    if (leadingZeros(d.getHours(), 2) < 13){
        ampm="AM";
    }
    else {ampm ="PM"};
    var s = leadingZeros(d.getFullYear(), 4) + '-' + leadingZeros(d.getMonth() + 1, 2)
    + '-' + leadingZeros(d.getDate(), 2) + ' ' +leadingZeros(d.getHours(), 2)
    + ':' +leadingZeros(d.getMinutes(), 2) + ':' + leadingZeros(d.getSeconds(), 2) + ' ' +ampm;
    return s;
 }