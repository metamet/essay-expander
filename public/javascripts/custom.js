$(function(){

	// Push any of the buttons. 
	$('#processWords button').click(function() {
		event.preventDefault();
		// Get the button value so we know what they do
		var parameters = { input: $('#results').text(), min: $(this).val() };
		// Save it for later.
		if (parameters.min == "save") {
			saveEdits();
			$('#saved').fadeIn( 200 ).delay( 600 ).fadeOut( 50 );
			return;
		}
		// The number process the string. 
		$.get( '/process',parameters, function(data) {
			var result = JSON.parse(data);
			var newTable = '';
			// Wrap each word in a span. If there are synonynms, class it up. 
			for (var i = 0; i < result.length; i++) {
				if (result[i].syn.length > 0) {
					newTable += '<span id="w' + i + '" class="word" data-synonyms="' + result[i].syn + '" >';
					newTable += result[i].word;
					newTable += '</span> ';
				} else {
					newTable += '<span id="w' + i + '">';
					newTable += result[i].word;
					newTable += '</span> ';
				}
			}
			// Spit it back out on the table. Blech!
			$('#results').html(newTable);
		});
		$('#processWords button').removeClass('active inactive');
		$(this).addClass('active');
		$('#results').addClass('active').removeClass('inactive');
	});
	
	// Hover over word to see replacements.
	// Hover off the word or #synonym to make it disappear.
	$('#results').on({
		mouseover: function (e) {
			if ($(this).data('synonyms') !== "") {
				var replacementId = $(this).attr('id');
				var replacementWord = $(this).text();
				var synonyms = $(this).data('synonyms').split(',');
				$('#synonymwell').html('<h3>Replacements for "' + replacementWord + '"</h3><ul>' + $.map(synonyms, function(v, i) { 
					return '<li><a href="#" class="replacement">' + v + '</a></li>';
				}).join('') + '</ul>');
				var wordPosition = $(this).position();
				$('#synonymmodal').attr('data-replacement',replacementId).css({left: wordPosition.left,top: wordPosition.top + 23}).show();
			}
		},
		mouseleave: function () {
			// https://stackoverflow.com/questions/1273566/how-do-i-check-if-the-mouse-is-over-an-element-in-jquery/13382705#13382705?newreg=078893fce8f04bf3ba49bc3f6623edfd
			if ($('#synonymmodal:hover').length != 0) {
				$('#synonymmodal').on({
					mouseleave: function () {
						$('#synonymmodal').hide();
					}		
				});
			} else {
				$('#synonymmodal').hide();
			}
		}
	}, '.word');
	
	// Function to replace the original word with the replacement word
	$('#synonymmodal').on({
		click: function (e) {
			e.preventDefault();
			var oldWordId = $('#synonymmodal').attr('data-replacement');
			var newWord = $(this).text();
			$('#' + oldWordId).text(newWord);
			$('#synonymmodal').hide();
		}	
	}, '.replacement');
	
	// http://www.developerdrive.com/2012/06/allowing-users-to-edit-text-content-with-html5/
	function saveEdits() {
		var editElem = document.getElementById("results");
		var userVersion = editElem.innerHTML;
		localStorage.userEdits = userVersion;
	}
	
	function checkEdits() {
		if(localStorage.userEdits!=null) {
			document.getElementById("results").innerHTML = localStorage.userEdits;
		}
	}
	
	checkEdits();
});