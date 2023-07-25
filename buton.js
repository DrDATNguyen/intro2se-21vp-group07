function displayside()
{
    var a = document.getElementById('sides').style.width;
    if (a != '280px') 
        document.getElementById('sides').style.width = '280px';
    else document.getElementById('sides').style.width = '90px';
}

function changeTongquan()
{
    document.getElementById('test').innerHTML = 'Sơ lược tổng quan';
    document.getElementById('show').innerHTML = document.getElementById('board1').innerHTML;
}

function changeTimkiem()
{
    document.getElementById('test').innerHTML = 'Tìm kiếm rộng';
    document.getElementById('show').innerHTML = document.getElementById('board2').innerHTML;
    
    fetch("searchh/searchh.json");
	.then(res => res.json())
	.then(data => 
	{
		console.log(data);
		document.getElementById('searchh').innerHTML = JSON.stringify(data.group_detail);
	});
}

function defaultScreen()
{
    changeTimkiem();
}
