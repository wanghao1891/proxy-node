function play(soundobj) {
    var thissound=document.getElementById(soundobj);
    thissound.play();
}

function getVocabulary() {
    req = new XMLHttpRequest();
    req.onreadystatechange = function()
    {
	if (req.readyState == 4 && req.status == 200)
	{
	    vocabularyObj = JSON.parse(req.responseText);

	    content = "<ul>";

	    for (i=0;i<vocabularyObj.vocabulary.length-1;i++){
		content += "<li><a href=\"javascript:play('hello')\">" + vocabularyObj.vocabulary[i].name + "</a></li>";
	    }

	    content += "</ul>";

	    //alert(content);
	    
	    document.getElementById("vocabulary_list").innerHTML = content;
	}
    }
    req.open("GET","get",true);
    req.send();
}
