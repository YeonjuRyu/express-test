/*const fetch = require("node-fetch");
var express =  require('express');
var app = express();
*/

/* 1번 기능
get all post
endpoint: 127.0.0.1:3000/postList
method: get* (read)
input param: none
output param: version
*/
function getallpost(cbFunc){
    let url = 'http://127.0.0.1:3000/postList';
    return fetch(url
    ,{method: 'GET'}) //promise
    .then((response) => response.json()) //json object
    .then((jsonObj) => {
        if(jsonObj.result == "Ok") {
            cbFunc(jsonObj.postList); 
        } else if(jsonObj.result == "fail") {
            alert('error! reason is:' + jsonObj.error)
        }
    })
}

/*2번 기능
endpoint: 127.0.0.1:3000/board/boardList
method: get* (read)
input param: none
output param: {result, boardList, error}
*/
function getboardlist(cbFunc){
    let url = 'http://127.0.0.1:3000/boardList'
    return fetch(url
    ,{method: 'GET'}) //promise
    .then((response) => response.json())
    .then((jsonObj) => {
        if(jsonObj.result == "Ok") {
            cbFunc(jsonObj.boardList); 
        } else if(jsonObj.result == "fail") {
            alert('error! reason is:' + jsonObj.error)
        }
    })
}

/*3번 기능
endpoint: 127.0.0.1:3000//board/postList/:board의 id 값(ex: 27.1.60.24:9900/board/postList/1)
method: get
input param: boardid
output param: {result, postList, error}
*/
function getpostlist(cbFunc,id){
    return fetch(
        'http://127.0.0.1:3000/board/postList/'+String(id)
        ,{method: 'GET'})
        .then((response) => response.json())
        .then((jsonObj) => {
            if(jsonObj.result == "Ok"){
                cbFunc(jsonObj.postList);
            } else if(jsonObj.result == "fail"){
                alert('error! reason is:' + jsonObj.error)
            }
    })
}
/*4번 기능
endpoint: 127.0.0.1:3000/board/post/:post의 id(ex: 27.1.60.24:9900/board/post/1)
method: get
input param: postid
output param: {result, postDetail, error}
*/
function getpostdetail(UICallback,id){
    return fetch('http://127.0.0.1:3000/board/post/'+String(id)
        ,{method:'GET'})
        .then((response) => response.json())
        .then((jsonObj) =>  {
            if(jsonObj.result == "Ok"){
                UICallback(jsonObj.postDetail);
            } else if(jsonObj.result == "fail"){
                alert('error! reason is:' + jsonObj.error);
            }
        })
}

/*5번 기능
endpoint: 27.1.60.24:9900/board/post/:post의 id(ex: 27.1.60.24:9900/board/post/1)
method: post
input param: postid
output param: {result, postDetail, error}

*/
function postnewcontent(infoArray,id){
    fetch('127.0.0.1:3000/board/post/'+String(id), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'},
        body: JSON.stringify(infoArray)
            })/*.then(response => response.json()) --> 이 부분 쓰면 token 문제 발생*/ 
            .then((jsonObj) =>  {
                if(jsonObj.result == "ok"){
                    alert('전송 성공')
                } else if(jsonObj.result == "fail"){
                    alert('error! reason is:' + jsonObj.error)
                }
            })
        }
