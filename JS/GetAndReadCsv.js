$(document).ready(function () {
    $(function ReachSheet() {

        var aLatitude = [];
        var aLongtitude = [];
        var aTitle = [];
        var aIcon = [];
        var aTextdata = [];
        var aType = [];
        var aImg = [];
        var aInfoTitle = [];
        var dataAmount = 0;

        //console.log("w");

        //1eUgqe2z8gL1d9GrY2LwpAAxW9Wh2xOKOopqDNcISdpE 學長的試算表
        $.getJSON('https://spreadsheets.google.com/feeds/list/1wNhF8AjCgcqdzftTcBpmtAsfY5HHN6Dw0APrABZqxhA/1/public/values?alt=json', function (dataLog) {
                //console.log("gJson");
                dataAmount = dataLog.feed.entry.length;
                //console.log(dataAmount);
                for (var i = 0; i < dataAmount; i++) {
                    aLatitude[i] = dataLog.feed.entry[i].gsx$lat.$t;
                    aLongtitude[i] = dataLog.feed.entry[i].gsx$long.$t;
                    aTitle[i] = dataLog.feed.entry[i].gsx$tit.$t;
                    aIcon[i] = dataLog.feed.entry[i].gsx$ico.$t;
                    aTextdata[i] = dataLog.feed.entry[i].gsx$textdata.$t;
                    aType[i] = dataLog.feed.entry[i].gsx$type.$t; 
                    aImg[i] = dataLog.feed.entry[i].gsx$infoimage.$t;
                    aInfoTitle[i] = dataLog.feed.entry[i].gsx$infotitle.$t; // 以上依照指定進行抓試算表裡面的資料
                    $('#TextOutput').append("<br>" + aLatitude[i] + "," + aLongtitude[i] + "," + aTitle[i] + "," + aIcon[i] + "," + aTextdata[i] + "," +aType[i]+","+aImg[i]+","+aInfoTitle[i]);
                    
                    
                    CsvToArray(parseFloat(aLatitude[i]), parseFloat(aLongtitude[i]), aTitle[i], aIcon[i], aTextdata[i],aType[i],aImg[i],aInfoTitle[i], i); // 抓取資料到CsvToArray函數中

                } //end for
                console.log(GeoData);
                GetItemsFromGeoData();//這裡進行第一次打點
            } //end function data
        ); //end get JSON
    }); //end function

}); //end ready


var GeoJSONText;
var GeoData = new Array();
var items;
var a = -1;


function CsvToArray(Lat, Long, Tit, Ico, Tex, Typ, Img, InfoT, I) { 
    GeoData[I] = new Array();
    GeoData[I][0] = Lat;
    GeoData[I][1] = Long;
    GeoData[I][2] = Tit;//滑鼠移上顯示字樣
    GeoData[I][3] = Ico;//座標Icon
    GeoData[I][4] = Tex;//info內文
    GeoData[I][5] = Typ;//此座標分類
    GeoData[I][6] = Img;//此座標infoimage
    GeoData[I][7] = InfoT;//此座標的Title
} //end CsvToArray 將csv資料傳入陣列中

var markerArray =[];
var INum = 0;
var marker;
var InfoBoxContent;

function InfoBoxContentInput(){
    
    if(items[6] == "")
        {
            items[6] = "./TestIcon/noneImg.png";//判斷若沒有圖片來源則放上暫無圖片的示意圖
        }
    items[4] = items[4].replace(/\n|↵/g,"<br>"); //將CSV中的換行符號轉換成<br>讓其在infobox中也換行
    items[4] = items[4].replace(/\s/g,"\xa0");//將CSV中的空個符號\s換成no-break space \xa0 讓空格也可在infowindow中正常顯示
    
   
    InfoBoxContent = "<div id='InfoWindow'>"+"<img id='MapImage' src='"+items[6]+"'>" + "<h1 id='InfoTitle'>"+items[7]+"</h1>"+"<div id='InfoText'>"+items[4]+"</div>"+"</div>";
    //以上可以將想要的資訊依照格式置入後呈現在網頁中的infobox
}


function GetItemsFromGeoData() {
    for (INum = 0; INum < GeoData.length; INum++) {

        items = GeoData[INum]; //利用一個變數去取得一個陣列，可以將其二維中拉出一維
        //console.log(items);
        var infoWindow = new google.maps.InfoWindow({}); //end infoWindow 新增InfoWindow 到地圖上
        
            InfoBoxContentInput();//將讀取到的資料置入InfoBoxContent中，而後使用
        
         marker = new google.maps.Marker({
            position: {
                lat: items[0], //items[0] 相當於 GeoData[INum][0]
                lng: items[1]
            },
            map: map,
            title: items[2], //增加鼠標碰觸時候顯示文字
            icon: {
                url: items[3], //icon利用url導入路徑在換圖
                scaledSize: new google.maps.Size(50, 50)
            },
            animation: google.maps.Animation.DROP, // 在此加上載入落下動畫
            data: InfoBoxContent, //將文字加入跳出資訊窗 <img src='TestIcon/icon.jpg'>
        }); // end marker

        
        var IsMarkerOpen;
        marker.addListener('click', function () {
            if (this.getAnimation() == null) {
                this.setAnimation(google.maps.Animation.BOUNCE);
                infoWindow.setContent(this.data); // 將此marker的data輸入進infoWindow的content中
                /*if(!IsMarkerOpen){
                    infoWindow.open(map, this); //打開這個infoWindow
                    IsMarkerOpen = true;
                }
                else{
                    infoWindow.close(map,this);
                    IsMarkerOpen = false;
                }*/ // 此方法打開為重複點座標會一開一關
                 infoWindow.open(map, this); //打開這個infoWindow，若點擊其他座標會直接開啟並關閉原本開啟的座標
                IsMarkerOpen = true;
                this.setAnimation(null);
                console.log("IsMarkerOpen:"+IsMarkerOpen);
                
            }
        }); //end marker.addListener 點擊事件
        
        $('#menu').click(function(){
            infoWindow.close();
            IsMarkerOpen = false;
        });// end Click
        markerArray.push(marker); // 將所有剛產生的座標加入一個陣列之中 再引到markerArray中清除
        google.maps.event.addListener(marker,"click",function(){});
        MarkerSelect(marker, GeoData[INum][5]); //讀取GeoData[INum][5] 亦即試算表中的type 進涵式判斷
    } // end for
    
//console.log(markerArray.length);

} // end GetItemsFromGeoData 將資料從陣列拿出後並加上marker


var ClickValue = 0;
var RedDia;
var YBGR;
var Rest;
var YBulb;
var YGBulb;
var RedBulb;
var YGDia;
var Test;

var TestSpan;
var RedDiaSpan;
var YBGRSpan;
var RestSpan;
var YBulbSpan;
var YGBulbSpan;
var RedBulbSpan;
var YGDiaSpan; //span用來製造自定義的checkbox

onload = function () {
    var RedDia_img;
    var YellowCir_img;
    var BlueCir_img;
    var GreenCir_img;
    var RedBulb_img;
    var Rest_img;
    var YellowBulb_img;
    var YGBulb_img;
    var YGDia_img;
    var RedBulb_img2;
    var Test_img;
    
    RedDia_img = document.createElement("img");
    RedDia_img.src = "TestIcon/RedDiamond.png";
    document.getElementById("Red_Diamond").appendChild(RedDia_img);
    RedDia = document.createElement("input"); //動態生成一個input標籤
    RedDia.type = "checkbox"; // 給予生成的input有checkbox屬性 
    RedDia.checked = true; //預設其是被勾選狀態
    RedDia.addEventListener('click', function () {
        ValueCheck(RedDia.checked);
      }); //end RedDia click 給予checkbox 點擊事件，每次有被點擊呼叫ValueCheck()涵式
    document.getElementById("Red_Diamond").appendChild(RedDia); //將動態生成物件加入至指定區域
    RedDiaSpan = document.createElement("span");
    RedDiaSpan.setAttribute("class","checkmark");
    document.getElementById("Red_Diamond").appendChild(RedDiaSpan);
    document.getElementById("Red_Diamond").append("\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"+"鍾延豪文學地景")
    
    YellowCir_img = document.createElement("img");
    YellowCir_img.src = "TestIcon/YellowCircle.png";
    document.getElementById("YBGR_Group").appendChild(YellowCir_img);
    BlueCir_img = document.createElement("img");
    BlueCir_img.src = "TestIcon/BlueCircle.png";
    document.getElementById("YBGR_Group").appendChild(BlueCir_img);
    GreenCir_img = document.createElement("img");
    GreenCir_img.src = "TestIcon/GreenCircle.png";
    document.getElementById("YBGR_Group").appendChild(GreenCir_img);
    RedBulb_img = document.createElement("img");
    RedBulb_img.src = "TestIcon/RedBulb.png";
    document.getElementById("YBGR_Group").appendChild(RedBulb_img);   
    YBGR = document.createElement("input");
    YBGR.type = "checkbox";
    YBGR.checked = true;
    YBGR.addEventListener('click',function(){
        ValueCheck(YBGR.checked);
    });//end YBGR Click
    document.getElementById("YBGR_Group").appendChild(YBGR);
    YBGRSpan = document.createElement("span");
    YBGRSpan.setAttribute("class","checkmark");
    document.getElementById("YBGR_Group").appendChild(YBGRSpan);
    document.getElementById("YBGR_Group").append('\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'+"鍾肇政文學地景");
    // \xa0 NO-BREAK SPACE
    
    
    /*Rest_img = document.createElement("img");
    Rest_img.src = "TestIcon/Restaurant.png";
    document.getElementById("map-iconTip").appendChild(Rest_img);
    Rest = document.createElement("input");
    Rest.type = "checkbox";
    Rest.checked = true;
    Rest.addEventListener('click',function(){
        ValueCheck(Rest.checked);
    }); // just test*/
    
    
    Rest_img = document.createElement("img");
    Rest_img.src = "TestIcon/Restaurant.png";
    document.getElementById("Restaurant").appendChild(Rest_img);
    Rest = document.createElement("input");
    Rest.type = "checkbox";
    Rest.checked = true;
    Rest.addEventListener('click',function(){
        ValueCheck(Rest.checked);
    });// end Rest Click
    document.getElementById("Restaurant").appendChild(Rest);
    RestSpan = document.createElement("span");
    RestSpan.setAttribute("class","checkmark");
    document.getElementById("Restaurant").appendChild(RestSpan);
    document.getElementById("Restaurant").append("\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"+"鍾肇政愛吃的餐館");
    
    
    YellowBulb_img = document.createElement("img");
    YellowBulb_img.src = "TestIcon/YellowBulb.png";
    document.getElementById("Yellow_Bulb").appendChild(YellowBulb_img);
    YBulb = document.createElement("input");
    YBulb.type = "checkbox";
    YBulb.checked = true;
    YBulb.addEventListener('click',function(){
        ValueCheck(YBulb.checked);
    });// end Rest Click
    document.getElementById("Yellow_Bulb").appendChild(YBulb);
    YBulbSpan = document.createElement("span");
    YBulbSpan.setAttribute("class","checkmark");
    document.getElementById("Yellow_Bulb").appendChild(YBulbSpan);
    document.getElementById("Yellow_Bulb").append("\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"+"鍾肇政居住地");
    
    
    
    YGBulb_img = document.createElement("img");
    YGBulb_img.src = "TestIcon/YellowGreenBulb.png";
    document.getElementById("YG_Buld").appendChild(YGBulb_img);
    YGBulb = document.createElement("input");
    YGBulb.type = "checkbox";
    YGBulb.checked = true;
    YGBulb.addEventListener('click',function(){
        ValueCheck(YGBulb.checked);
    });//end YGBlub Click
    document.getElementById("YG_Buld").appendChild(YGBulb);
    YGBulbSpan = document.createElement("span");
    YGBulbSpan.setAttribute("class","checkmark");
    document.getElementById("YG_Buld").appendChild(YGBulbSpan);
    document.getElementById("YG_Buld").append("\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"+"文學館舍及藝文空間");
    
    RedBulb_img2 = document.createElement("img");
    RedBulb_img2.src = "TestIcon/RedBulb.png";
    document.getElementById("Red_Buld").appendChild(RedBulb_img2);
    RedBulb = document.createElement("input");
    RedBulb.type = "checkbox";
    RedBulb.checked = true;
    RedBulb.addEventListener('click',function(){
        ValueCheck(RedBulb.checked);
    });//end RedBulb click
    document.getElementById("Red_Buld").appendChild(RedBulb);
    RedBulbSpan = document.createElement("span");
    RedBulbSpan.setAttribute("class","checkmark");
    document.getElementById("Red_Buld").appendChild(RedBulbSpan);
    document.getElementById("Red_Buld").append("\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"+"全臺文學館舍");
    
    YGDia_img = document.createElement("img");
    YGDia_img.src = "TestIcon/YellowGreenDiamond.png";
    document.getElementById("YG_Diamond").appendChild(YGDia_img);
    YGDia = document.createElement("input");
    YGDia.type = "checkbox";
    YGDia.checked = true;
    YGDia.addEventListener('click',function(){
        ValueCheck(YGDia.checked);
    });//end YGDia Click
    document.getElementById("YG_Diamond").appendChild(YGDia);
    YGDiaSpan = document.createElement("span");
    YGDiaSpan.setAttribute("class","checkmark");
    document.getElementById("YG_Diamond").appendChild(YGDiaSpan);
    document.getElementById("YG_Diamond").append("\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"+"馮輝岳及向鴻全文學地景");
    
  // this area is for test  
   /* Test_img = document.createElement("img");
    Test_img.src = "TestIcon/RedDiamond.png";
    document.getElementById("myTest").appendChild(Test_img);
    Test = document.createElement("input");
    Test.type = "checkbox";
    Test.checked = true; 
    document.getElementById("myTest").appendChild(Test);
    
    TestSpan = document.createElement("span");
    TestSpan.setAttribute("class","checkmark");
    document.getElementById("myTest").appendChild(TestSpan);*/
    
 //this area is for test
    
} //end onload 動態分類區塊生成用 

function ValueCheck(RedDiaValue) {
    MarkerReset();
    GetItemsFromGeoData();
}



function MarkerSelect(TheMarker, TypeName) {
   /* if (IconName == "TestIcon/RedDiamond.png" && RedDia.checked) {
        
        TheMarker.setVisible(true);
        
    }
    else if(IconName == "TestIcon/Restaurant.png" && Rest.checked){
        TheMarker.setVisible(true);
    }
    else if(IconName == "TestIcon/YellowCircle.png" && YBGR.checked || IconName == "TestIcon/BlueCircle.png" && YBGR.checked || IconName == "TestIcon/GreenCircle.png" && YBGR.checked|| IconName == "TestIcon/RedBulb.png" && YBGR.checked){
        TheMarker.setVisible(true);
    }
    else if(IconName == "TestIcon/YellowBulb.png" && YBulb.checked){
        TheMarker.setVisible(true);
    }
    else if(IconName == "TestIcon/YellowGreenBulb.png" && YGBulb.checked){
        TheMarker.setVisible(true);
    }
    else if(IconName == "TestIcon/RedBulb.png" && RedBulb.checked){
        TheMarker.setVisible(true);
    }
    else if(IconName =="TestIcon/YellowGreenDiamond.png" && YGDia.checked){
        TheMarker.setVisible(true);
    }
    else{
        TheMarker.setVisible(false);
    }*/ //利用圖檔路徑判斷此座標的分類
    /*
        1 鍾延豪文學地景
        2345 鍾肇政文學地景
        6 鍾肇政愛吃的餐館
        7 鍾肇政居住地
        8 文學館舍及藝文空間
        5 全臺文學館舍
        9 馮輝岳及向鴻全文學地景
        
    */
    if (TypeName == "1" && RedDia.checked) {
        TheMarker.setVisible(true);
    }
    else if(TypeName == "6" && Rest.checked){
        TheMarker.setVisible(true);
    }
    else if(TypeName == "2" && YBGR.checked || TypeName == "3" && YBGR.checked || TypeName == "4" && YBGR.checked|| TypeName == "5" && YBGR.checked){
        TheMarker.setVisible(true);
    }
    else if(TypeName == "7" && YBulb.checked){
        TheMarker.setVisible(true);
    }
    else if(TypeName == "8" && YGBulb.checked){
        TheMarker.setVisible(true);
    }
    else if(TypeName == "5" && RedBulb.checked){
        TheMarker.setVisible(true);
    }
    else if(TypeName =="9" && YGDia.checked){
        TheMarker.setVisible(true);
    }
    else{
        TheMarker.setVisible(false);
    } //利用多一欄的編號資料來判斷此座標分類
   

} // end MarkerSelect 用來判斷甚麼座標分類該顯示

function MarkerReset(){

    for(var MRC=0; MRC < markerArray.length; MRC++){
        markerArray[MRC].setMap(null);
    }
    markerArray.length = 0;
    
}// end MarkerReset 