AJAX:

/*
	USERS
*/

$.ajax({
type:'GET',
	url: 'http://localhost:8888/users/1',
	success: function(data){
		console.log(data)
	}
});

$.ajax({
	type:'GET',
	url: 'http://localhost:8888/users/1',
	success: function(data){
		console.log(data)
	}
});


$.ajax({
	type:'POST',
	url: 'http://localhost:8888/users',
	data: 'firstname=bbc&lastname=reading&email=rr15g10@ecs.soton.ac.uk&password=hello',
	success: function(data){
		console.log(data)	
	}
});


$.ajax({
	type: 'PUT',
	url: 'http://localhost:8888/users/1',
	data: 'firstname=Nick&lastname=Carins&email=tc14g10@ecs.soton.ac.uk&password=world',
	success: function(data){
		console.log(data)
	}
})


$.ajax({
	type:'DELETE',
	url: 'http://localhost:8888/users/1',
	success: function(data){
		console.log(data)
	}
});


/*
	QUESTIONS
*/

$.ajax({
	type:'GET',
	url: 'http://localhost:8888/questions',
	success: function(data){
		console.log(data)
	}
});

$.ajax({
	type:'GET',
	url: 'http://localhost:8888/questions/1',
	success: function(data){
		console.log(data)
	}
});


$.ajax({
	type:'POST',
	url: 'http://localhost:8888/questions',
	data: 'content=Why is Node ORM crap&title=ThisTitleIsBiggerThan10Chars',
	success: function(data){
		console.log(data)	
	}
});


$.ajax({
	type: 'PUT',
	url: 'http://localhost:8888/questions/1',
	data: 'content=This has been updated yayyyyyy&title=updated and gerater than 10',
	success: function(data){
		console.log(data)
	}
});


$.ajax({
	type:'DELETE',
	url: 'http://localhost:8888/questions/1',
	success: function(data){
		console.log(data)
	}
});

/*
	Answers
*/

$.ajax({
	type:'GET',
	url: 'http://localhost:8888/answers',
	success: function(data){
		console.log(data)
	}
});


$.ajax({
	type:'GET',
	url: 'http://localhost:8888/answers/1',
	success: function(data){
		console.log(data)
	}
});


$.ajax({
	type:'POST',
	url: 'http://localhost:8888/answers',
	data: 'content=Wooooo i think this is the answer because Im awesome',
	success: function(data){
		console.log(data)	
	}
});


$.ajax({
	type: 'PUT',
	url: 'http://localhost:8888/answers/1',
	data: 'content=I was wrong, crap.',
	success: function(data){
		console.log(data)
	}
})


$.ajax({
	type:'DELETE',
	url: 'http://localhost:8888/answers/1',
	success: function(data){
		console.log(data)
	}
});




