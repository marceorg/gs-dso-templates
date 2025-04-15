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
	// Cuerpo
	var url = fGetURLPag("interface/Inicio.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", url);
}

function fSetPerfil(profileKey) {
	if (profileKey == "OPERADOR") {
		// Imagen
		document.getElementById("imgTopPerfil").src = fGetURLPag("images/topPerfilOpe.jpg");
		// Menu
		dijit.byId("mOperaciones").set("disabled", false);
		dijit.byId("mOpeSiniestros").set("disabled", false);
		dijit.byId("mOpeSinCarga").set("disabled", false);
		dijit.byId("mOpeSinSeguim").set("disabled", false);
		dijit.byId("mOpeSinForms").set("disabled", false);
		dijit.byId("mOpeReclamos").set("disabled", false);
		dijit.byId("mOpeRecCarga").set("disabled", false);
		dijit.byId("mOpeRecSeguim").set("disabled", false);
		dijit.byId("mConsultas").set("disabled", false);
		dijit.byId("mConOpeEmitidas").set("disabled", false);
		dijit.byId("mConClientes").set("disabled", false);
		dijit.byId("mConSiniestros").set("disabled", false);
	}
	if (profileKey == "SUPERVISOR") {
		// Imagen
		document.getElementById("imgTopPerfil").src = fGetURLPag("images/topPerfilSup.jpg");
		// Menu
		dijit.byId("mOperaciones").set("disabled", false);
		dijit.byId("mOpeSiniestros").set("disabled", false);
		dijit.byId("mOpeSinCarga").set("disabled", false);
		dijit.byId("mOpeSinSeguim").set("disabled", false);
		dijit.byId("mOpeSinForms").set("disabled", false);
		dijit.byId("mOpeReclamos").set("disabled", false);
		dijit.byId("mOpeRecCarga").set("disabled", false);
		dijit.byId("mOpeRecSeguim").set("disabled", false);
		dijit.byId("mConsultas").set("disabled", false);
		dijit.byId("mConOpeEmitidas").set("disabled", false);
		dijit.byId("mConClientes").set("disabled", false);
		dijit.byId("mConSiniestros").set("disabled", false);
	}
	if (profileKey == "CONSULTA") {
		// Imagen
		document.getElementById("imgTopPerfil").src = fGetURLPag("images/topPerfilCon.jpg");
		// Menu
		dijit.byId("mOperaciones").set("disabled", true);
		dijit.byId("mOpeSiniestros").set("disabled", true);
		dijit.byId("mOpeSinCarga").set("disabled", true);
		dijit.byId("mOpeSinSeguim").set("disabled", true);
		dijit.byId("mOpeSinForms").set("disabled", true);
		dijit.byId("mOpeReclamos").set("disabled", true);
		dijit.byId("mOpeRecCarga").set("disabled", true);
		dijit.byId("mOpeRecSeguim").set("disabled", true);
		dijit.byId("mConsultas").set("disabled", false);
		dijit.byId("mConOpeEmitidas").set("disabled", false);
		dijit.byId("mConClientes").set("disabled", false);
		dijit.byId("mConSiniestros").set("disabled", false);
	}
}