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

// Operaciones
function mnuOpeSitios() {
	fSessionValidate("fMnuSitios");
}

function fMnuSitios() {
	var url = fGetURLPag("interface/Sitios.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onSITLoad();
	});
}

function mnuOpeDestacados() {
	fSessionValidate("fMnuDestacados");
}

function fMnuDestacados() {
	var url = fGetURLPag("interface/Destacados.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onDESLoad();
	});
}

function mnuOpeBanners() {
	fSessionValidate("fMnuBanners");
}

function fMnuBanners() {
	var url = fGetURLPag("interface/Banners.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onBANLoad();
	});
}

function mnuOpeTAcceso() {
	fSessionValidate("fMnuTAcceso");
}

function fMnuTAcceso() {
	var url = fGetURLPag("interface/TAcceso.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onTACLoad();
	});
}

function mnuOpeSalir() {
	fSessionClose();
}