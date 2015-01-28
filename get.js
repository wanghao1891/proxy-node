function play(url) {
    var thissound=document.getElementById("sound");
    thissound.src = url;
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
		vocabulary = vocabularyObj.vocabulary[i];
		name = decodeURIComponent(vocabulary.name);
		pronunciation_uk = decodeURIComponent(vocabulary.pronunciation_uk);
		sound_uk = decodeURIComponent(vocabulary.sound_uk);
		pronunciation_us = decodeURIComponent(vocabulary.pronunciation_us);
		sound_us = decodeURIComponent(vocabulary.sound_us);
		content += "<li>" + name + " [<a href=\"\" onmouseover=\"play('" + sound_uk  + "')\">BrE /" + pronunciation_uk  + "/</a>&nbsp<a href=\"\" onmouseover=\"play('" + sound_us + "')\">NAmE /" + pronunciation_us  + "/</a>]</li>";
	    }

	    content += "</ul>";

	    //alert(content);
	    
	    document.getElementById("vocabulary_list").innerHTML = content;
	}
    }
    req.open("GET","get",true);
    req.send();
}
