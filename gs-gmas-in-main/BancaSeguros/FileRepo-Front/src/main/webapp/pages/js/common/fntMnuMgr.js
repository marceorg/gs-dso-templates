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

// Parametros
function mnuParTipoDoc() {
	if (fSessionValidate().pSft) {
		fMnuParTipoDoc();
	}
}

function fMnuParTipoDoc() {
	var url = fGetURLPag("interface/ParTipoDoc.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onPTDLoad();
	});
}

function mnuParPermisos() {
	if (fSessionValidate().pSft) {
		fMnuParPermisos();
	}
}

function fMnuParPermisos() {
	var url = fGetURLPag("interface/ParPermisos.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onPPELoad();
	});
}

function mnuParAlertas() {
	if (fSessionValidate().pSft) {
		fMnuParAlertas();
	}
}

function fMnuParAlertas() {
	var url = fGetURLPag("interface/ParAlertas.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onPALLoad();
	});
}

// Operaciones OV
function mnuOpeBandeja() {
	if (fSessionValidate().pSft) {
		fMnuOpeBandeja();
	}
}

function fMnuOpeBandeja() {
	var url = fGetURLPag("interface/OpeBandeja.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onOBPLoad();
	});
	// oCP.set("onUnload", function() {onOBPUnload();});
}

function mnuOpeConSol() {
	if (fSessionValidate().pSft) {
		fMnuOpeConSol();
	}
}

function fMnuOpeConSol() {
	var url = fGetURLPag("interface/OpeConSol.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onOCSLoad();
	});
}

function mnuOpeConArc() {
	if (fSessionValidate().pSft) {
		fMnuOpeConArc();
	}
}

function fMnuOpeConArc() {
	var url = fGetURLPag("interface/OpeConArc.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onOCALoad();
	});
}

// Otras Operaciones

function mnuOpeSiniestro() {
	if (fSessionValidate().pSft) {
		fMnuOpeSiniestro();
	}
}

function fMnuOpeSiniestro() {
	var url = fGetURLPag("interface/OpeSiniestro.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onOSILoad();
	});
}

function mnuOpeDDBen() {
	if (fSessionValidate().pSft) {
		fMnuOpeDDBen();
	}
}

function fMnuOpeDDBen() {
	var url = fGetURLPag("interface/OpeDDBen.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onODBLoad();
	});
}

function mnuOpeRetCol() {
	if (fSessionValidate().pSft) {
		fMnuOpeRetCol();
	}
}

function fMnuOpeRetCol() {
	var url = fGetURLPag("interface/OpeRetCol.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onORTLoad();
	});
}

// Reportes
function mnuRepReporte() {
	if (fSessionValidate().pSft) {
		fMnuRepReporte();
	}
}

function fMnuRepReporte() {
	// Hacer
}

function mnuRepBatchLog() {
	if (fSessionValidate().pSft) {
		fMnuRepBatchLog();
	}
}

function fMnuRepBatchLog() {
	var url = fGetURLPag("interface/RepBatchLog.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
	oCP.set("onDownloadEnd", function() {
		onRBLLoad();
	});
}

// Otros
function mnuBlank() {

}

function fMnuDeselect() {
	// Deseleccionar menues
	dijit.byId("mParametros")._setSelected(false);
	dijit.byId("mOperaciones")._setSelected(false);
	dijit.byId("mConsultas")._setSelected(false);
}