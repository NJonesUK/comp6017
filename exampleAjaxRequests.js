AJAX:


$.ajax({
type:'GET',
	url: 'http://localhost:8888/users/2',
	success: function(data){
		console.log(data)
	}
});


	$.ajax({
		type: 'PUT',
		url: 'http://localhost:8888/users/2',
		data: 'firstname=Nick&lastname=Carins&email=tc14g10@ecs.soton.ac.uk&password=world',
		success: function(data){
			console.log(data)
		}
	})


$.ajax({
	type:'POST',
	url: 'http://localhost:8888/users',
	data: 'firstname=richard&lastname=reading&email=rr15g10@ecs.soton.ac.uk&password=hello',
	success: function(data){
		console.log(data)	
	}
});


$.ajax({
	type:'DELETE',
	url: 'http://localhost:8888/users/1',
	success: function(data){
		console.log(data)
	}
});