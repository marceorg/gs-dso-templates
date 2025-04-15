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
function mnuBlank() {

}

function mnuOpeSiniestroCar() {
	fSessionValidate("fMnuOpeSiniestroCar");
}

function fMnuOpeSiniestroCar() {
	var url = fGetURLPag("interface/OpeSiniestroCar.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onOSCLoad();
	});
}

function mnuOpeSiniestroSeg() {
	fSessionValidate("fMnuOpeSiniestroSeg");
}

function fMnuOpeSiniestroSeg() {
	var url = fGetURLPag("interface/OpeSiniestroSeg.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onOSSLoad();
	});
}

function mnuOpeSiniestroFor() {
	fSessionValidate("fMnuOpeSiniestroFor");
}

function fMnuOpeSiniestroFor() {
	window.open(fGetURLPag("interface/OpeSiniestroFor.html"), "forms",
			"resizable=yes,height=450,width=450,top=50,left=100");
}

function mnuOpeReclamoCar() {
	fSessionValidate("fMnuOpeReclamoCar");
}

function fMnuOpeReclamoCar() {
	var url = fGetURLPag("interface/OpeReclamoCar.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onORCLoad();
	});
}

function mnuOpeReclamoSeg() {
	fSessionValidate("fMnuOpeReclamoSeg");
}

function fMnuOpeReclamoSeg() {
	var url = fGetURLPag("interface/OpeReclamoSeg.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onORSLoad();
	});
}

// Consultas
function mnuConOpeEmitidas() {
	fSessionValidate("fMnuConOpeEmitidas");
}

function fMnuConOpeEmitidas() {
	var url = fGetURLPag("interface/ConOpeEmitidas.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onCOELoad();
	});
}

function mnuConClientes() {
	fSessionValidate("fMnuConClientes");
}

function fMnuConClientes() {
	var url = fGetURLPag("interface/ConClientes.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onCCLLoad();
	});
}
function mnuConSiniestros() {
	fSessionValidate("fMnuConSiniestros");
}

function fMnuConSiniestros() {
	var url = fGetURLPag("interface/ConSiniestros.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onCSILoad();
	});
}

function fMnuDeselect() {
	// Deseleccionar menues
	dijit.byId("mOperaciones")._setSelected(false);
	dijit.byId("mConsultas")._setSelected(false);
}