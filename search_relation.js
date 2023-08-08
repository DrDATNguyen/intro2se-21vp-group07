fetch("searchh/searchh.json")
	.then(res => res.json())
	.then(data => 
	{
		console.log(data);
		document.getElementById('searchh').innerHTML = JSON.stringify(data.group_detail);
	});

function gethistory()
{
	var container = document.getElementById("searchh");
	
	fetch("searchh/searchh.json")
	.then(res => res.json())
	.then(data => 
	{
		console.log(data);
		document.getElementById('searchh').innerHTML = JSON.stringify(data.group_detail);
		for (var key in data.group_detail) 
					{
						//~ console.log(key);
                        //~ console.log(data.group_detail[key]);
                        var  tag = document.createElement("SPAN");
						console.log(data.group_detail[key]);
						var t = document.createTextNode(data.group_detail[key]);
						tag.appendChild(t);
						tag.style.display = 'inline-block';
						tag.style.width = '1px';
						tag.style.height = '1px';
						tag.style.backgroundColor = 'blue';
						tag.style.color = 'white';
						container.appendChild(tag);
					}
		//~ console.log(data.group_detail["after_date"]);
		//~ document.getElementById('rangeBottom').value = data.group_detail["after_date"];
		
	});
	//~ document.getElementById('searchh').innerHTML = document.getElementById('rangeTop').value;
	//~ console.log(document.getElementById('rangeTop').value);
	
	
	
}
