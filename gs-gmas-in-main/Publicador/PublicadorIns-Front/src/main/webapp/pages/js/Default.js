function onDefaultLoad() {
	// Validar Browser
	if (!fBrowserValidate()) {
		document.frmMain.action = fGetURLPag("includes/errBrowser.html");
		document.frmMain.submit();
		return;
	}

	// Resize
	fBrowserResize();

	// Cuerpo
	var url = fGetURLPag("interface/Inicio.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
}