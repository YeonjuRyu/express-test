//!jw, general to specific
//!jw, require & import -> function or const
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var cors = require('cors');


 //======= 0. express setup
 //!jw, basic, import -> specific
const app = express();

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})

//!jw what is the meaning of CORS? what  parameters below meanining?
app.use(cors({
   'allowedHeaders': ['sessionId', 'Content-Type'],
   'exposedHeaders': ['sessionId'],
   'origin': '*',
   'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
   'preflightContinue': false
 })); //solve sCORS Issue

//!jw one time declaration and reuse
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static('public'));


//======= 1. api section
app.get('/main', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('Main page');
})

//1. read all post
app.get('/postList', function(req,res) { //!jw, indentation ){ => ) {
   console.log("postList");
   fs.readFile( __dirname + "/postdb.json", "utf8", function(err,data) {
      var resArray = {};
      resArray.result = "Ok";
      resArray.postList = new Array();
      var db = JSON.parse(data); //readFile에서 data가 txt형식으로 넘어오게됨. 따라서 다시 jsonobj형태로 바꿔줘야함
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
})

//2. read all board list
app.get('/boardList', function(req,res){
   console.log("boardList");
   fs.readFile( __dirname + "/postdb.json", "utf8", function(err,data){
      var resArray = {};
      resArray.result = "Ok";
      resArray.boardList = new Array();
      var db = JSON.parse(data);
      for (var i=0; i<db.boards.length; i++){
         var inboardList = {};
         inboardList.id = db.boards[i].id;
         inboardList.board_name = db.boards[i].board_name;
         resArray.boardList.push(inboardList);
   }
   res.send(resArray);
   })
})

//3. read all post which is in the designated board
app.get('/board/postList/:boardid', function(req,res){
   console.log('read all post which is in the designated board');
   fs.readFile( __dirname + "/postdb.json", "utf8", function(err,data){
      var resArray = {};
      resArray.result = "Ok";
      resArray.postList = new Array();
      var db = JSON.parse(data);
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
})

//4. read post detail
app.get('/board/post/:postid', function(req,res){
   console.log('read all post detail');
   fs.readFile( __dirname + "/postdb.json", "utf8", function(err,data){
      var resArray = {};
      resArray.result = "Ok";
      resArray.postDetail = new Array();
      var db = JSON.parse(data);
      var id = req.params.postid;
      for (var i=0; i<db.posts.length; i++){
         if(id == db.posts[i].id){
            var inpostDetail = {};
            inpostDetail.id=db.posts[i].id;
            inpostDetail.board_id=db.posts[i].board_id;
            inpostDetail.post_title=db.posts[i].post_title;
            inpostDetail.post_content=db.posts[i].post_content;
            inpostDetail.post_user_name=db.posts[i].post_user_name;
            inpostDetail.post_reg_date=db.posts[i].post_reg_date;
            inpostDetail.post_reg_ip=db.posts[i].post_reg_ip;
            resArray.postDetail = inpostDetail;
         }
      }
   res.send(resArray);
   })
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
      db.posts.push(pushArray);
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

//7. post new contents
app.get('/modifypost/:postid', function (req, res) {
   res.sendFile(__dirname + "/modifypost.html");
})

app.post('/modified', urlencodedParser, function(req,res){
   console.log('Modify existing data');
   fs.readFile( __dirname + "/postdb.json", "utf8", function(err,data){
      var db = JSON.parse(data);
      for(i=0 ; i<db.posts.length; i++){
         if(db.posts[i].id == req.body.id){
            db.posts[i].id = req.body.id;
            db.posts[i].board_id = db.posts[i].board_id;
            db.posts[i].post_title = req.body.post_title;
            db.posts[i].post_content = req.body.post_content;
            db.posts[i].post_user_name = db.posts[i].post_user_name;
            db.posts[i].post_reg_date = getTimeStamp();
            db.posts[i].post_reg_ip = req.body.post_reg_ip;
         }
       }
       fs.writeFile('postdb.json',JSON.stringify(db, '\n'),function(err){
         console.error(err);
      })
      res.send("Successfully Modified!")
   })
})

//0. auxilary functions -> maybe split to util.js?
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