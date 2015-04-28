/*
JS Quiz Grader
Copyright 2013 MCHS Tech Club

Instructions for Usage:
 1.) Load into your page with jQuery
 2.) Set up questions (as <form> tags) with class "q" 
	 Set up questions (as <form> tags) with id equivalent to the question number
	 Set answer choices (as <input> tags) to all share a name attribute equal to the question number
	 
	EX:
		<form id="1" class="q"> (That's a question, question 1 to be specfic)
			<input name="1" value="a"> (Answer choice for question 1)
			<input name="2" value="b">
		</form>
 3.) Create an answer key as a JavaScript array that goes in order of the questions. You can obfuscate this if you like, but be sure to know
	 the variable name to use it later. Declare this answer key variable somewhere in your document, that way it can be used when grading.
	 If there are multiple answers (check all that apply question), create another array for that particular question in the answer key array.
	
	EX:
		VAR ANSWER_KEY = ["a","b","c","d"] - Question 1 is "a", Question 2 is "b", Question 3 is "c", etc.
		VAR ANSWER_KEY2 = ["a", ["b","c","d"], "a", "b"] - Question 1 is "a", Question 2 has multiple answers of "b", "c", and "d", etc.

 4.) To call to grade, call $getChoices(key), where key is your answer key.
 
Code Tips and Tricks:
 * Any function preceded with a $ depends on jQuery. If any of those don't work properly, check your jQuery install
 * If/Else blocks are labelled as "If Branch ____" to make explanations and identification easier
 
*/	

function $getChoices(key){
	var answers = [];
	var blanks = [];
	/*
	* $(".q") is used to identify the number of questions on screen, since each question has a class="q"
	* $("input[name="+i+"]") is a jQuery selector that targets all of the <input> elements, starting with the ones with a name="1"
	* The user-selected choices are pushed into an array designated for that particular question - all of these arrays are in turn part of a larger array
	*/
	for(i=1; i<= $(".q").length; i++){
		var choices = $("input[name="+i+"]");
		answers[i] = [];
		for(j=0; j<choices.length; j++){
			if( choices[j].checked ){
				answers[i].push(choices[j].value);
			}
		}
	}
	/*
	* Since all answers are in a 2D array (EX: answers[1][0] = "a"), if it is empty (EX: answers[1].length = 0), the question was skipped.
	* The index of each skipped question goes into the blanks[] array. EX: Question 5 was skipped, so 5 is in the blanks[] array.
	* The first element in the array is removed with answers.splice(0,1) - it is always going to be empty, since JS counts from 0.
	* If the blanks[] array is populated, the user is notified which questions were skipped.
	* In case nothing is skipped, the grade() function is called, passing in the collected answer choices and the answer key declared in HTML file
	*/
	for(var eachQuestion in answers){
		if(answers[eachQuestion].length < 1){
			blanks.push(eachQuestion);
		}
	}
	answers.splice(0,1);
	if(blanks.length >= 1){
		alert("You didn't answer questions: "+ blanks);
	}
	else{
		grade(key, answers);
	}
}

function grade(key, choices){
	var stats = {
		wrong: [],
		wrongCount: 0,
		percentCorrect: 0
	}
	/*
	* If-Branch Alpha tests to see if this particular question has multiple answers
	* If-Branch Beta - the number of answers selected by the user is compared to the amount of right answers
	* Else-Branch Beta - the values are compared EX: key[i][2] = choices[i][2] ?
	* Else-Branch Alpha compares the values straightforward EX: key[1] = choices[1] ?
	*/
	for(i=0; i<key.length; i++){
		// If-Branch Alpha
		if(key[i].length > 1){
			// If-Branch Beta
			if( key[i].length != choices[i].length ){
				stats.wrongCount++;
				stats.wrong.push(i);
			}
			// Else-Branch Beta
			else{
				for(j=0; j<key[i].length; j++){
					if( key[i][j] != choices[i][j] ){
						stats.wrongCount++;
						stats.wrong.push(i);
					}
				}
			}
		}
		// Else-Branch Alpha
		else{
			if( key[i] != choices[i] ){
				stats.wrongCount++;
				stats.wrong.push(i);
			}
		}
	}
	// Since JS is 0-based, the indexes of the wrong questions are all off by one. We increment them to make them correct.
	for(var k in stats.wrong){
		stats.wrong[k]++;
	}
	// A percentage correct is calculated, and the feedback function $giveFeedback() is executed.
	console.log(stats.wrongCount);
	stats.percentCorrect = (key.length - stats.wrongCount)/(key.length)*100;
	// If the modal is disabled (settings.modal.enabled = false), then only an alert() is displayed.
	if(settings.modal.enabled){
		$open(stats);
		$UIgiveFeedback(stats);
	}
	else{
		if(stats.wrong.length != 0){
			alert("You earned a " + stats.percentCorrect + "%" + "\n" + "You missed these questions: " + stats.wrong);
		}
		else{
			alert("You earned a 100%! Excellent work!");
		}
	}
}

	