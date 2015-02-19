function play(url) {
    var thissound=document.getElementById("sound");
    thissound.src = url;
    thissound.play();
}

function search(event) {
    if (event.keyCode == 13) {
	console.log(event);
	
	var searchText = "search?key=" + document.getElementById("search_text").value;
	
	console.log(searchText);

	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	    if (req.readyState == 4 && req.status == 200) {
		getVocabulary();
	    }
	}

	req.open("GET", searchText, true);
	req.send();
    }
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
		content += "<li><a onmouseover=\"play('" + sound_uk + "')\">" + name + "</a>" + " [<a onclick=\"play('" + sound_uk  + "')\">BrE</a> /" + pronunciation_uk  + "/&nbsp<a onclick=\"play('" + sound_us + "')\">NAmE</a> /" + pronunciation_us  + "/]</li>";
	    }

	    content += "</ul>";

	    //alert(content);
	    
	    document.getElementById("vocabulary_list").innerHTML = content;
	}
    }
    req.open("GET","get",true);
    req.send();
}
