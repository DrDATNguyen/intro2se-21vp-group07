fetch("searchh/searchh.json")
	.then(res => res.json())
	.then(data => 
	{
		console.log(data);
		document.getElementById('searchh').innerHTML = JSON.stringify(data.group_detail);
	});

function gethistory()
{
	fetch("searchh/searchh.json")
	.then(res => res.json())
	.then(data => 
	{
		console.log(data);
		document.getElementById('searchh').innerHTML = JSON.stringify(data.group_detail);
	});
	
}
