// Funciones Dialog
function fMsgBox(message, title, image) {
	document.getElementById("lblMsgBox").innerHTML = message;
	if (title) {
		dijit.byId("dlgMsgBox").set("title", title);
	}
	if (image) {
		document.getElementById("imgMsgBox").style.display = "";
		document.getElementById("imgMsgBox").src = fGetIcon(image);
	} else {
		document.getElementById("imgMsgBox").style.display = "none";
	}
	dijit.byId("dlgMsgBox").show();
}

function fQstBox(message, fnct) {
	document.getElementById("lblQstBox").innerHTML = message;
	document.getElementById("hQstBoxFnc").value = fnct;
	dijit.byId("dlgQstBox").show();
}

function fQstBoxYes() {
	dijit.byId('dlgQstBox').onCancel();
	eval(document.getElementById("hQstBoxFnc").value);
}
