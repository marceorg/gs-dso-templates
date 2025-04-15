function onPDFImpresoLoad() {
	// Tomar Parametros
	var vTipoPersona = fGetParURL("tipoPersona");
	var vNumeroCUIL = fGetParURL("numeroCUIL");
	var vNumeroCUIT = fGetParURL("numeroCUIT");

	var vUrl = "";
	if (vTipoPersona == "tipoPersona=F") {
		vUrl = fGetURLMVC("generatePDF.html?" + "cache=" + fGetCacheRnd() + "&"
				+ vTipoPersona + "&" + vNumeroCUIL);
	} else if (vTipoPersona == "tipoPersona=J") {
		vUrl = fGetURLMVC("generatePDF.html?" + "cache=" + fGetCacheRnd() + "&"
				+ vTipoPersona + "&" + vNumeroCUIT);
	}

	// set the src attribute
	document.getElementById("ifrPDF").setAttribute("src", vUrl);
	document.getElementById("imgImpreso").style.display = "none";
	document.getElementById("lblImpreso").style.display = "none";

	/*
	 * document.getElementById("imgImpreso").style.display = "none";
	 * document.getElementById("imgError").style.display = "";
	 * document.getElementById("lblImpreso").innerHTML = "Se ha producido un
	 * error al generar el impreso.";
	 */
}