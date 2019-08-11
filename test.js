//document.write("<script type='text/javascript' src='util.js'><"+"/script>");

//!jw, general to specific
//!jw, require & import -> function or const
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var cors = require('cors');


 //======= 0. express setup
 //!jw, basic, import -> specific
const app = express();

var dbpost = {};
var dbboard = {};

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
   fs.readFile(__dirname + "/posdb.json", "utf8", function(err,data){
      var db = JSON.parse(data);
      for (var i=0; i<db.posts.length; i++){
         var inpost = {};
         inpost.id=db.posts[i].id;
         inpost.board_id=db.posts[i].board_id;
         inpost.post_title=db.posts[i].post_title;
         inpost.post_content=db.posts[i].post_content;
         inpost.post_user_name=db.posts[i].post_user_name;
         inpost.post_reg_date=db.posts[i].post_reg_date;
         inpost.post_reg_ip=db.posts[i].post_reg_ip;
         dbpost.postDetail = inpost;
      }
      for (var i=0; i<db.boards.length; i++){
         var inboard={};
         inboard.id = db.boards[i].id;
         inboard.board_name = db.boards[i].board_name;
         dbboard.boards = inboard;
      }
   })
})

//!jw what is the meaning of CORS? what  parameters below meanining?
//rz CORS issue occurs because of JS's Same Origin Policy. And the code below is for solving the issue, (Source: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
app.use(cors({
   'allowedHeaders': ['sessionId', 'Content-Type'],
   'exposedHeaders': ['sessionId'],
   'origin': '*',
   'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
   'preflightContinue': false
 }));

//!jw one time declaration and reuse
//>rz the line below is to give 'req' 'body attribute' and set encoding as UTF-8 automatically so that we can use req.body in simple way.
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//>rz the line below is to load all file that in the directory named 'public' which includes express.
app.use(express.static('public'));


//======= 1. api section
app.get('/main', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('Main page');
})

//======= 2. Read all data from db and store it as Global variable not to search db every single time.
var dbpost = {};
var dbboard = {};

process.on('exit', function () { //이때 저장..?
   //여기서 다시 db로 그동한 수정했던 정보들 모두 보내주기.
 });

//1. read all post
app.get('/postList', function(req,res) { //!jw, indentation ){ => ) {
   console.log("postList");
   var resArray = {};
   resArray.result = "Ok";
   resArray.postList = new Array();
   for(var i=0; i<dbpost.postDetail.length; i++){
      var inpostList={};
      inpostList.id = dbpost.postDetail[i].id;
      inpostList.post_title = dbpost.postDetail[i].post_title;
      inpostList.post_reg_date = dbpost.postDetail[i].post_reg_date;
      inpostList.post_reg_ip = dbpost.postDetail[i].post_reg_ip;
      resArray.postList.push(inpostList);
   }
   res.send(resArray);
})

//2. read all board list
app.get('/boardList', function(req,res){
   console.log("boardList");
   var resArray = {};
   resArray.result = "Ok";
   resArray.boardList = new Array();
   for (var i=0; i<dbboard.boards.length; i++){
         var inboardList = {};
         inboardList.id = dbboard.boards[i].id;
         inboardList.board_name = dbboard.boards[i].board_name;
         resArray.boardList.push(inboardList);
   }
   res.send(resArray);
})

//3. read all post which is in the designated board
app.get('/board/postList/:boardid', function(req,res){
   console.log('read all post which is in the designated board');
   var resArray = {};
   resArray.result = "Ok";
   resArray.postList = new Array();
   var id = req.params.boardid;
   for(var i=0; i<dbpost.posts.length; i++){
      var inpostList = {};
      if(id == dbpost.posts[i].board_id){
         inpostList.id=dbpost.posts[i].id;
         inpostList.post_title=dbpost.posts[i].post_title;
         inpostList.post_reg_date=dbpost.posts[i].post_reg_date;
         inpostList.post_reg_ip=dbpost.posts[i].post_reg_ip;
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
   for (var i=0; i<dbpost.posts.length; i++){
      if(id == dbpost.posts[i].id){
         var inpostDetail = {};
         inpostDetail.id=dbpost.posts[i].id;
         inpostDetail.board_id=dbpost.posts[i].board_id;
         inpostDetail.post_title=dbpost.posts[i].post_title;
         inpostDetail.post_content=dbpost.posts[i].post_content;
         inpostDetail.post_user_name=dbpost.posts[i].post_user_name;
         inpostDetail.post_reg_date=dbpost.posts[i].post_reg_date;
         inpostDetail.post_reg_ip=dbpost.posts[i].post_reg_ip;
         resArray.postDetail = inpostDetail;
         }
      }
   res.send(resArray);
})

//5. post new contents
app.get('/writepost/:boardid', function (req, res) {;
   res.sendFile(__dirname + "/writepost.html");
})

app.post('/postList', urlencodedParser, function(req,res){
   console.log('Writing new data');
   fs.readFile( __dirname + "/postdb.json", "utf8", function(err,data){
      var db = JSON.parse(data);   
      pushArray = {
      "id" : (db.posts.length+1),
      "board_id" : req.body.board_id, //해당 게시판에 들어가서 써줄 것이기 때문에 parser사용
      "post_title" : req.body.post_title,
      "post_content" : req.body.post_content,
      "post_user_name" : req.body.post_user_name, //현재 로그인 기능 없으므로 Default로 줌
      "post_reg_date" : getTimeStamp(),
      "post_reg_ip" : req.body.post_reg_ip
      };
      dbpost.posts.push(pushArray);
      fs.writeFile('postdb.json',JSON.stringify(db, '\n'),function(err){
         console.error(err);
      })
      res.send("Successfully Uploaded!")
   })
})

//6. delete content
app.delete('/postList', urlencodedParser, function(req,res){
   fs.readFile( __dirname + "/postdb.json", "utf8", function(err,data){
      var db = JSON.parse(data);
      for (i=0; i<db.posts.length; i++){
         if(req.body.postlist == db.posts[i].id){
            delete db.posts[req.params.id];
         }
      }
   res.send('Successfully deleted!')
   })
})

//7. modify content
app.get('/modifypost/:postid', function (req, res) {
   res.sendFile(__dirname + "/modifypost.html");
})

app.post('/modified', urlencodedParser, function(req,res){
   console.log('Modify existing data');
   for(i=0 ; i<dbpost.posts.length; i++){
      if(dbpost.posts[i].id == req.body.id){
         dbpost.posts[i].id = req.body.id;
         dbpost.posts[i].board_id = dbpost.posts[i].board_id;
         dbpost.posts[i].post_title = req.body.post_title;
         dbpost.posts[i].post_content = req.body.post_content;
         dbpost.posts[i].post_user_name = dbpost.posts[i].post_user_name;
         dbpost.posts[i].post_reg_date = getTimeStamp();
         dbpost.posts[i].post_reg_ip = req.body.post_reg_ip;
         }
       }
   fs.writeFile('postdb.json',JSON.stringify(db, '\n'),function(err){
      console.error(err);
   })
   res.send("Successfully Modified!")
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