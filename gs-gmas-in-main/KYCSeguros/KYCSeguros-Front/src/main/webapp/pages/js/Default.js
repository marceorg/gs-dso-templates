function onDefaultLoad() {
	// Validar Browser
	if (!fBrowserValidate()) {
		document.frmMain.action = fGetURLPag("includes/errBrowser.html");
		document.frmMain.submit();
		return;
	}

	// Resize
	fBrowserResize();

	fWaitMsgBoxIni("Autenticando", [ "Autenticando Usuario..." ]);

	// Usuario
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {
				var url = fGetURLSvc("UserValidationService/getAuthorizedUser?cache="
						+ fGetCacheRnd());
				var deferred = request.get(url, {
					handleAs : "json"
				});

				deferred
						.then(
								function(response) {
									if (response.result != null) {
										var vUsuario = response.result.lName
												+ ", "
												+ toUpperCaseFirst(response.result.fName);
										document.getElementById("lblTopUser").innerHTML = toUpperCaseFirst(vUsuario);
										fSetPerfil(response.result.profileKey);
										// Fin Autenticacion
										fWaitMsgBoxUpd(0, "Autenticado", "O");
										fWaitMsgBoxClose();
										try {
											dijit.byId("dlgWait").onCancel();
										} catch (err) {

										}
									} else {
										// Fin Autenticacion
										fWaitMsgBoxUpd(
												0,
												"Fall&oacute; Autenticaci&oacute;n",
												"E");

										document.frmMain.action = fGetURLPag("includes/accDen.html");
										document.frmMain.submit();
										return;
									}
								},
								function(error) {
									// Fin Autenticacion
									fWaitMsgBoxUpd(
											0,
											"Fall&oacute; Autenticaci&oacute;n",
											"E");

									document.frmMain.action = fGetURLPag("includes/accDen.html");
									document.frmMain.submit();
									return;
								});
			});

	// Analizar entrada
	var vParTPer = fGetParURL("tipoPersona");
	var vParCUIL = fGetParURL("numeroCUIL");
	var vParCUIT = fGetParURL("numeroCUIT");

	if (vParTPer == "") {
		// Cuerpo
		var url = fGetURLPag("interface/Inicio.html");
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
	} else if (vParTPer == "tipoPersona=F") {
		var url = fGetURLPag("interface/KYCPersFis.html?tipoAcc=F&" + vParCUIL
				+ "&apellido=&nombre=");
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onKPFLoad();
		});
	} else if (vParTPer == "tipoPersona=J") {
		var url = fGetURLPag("interface/KYCPersJur.html?tipoAcc=F&" + vParCUIT
				+ "&razonSocial=");
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onKPJLoad();
		});
	}
}

function fSetPerfil(profileKey) {
	if (profileKey == "OPERADOR") {
		// Imagen
		document.getElementById("imgTopPerfil").src = fGetURLPag("images/topPerfilOpe.jpg");
		// Menu
		dijit.byId("mFormularios").set("disabled", false);
		dijit.byId("mKYCPersFis").set("disabled", false);
		dijit.byId("mKYCPersJur").set("disabled", false);
		dijit.byId("mOperaciones").set("disabled", true);
		dijit.byId("mAprobacion").set("disabled", true);
	}
	if (profileKey == "SUPERVISOR") {
		// Imagen
		document.getElementById("imgTopPerfil").src = fGetURLPag("images/topPerfilSup.jpg");
		// Menu
		dijit.byId("mFormularios").set("disabled", false);
		dijit.byId("mKYCPersFis").set("disabled", false);
		dijit.byId("mKYCPersJur").set("disabled", false);
		dijit.byId("mOperaciones").set("disabled", false);
		dijit.byId("mAprobacion").set("disabled", false);
	}
	if (profileKey == "COMPLIANCE") {
		// Imagen
		document.getElementById("imgTopPerfil").src = fGetURLPag("images/topPerfilCom.jpg");
		// Menu
		dijit.byId("mFormularios").set("disabled", false);
		dijit.byId("mKYCPersFis").set("disabled", false);
		dijit.byId("mKYCPersJur").set("disabled", false);
		dijit.byId("mOperaciones").set("disabled", false);
		dijit.byId("mAprobacion").set("disabled", false);
	}
	if (profileKey == "CONSULTA") {
		// Imagen
		document.getElementById("imgTopPerfil").src = fGetURLPag("images/topPerfilCon.jpg");
		// Menu
		dijit.byId("mFormularios").set("disabled", false);
		dijit.byId("mKYCPersFis").set("disabled", false);
		dijit.byId("mKYCPersJur").set("disabled", false);
		dijit.byId("mOperaciones").set("disabled", true);
		dijit.byId("mAprobacion").set("disabled", true);
	}
}