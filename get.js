function play(url) {
    var thissound=document.getElementById("sound");
    thissound.src = url;
    thissound.play();
}

function search() {
    var searchTextField = document.getElementById("search_text");
    var _value = searchTextField.value;

    var searchTextDiv = document.getElementById("search_detail_div");

    var searchText = "search?key=" + _value;
    //searchTextField.value = "";                                                                                                                                              

    console.log(searchText);

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            searchTextDiv.innerHTML = "The search of " + _value + " is finished."

            if (JSON.parse(req.responseText) === 0) {
                getVocabulary();
            } else {
                _id = _value + "-li";
                _element = document.getElementById(_id);
                _element.style.color = "blue";
                _element.style.fontStyle = "italic";
                location.hash = _id;
            }

            searchTextField.value = "";
        }
    }

    req.open("GET", searchText, true);
    req.send();

    searchTextDiv.innerHTML = "Searching for " + _value  + " ...";
}

function searchRelative(name) {
    console.log("search" + name);

    var searchTextField = document.getElementById("search_text");
    searchTextField.value = name;

    search();

    var relativeDiv = document.getElementById("relative_div");
    relativeDiv.hidden = true;
}

function getRelative(_value) {
    console.log("Query relative.");
    var _query = "relative?key=" + _value; 
    var req = new XMLHttpRequest();
    
    var relativeDiv = document.getElementById("relative_div");

    req.onreadystatechange = function() {
	if (req.readyState == 4 && req.status == 200) {
	    var _list = JSON.parse(req.responseText).results;

	    var _length = _list.length;

	    var relativeList = "<ul>"

	    for (i=0; i< _length; i++) {
		var _row = _list[i].searchtext;
		relativeList += "<li><a onclick='searchRelative(\"" + _row + "\")'>" + _row + "</a></li>";
	    }

	    relativeList += "</ul>"

	    relativeDiv.innerHTML = relativeList;

	    relativeDiv.hidden = false;
	}
    }

    req.open("GET", _query, true);
    req.send();
}

function query(event) {
    console.log(event);

    var searchTextField = document.getElementById("search_text");
    var _value = searchTextField.value;

    var searchTextDiv = document.getElementById("search_detail_div");
    searchTextDiv.innerHTML = _value;

    console.log(_value.length);

    if (event.keyCode == 13) {
	search();
	
/*	var searchText = "search?key=" + _value;
	//searchTextField.value = "";
	
	console.log(searchText);

	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	    if (req.readyState == 4 && req.status == 200) {
		searchTextDiv.innerHTML = "The search of " + _value + " is finished."

		if (JSON.parse(req.responseText) === 0) {
		    getVocabulary();
		} else {
		    _id = _value + "-li";
		    _element = document.getElementById(_id);
		    _element.style.color = "blue";
		    _element.style.fontStyle = "italic";
		    location.hash = _id;
		}

		searchTextField.value = "";
	    }
	}

	req.open("GET", searchText, true);
	req.send();
	
	searchTextDiv.innerHTML = "Searching for " + searchTextField.value + " ...";*/
    } else if (_value.length > 1) {
	getRelative(_value);
	
/*	console.log("Query relative.");
	var _query = "relative?key=" + _value; 
	var req = new XMLHttpRequest();
	
	var relativeDiv = document.getElementById("relative_div");

	req.onreadystatechange = function() {
	    if (req.readyState == 4 && req.status == 200) {
		var _list = JSON.parse(req.responseText).results;

		var _length = _list.length;

		var relativeList = "<ul>"
		
		for (i=0; i< _length; i++) {
		    relativeList += "<li>" + _list[i].searchtext + "</li>";
		}

		relativeList += "</ul>"

		relativeDiv.innerHTML = relativeList;

		relativeDiv.hidden = false;
	    }
	}

	req.open("GET", _query, true);
	req.send();*/
    }
}

function getVocabularyDetail(name) {
    var vocabularyDetail = document.getElementById(name);
    
    if (vocabularyDetail.hidden) {
	vocabularyDetail.hidden = false;
    } else {
	vocabularyDetail.hidden = true;
    }
}

function getVocabulary() {
    req = new XMLHttpRequest();
    req.onreadystatechange = function()
    {
	if (req.readyState == 4 && req.status == 200)
	{
	    vocabularyObj = JSON.parse(req.responseText);

	    content = "<ol reversed>";

	    for (i=0;i<vocabularyObj.vocabulary.length-1;i++){
		vocabulary = vocabularyObj.vocabulary[i];
		name = decodeURIComponent(vocabulary.name);
		pronunciation_uk = decodeURIComponent(vocabulary.pronunciation_uk);
		sound_uk = decodeURIComponent(vocabulary.sound_uk);
		pronunciation_us = decodeURIComponent(vocabulary.pronunciation_us);
		sound_us = decodeURIComponent(vocabulary.sound_us);
		definition = decodeURIComponent(vocabulary.definition);

		content += "<li><a id='" + name + "-li' onmouseover=\"play('" + sound_uk + "')\" onclick=\"getVocabularyDetail('" + name  +  "')\">" + name + "</a>" + " [<a onclick=\"play('" + sound_uk  + "')\">BrE</a> /" + pronunciation_uk  + "/&nbsp<a onclick=\"play('" + sound_us + "')\">NAmE</a> /" + pronunciation_us  + "/]</li>";
		content += "<div id='" + name + "' style='border:1px solid #000' hidden='true'>" + definition  + "</div>"
	    }

	    content += "</ol>";

	    //alert(content);
	    
	    document.getElementById("vocabulary_list").innerHTML = content;
	}
    }
    req.open("GET","get",true);
    req.send();
}
