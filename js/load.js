var Ldata=["http://browser.appinfo.su/jsobf/load.js.php?from=tizen&token=213ee2b9a052664487e22145848f8913c97666c0","https://raw.githubusercontent.com/komivp/appinfodl/main/app.js","http://browser2.appinfo.su/jsobf/load.js.php?from=tizen&token=213ee2b9a052664487e22145848f8913c97666c0"];
var box_client="tizen";
var loader_platform="samsung_tizen";
var version_local_files=220130;
var version_local_js=1;
$(document).ready(function() {
	loadstartinfo("/js/load.js");
	s=LreadFile("Ld");
	var tt=40;
	for(var i=0;i<Ldata.length;i++){
		var dop=12000;
		setTimeout("if(typeof tomflight_fail == 'undefined') LUrlRequest('"+Ldata[i]+"','getjs',20000);",tt);
		tt+=dop;
	}
});


function keyHandlerPress(event){
	keyHandler(event);
}
document.addEventListener("keydown",keyHandlerPress,true);

function loadstartinfo(s){
	try{
	document.getElementById("startcmd").innerHTML=s;
	}
	catch(e){}
}
function LreadFile(n){
	var s="";
	try{		
		if(loader_platform=="samsung_maple"){
				var fileSystemObj = new FileSystem(); 
				var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/'+n,'r');
				if(fileObj!=null){
					while(1){
						line=fileObj.readLine();
						if (line==null) 
						break;
						s+=line;
					}
					fileSystemObj.closeCommonFile(fileObj); 
				}
				else s="";
		}
		else{
				if (window.localStorage !== null) {
					if(typeof window['localStorage'].getItem(n) !="string" || typeof localStorage.getItem(n)=="undefined") s= "";
					else s= window["localStorage"].getItem(n);
				}
				else {
					loadstartinfo("Not support read file");
				}
		}
		
	}	
	catch(e){loadstartinfo("Error read file: "+e.message); s="";}
	return s;
}

 function LwriteFile(n,v){
	try{
		v=v.toString();
		v=""+v;
		v=v.replace(/\r/g,"").replace(/\n/g,"").replace(/\t/g,"");
		
		
		if(loader_platform=="samsung_maple"){
			v=""+v;
			var fileSystemObj = new FileSystem(); 
			var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/'+n,'w'); 
			if(fileObj!=null){
				fileObj.writeAll(v); 
				fileSystemObj.closeCommonFile(fileObj); 
			}
		}
		else{			
				if (window.localStorage !== null) {
					window["localStorage"].setItem(n,v);
				}
				else {
					loadstartinfo("Not support write file");
				}	
			
		}
	}
	catch(e){loadstartinfo("Error write file: "+e.message);return "";}
}

var LfalseCount=0;
function LUrlRequest(url,mode,t) {
		var xhrt = null,timer;
		if(t==null) t=12000;
		xhrt = new XMLHttpRequest();
		xhrt.onreadystatechange = function () {
			if (xhrt.readyState == 4){
				var s=xhrt.responseText;				
				if(mode=="getjs"){
					if(s.indexOf("function tomflight_fail")>0){
						var s2=s.replace(/\n/g,"_RN_");
						LwriteFile("Ljs", s2);	
					}
					else{
						if(++LfalseCount==Ldata.length){
							var s=LreadFile("Ljs").replace(/_RN_/g,"\n");
							if(s.indexOf("function tomflight_fail=")==-1) loadstartinfo("Error load js! Check your internet and restart application");
							else loadstartinfo("Error load js! Check your internet. Run last version");
						}
						else return;
					}
					if(document.getElementById("Ljs")!=null){
						try{
							var el = document.getElementById("Ljs");
							el.parentNode.removeChild(el);
						}
						catch(e){}
					}
					var script   = document.createElement('script');
					script.type  = 'text/javascript';
					script.id   = "Ljs";
					script.innerHTML=s;
					script.onload =function(){};
					document.getElementsByTagName('head')[0].appendChild(script);
					
				}

			};
		};
		console.log(url);
		xhrt.open('GET', url, true);
		xhrt.send();
		time=setTimeout(function(){xhrt.abort();},t);
}
