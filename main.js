let secVar = document.getElementById('sec');
let minsVar = document.getElementById('mins');
let hourVar = document.getElementById('hour');
let dayVar = document.getElementById('day');
let btnVar = document.querySelector('.btn');
let sh = document.querySelector('#shradha');
const lifeBirthdate = 'Jan 7 '+ (new Date().getFullYear()+1).toString();
var count =0;
localStorage.setItem('date','');

function countD(){
    let bday = document.querySelector('#birth-date').value;
    btnVar.addEventListener('click',()=>{
        localStorage.setItem('date',bday); 
        count = 0;
        if(localStorage.getItem('date')!=''){

            document.getElementsByTagName('h6')[0].style.display='none';
        }
    });
    if((localStorage.getItem('date')=='1 7 2022') || (localStorage.getItem('date')=='7 1 2022') || (localStorage.getItem('date')=='7 jan 2022') || (localStorage.getItem('date')=='jan 7 2022') || (localStorage.getItem('date')=='')){
        sh.innerHTML='Shradha';
    }else{
        sh.innerHTML='to you';
    }
    // let launchDate = localStorage.getItem('date')==''?new Date(lifeBirthdate+" 00:00:00").getTime():new Date(localStorage.getItem('date')+" 00:00:00").getTime() ;
    let launchDate = localStorage.getItem('date')==''?new Date("Jan 7 2022 00:00:00").getTime():new Date(localStorage.getItem('date')+" 00:00:00").getTime() ;
    var nowDate = new Date().getTime();
    let distance = launchDate - nowDate;
    var days = Math.floor(distance/(1000*60*60*24));
    var hours = Math.floor((distance%(1000*60*60*24))/(1000*60*60));
    var minutes = Math.floor((distance%(1000*60*60))/(1000*60));
    var seconds = Math.floor((distance%(1000*60))/1000);

    secVar.innerText=getZero(seconds);
    minsVar.innerHTML=getZero(minutes);
    hourVar.innerHTML=getZero(hours);
    dayVar.innerHTML=getZero(days);

    if(distance<0){
        secVar.innerHTML='00';
        minsVar.innerHTML='00';
        hourVar.innerHTML='00';
        dayVar.innerHTML='00';
        if(count==0){
            alert('OOps!!! Birthday already passed');
            count=1;
        }
    }
}

var x = setInterval(countD,1000);



function getZero(n){ //add 0 to 1 2 3 4 5 6 7 8 9 one digit num
    return(parseInt(n,10)<10?'0':'')+n;
}