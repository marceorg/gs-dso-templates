// Funciones Menu

// Home
function mnuHome() {
	fSessionValidate("fMnuHome");
}

function fMnuHome() {
	var url = fGetURLPag("interface/Inicio.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	// Resize
	fBrowserResize();
}

// Formularios
function mnuKYCPersFis() {
	fSessionValidate("fMnuKYCPersFis");
}

function fMnuKYCPersFis() {
	var url = fGetURLPag("interface/KYCPersFis.html?tipoAcc=F");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onKPFLoad();
	});
}

function mnuKYCPersJur() {
	fSessionValidate("fMnuKYCPersJur");
}

function fMnuKYCPersJur() {
	var url = fGetURLPag("interface/KYCPersJur.html?tipoAcc=F");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onKPJLoad();
	});
}

// Operaciones
function mnuKYCAprobacion() {
	fSessionValidate("fMnuKYCAprobacion");
}

function fMnuKYCAprobacion(vUser) {
	var url = fGetURLPag("interface/KYCAprobacion.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onKAPLoad(vUser);
	});
}

function fMnuDeselect() {
	// Deseleccionar menues
	dijit.byId("mFormularios")._setSelected(false);
	dijit.byId("mOperaciones")._setSelected(false);
}