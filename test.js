const express = require('express');
const app = express();
const bodyParser = require('body-parser');
type="text/javascript";
src="http://jsgetip.appspot.com/?getip";
var cors = require('cors');
app.use(cors({
   'allowedHeaders': ['sessionId', 'Content-Type'],
   'exposedHeaders': ['sessionId'],
   'origin': '*',
   'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
   'preflightContinue': false
 })); //solve sCORS Issue

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})

var db = {
   boards : [
      { id : 1, board_name : "BOARD 1"},
      { id : 2, board_name : "BOARD 2"},
      { id : 3, board_name : "BOARD 3"},
      { id : 4, board_name : "BOARD 4"},
   ],

   posts : [
      { id : 1, board_id : 1, post_title : "첫번째 게시글은 뭘 할까.", post_content : "post_content", post_user_name : "Summer", post_reg_date : "a", post_reg_ip : "b" },
      { id : 2, board_id : 2, post_title : "캣츠 12월 개봉 신난당", post_content : "post_content", post_user_name : "Summer", post_reg_date : "a", post_reg_ip : "b" },
      { id : 3, board_id : 3, post_title : "알라딘 재밌었다.", post_content : "post_content", post_user_name : "Summer", post_reg_date : "a", post_reg_ip : "b" },
      { id : 4, board_id : 4, post_title : "이상한 나라의 앨리스", post_content : "post_content", post_user_name : "Summer", post_reg_date : "a", post_reg_ip : "b" },
      { id : 5, board_id : 1, post_title : "임의로 넣은 게시글", post_content : "post_content", post_user_name : "Summer", post_reg_date : "a", post_reg_ip : "b" },
   ]

}



app.get('/main', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('Main page');
})

//1. read all post
app.get('/postList', function(req,res){
   console.log("postList");
   var resArray = {};
   resArray.result = "Ok";
   resArray.postList = new Array();
   for(var i=0; i<db.posts.length; i++){
      var inpostList = {};
      inpostList.id = db.posts[i].id;
      inpostList.post_title = db.posts[i].post_title;
      inpostList.post_reg_date = db.posts[i].post_reg_date;
      inpostList.post_reg_ip = db.posts[i].post_reg_ip;
      resArray.postList.push(inpostList);
   }
   res.send(resArray)
})

//2. read all board list
app.get('/boardList', function(req,res){
   console.log("boardList");
   var resArray = {};
   resArray.result = "Ok";
   resArray.boardList = new Array();
   for (var i=0; i<db.boards.length; i++){
      var inboardList = {};
      inboardList.id = db.boards[i].id;
      inboardList.board_name = db.boards[i].board_name;
      resArray.boardList.push(inboardList);
   }
   res.send(resArray)
})

//3. read all post which is in the designated board
app.get('/board/postList/:boardid', function(req,res){
   console.log('read all post which is in the designated board');
   var resArray = {};
   resArray.result = "Ok";
   resArray.postList = new Array();
   var id = req.params.boardid;
   for(var i=0; i<db.posts.length; i++){
      var inpostList = {};
      if(id == db.posts[i].board_id){
         inpostList.id=db.posts[i].id;
         inpostList.post_title=db.posts[i].post_title;
         inpostList.post_reg_date=db.posts[i].post_reg_date;
         inpostList.post_reg_ip=db.posts[i].post_reg_ip;
         resArray.postList.push(inpostList);
      }
   }
   res.send(resArray);
})

//4. read post detail
app.get('/board/post/:postid', function(req,res){
   console.log('read all post detail');
   var resArray = {};
   resArray.result = "Ok";
   resArray.postDetail = new Array();
   var id = req.params.postid;
   for (var i=0; i<db.posts.length; i++){
      var inpostDetail = {};
      if(id == db.posts[i].id){
         inpostDetail.id=db.posts[i].id;
         inpostDetail.board_id=db.posts[i].board_id;
         inpostDetail.post_title=db.posts[i].post_title;
         inpostDetail.post_content=db.posts[i].post_content;
         inpostDetail.post_user_name=db.posts[i].post_user_name;
         inpostDetail.post_reg_date=db.posts[i].post_reg_date;
         inpostDetail.post_reg_ip=db.posts[i].post_reg_ip;
         resArray.postDetail.push(inpostDetail);
         break;
      }
   }
   res.send(resArray);
})

//5. post new contents
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static('public'));
app.get('/writepost/:boardid', function (req, res) {
   res.sendFile("writepost.html");
})

app.post('/board/newpost:boardid', urlencodedParser, function(req,res){
   response = {
      id : db.posts.length+1,
      board_id : req.params.boardid, //해당 게시판에 들어가서 써줄 것이기 때문에 parser사용
      post_title : req.body.post_title,
      post_content : req.body.post_content,
      post_user_name : "Unknown", //현재 로그인 기능 없으므로 Default로 줌
      post_reg_date : getTimeStamp(),
      post_reg_ip : getip()
   };
   console.log(response);
   res.end(JSON.stringify(response));
})


//6. delete content
app.delete('/board/postDelete', function(req,res){
   res.send('delete content')
})

//7. modify post
app.get('/board/postModify', function(req,res){

})

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