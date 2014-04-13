console.log("content script loaded");

function createNotification(){
	var parentOffset = $('body').offset();
	console.log("created notification div");
	var notifDiv = $('<div>');
	notifDiv.css('width', '100%');		
	notifDiv.css('height', '100px');		
	notifDiv.css('position', 'absolute');
	notifDiv.css('z-index', 9999);
	notifDiv.css('top', 0 - parentOffset.top);		
	notifDiv.css('left', 0 - parentOffset.left);
	notifDiv.css('background-color', '#e8a2a2');
	notifDiv.text('MapleTab Added!');
	notifDiv.css('text-align', 'center');
	notifDiv.css('line-height', '100px');

	notifDiv.hide();
	notifDiv.slideUp();
	$('body').append(notifDiv);
	
	notifDiv.slideDown();
	setTimeout(function(){
		notifDiv.slideUp();	
	}, 1000);
}

createNotification();
