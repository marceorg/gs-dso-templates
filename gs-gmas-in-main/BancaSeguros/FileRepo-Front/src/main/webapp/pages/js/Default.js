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
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("UserValidationService/getAuthorizedUser?cache="
				+ fGetCacheRnd());
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (response.result != null) {
				var vUsuario = toUpperCaseFirst(response.result.lName) + ", "
						+ toUpperCaseFirst(response.result.fName);
				document.getElementById("lblTopUser").innerHTML = DOMPurify
						.sanitize(vUsuario);
				fSetPerfil(response.result.profileKey,
						response.result.profileLabel,
						response.result.profileType);
				// Fin Autenticacion
				fWaitMsgBoxUpd(0, "Autenticado", "O");
				fWaitMsgBoxClose();
				dijit.byId("dlgWait").onCancel();
			} else {
				// Fin Autenticacion
				fWaitMsgBoxUpd(0, "Fall&oacute; Autenticaci&oacute;n", "E");

				document.frmMain.action = fGetURLPag("includes/accDen.html");
				document.frmMain.submit();
				return;
			}
		}, function(error) {
			// Fin Autenticacion
			fWaitMsgBoxUpd(0, "Fall&oacute; Autenticaci&oacute;n", "E");

			document.frmMain.action = fGetURLPag("includes/accDen.html");
			document.frmMain.submit();
			return;
		});
	});
	// Cuerpo
	var vFrm = fGetURLPag("interface/Inicio.html");
	var oCP = dijit.byId("divContent");
	oCP.set("href", vFrm);
}

function fSetPerfil(profileKey, profileLabel, profileType) {
	document.getElementById("lblTopPefil").innerHTML = DOMPurify
			.sanitize(profileLabel);
	if (profileType == "S") {
		document.getElementById("lblTopPefil").innerHTML = document
				.getElementById("lblTopPefil").innerHTML
				+ " (S)";
	} else if (profileType == "A") {
		document.getElementById("lblTopPefil").innerHTML = document
				.getElementById("lblTopPefil").innerHTML
				+ " (A)";
	}
	if (profileKey == "A") {
		// Menu
		dijit.byId("mParametros").set("disabled", false);
		dijit.byId("mParTipoDoc").set("disabled", false);
		dijit.byId("mParPermisos").set("disabled", false);
		dijit.byId("mParAlertas").set("disabled", false);
		dijit.byId("mOperaciones").set("disabled", false);
		dijit.byId("mOpeBandeja").set("disabled", true);
		dijit.byId("mOpeConSol").set("disabled", false);
		dijit.byId("mOpeConArc").set("disabled", false);
		dijit.byId("mOtrasOper").set("disabled", false);
		dijit.byId("mOpeSiniestro").set("disabled", false);
		dijit.byId("mOpeDDBen").set("disabled", false);
		dijit.byId("mOpeRetCol").set("disabled", false);
		dijit.byId("mReportes").set("disabled", false);
		dijit.byId("mRepBatchLog").set("disabled", false);
	} else if (profileKey == "C") {
		// Menu
		dijit.byId("mParametros").set("disabled", true);
		dijit.byId("mParTipoDoc").set("disabled", true);
		dijit.byId("mParPermisos").set("disabled", true);
		dijit.byId("mParAlertas").set("disabled", true);
		dijit.byId("mOperaciones").set("disabled", false);
		dijit.byId("mOpeBandeja").set("disabled", true);
		dijit.byId("mOpeConSol").set("disabled", false);
		dijit.byId("mOpeConArc").set("disabled", false);
		dijit.byId("mOtrasOper").set("disabled", false);
		dijit.byId("mOpeSiniestro").set("disabled", false);
		dijit.byId("mOpeDDBen").set("disabled", false);
		dijit.byId("mOpeRetCol").set("disabled", false);
		dijit.byId("mReportes").set("disabled", true);
		dijit.byId("mRepBatchLog").set("disabled", true);
	} else {
		dijit.byId("mParametros").set("disabled", true);
		dijit.byId("mParTipoDoc").set("disabled", true);
		dijit.byId("mParPermisos").set("disabled", true);
		dijit.byId("mParAlertas").set("disabled", true);
		if (profileKey == "M" || profileKey == "S" || profileKey == "E") {
			dijit.byId("mOperaciones").set("disabled", false);
			dijit.byId("mOpeBandeja").set("disabled", false);
			dijit.byId("mOpeConSol").set("disabled", false);
			dijit.byId("mOpeConArc").set("disabled", false);
			dijit.byId("mOtrasOper").set("disabled", false);
			dijit.byId("mOpeSiniestro").set("disabled", false);
			dijit.byId("mOpeDDBen").set("disabled", false);
			dijit.byId("mOpeRetCol").set("disabled", false);
			dijit.byId("mReportes").set("disabled", true);
			dijit.byId("mRepBatchLog").set("disabled", true);
		} else {
			dijit.byId("mOperaciones").set("disabled", true);
			dijit.byId("mOpeBandeja").set("disabled", true);
			dijit.byId("mOpeConSol").set("disabled", true);
			dijit.byId("mOpeConArc").set("disabled", true);
			dijit.byId("mOtrasOper").set("disabled", false);
			dijit.byId("mOpeSiniestro").set("disabled", false);
			dijit.byId("mOpeDDBen").set("disabled", false);
			dijit.byId("mOpeRetCol").set("disabled", false);
			dijit.byId("mReportes").set("disabled", true);
			dijit.byId("mRepBatchLog").set("disabled", true);
		}
	}
}

function fUSUARIO(vCbo) {
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var vURL = fGetURLSvc("UserValidationService/setAuthorizedUser?cache="
				+ fGetCacheRnd() + "&peopleSoft=" + vCbo.get("value"));
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});
		deferred.then(function(response) {
			if (response.result != null && response.result) {
				document.frmMain.submit();
			}
		});
	});
}
