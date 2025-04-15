function onKPJLoad() {
	// Inicializar
	if (!fKPJInitialize()) {
		fKPJReadOnly(true);
		dijit.byId("btnKPJConsultar").set("disabled", true);
		fMsgBox("Se ha producido un error al inicializar..<br/>"
				+ "Por favor, vuelva a ingresar al men&uacute; Formularios.",
				"Error", "E");
		return;
	}
	// Tomar Parametros
	var vParTAc = fGetParamURL("tipoAcc");
	var vParCUI = fGetParamURL("numeroCUIT");
	var vParRaz = fGetParamURL("razonSocial");
	document.getElementById("lblKPJEstado").parTipoAcc = vParTAc;
	document.getElementById("lblKPJEstado").parNumeroCUIT = vParCUI;
	document.getElementById("lblKPJEstado").parRazonSocial = vParRaz;
	// Deshabilitar
	fKPJReadOnly(true);

	if (vParCUI.length == 0) {
		fSessionValidate("fKPJBusDialog");
	} else {
		fSessionValidate("fKPJDataLoad");
	}
}

function fKPJBusDialog(vUser, vProfileKey) {
	// Habilitar / Deshabilitar Apellido y Nombre
	if (vProfileKey == "OPERADOR") {
		dijit.byId("txtKPJBusRazonSocial").set("disabled", false);
	} else {
		dijit.byId("txtKPJBusRazonSocial").set("disabled", true);
	}

	// Mostrar Dialog
	dijit.byId("dlgKPJFinder").show();
}

function fKPJInitialize() {
	var vRet = true;
	// Resize
	fBrowserResize();
	// Tamaño de botones
	dojo.style("btnKPJConsultar", "width", "120px");
	dojo.style("btnKPJDiff", "width", "120px");
	dojo.style("btnKPJImprimir", "width", "120px");
	dojo.style("btnKPJEnviar", "width", "120px");
	// Valores
	document.getElementById("lblKPJEstado").fechaHoy = "0";
	document.getElementById("lblKPJEstado").origValue = "";
	document.getElementById("lblKPJEstado").esReadOnly = true;

	// Fecha Hoy
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {

				var vURL = fGetURLSvc("ParametersService/getFechaHoy");
				var deferred = request.get(vURL, {
					handleAs : "json",
					sync : true
				});

				deferred
						.then(
								function(response) {
									if (response.error) {
										vRet = false;
									} else {
										document.getElementById("lblKPJEstado").fechaHoy = response.result;
									}
								}, function(err) {
									vRet = false;
								});
			});

	// Cargar Combo Provincias
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getProvinciaList");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				fComboLoad(response, "cboKPJDirProv");
			}
		}, function(err) {
			vRet = false;
		});
	});
	// Cargar Combo Tipos de Documento
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getTipoDocList");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				fComboLoadSCUIT(response, "cboKPJRepTipDoc");
				fComboLoad(response, "cboKPJTitMPgTipDoc");
				fComboLoadSCUIT(response, "cboKPJRepSCCTipDoc");
			}
		}, function(err) {
			vRet = false;
		});
	});
	// Cargar Combo Caracter
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getCaracterList");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				fComboLeyLoad(response, "cboKPJCaracter", "NO APLICA");
			}
		}, function(err) {
			vRet = false;
		});
	});
	// Cargar Combo Supervisores
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getSupervisorList");
		var deferred = request.get(vURL, {
			handleAs : "json"
		});

		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				fComboSupLoad(response, "cboKPJAprSup");
			}
		}, function(err) {
			vRet = false;
		});
	});

	return vRet;
}

function fKPJMPgShow(value) {
	if (value == "N") {
		document.getElementById("trKPJMPgLista").style.display = "";
	} else {
		document.getElementById("trKPJMPgLista").style.display = "none";
	}
}

function fKPJMPgTDoShow(value) {
	if (value == "4") {
		dijit.byId("txtKPJTitMPgNombre").set("value", "");
		dijit.byId("txtKPJTitMPgNombre").set("disabled", true);
	} else {
		dijit.byId("txtKPJTitMPgNombre").set("disabled", false);
	}
}

function fKPJCaracterShow(value) {
	if (value == "4") {
		document.getElementById("trKPJCaracterDes").style.display = "";
	} else {
		document.getElementById("trKPJCaracterDes").style.display = "none";
	}
}

function fKPJSCCShow(value) {
	if (value == "S") {
		document.getElementById("trKPJSCCMot").style.display = "";
		// Si No requiere PT
		if (!document.getElementById("lblKPJEstado").perfilObligenAIS) {
			document.getElementById("trKPJSCCLeyIng").style.display = "";
			document.getElementById("trKPJSCCLeyPfT").style.display = "";
		}
	} else {
		document.getElementById("trKPJSCCMot").style.display = "none";
		document.getElementById("trKPJSCCLeyIng").style.display = "none";
		document.getElementById("trKPJSCCLeyPfT").style.display = "none";
	}
}

function fKPJRepSCCShow(value) {
	if (value == "S") {
		document.getElementById("trKPJRepSCCLista").style.display = "";
		if (dijit.byId("dgrKPJRepSCCLista") != null)
			dijit.byId("dgrKPJRepSCCLista").update();
	} else {
		document.getElementById("trKPJRepSCCLista").style.display = "none";
	}
}

function fKPJCiaShow(value) {
	if (value == "S") {
		document.getElementById("trKPJCiaLista").style.display = "";
		if (dijit.byId("dgrKPJCiaLista") != null)
			dijit.byId("dgrKPJCiaLista").update();
	} else {
		document.getElementById("trKPJCiaLista").style.display = "none";
	}
}

function fKPJRelShow(value) {
	if (value == "S") {
		document.getElementById("trKPJRelDet").style.display = "";
	} else {
		document.getElementById("trKPJRelDet").style.display = "none";
	}
}

function fKPJOInShow(value) {
	if (value == "S") {
		document.getElementById("trKPJOInLista").style.display = "";
		if (dijit.byId("dgrKPJOInLista") != null)
			dijit.byId("dgrKPJOInLista").update();
	} else {
		document.getElementById("trKPJOInLista").style.display = "none";
	}
}

function fKPJReadOnly(value) {
	// Opciones
	if (document.getElementById("lblKPJEstado").parTipoAcc == "tipoAcc=A"
			|| document.getElementById("lblKPJEstado").parTipoAcc == "tipoAcc=O") {
		dijit.byId("btnKPJConsultar").set("disabled", true);
	} else {
		dijit.byId("btnKPJConsultar").set("disabled", false);
	}
	dijit.byId("btnKPJImprimir").set("disabled", value);
	dijit.byId("btnKPJDiff").set("disabled", value);
	dijit.byId("btnKPJEnviar").set("disabled", value);
	// 1- Informacion Basica
	dijit.byId("txtKPJRazonSocial").set("disabled", value);
	dijit.byId("txtKPJFechaConst").set("disabled", value);
	dijit.byId("txtKPJDirCalle").set("disabled", value);
	dijit.byId("txtKPJDirNumero").set("disabled", value);
	dijit.byId("txtKPJDirPiso").set("disabled", value);
	dijit.byId("txtKPJDirDepto").set("disabled", value);
	dijit.byId("cboKPJDirProv").set("disabled", value);
	if (value)
		dijit.byId("txtKPJDirLocal").set("disabled", value);
	dijit.byId("btnKPJDirCP").set("disabled", value);
	dijit.byId("txtKPJTelefono").set("disabled", value);
	dijit.byId("txtKPJEmail").set("disabled", value);
	if (value)
		fKPJReadOnlyRep(value);
	dijit.byId("btnKPJRepNew").set("disabled", value);
	dijit.byId("btnKPJRepUpd").set("disabled", value);
	dijit.byId("btnKPJRepDel").set("disabled", value);
	dijit.byId("cboKPJTitMPg").set("disabled", value);
	dijit.byId("cboKPJTitMPgTipDoc").set("disabled", value);
	dijit.byId("txtKPJTitMPgNroDoc").set("disabled", value);
	dijit.byId("txtKPJTitMPgApellido").set("disabled", value);
	dijit.byId("txtKPJTitMPgNombre").set("disabled", value);
	dijit.byId("txtKPJTitMPgMedioPago").set("disabled", value);
	// 2- Informacion Detallada
	dijit.byId("txtKPJActividad").set("disabled", value);
	dijit.byId("btnKPJActividad").set("disabled", value);
	if (value)
		dijit.byId("cboKPJActividad").set("disabled", value);
	dijit.byId("txtKPJActivDes").set("disabled", value);
	dijit.byId("txtKPJPropositoDes").set("disabled", value);
	dijit.byId("cboKPJCaracter").set("disabled", value);
	dijit.byId("txtKPJCaracterDes").set("disabled", value);
	dijit.byId("cboKPJBco").set("disabled", value);
	dijit.byId("cboKPJCotBolsa").set("disabled", value);
	dijit.byId("cboKPJSubsCia").set("disabled", value);
	dijit.byId("cboKPJCliRegOrg").set("disabled", value);
	dijit.byId("cboKPJSCC").set("disabled", value);
	dijit.byId("txtKPJSCCMot").set("disabled", value);
	dijit.byId("cboKPJRepSCC").set("disabled", value);
	if (value)
		fKPJReadOnlyRepSCC(value);
	dijit.byId("btnKPJRepSCCUpd").set("disabled", value);
	dijit.byId("txtKPJAccionistas").set("disabled", value);
	dijit.byId("cboKPJCia").set("disabled", value);
	if (value)
		fKPJReadOnlyCia(value);
	dijit.byId("btnKPJCiaNew").set("disabled", value);
	dijit.byId("btnKPJCiaUpd").set("disabled", value);
	dijit.byId("btnKPJCiaDel").set("disabled", value);
	dijit.byId("txtKPJBalFecEstCont").set("disabled", value);
	dijit.byId("txtKPJBalAuditor").set("disabled", value);
	dijit.byId("txtKPJBalFecha").set("disabled", value);
	dijit.byId("txtKPJBalActivo").set("disabled", value);
	dijit.byId("txtKPJBalPasivo").set("disabled", value);
	dijit.byId("txtKPJBalVentas").set("disabled", value);
	dijit.byId("txtKPJBalResFinal").set("disabled", value);
	dijit.byId("txtKPJDocResDet").set("disabled", value);
	dijit.byId("txtKPJObserv").set("disabled", value);
	dijit.byId("cboKPJRel").set("disabled", value);
	dijit.byId("txtKPJRelDet").set("disabled", value);
	dijit.byId("txtKPJIniAnn").set("disabled", value);
	// 3- Perfil Transaccional
	dijit.byId("txtKPJValOpe").set("disabled", value);
	dijit.byId("txtKPJValOpeMot").set("disabled", value);
	dijit.byId("txtKPJComent").set("disabled", value);
	// 4- Operaciones Inusuales
	dijit.byId("cboKPJOIn").set("disabled", value);
	if (value)
		fKPJReadOnlyOIn(value);
	dijit.byId("btnKPJOInNew").set("disabled", value);
	dijit.byId("btnKPJOInUpd").set("disabled", value);
	dijit.byId("btnKPJOInDel").set("disabled", value);
}

function fKPJReadOnlyRep(value) {
	dijit.byId("btnKPJRepApl").set("disabled", value);
	dijit.byId("btnKPJRepCan").set("disabled", value);
	dijit.byId("cboKPJRepTipDoc").set("disabled", value);
	dijit.byId("txtKPJRepNroDoc").set("disabled", value);
	dijit.byId("txtKPJRepApellido").set("disabled", value);
	dijit.byId("txtKPJRepNombre").set("disabled", value);
}

function fKPJReadOnlyRepSCC(value) {
	dijit.byId("btnKPJRepSCCApl").set("disabled", value);
	dijit.byId("btnKPJRepSCCCan").set("disabled", value);
	dijit.byId("cboKPJRepSCCSCC").set("disabled", value);
	dijit.byId("txtKPJRepSCCCargo").set("disabled", value);
	dijit.byId("cboKPJRepSCCPEP").set("disabled", value);
}

function fKPJReadOnlyCia(value) {
	dijit.byId("btnKPJCiaApl").set("disabled", value);
	dijit.byId("btnKPJCiaCan").set("disabled", value);
	dijit.byId("txtKPJCiaRazSoc").set("disabled", value);
	dijit.byId("cboKPJCiaSCC").set("disabled", value);
}

function fKPJReadOnlyOIn(value) {
	dijit.byId("btnKPJOInApl").set("disabled", value);
	dijit.byId("btnKPJOInCan").set("disabled", value);
	dijit.byId("txtKPJOInFecha").set("disabled", value);
	dijit.byId("txtKPJOInTipOpe").set("disabled", value);
	dijit.byId("txtKPJOInOriFon").set("disabled", value);
	dijit.byId("txtKPJOInMonto").set("disabled", value);
	dijit.byId("txtKPJOInObserv").set("disabled", value);
}

function fKPJClean() {
	// Limpiar Estado
	document.getElementById("lblKPJEstado").innerHTML = "";
	document.getElementById("lblKPJEstado").origValue = "";
	document.getElementById("lblKPJEstado").perfilObligenAIS = false;
	document.getElementById("lblKPJEstado").tipoOperacion = "";
	document.getElementById("lblKPJEstado").vigenciaDesde = "0";
	document.getElementById("lblKPJEstado").vigenciaHasta = "0";
	document.getElementById("lblKPJEstado").esReadOnly = true;
	document.getElementById("lblKPJEstado").parNumeroCUIT = "";
	document.getElementById("lblKPJEstado").parRazonSocial = "";
	document.getElementById("divKPJOriginal").style.display = "none";
	// Cerrar Paneles
	fKPJHelpOut();
	dijit.byId("tpnKPJHelp").set("style", "display:none;");
	dijit.byId("tpnKYCPersJurP1").set("open", false);
	dijit.byId("tpnKYCPersJurP2").set("open", false);
	dijit.byId("tpnKYCPersJurP3").set("open", false);
	dijit.byId("tpnKYCPersJurP4").set("open", false);
	dijit.byId("tpnKYCPersJurP5").set("open", false);
	// Panel 1
	dijit.byId("txtKPJCUIT").set("value", "");
	dijit.byId("txtKPJRazonSocial").set("value", "");
	dijit.byId("txtKPJFechaConst").set("value", null);
	dijit.byId("txtKPJDirCalle").set("value", "", false);
	dijit.byId("txtKPJDirNumero").set("value", "", false);
	dijit.byId("txtKPJDirPiso").set("value", "");
	dijit.byId("txtKPJDirDepto").set("value", "");
	dijit.byId("cboKPJDirProv").set("value", "", false);
	dijit.byId("txtKPJDirLocal").set("value", "", false);
	dijit.byId("txtKPJDirCP").set("value", "");
	dijit.byId("txtKPJTelefono").set("value", "");
	dijit.byId("txtKPJEmail").set("value", "");
	dijit.byId("cboKPJTitMPg").set("value", "");
	fGridClean("dgrKPJRepLista");
	fKPJCleanRep();
	dijit.byId("cboKPJTitMPgTipDoc").set("value", "");
	dijit.byId("txtKPJTitMPgNroDoc").set("value", "");
	dijit.byId("txtKPJTitMPgApellido").set("value", "");
	dijit.byId("txtKPJTitMPgNombre").set("value", "");
	dijit.byId("txtKPJTitMPgMedioPago").set("value", "");
	// Panel 2
	dijit.byId("txtKPJActividad").set("value", "");
	fComboClean("cboKPJActividad");
	dijit.byId("txtKPJActivDes").set("value", "");
	dijit.byId("txtKPJPropositoDes").set("value", "");
	dijit.byId("cboKPJCaracter").set("value", "");
	dijit.byId("txtKPJCaracterDes").set("value", "");
	dijit.byId("cboKPJBco").set("value", "");
	dijit.byId("cboKPJCotBolsa").set("value", "");
	dijit.byId("cboKPJSubsCia").set("value", "");
	dijit.byId("cboKPJCliRegOrg").set("value", "");
	dijit.byId("cboKPJSCC").set("value", "");
	dijit.byId("txtKPJSCCMot").set("value", "");
	dijit.byId("cboKPJRepSCC").set("value", "");
	fKPJCleanRepSCC();
	dijit.byId("txtKPJAccionistas").set("value", "");
	dijit.byId("cboKPJCia").set("value", "");
	fGridClean("dgrKPJCiaLista");
	fKPJCleanCia();
	dijit.byId("txtKPJBalFecEstCont").set("value", null);
	dijit.byId("txtKPJBalAuditor").set("value", "");
	dijit.byId("txtKPJBalFecha").set("value", null);
	dijit.byId("txtKPJBalActivo").set("value", "", false);
	dijit.byId("txtKPJBalPasivo").set("value", "", false);
	dijit.byId("txtKPJBalPN").set("value", "");
	dijit.byId("txtKPJBalVentas").set("value", "", false);
	dijit.byId("txtKPJBalResFinal").set("value", "");
	dijit.byId("txtKPJDocResDet").set("value", "");
	dijit.byId("txtKPJObserv").set("value", "");
	dijit.byId("cboKPJRel").set("value", "");
	dijit.byId("txtKPJRelDet").set("value", "");
	dijit.byId("txtKPJIniAnn").set("value", "");
	// Panel 3
	dijit.byId("txtKPJValOpe").set("value", "");
	dijit.byId("txtKPJAcuPri").set("value", "");
	dijit.byId("txtKPJValOpeMot").set("value", "");
	dijit.byId("txtKPJComent").set("value", "");
	dijit.byId("txtKPJUltFec").set("value", null);
	// Panel 4
	dijit.byId("cboKPJOIn").set("value", "");
	fGridClean("dgrKPJOInLista");
	fKPJCleanOIn();
	// Otros Datos
	dijit.byId("txtKPJOpePSoft").set("value", "");
	dijit.byId("txtKPJOpeNombre").set("value", "");
	dijit.byId("txtKPJOpeFecha").set("value", "");
	dijit.byId("txtKPJSupPSoft").set("value", "");
	dijit.byId("txtKPJSupNombre").set("value", "");
	dijit.byId("txtKPJSupFecha").set("value", "");
	dijit.byId("txtKPJSupComentario").set("value", "");
	dijit.byId("txtKPJComPSoft").set("value", "");
	dijit.byId("txtKPJComNombre").set("value", "");
	dijit.byId("txtKPJComFecha").set("value", "");
	dijit.byId("txtKPJComComentario").set("value", "");
}

function fKPJCleanRep() {
	dijit.byId("tpnKYCRepEdit").set("style", "width: 650px;height: 25px;");
	dijit.byId("tpnKYCRepEdit").set("open", false);
	dijit.byId("cboKPJRepTipDoc").set("value", "");
	dijit.byId("txtKPJRepNroDoc").set("value", "");
	dijit.byId("txtKPJRepApellido").set("value", "");
	dijit.byId("txtKPJRepNombre").set("value", "");
	dijit.byId("txtKPJFechaNac").set("value", null);
}

function fKPJCleanRepSCC() {
	dijit.byId("tpnKYCRepSCCEdit").set("style", "width: 720px;height: 25px;");
	dijit.byId("tpnKYCRepSCCEdit").set("open", false);
	dijit.byId("cboKPJRepSCCTipDoc").set("value", "");
	dijit.byId("txtKPJRepSCCNroDoc").set("value", "");
	dijit.byId("cboKPJRepSCCSCC").set("value", "");
	dijit.byId("txtKPJRepSCCCargo").set("value", "");
	dijit.byId("cboKPJRepSCCPEP").set("value", "");
}

function fKPJCleanCia() {
	dijit.byId("tpnKYCCiaEdit").set("style", "width: 560px;height: 25px;");
	dijit.byId("tpnKYCCiaEdit").set("open", false);
	dijit.byId("txtKPJCiaRazSoc").set("value", "");
	dijit.byId("txtKPJCiaRazSoc").set("secuencia", "");
	dijit.byId("cboKPJCiaSCC").set("value", "");
	dijit.byId("txtKPJFechaConstit").set("value", null);
}

function fKPJCleanOIn() {
	dijit.byId("tpnKYCOInEdit").set("style", "width: 720px;height: 25px;");
	dijit.byId("tpnKYCOInEdit").set("open", false);
	dijit.byId("txtKPJOInFecha").set("value", null);
	dijit.byId("txtKPJOInTipOpe").set("value", "");
	dijit.byId("txtKPJOInTipOpe").set("secuencia", "");
	dijit.byId("txtKPJOInOriFon").set("value", "");
	dijit.byId("txtKPJOInMonto").set("value", "");
	dijit.byId("txtKPJOInObserv").set("value", "");
}

function fKPJConsultar() {
	if (document.getElementById("lblKPJEstado").origValue != ""
			&& !document.getElementById("lblKPJEstado").esReadOnly) {
		fQstBox(
				"Est&aacute; seguro de consultar otro KYC?<br/>Se perderan los cambios realizados",
				"fKPJSearch()");
	} else {
		fKPJSearch();
	}
}

function fKPJImprimir() {
	// Verificar Session
	fSessionValidate("fKPJPrint");
}

function fKPJEnviar() {
	// Acomodar importes totales si quedaron mal
	fKPJBalResFinal("S");

	// Si no realizo ningun cambio (Excepto RECUPERADO)
	if (document.getElementById("lblKPJEstado").innerHTML
			.indexOf("(RECUPERADO)") == -1) {
		if (!fKPJDiffShow(false)) {
			fMsgBox("No se realiz&oacute; ning&uacute;n cambio.",
					"Advertencia", "W");
			return;
		}
	}

	if (fKPJValidate()) {
		// Limpiar
		dijit.byId("cboKPJAprSup").set("value", "");
		// Si es nuevo o No actualiza el perfil transaccional
		//if (document.getElementById("lblKPJEstado").origValue == "N"
		// Solo si No actualiza el perfil transaccional
		if (!fKPJActPerfilTrans()) {
			fQstBox("Est&aacute; seguro de enviar el KYC?",
					"fSessionValidate('fKPJSend')");
		} else if (document.getElementById("lblKPJEstado").origValue == "O"
				|| document.getElementById("lblKPJEstado").origValue == "V"
				|| document.getElementById("lblKPJEstado").origValue == "N") {
			// Mostrar Dialog
			dijit.byId("dlgKPJSend").show();
		}
	}
}

function fKPJEnviarOk() {
	if (dijit.byId("cboKPJAprSup").get("value") == "") {
		fMsgBox("Debe seleccionar un Supervisor.", "Advertencia", "W");
		return;
	}
	dijit.byId('dlgKPJSend').onCancel();
	fSessionValidate("fKPJSend");
}

function fKPJClear() {
	// Limpiar
	fKPJClean();
	// Deshabilitar
	fKPJReadOnly(true);
}

function fKPJBuscar() {
	// Validar
	if (isNaN(dijit.byId("txtKPJBusCUIT").get("value"))
			|| String(dijit.byId("txtKPJBusCUIT").get("value")).length < 11
			|| String(dijit.byId("txtKPJBusCUIT").get("value")).substr(0, 1) != "3"
			|| !fValCUIT(String(dijit.byId("txtKPJBusCUIT").get("value")))) {
		fMsgBox("Debe ingresar un CUIT v&aacute;lido.", "Advertencia", "W");
		return;
	}
	if (!fValType("A", String(dijit.byId("txtKPJBusRazonSocial").get("value")))) {
		fMsgBox("Debe ingresar una raz&oacute;n social v&aacute;lida.",
				"Advertencia", "W");
		return;
	}

	// Parametros
	document.getElementById("lblKPJEstado").parNumeroCUIT = "numeroCUIT="
			+ dijit.byId("txtKPJBusCUIT").get("value");
	document.getElementById("lblKPJEstado").parRazonSocial = "razonSocial="
			+ dijit.byId("txtKPJBusRazonSocial").get("value");

	// Verificar Session
	fSessionValidate("fKPJDataLoad");
}

function fKPJSearch() {
	// Limpiar
	fKPJClean();
	// Deshabilitar
	fKPJReadOnly(true);
	// Limpiar Busqueda
	dijit.byId("txtKPJBusCUIT").set("value", "");
	dijit.byId("txtKPJBusRazonSocial").set("value", "");
	// Mostrar Dialog
	dijit.byId("dlgKPJFinder").show();
}

function fKPJPrint(vUser) {
	window.open(
			fGetURLPag("interface/PDFImpreso.html?tipoPersona=J&numeroCUIT="
					+ dijit.byId("txtKPJCUIT").get("value")), "impreso",
			"resizable=yes,height=550,width=750,top=50,left=100");
}

function fKPJSend(vUser, vProfileKey, vUsrApe, vUsrNom) {
	try {
		// Espera
		fWaitMsgBoxIni("Procesando...", [ "Guardado de KYC",
				"Env&iacute;o al Sistema Central", "Estado del proceso" ]);

		// Guardar
		require(
				[ "dojo/request", "dojo/domReady!" ],
				function(request) {
					fWaitMsgBoxUpd(0, "Guardando KYC...", "A");

					var vURL = fGetURLSvc("KYCService/setKYCPersJur");
					var vPar = fKPJSendGetSave(vUser, vProfileKey, vUsrApe,
							vUsrNom);

					var deferred = request.post(vURL, {
						handleAs : "json",
						data : vPar
					});

					deferred
							.then(
									function(response) {
										if (response.error) {
											fWaitMsgBoxUpd(
													0,
													"Se ha producido un error al guardar el KYC.",
													"E");
											fWaitMsgBoxUpd(
													2,
													"Proceso finalizado con errores.",
													"E");
											fWaitMsgBoxClose();
										} else if (response.result) {
											fWaitMsgBoxUpd(
													0,
													"El KYC ha sido guardado con &eacute;xito!",
													"O");
											fWaitMsgBoxUpd(
													1,
													"Enviando al Sistema Central...",
													"A");

											vURL = fGetURLSvc("KYCService/setKYCPersJurAIS");
											vPar = fKPJSendGetSend();

											deferred = request.get(vURL + "?"
													+ vPar, {
												handleAs : "json"
											});
											deferred
													.then(
															function(response) {
																if (response.error
																		|| response.result == null) {
																	fWaitMsgBoxUpd(
																			1,
																			"Se ha producido un error al enviar el KYC.",
																			"E");
																	fWaitMsgBoxUpd(
																			2,
																			"Proceso finalizado con errores.",
																			"E");
																	fWaitMsgBoxClose();
																} else if (response.result.estadoGra == 0
																		&& (response.result.estadoAsi == 0 || response.result.estadoAsi == 9)) {
																	// SiRespuestaOK
																	var vLeySend = "El KYC ha sido enviado, quedando en estado "
																			+ response.result.estadoKYC.descripcion;
																	var vIcoSend = "O";
																	var vLeyFinP = "Proceso finalizado con &eacute;xito!";
																	if (response.result.estadoKYC.codigo == "A") {
																		// SiQuedoPorAprobar
																		vLeySend += "<br/>Requiere la aprobaci&oacute;n del SUPERVISOR seleccionado.";
																		vIcoSend = "W";
																		vLeyFinP = "Proceso finalizado con advertencias";
																	}
																	if (response.result.estadoKYC.codigo == "I") {
																		// SiQuedoInconsistente
																		vLeySend += "<br/>Requiere la aprobaci&oacute;n de COMPLIANCE.";
																		vIcoSend = "W";
																		vLeyFinP = "Proceso finalizado con advertencias";
																	}
																	if (response.result.estadoAsi == 9) {
																		// SiNoActualizaVigencia
																		vLeySend += "<br/>No se actualiz&oacute; la vigencia.";
																		vIcoSend = "W";
																		vLeyFinP = "Proceso finalizado con advertencias";
																	}
																	fWaitMsgBoxUpd(
																			1,
																			vLeySend,
																			vIcoSend);
																	fWaitMsgBoxUpd(
																			2,
																			vLeyFinP,
																			vIcoSend);
																	fWaitMsgBoxClose();

																	// Limpiar
																	fKPJClean();
																	// Deshabilitar
																	fKPJReadOnly(true);
																} else {
																	fWaitMsgBoxUpd(
																			1,
																			"Se ha producido un error al enviar el KYC.",
																			"E");
																	fWaitMsgBoxUpd(
																			2,
																			"Proceso finalizado con errores.",
																			"E");
																	fWaitMsgBoxClose();
																}
															},
															function(err) {
																fWaitMsgBoxUpd(
																		1,
																		"Se ha producido un error al enviar el KYC.",
																		"E");
																fWaitMsgBoxUpd(
																		2,
																		"Proceso finalizado con errores.",
																		"E");
																fWaitMsgBoxClose();
															});
										} else {
											fWaitMsgBoxUpd(
													0,
													"Se ha producido un error al guardar el KYC.",
													"E");
											fWaitMsgBoxUpd(
													2,
													"Proceso finalizado con errores.",
													"E");
											fWaitMsgBoxClose();
										}
									},
									function(err) {
										fWaitMsgBoxUpd(
												0,
												"Se ha producido un error al guardar el KYC.",
												"E");
										fWaitMsgBoxUpd(
												2,
												"Proceso finalizado con errores.",
												"E");
										fWaitMsgBoxClose();
									});
				});
	} catch (err) {
		fWaitMsgBoxUpd(2, "Proceso finalizado con errores.", "E");
		fWaitMsgBoxClose();
	}
}

function fKPJSendGetSave(vUser, vProfileKey, vUsrApe, vUsrNom) {
	var vPar = "";

	vPar += "cache=" + fGetCacheRnd();
	vPar += "&numeroCUIT=" + dijit.byId("txtKPJCUIT").get("value");
	vPar += "&razonSocial="
			+ fEncodeURI(dijit.byId("txtKPJRazonSocial").get("value"));
	vPar += "&fechaConstitucion="
			+ dojo.date.locale.format(dijit.byId("txtKPJFechaConst").get(
					"value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			});
	vPar += "&dirCalle=" + dijit.byId("txtKPJDirCalle").get("value");
	vPar += "&dirNumero=" + dijit.byId("txtKPJDirNumero").get("value");
	vPar += "&dirPiso=" + dijit.byId("txtKPJDirPiso").get("value");
	vPar += "&dirDepto=" + dijit.byId("txtKPJDirDepto").get("value");
	vPar += "&dirProvincia=" + dijit.byId("cboKPJDirProv").get("value");
	vPar += "&dirLocalidad=" + dijit.byId("txtKPJDirLocal").get("value");
	vPar += "&dirCodigoPostal=" + dijit.byId("txtKPJDirCP").get("value");
	vPar += "&telefono=" + dijit.byId("txtKPJTelefono").get("value");
	vPar += "&email=" + dijit.byId("txtKPJEmail").get("value");
	vPar += "&representanteList=" + fKPJSendGetArrRep();
	vPar += "&esTitMPago="
			+ (dijit.byId("cboKPJTitMPg").get("value") == "S" ? true : false);
	vPar += "&titMPagoList=" + fKPJSendGetArrTitMPg();
	vPar += "&actividadCod=" + dijit.byId("cboKPJActividad").get("value");
	vPar += "&actividadNom="
			+ fEncodeURI(dijit.byId("cboKPJActividad").get("displayedValue"));
	vPar += "&actividadDes="
			+ fEncodeURI(dijit.byId("txtKPJActivDes").get("value"));
	vPar += "&propositoDes="
			+ fEncodeURI(dijit.byId("txtKPJPropositoDes").get("value"));
	vPar += "&caracterCod=" + dijit.byId("cboKPJCaracter").get("value");
	vPar += "&caracterDes="
			+ fEncodeURI(dijit.byId("txtKPJCaracterDes").get("value"));
	vPar += "&esClienteBco="
			+ (dijit.byId("cboKPJBco").get("value") == "S" ? true : false);
	vPar += "&cotizaBolsa="
			+ (dijit.byId("cboKPJCotBolsa").get("value") == "S" ? true : false);
	vPar += "&subsCiaCotizaBolsa="
			+ (dijit.byId("cboKPJSubsCia").get("value") == "S" ? true : false);
	vPar += "&cliRegOrganismo="
			+ (dijit.byId("cboKPJCliRegOrg").get("value") == "S" ? true : false);
	vPar += "&esSCC="
			+ (dijit.byId("cboKPJSCC").get("value") == "S" ? true : false);
	vPar += "&motivoSCC=" + fEncodeURI(dijit.byId("txtKPJSCCMot").get("value"));
	vPar += "&tieneRepSCC="
			+ (dijit.byId("cboKPJRepSCC").get("value") == "S" ? true : false);
	vPar += "&accionistas="
			+ fEncodeURI(dijit.byId("txtKPJAccionistas").get("value"));
	vPar += "&companiaList=" + fKPJSendGetArrCia();
	if (dijit.byId("txtKPJBalFecEstCont").get("value") != null) {
		vPar += "&balFechaEstContable="
				+ dojo.date.locale.format(dijit.byId("txtKPJBalFecEstCont")
						.get("value"), {
					datePattern : "yyyyMMdd",
					selector : "date"
				});
	} else {
		vPar += "&balFechaEstContable=0";
	}
	vPar += "&balAuditor="
			+ fEncodeURI(dijit.byId("txtKPJBalAuditor").get("value"));
	if (dijit.byId("txtKPJBalFecha").get("value") != null) {
		vPar += "&balFecha="
				+ dojo.date.locale.format(dijit.byId("txtKPJBalFecha").get(
						"value"), {
					datePattern : "yyyyMMdd",
					selector : "date"
				});
	} else {
		vPar += "&balFecha=0";
	}
	vPar += "&balActivo=" + dijit.byId("txtKPJBalActivo").get("value");
	vPar += "&balPasivo=" + dijit.byId("txtKPJBalPasivo").get("value");
	vPar += "&balPatNeto=" + dijit.byId("txtKPJBalPN").get("value");
	vPar += "&balVentas=" + dijit.byId("txtKPJBalVentas").get("value");
	vPar += "&balResFinal=" + dijit.byId("txtKPJBalResFinal").get("value");
	vPar += "&docResDetalle="
			+ fEncodeURI(dijit.byId("txtKPJDocResDet").get("value"));
	vPar += "&observaciones="
			+ fEncodeURI(dijit.byId("txtKPJObserv").get("value"));
	vPar += "&tieneRelHSBC="
			+ (dijit.byId("cboKPJRel").get("value") == "S" ? true : false);
	vPar += "&relDetalle="
			+ fEncodeURI(dijit.byId("txtKPJRelDet").get("value"));
	vPar += "&inicioAnn=" + dijit.byId("txtKPJIniAnn").get("value");
	vPar += "&valorOperar=" + dijit.byId("txtKPJValOpe").get("value");
	vPar += "&primaAnual=" + dijit.byId("txtKPJAcuPri").get("value");
	vPar += "&valorOperarMot="
			+ fEncodeURI(dijit.byId("txtKPJValOpeMot").get("value"));
	vPar += "&perfilComentarios="
			+ fEncodeURI(dijit.byId("txtKPJComent").get("value"));
	if (dijit.byId("txtKPJUltFec").get("value") != null) {
		vPar += "&ultFecha="
				+ dojo.date.locale.format(dijit.byId("txtKPJUltFec").get(
						"value"), {
					datePattern : "yyyyMMdd",
					selector : "date"
				});
	} else {
		vPar += "&ultFecha=0";
	}
	vPar += "&opeInusualList=" + fKPJSendGetArrOIn();
	vPar += "&opePeopleSoft=" + vUser;
	vPar += "&opeApellido=" + vUsrApe;
	vPar += "&opeNombre=" + vUsrNom;

	return vPar;
}

function fKPJSendGetSend() {
	var vPar = "";

	vPar += "cache=" + fGetCacheRnd();
	vPar += "&numeroCUIT=" + dijit.byId("txtKPJCUIT").get("value");
	vPar += "&tipoOperacion="
			+ document.getElementById("lblKPJEstado").tipoOperacion;
	vPar += "&actPerfilTrans=" + fKPJActPerfilTrans();
	vPar += "&esKYCNuevo=" + fKPJesKYCNuevo();
	vPar += "&vigenciaDesde="
			+ document.getElementById("lblKPJEstado").vigenciaDesde;
	vPar += "&vigenciaHasta="
			+ document.getElementById("lblKPJEstado").vigenciaHasta;
	vPar += "&perfilObligenAIS="
			+ document.getElementById("lblKPJEstado").perfilObligenAIS;
	if (dijit.byId("cboKPJAprSup").get("value") != "") {
		vPar += "&supPeopleSoft="
				+ dijit.byId("cboKPJAprSup").get("value").split("|")[0];
		vPar += "&supApellido="
				+ dijit.byId("cboKPJAprSup").get("value").split("|")[1];
		vPar += "&supNombre="
				+ dijit.byId("cboKPJAprSup").get("value").split("|")[2];
	} else {
		vPar += "&supPeopleSoft=" + "&supApellido=" + "&supNombre=";
	}

	return vPar;
}

function fKPJSendGetArrRep() {
	// Pasar a string array de Representantes
	var oGridStore = dijit.byId("dgrKPJRepLista").store._arrayOfTopLevelItems;
	var vRet = '{"representanteList":[';
	for ( var i = 0; i < oGridStore.length; i++) {
		vRet += '{';
		vRet += '"tipoDoc":' + oGridStore[i].tipoDoc[0].id[0] + ',';
		vRet += '"numeroDoc":' + oGridStore[i].numeroDoc + ',';
		vRet += '"apellido":"' + oGridStore[i].apellido + '",';
		vRet += '"nombre":"' + oGridStore[i].nombre + '",';
		vRet += '"esSCC":' + oGridStore[i].esSCC + ',';
		vRet += '"cargo":"' + oGridStore[i].cargo + '",';
		vRet += '"esPEP":' + oGridStore[i].esPEP + ',';
		vRet += '"fechaConstitNacim":' + oGridStore[i].fechaConstitNacim;
		vRet += '}';
		if (i < (oGridStore.length - 1)) {
			vRet += ',';
		}
	}
	vRet += ']}';
	return vRet;
}

function fKPJSendGetArrTitMPg() {
	// Pasar a string array de Titular de Medios de Pago
	var vRet = '{"titMPagoList":[';
	if (dijit.byId("cboKPJTitMPg").get("value") == "N") {
		vRet += '{';
		vRet += '"tipoDoc":' + dijit.byId("cboKPJTitMPgTipDoc").get("value")
				+ ',';
		vRet += '"numeroDoc":' + dijit.byId("txtKPJTitMPgNroDoc").get("value")
				+ ',';
		vRet += '"apellido":"'
				+ dijit.byId("txtKPJTitMPgApellido").get("value") + '",';
		vRet += '"nombre":"' + dijit.byId("txtKPJTitMPgNombre").get("value")
				+ '",';
		vRet += '"medioPago":"'
				+ dijit.byId("txtKPJTitMPgMedioPago").get("value") + '"';
		vRet += '}';
	}
	vRet += ']}';
	return vRet;
}

function fKPJSendGetArrCia() {
	// Pasar a string array de Companias
	var oGridStore = dijit.byId("dgrKPJCiaLista").store._arrayOfTopLevelItems;
	var vRet = '{"companiaList":[';
	if (dijit.byId("cboKPJCia").get("value") == "S") {
		for ( var i = 0; i < oGridStore.length; i++) {
			vRet += '{';
			vRet += '"secuencia":' + oGridStore[i].secuencia + ',';
			vRet += '"razonSocial":"' + fEncodeURI(String(oGridStore[i].razonSocial)) + '",';
			vRet += '"esSCC":' + oGridStore[i].esSCC + ',';
			vRet += '"fechaConstitucion":' + oGridStore[i].fechaConstitucion;
			vRet += '}';
			if (i < (oGridStore.length - 1)) {
				vRet += ',';
			}
		}
	}
	vRet += ']}';
	return vRet;
}

function fKPJSendGetArrOIn() {
	// Pasar a string array de Operaciones Inusuales
	var oGridStore = dijit.byId("dgrKPJOInLista").store._arrayOfTopLevelItems;
	var vRet = '{"opeInusualList":[';
	if (dijit.byId("cboKPJOIn").get("value") == "S") {
		for ( var i = 0; i < oGridStore.length; i++) {
			vRet += '{';
			vRet += '"secuencia":' + oGridStore[i].secuencia + ',';
			vRet += '"fecha":' + oGridStore[i].fecha + ',';
			vRet += '"tipoOperacion":"' + oGridStore[i].tipoOperacion + '",';
			vRet += '"origenFondos":"' + oGridStore[i].origenFondos + '",';
			vRet += '"monto":' + oGridStore[i].monto + ',';
			vRet += '"observacion":"' + oGridStore[i].observacion + '"';
			vRet += '}';
			if (i < (oGridStore.length - 1)) {
				vRet += ',';
			}
		}
	}
	vRet += ']}';
	return vRet;
}

function fKPJActPerfilTrans() {
	if (document.getElementById("lblKPJEstado").origValue == "N") {
		// Si es nueva - NO Actualiza Perfil Transaccional
		return true;
	} else {
		if (document.getElementById("lblKPJEstado").innerHTML
				.indexOf("(RECUPERADO)") > 0) {
			// Si es RECUPERADA - Siempre Actualiza Perfil Transaccional
			return true;
		} else {
			// Verifica si se modificaron los campos
			var vDiffTpn3 = [];
			fKPJDiffAdd(vDiffTpn3, "T", "3.1", "txtKPJValOpe");
			fKPJDiffAdd(vDiffTpn3, "T", "3.2", "txtKPJAcuPri");
			fKPJDiffAdd(vDiffTpn3, "T", "3.3", "txtKPJValOpeMot");
			fKPJDiffAdd(vDiffTpn3, "T", "3.4", "txtKPJComent");
			var vDiffTpn3Lng = vDiffTpn3.length;
			if (vDiffTpn3Lng == 0) {
				return false;
			} else {
				return true;
			}
		}
	}
}

function fKPJesKYCNuevo() {
	if (document.getElementById("lblKPJEstado").tipoOperacion == "A") {
		return true;
	} else {
		return false;
	};
}

function fKPJOriginal() {
	fSessionValidate("fSessionVoid");

	if (document.getElementById("divKPJOriginal").mark == "O") {
		var vURL = fGetURLPag("interface/KYCPersJur.html?tipoAcc=O&"
				+ document.getElementById("lblKPJEstado").parNumeroCUIT + "&"
				+ document.getElementById("lblKPJEstado").parRazonSocial);
		var oCP = dijit.byId("divContent");
		oCP.set("href", vURL);
		oCP.set("onDownloadEnd", function() {
			onKPJLoad();
		});
	} else if (document.getElementById("divKPJOriginal").mark == "V") {
		var vURL = fGetURLPag("interface/KYCPersJur.html?tipoAcc=F&"
				+ document.getElementById("lblKPJEstado").parNumeroCUIT + "&"
				+ document.getElementById("lblKPJEstado").parRazonSocial);
		var oCP = dijit.byId("divContent");
		oCP.set("href", vURL);
		oCP.set("onDownloadEnd", function() {
			onKPJLoad();
		});
	} else if (document.getElementById("divKPJOriginal").mark == "A") {
		var url = fGetURLPag("interface/KYCAprobacion.html?id="
				+ dijit.byId("txtKPJCUIT").get("value"));
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onKAPLoad();
		});
	}
}

function fKPJDiffShow(vShow) {
	var vChange = false;

	require(
			[ "dojo/request", "dijit/Tree", "dojo/data/ItemFileReadStore",
					"dijit/tree/ForestStoreModel", "dojo/domReady!" ],
			function(request, Tree, ItemFileReadStore, ForestStoreModel) {
				// Titulos
				dijit.byId("dlgKPJDiffShow").set("title",
						"Diferencias / Modificaciones realizadas");
				document.getElementById("lblKPJDiffShow").innerHTML = "Lista de modificaciones realizadas:";
				document.getElementById("lblKPJDiffLey").innerHTML = "La secci&oacute;n marcada en rojo "
						+ "contiene los campos que requieren aprobaci&oacute;n";

				var vDiffTpn1 = [];
				var vDiffTpn2 = [];
				var vDiffTpn3 = [];
				var vDiffTpn4 = [];

				// Diferencias Panel 1
				fKPJDiffAdd(vDiffTpn1, "T", "1.1", "txtKPJRazonSocial");
				fKPJDiffAdd(vDiffTpn1, "D", "1.3", "txtKPJFechaConst");
				fKPJDiffAdd(vDiffTpn1, "T", "1.4", "txtKPJDirCalle");
				fKPJDiffAdd(vDiffTpn1, "T", "1.5", "txtKPJDirNumero");
				fKPJDiffAdd(vDiffTpn1, "T", "1.6", "txtKPJDirPiso");
				fKPJDiffAdd(vDiffTpn1, "T", "1.7", "txtKPJDirDepto");
				fKPJDiffAdd(vDiffTpn1, "C", "1.8", "cboKPJDirProv");
				fKPJDiffAdd(vDiffTpn1, "T", "1.9", "txtKPJDirLocal");
				fKPJDiffAdd(vDiffTpn1, "T", "1.10", "txtKPJDirCP");
				fKPJDiffAdd(vDiffTpn1, "T", "1.11", "txtKPJTelefono");
				fKPJDiffAdd(vDiffTpn1, "T", "1.12", "txtKPJEmail");
				fKPJDiffAdd(vDiffTpn1, "C", "1.14", "cboKPJTitMPg");
				fKPJDiffAddRep(vDiffTpn1, "1.15", "dgrKPJRepLista");
				// Solo mostrar diferencias cuando es N
				if (dijit.byId("cboKPJTitMPg").get("value") == "N") {
					fKPJDiffAdd(vDiffTpn1, "C", "1.16", "cboKPJTitMPgTipDoc",
							" del titular del medio de pago");
					fKPJDiffAdd(vDiffTpn1, "T", "1.17", "txtKPJTitMPgNroDoc",
							" Documento del titular del medio de pago");
					fKPJDiffAdd(vDiffTpn1, "T", "1.18", "txtKPJTitMPgApellido",
							" del titular del medio de pago");
					fKPJDiffAdd(vDiffTpn1, "T", "1.19", "txtKPJTitMPgNombre",
							" del titular del medio de pago");
					fKPJDiffAdd(vDiffTpn1, "T", "1.20",
							"txtKPJTitMPgMedioPago",
							" del titular del medio de pago");
				}

				var vDiffTpn1Lng = vDiffTpn1.length;
				if (vDiffTpn1Lng > 0) {
					vChange = true;
				}

				// Diferencias Panel 2
				fKPJDiffAdd(vDiffTpn2, "C", "2.1", "cboKPJActividad");
				fKPJDiffAdd(vDiffTpn2, "T", "2.2", "txtKPJActivDes");
				fKPJDiffAdd(vDiffTpn2, "T", "2.3", "txtKPJPropositoDes");
				fKPJDiffAdd(vDiffTpn2, "C", "2.4", "cboKPJCaracter");
				fKPJDiffAdd(vDiffTpn2, "T", "2.5", "txtKPJCaracterDes");
				fKPJDiffAdd(vDiffTpn2, "C", "2.6", "cboKPJBco");
				fKPJDiffAdd(vDiffTpn2, "C", "2.7", "cboKPJCotBolsa");
				fKPJDiffAdd(vDiffTpn2, "C", "2.8", "cboKPJSubsCia");
				fKPJDiffAdd(vDiffTpn2, "C", "2.9", "cboKPJCliRegOrg");
				fKPJDiffAdd(vDiffTpn2, "C", "2.10", "cboKPJSCC");
				fKPJDiffAdd(vDiffTpn2, "T", "2.11", "txtKPJSCCMot",
						" si es SCC");
				fKPJDiffAdd(vDiffTpn2, "C", "2.12", "cboKPJRepSCC");
				// Si RepSCC no cambia y era NO, no chequeo Listado Rep SCC
				if (!(dijit.byId("cboKPJRepSCC").get("value") == "N" && dijit
						.byId("cboKPJRepSCC").get("origValue") == "N")) {
					fKPJDiffAddRepSCC(vDiffTpn2, "2.13", "dgrKPJRepSCCLista");
				}
				fKPJDiffAdd(vDiffTpn2, "T", "2.14", "txtKPJAccionistas");
				fKPJDiffAdd(vDiffTpn2, "C", "2.15", "cboKPJCia");
				fKPJDiffAddCia(vDiffTpn2, "2.16", "dgrKPJCiaLista");
				fKPJDiffAdd(vDiffTpn2, "D", "2.17", "txtKPJBalFecEstCont");
				fKPJDiffAdd(vDiffTpn2, "T", "2.18", "txtKPJBalAuditor");
				fKPJDiffAdd(vDiffTpn2, "D", "2.19", "txtKPJBalFecha");
				fKPJDiffAdd(vDiffTpn2, "T", "2.20", "txtKPJBalActivo");
				fKPJDiffAdd(vDiffTpn2, "T", "2.21", "txtKPJBalPasivo");
				fKPJDiffAdd(vDiffTpn2, "T", "2.22", "txtKPJBalPN");
				fKPJDiffAdd(vDiffTpn2, "T", "2.23", "txtKPJBalVentas");
				fKPJDiffAdd(vDiffTpn2, "T", "2.24", "txtKPJBalResFinal");
				fKPJDiffAdd(vDiffTpn2, "T", "2.25", "txtKPJDocResDet");
				fKPJDiffAdd(vDiffTpn2, "T", "2.26", "txtKPJObserv");
				fKPJDiffAdd(vDiffTpn2, "C", "2.27", "cboKPJRel");
				fKPJDiffAdd(vDiffTpn2, "T", "2.28", "txtKPJRelDet",
						" si tiene relaci&oacute;n con otra compa&ntilde;&iacute;a del grupo");
				fKPJDiffAdd(vDiffTpn2, "T", "2.29", "txtKPJIniAnn");

				var vDiffTpn2Lng = vDiffTpn2.length;
				if (vDiffTpn2Lng > 0) {
					vChange = true;
				}

				// Diferencias Panel 3
				fKPJDiffAdd(vDiffTpn3, "T", "3.1", "txtKPJValOpe");
				fKPJDiffAdd(vDiffTpn3, "T", "3.2", "txtKPJAcuPri");
				fKPJDiffAdd(vDiffTpn3, "T", "3.3", "txtKPJValOpeMot");
				fKPJDiffAdd(vDiffTpn3, "T", "3.4", "txtKPJComent");

				var vDiffTpn3Lng = vDiffTpn3.length;
				if (vDiffTpn3Lng > 0) {
					vChange = true;
				}

				// Diferencias Panel 4
				fKPJDiffAdd(vDiffTpn4, "C", "4.1", "cboKPJOIn");
				fKPJDiffAddOIn(vDiffTpn4, "4.2", "dgrKPJOInLista");

				var vDiffTpn4Lng = vDiffTpn4.length;
				if (vDiffTpn4Lng > 0) {
					vChange = true;
				}

				if (vShow) {
					var vDataDiff = [];
					if (!vChange) {
						// Si no existen diferencias
						vDataDiff = [ {
							label : '<b>No se encontraron diferencias.</b>',
							id : '1'
						} ];
					} else {
						// Si existen diferencias solo muestro diferencias
						if (vDiffTpn1Lng > 0) {
							var vDiffTit1 = {
								label : '<b>1 - Informaci&oacute;n B&aacute;sica del Cliente ('
										+ vDiffTpn1Lng + ')</b>',
								id : '1',
								children : vDiffTpn1
							};
							vDataDiff.push(vDiffTit1);
						}
						if (vDiffTpn2Lng > 0) {
							var vDiffTit2 = {
								label : '<b>2 - Informaci&oacute;n Detallada del Cliente ('
										+ vDiffTpn2Lng + ')</b>',
								id : '2',
								children : vDiffTpn2
							};
							vDataDiff.push(vDiffTit2);
						}
						if (vDiffTpn3Lng > 0) {
							var vDiffTit3 = {
								label : '<font color="red"><b>3- Perfil Transaccional ('
										+ vDiffTpn3Lng + ')</b></font>',
								id : '3',
								children : vDiffTpn3
							};
							vDataDiff.push(vDiffTit3);
						}
						if (vDiffTpn4Lng > 0) {
							var vDiffTit4 = {
								label : '<b>4- Operaciones Inusuales ('
										+ vDiffTpn4Lng + ')</b>',
								id : '4',
								children : vDiffTpn4
							};
							vDataDiff.push(vDiffTit4);
						}
					}

					var vStoreDiff = new ItemFileReadStore({
						data : {
							identifier : 'id',
							label : 'label',
							items : vDataDiff
						}
					});

					var vTreeModel = new ForestStoreModel({
						store : vStoreDiff
					});

					if (dijit.byId("treKPJDiffShow") != null) {
						fDestroyElement("treKPJDiffShow");
						document.getElementById("tdKPJDiffShow").innerHTML = '<div id="_divKPJDiffShow" style="width: 600px; height: 400px;"></div>';
					}
					if (dijit.byId("treKPJDiffShow") == null) {
						oTree = dijit.Tree({
							id : "treKPJDiffShow",
							style : 'width: 600px; height: 400px;',
							model : vTreeModel,
							autoExpand : false,
							showRoot : false,
							_createTreeNode : function(args) {
								var tnode = new dijit._TreeNode(args);
								tnode.labelNode.innerHTML = args.label;
								return tnode;
							}
						}, "_divKPJDiffShow");

						oTree.startup();
					}
				}
			});

	// Mostrar Dialog
	if (vShow) {
		dijit.byId("dlgKPJDiffShow").show();
	}

	return vChange;
}

function fKPJDiffAdd(vArr, vTipo, vIdTree, vObjId, vTextAdi) {
	var vObj = dijit.byId(vObjId);
	var vLbl = document.getElementById("lbl" + vObjId.substr(3, vObjId.length));

	var vLblDes = "";
	if (vLbl) {
		vLblDes = vLbl.innerHTML.replace(":", "");
		vLblDes = vLblDes.replace("<BR>", " ");
	}
	if (vTextAdi) {
		vLblDes += vTextAdi;
	}

	if (vTipo == "T" || vTipo == "C") {
		// Text y Combo
		if (vObj.get("origValue") != vObj.get("value")) {
			var vObjValDes = "";
			var vObjOriDes = "";
			if (vTipo == "T") {
				vObjOriDes = vObj.get("origValue");
				vObjValDes = vObj.get("value");
			} else if (vTipo == "C") {
				vObjOriDes = vObj.get("origDisplayedValue");
				vObjValDes = vObj.get("displayedValue");
			}

			var vDiff = {
				id : vIdTree,
				label : '<b>Campo: </b>' + vLblDes,
				children : [
						{
							id : vIdTree + '.1',
							label : '<b>Valor Original: </b>' + vObjOriDes
						},
						{
							id : vIdTree + '.2',
							label : '<font color="blue"><b>Valor Modificado: </b>'
									+ vObjValDes + '</font>'
						} ]
			};
			vArr.push(vDiff);
		}
	} else if (vTipo == "D") {
		// Date
		var vObjValDes = null;
		if (vObj.get("value") != null) {
			vObjValDes = dojo.date.locale.format(vObj.get("value"), {
				datePattern : "yyyy-MM-dd",
				selector : "date"
			});
		}
		if (vObj.get("origValue") != vObjValDes) {
			var vObjOriDes = vObj.get("origValue");

			if (vObjValDes == null) {
				vObjValDes = "";
			}
			if (vObjOriDes == null) {
				vObjOriDes = "";
			}

			var vDiff = {
				id : vIdTree,
				label : '<b>Campo: </b>' + vLblDes,
				children : [
						{
							id : vIdTree + '.1',
							label : '<b>Valor Original: </b>' + vObjOriDes
						},
						{
							id : vIdTree + '.2',
							label : '<font color="blue"><b>Valor Modificado: </b>'
									+ vObjValDes + '</font>'
						} ]
			};
			vArr.push(vDiff);
		}
	}
}

function fKPJDiffAddRep(vArr, vIdTree, vObjId) {
	// Grilla Representantes
	var vObj = dijit.byId(vObjId);
	var vLbl = document.getElementById("lbl" + vObjId.substr(3, vObjId.length));

	var vLblDes = "";
	if (vLbl) {
		vLblDes = vLbl.innerHTML.replace(":", "");
	}

	var vModGrid = vObj.store._arrayOfTopLevelItems;
	var vOriGrid = JSON.parse(document.getElementById("hdgrKPJRepLista").value);
	var vEnc = false;
	var vDiffGrid = [];

	// Nuevos y modificados
	for ( var i = 0; i < vModGrid.length; i++) {
		vEnc = false;
		for ( var j = 0; j < vOriGrid.length; j++) {
			if (vModGrid[i].numeroDoc == vOriGrid[j].numeroDoc) {
				vEnc = true;
				if ((vModGrid[i].apellido != vOriGrid[j].apellido)
						|| (vModGrid[i].nombre != vOriGrid[j].nombre) 
						|| (vModGrid[i].fechaConstitNacim != vOriGrid[j].fechaConstitNacim)) {
					// Modificado
					vDiffGrid
							.push({
								id : vIdTree + '.1.' + i,
								label : "(Modificado) "
										+ vModGrid[i].tipoDoc[0].name + " "
										+ vModGrid[i].numeroDoc,
								children : [
										{
											id : vIdTree + '.1.' + i + '.1',
											label : '<b>Valor Original: </b>'
													+ vOriGrid[j].apellido
													+ ', ' 
													+ vOriGrid[j].nombre
													+ ', ' 
													+ vOriGrid[j].fechaConstitNacim
										},
										{
											id : vIdTree + '.1.' + i + ".2",
											label : '<font color="blue"><b>Valor Modificado: </b>'
													+ vModGrid[i].apellido
													+ ', '
													+ vModGrid[i].nombre
													+ ', ' 
													+ vModGrid[i].fechaConstitNacim
													+ '</font>'
										} ]
							});
				}
			}
		}
		// Es nuevo
		if (!vEnc) {
			vDiffGrid.push({
				id : vIdTree + '.1.' + i,
				label : "<font color='blue'>(Nuevo) "
						+ vModGrid[i].tipoDoc[0].name + " "
						+ vModGrid[i].numeroDoc + " - " + vModGrid[i].apellido
						+ ", " + vModGrid[i].nombre + "</font>"
			});
		}
	}
	// Eliminados
	for ( var j = 0; j < vOriGrid.length; j++) {
		vEnc = false;
		for ( var i = 0; i < vModGrid.length; i++) {
			if (vModGrid[i].numeroDoc == vOriGrid[j].numeroDoc) {
				vEnc = true;
			}
		}
		if (!vEnc) {
			vDiffGrid.push({
				id : vIdTree + '.1.' + (vModGrid.length + j),
				label : "<font color='blue'>(Eliminado) "
						+ vOriGrid[j].tipoDoc.name + " "
						+ vOriGrid[j].numeroDoc + " - " + vOriGrid[j].apellido
						+ ", " + vOriGrid[j].nombre + "</font>"
			});
		}
	}
	// Diferencias totales
	if (vDiffGrid.length > 0) {
		var vDiff = {
			id : vIdTree,
			label : '<b>Grilla: </b>' + vLblDes,
			children : [ {
				id : vIdTree + '.1',
				label : '<b>Cantidad Original: </b>' + vOriGrid.length + " / "
						+ '<font color="blue"><b>Cantidad Modificada: </b>'
						+ vModGrid.length + '</font>',
				children : vDiffGrid
			} ]
		};
		vArr.push(vDiff);
	}
}

function fKPJDiffAddRepSCC(vArr, vIdTree, vObjId) {
	// Grilla Representantes SCC
	var vObj = dijit.byId(vObjId);
	var vLbl = document.getElementById("lbl" + vObjId.substr(3, vObjId.length));

	var vLblDes = "";
	if (vLbl) {
		vLblDes = vLbl.innerHTML.replace(":", "");
	}

	var vModGrid = vObj.store._arrayOfTopLevelItems;
	var vOriGrid = JSON.parse(document.getElementById("hdgrKPJRepLista").value);
	var vEnc = false;
	var vDiffGrid = [];

	// Nuevos y modificados
	for ( var i = 0; i < vModGrid.length; i++) {
		vEnc = false;
		for ( var j = 0; j < vOriGrid.length; j++) {
			if (vModGrid[i].numeroDoc == vOriGrid[j].numeroDoc) {
				vEnc = true;
				if ((vModGrid[i].esSCC != String(vOriGrid[j].esSCC))
						|| (vModGrid[i].cargo != vOriGrid[j].cargo)
						|| (vModGrid[i].esPEP != String(vOriGrid[j].esPEP))) {
					// Modificado
					vDiffGrid
							.push({
								id : vIdTree + '.1.' + i,
								label : "(Modificado) "
										+ vModGrid[i].tipoDoc[0].name + " "
										+ vModGrid[i].numeroDoc,
								children : [
										{
											id : vIdTree + '.1.' + i + '.1',
											label : '<b>Valor Original: </b>'
													+ (vOriGrid[j].esSCC ? "Es SCC"
															: "No es SCC")
													+ ', '
													+ vOriGrid[j].cargo
													+ ', '
													+ (vOriGrid[j].esPEP ? "Es PEP"
															: "No es PEP")
										},
										{
											id : vIdTree + '.1.' + i + ".2",
											label : '<font color="blue"><b>Valor Modificado: </b>'
													+ (vModGrid[i].esSCC == "true" ? "Es SCC"
															: "No es SCC")
													+ ', '
													+ vModGrid[i].cargo
													+ ', '
													+ (vModGrid[i].esPEP == "true" ? "Es PEP"
															: "No es PEP")
													+ '</font>'
										} ]
							});
				}
			}
		}
		// Es nuevo
		if (!vEnc) {
			vDiffGrid
					.push({
						id : vIdTree + '.1.' + i,
						label : "<font color='blue'>(Nuevo) "
								+ vModGrid[i].tipoDoc[0].name
								+ " "
								+ vModGrid[i].numeroDoc
								+ " - "
								+ (vModGrid[i].esSCC == "true" ? "Es SCC"
										: "No es SCC")
								+ ", "
								+ vModGrid[i].cargo
								+ ", "
								+ (vModGrid[i].esPEP == "true" ? "Es PEP"
										: "No es PEP") + "</font>"
					});
		}
	}
	// Eliminados
	for ( var j = 0; j < vOriGrid.length; j++) {
		vEnc = false;
		for ( var i = 0; i < vModGrid.length; i++) {
			if (vModGrid[i].numeroDoc == vOriGrid[j].numeroDoc) {
				vEnc = true;
			}
		}
		if (!vEnc) {
			vDiffGrid.push({
				id : vIdTree + '.1.' + (vModGrid.length + j),
				label : "<font color='blue'>(Eliminado) "
						+ vOriGrid[j].tipoDoc.name + " "
						+ vOriGrid[j].numeroDoc + " - "
						+ (vOriGrid[j].esSCC ? "Es SCC" : "No es SCC") + ", "
						+ vOriGrid[j].cargo + ", "
						+ (vOriGrid[j].esPEP ? "Es PEP" : "No es PEP")
						+ "</font>"
			});
		}
	}
	// Diferencias totales
	if (vDiffGrid.length > 0) {
		var vDiff = {
			id : vIdTree,
			label : '<b>Grilla: </b>' + vLblDes,
			children : [ {
				id : vIdTree + '.1',
				label : '<b>Cantidad Original: </b>' + vOriGrid.length + " / "
						+ '<font color="blue"><b>Cantidad Modificada: </b>'
						+ vModGrid.length + '</font>',
				children : vDiffGrid
			} ]
		};
		vArr.push(vDiff);
	}
}

function fKPJDiffAddCia(vArr, vIdTree, vObjId) {
	// Grilla Companias
	var vObj = dijit.byId(vObjId);
	var vLbl = document.getElementById("lbl" + vObjId.substr(3, vObjId.length));

	var vLblDes = "";
	if (vLbl) {
		vLblDes = vLbl.innerHTML.replace(":", "");
	}

	var vModGrid = vObj.store._arrayOfTopLevelItems;
	var vOriGrid = JSON.parse(document.getElementById("hdgrKPJCiaLista").value);
	var vEnc = false;
	var vDiffGrid = [];

	// Nuevos y modificados
	for ( var i = 0; i < vModGrid.length; i++) {
		vEnc = false;
		for ( var j = 0; j < vOriGrid.length; j++) {
			if (vModGrid[i].secuencia == vOriGrid[j].secuencia) {
				vEnc = true;
				if ((vModGrid[i].razonSocial != vOriGrid[j].razonSocial)
						|| (vModGrid[i].esSCC != String(vOriGrid[j].esSCC)
						|| (vModGrid[i].fechaConstitucion != vOriGrid[j].fechaConstitucion))) {
					// Modificado
					vDiffGrid
							.push({
								id : vIdTree + '.1.' + i,
								label : "(Modificado) ",
								children : [
										{
											id : vIdTree + '.1.' + i + '.1',
											label : '<b>Valor Original: </b>'
													+ vOriGrid[j].razonSocial
													+ ' - '
													+ (vOriGrid[j].esSCC ? "Es SCC"
															: "No es SCC")
													+ ' - ' 
													+ vOriGrid[j].fechaConstitucion
										},
										{
											id : vIdTree + '.1.' + i + ".2",
											label : '<font color="blue"><b>Valor Modificado: </b>'
													+ vModGrid[i].razonSocial
													+ ' - '
													+ (vModGrid[i].esSCC == "true" ? "Es SCC"
															: "No es SCC")
													+ ' - ' 
													+ vModGrid[i].fechaConstitucion
													+ '</font>'
										} ]
							});
				}
			}
		}
		// Es nuevo
		if (!vEnc) {
			vDiffGrid
					.push({
						id : vIdTree + '.1.' + i,
						label : "<font color='blue'>(Nuevo) "
								+ vModGrid[i].razonSocial
								+ " - "
								+ (vModGrid[i].esSCC == "true" ? "Es SCC"
										: "No es SCC") + "</font>"
					});
		}
	}
	// Eliminados
	for ( var j = 0; j < vOriGrid.length; j++) {
		vEnc = false;
		for ( var i = 0; i < vModGrid.length; i++) {
			if (vModGrid[i].secuencia == vOriGrid[j].secuencia) {
				vEnc = true;
			}
		}
		if (!vEnc) {
			vDiffGrid.push({
				id : vIdTree + '.1.' + (vModGrid.length + j),
				label : "<font color='blue'>(Eliminado) "
						+ vOriGrid[j].razonSocial + " - "
						+ (vOriGrid[j].esSCC ? "Es SCC" : "No es SCC")
						+ "</font>"
			});
		}
	}
	// Diferencias totales
	if (vDiffGrid.length > 0) {
		var vDiff = {
			id : vIdTree,
			label : '<b>Grilla: </b>' + vLblDes,
			children : [ {
				id : vIdTree + '.1',
				label : '<b>Cantidad Original: </b>' + vOriGrid.length + " / "
						+ '<font color="blue"><b>Cantidad Modificada: </b>'
						+ vModGrid.length + '</font>',
				children : vDiffGrid
			} ]
		};
		vArr.push(vDiff);
	}
}

function fKPJDiffAddOIn(vArr, vIdTree, vObjId) {
	// Grilla Operaciones Inusuales
	var vObj = dijit.byId(vObjId);
	var vLbl = document.getElementById("lbl" + vObjId.substr(3, vObjId.length));

	var vLblDes = "";
	if (vLbl) {
		vLblDes = vLbl.innerHTML.replace(":", "");
	}

	var vModGrid = vObj.store._arrayOfTopLevelItems;
	var vOriGrid = JSON.parse(document.getElementById("hdgrKPJOInLista").value);
	var vEnc = false;
	var vDiffGrid = [];

	// Nuevos y modificados
	for ( var i = 0; i < vModGrid.length; i++) {
		vEnc = false;
		for ( var j = 0; j < vOriGrid.length; j++) {
			if (vModGrid[i].secuencia == vOriGrid[j].secuencia) {
				vEnc = true;
				if ((vModGrid[i].fecha != vOriGrid[j].fecha)
						|| (vModGrid[i].tipoOperacion != vOriGrid[j].tipoOperacion)
						|| (vModGrid[i].origenFondos != vOriGrid[j].origenFondos)
						|| (parseFloat(vModGrid[i].monto) != parseFloat(vOriGrid[j].monto))
						|| (vModGrid[i].observacion != vOriGrid[j].observacion)) {
					// Modificado
					vDiffGrid
							.push({
								id : vIdTree + '.1.' + i,
								label : "(Modificado) ",
								children : [
										{
											id : vIdTree + '.1.' + i + '.1',
											label : '<b>Valor Original: </b>'
													+ fDgrColFec(vOriGrid[j].fecha)
													+ ' - '
													+ vOriGrid[j].tipoOperacion
													+ ' - '
													+ vOriGrid[j].origenFondos
													+ ' - ' + vOriGrid[j].monto
										},
										{
											id : vIdTree + '.1.' + i + ".2",
											label : '<font color="blue"><b>Valor Modificado: </b>'
													+ fDgrColFec(vModGrid[i].fecha)
													+ ' - '
													+ vModGrid[i].tipoOperacion
													+ ' - '
													+ vModGrid[i].origenFondos
													+ ' - '
													+ vModGrid[i].monto
													+ '</font>'
										} ]
							});
				}
			}
		}
		// Es nuevo
		if (!vEnc) {
			vDiffGrid.push({
				id : vIdTree + '.1.' + i,
				label : "<font color='blue'>(Nuevo) "
						+ fDgrColFec(vModGrid[i].fecha) + ' - '
						+ vModGrid[i].tipoOperacion + " - "
						+ vModGrid[i].origenFondos + ' - ' + vModGrid[i].monto
						+ "</font>"
			});
		}
	}
	// Eliminados
	for ( var j = 0; j < vOriGrid.length; j++) {
		vEnc = false;
		for ( var i = 0; i < vModGrid.length; i++) {
			if (vModGrid[i].secuencia == vOriGrid[j].secuencia) {
				vEnc = true;
			}
		}
		if (!vEnc) {
			vDiffGrid.push({
				id : vIdTree + '.1.' + (vModGrid.length + j),
				label : "<font color='blue'>(Eliminado) "
						+ fDgrColFec(vOriGrid[j].fecha) + " - "
						+ vOriGrid[j].tipoOperacion + " - "
						+ vOriGrid[j].origenFondos + ' - ' + vOriGrid[j].monto
						+ "</font>"
			});
		}
	}
	// Diferencias totales
	if (vDiffGrid.length > 0) {
		var vDiff = {
			id : vIdTree,
			label : '<b>Grilla: </b>' + vLblDes,
			children : [ {
				id : vIdTree + '.1',
				label : '<b>Cantidad Original: </b>' + vOriGrid.length + " / "
						+ '<font color="blue"><b>Cantidad Modificada: </b>'
						+ vModGrid.length + '</font>',
				children : vDiffGrid
			} ]
		};
		vArr.push(vDiff);
	}
}

function fKPJValidate() {
	var vRet = 0;
	require(
			[ "dojo/request", "dijit/Tree", "dojo/data/ItemFileReadStore",
					"dijit/tree/ForestStoreModel", "dojo/domReady!" ],
			function(request, Tree, ItemFileReadStore, ForestStoreModel) {
				// Titulos
				dijit.byId("dlgKPJDiffShow").set("title", "Validaci&oacute;n");
				document.getElementById("lblKPJDiffShow").innerHTML = "<font color='red'><b>Lista de Errores de Validaci&oacute;n:<b></font>";
				document.getElementById("lblKPJDiffLey").innerHTML = "Hacer doble clic en el error para ir a la posici&oacute;n del campo.";

				var vDataVal = [];
				var vValTpn1 = [];
				var vValTpn2 = [];
				var vValTpn3 = [];
				var vValTpn4 = [];

				// Validacion Panel 1
				fKPJValAdd(vValTpn1, "R", "1.1", "txtKPJRazonSocial");
				fKPJValAdd(vValTpn1, "D", "1.3", "txtKPJFechaConst");
				// Si tiene algo en la fecha
				if (dijit.byId("txtKPJFechaConst").get("value") != null) {
					var vFechaConst = dojo.date.locale.format(dijit.byId(
							"txtKPJFechaConst").get("value"), {
						datePattern : "yyyyMMdd",
						selector : "date"
					});
					if (vFechaConst > document.getElementById("lblKPJEstado").fechaHoy) {
						fKPJValAddMan(vValTpn1,
								"Fecha de constituci&oacute;n de la firma",
								"1.3", "txtKPJFechaConst",
								"La fecha no puede ser mayor a la actual.");
					}
				}
				fKPJValAdd(vValTpn1, "T", "1.4", "txtKPJDirCalle");
				fKPJValAdd(vValTpn1, "R", "1.5", "txtKPJDirNumero");
				fKPJValAdd(vValTpn1, "C", "1.7", "cboKPJDirProv");
				fKPJValAdd(vValTpn1, "T", "1.8", "txtKPJDirLocal");
				fKPJValAdd(vValTpn1, "N", "1.9", "txtKPJDirCP");
				// Validar CP (Solo CABA)
				if (dijit.byId("txtKPJDirCP").get("value") != "0") {
					if (dijit.byId("cboKPJDirProv").get("value") == "1") {
						if (!fCPFinderValCPXAltura(dijit.byId("txtKPJDirCalle")
								.get("value"), dijit.byId("txtKPJDirNumero")
								.get("value"), dijit.byId("txtKPJDirCP").get(
								"value"))) {
							fKPJValAddMan(vValTpn1, "C.Postal", "1.9",
									"txtKPJDirNumero",
									"No corresponde con la calle y el n&uacute;mero.");
						}
					}
				}
				fKPJValAdd(vValTpn1, "R", "1.10", "txtKPJTelefono");
				fKPJValAdd(vValTpn1, "M", "1.11", "txtKPJEmail");
				fKPJValAddRep(vValTpn1, "1.14", "dgrKPJRepLista");
				fKPJValAdd(vValTpn1, "C", "1.13", "cboKPJTitMPg");
				// Solo validar cuando es N
				if (dijit.byId("cboKPJTitMPg").get("value") == "N") {
					fKPJValAdd(vValTpn1, "C", "1.15", "cboKPJTitMPgTipDoc",
							" del titular del medio de pago");
					fKPJValAdd(vValTpn1, "N", "1.16", "txtKPJTitMPgNroDoc",
							" Documento del titular del medio de pago");
					// Validar solo para CUIT
					if (dijit.byId("cboKPJTitMPgTipDoc").get("value") == "4"
							&& !isNaN(dijit.byId("txtKPJTitMPgNroDoc").get(
									"value"))
							&& dijit.byId("txtKPJTitMPgNroDoc").get("value") != 0) {
						if (!fValCUIT(String(dijit.byId("txtKPJTitMPgNroDoc")
								.get("value")))) {
							fKPJValAddMan(vValTpn1,
									"Documento del titular del medio de pago",
									"1.16", "txtKPJTitMPgNroDoc",
									"Debe ingresar un CUIT v&aacute;lido.");
						}
					}
					fKPJValAdd(vValTpn1, "R", "1.17", "txtKPJTitMPgApellido",
							" del titular del medio de pago");
					if (dijit.byId("cboKPJTitMPgTipDoc").get("value") != "4") {
						fKPJValAdd(vValTpn1, "A", "1.18", "txtKPJTitMPgNombre",
								" del titular del medio de pago");
					}
					fKPJValAdd(vValTpn1, "R", "1.19", "txtKPJTitMPgMedioPago",
							" del titular del medio de pago");
				}

				var vValTpn1Lng = vValTpn1.length;
				if (vValTpn1Lng > 0) {
					vDataVal
							.push({
								label : '<b>1 - Informaci&oacute;n B&aacute;sica del Cliente ('
										+ vValTpn1Lng + ')</b>',
								id : '1',
								children : vValTpn1
							});
				}

				// Validacion Panel 2
				fKPJValAdd(vValTpn2, "C", "2.1", "cboKPJActividad");
				fKPJValAdd(vValTpn2, "T", "2.2", "txtKPJActivDes");
				fKPJValAdd(vValTpn2, "T", "2.3", "txtKPJPropositoDes");
				// fKPJValAdd(vValTpn2, "C", "2.4", "cboKPJCaracter");
				// Solo valida cuando es 4
				if (dijit.byId("cboKPJCaracter").get("value") == "4") {
					fKPJValAdd(vValTpn2, "T", "2.5", "txtKPJCaracterDes");
				}
				fKPJValAdd(vValTpn2, "C", "2.6", "cboKPJBco");
				fKPJValAdd(vValTpn2, "C", "2.7", "cboKPJCotBolsa");
				fKPJValAdd(vValTpn2, "C", "2.8", "cboKPJSubsCia");
				fKPJValAdd(vValTpn2, "C", "2.9", "cboKPJCliRegOrg");
				fKPJValAdd(vValTpn2, "C", "2.10", "cboKPJSCC");
				// Solo valida cuando es S
				if (dijit.byId("cboKPJSCC").get("value") == "S") {
					fKPJValAdd(vValTpn2, "T", "2.11", "txtKPJSCCMot",
							" si es SCC");
				}
				fKPJValAdd(vValTpn2, "C", "2.12", "cboKPJRepSCC");
				// Solo valida cuando es S
				if (dijit.byId("cboKPJRepSCC").get("value") == "S") {
					fKPJValAddRepSCC(vValTpn2, "2.13", "dgrKPJRepSCCLista");
				}
				fKPJValAdd(vValTpn2, "T", "2.14", "txtKPJAccionistas");
				fKPJValAdd(vValTpn2, "C", "2.15", "cboKPJCia");
				// Solo valida cuando es S
				if (dijit.byId("cboKPJCia").get("value") == "S") {
					fKPJValAddCia(vValTpn2, "2.16", "dgrKPJCiaLista");
				}
				// Siempre obligatoria la fecha de est cont / vigencia
				fKPJValAdd(vValTpn2, "D", "2.17", "txtKPJBalFecEstCont");
				// Si el perfil transaccional es obligatorio
				if (dijit.byId("cboKPJSCC").get("value") == "N"
						|| document.getElementById("lblKPJEstado").perfilObligenAIS) {
					fKPJValAdd(vValTpn2, "T", "2.18", "txtKPJBalAuditor");
					fKPJValAdd(vValTpn2, "D", "2.19", "txtKPJBalFecha");
					fKPJValAdd(vValTpn2, "N", "2.20", "txtKPJBalActivo");
					fKPJValAdd(vValTpn2, "N", "2.21", "txtKPJBalPasivo");
					fKPJValAdd(vValTpn2, "N", "2.22", "txtKPJBalVentas");
					fKPJValAdd(vValTpn2, "N", "2.23", "txtKPJBalResFinal");
					fKPJValAdd(vValTpn2, "T", "2.24", "txtKPJDocResDet");
				} else {
					fKPJValAdd(vValTpn2, "U", "2.20", "txtKPJBalActivo");
					fKPJValAdd(vValTpn2, "U", "2.21", "txtKPJBalPasivo");
					fKPJValAdd(vValTpn2, "U", "2.22", "txtKPJBalVentas");
					fKPJValAdd(vValTpn2, "U", "2.23", "txtKPJBalResFinal");
				}
				// Si tiene algo en la fecha de estados contables
				if (dijit.byId("txtKPJBalFecEstCont").get("value") != null) {
					var vBalFecEstCont = dojo.date.locale.format(dijit.byId(
							"txtKPJBalFecEstCont").get("value"), {
						datePattern : "yyyyMMdd",
						selector : "date"
					});
					if (vBalFecEstCont > document
							.getElementById("lblKPJEstado").fechaHoy) {
						fKPJValAddMan(
								vValTpn2,
								"Fecha de los Estados Contables / Inicio de Vigencia",
								"2.17", "txtKPJBalFecEstCont",
								"La fecha no puede ser mayor a la actual.");
					}
				}
				// Si tiene algo en la fecha
				if (dijit.byId("txtKPJBalFecha").get("value") != null) {
					var vBalFecha = dojo.date.locale.format(dijit.byId(
							"txtKPJBalFecha").get("value"), {
						datePattern : "yyyyMMdd",
						selector : "date"
					});
					if (vBalFecha > document.getElementById("lblKPJEstado").fechaHoy) {
						fKPJValAddMan(
								vValTpn2,
								"&Uacute;ltima fecha de actualizaci&oacute;n de ingresos",
								"2.19", "txtKPJBalFecha",
								"La fecha no puede ser mayor a la actual.");
					}
				}
				// Si escribio alguna observacion
				if (String(dijit.byId("txtKPJObserv").get("value")).length > 0) {
					fKPJValAdd(vValTpn2, "T", "2.25", "txtKPJObserv");
				}
				fKPJValAdd(vValTpn2, "C", "2.26", "cboKPJRel");
				// Solo valida cuando es S
				if (dijit.byId("cboKPJRel").get("value") == "S") {
					fKPJValAdd(vValTpn2, "T", "2.27", "txtKPJRelDet",
							" si tiene relaci&oacute;n con otra compa&ntilde;&iacute;a del grupo");
				}
				fKPJValAdd(vValTpn2, "N", "2.28", "txtKPJIniAnn");

				var vValTpn2Lng = vValTpn2.length;
				if (vValTpn2Lng > 0) {
					vDataVal
							.push({
								label : '<b>2 - Informaci&oacute;n Detallada del Cliente ('
										+ vValTpn2Lng + ')</b>',
								id : '2',
								children : vValTpn2
							});
				}

				// Validacion Panel 3
				// Si el perfil transaccional es obligatorio
				if (dijit.byId("cboKPJSCC").get("value") == "N"
						|| document.getElementById("lblKPJEstado").perfilObligenAIS) {
					fKPJValAdd(vValTpn3, "N", "3.2", "txtKPJValOpe");
					if (dijit.byId("txtKPJValOpe").get("value") > 0) {
						if (dijit.byId("txtKPJValOpe").get("value") < dijit
								.byId("txtKPJBalVentas").get("value")) {
							fKPJValAddMan(
									vValTpn3,
									"Ingresos Totales (cifra en Pesos) Perfil Transaccional",
									"3.2", "txtKPJValOpe",
									"El valor debe ser mayor o igual a las Ventas.");
						}
					}
					fKPJValAdd(vValTpn3, "T", "3.3", "txtKPJValOpeMot");
					fKPJValAdd(vValTpn3, "T", "3.4", "txtKPJComent");
				} else {
					fKPJValAdd(vValTpn3, "U", "3.2", "txtKPJValOpe");
				}

				var vValTpn3Lng = vValTpn3.length;
				if (vValTpn3Lng > 0) {
					vDataVal.push({
						label : '<b>3- Perfil Transaccional (' + vValTpn3Lng
								+ ')</b>',
						id : '3',
						children : vValTpn3
					});
				}

				// Validacion Panel 4
				fKPJValAdd(vValTpn4, "C", "4.1", "cboKPJOIn");
				// Solo valida cuando es S
				if (dijit.byId("cboKPJOIn").get("value") == "S") {
					fKPJValAddOIn(vValTpn4, "4.2", "dgrKPJOInLista");
				}

				var vValTpn4Lng = vValTpn4.length;
				if (vValTpn4Lng > 0) {
					vDataVal.push({
						label : '<b>4- Operaciones Inusuales (' + vValTpn4Lng
								+ ')</b>',
						id : '4',
						children : vValTpn4
					});
				}

				var vStoreVal = new ItemFileReadStore({
					data : {
						identifier : 'id',
						label : 'label',
						items : vDataVal
					}
				});

				var vTreeModel = new ForestStoreModel({
					store : vStoreVal
				});

				if (dijit.byId("treKPJDiffShow") != null) {
					fDestroyElement("treKPJDiffShow");
					document.getElementById("tdKPJDiffShow").innerHTML = '<div id="_divKPJDiffShow" style="width: 600px; height: 400px;"></div>';
				}
				if (dijit.byId("treKPJDiffShow") == null) {
					oTree = dijit.Tree({
						id : "treKPJDiffShow",
						style : 'width: 600px; height: 400px;',
						model : vTreeModel,
						autoExpand : true,
						showRoot : false,
						_createTreeNode : function(args) {
							var tnode = new dijit._TreeNode(args);
							tnode.labelNode.innerHTML = args.label;
							return tnode;
						},
						onDblClick : function(item, node, evt) {
							fKPJValFocus(item);
						}
					}, "_divKPJDiffShow");

					oTree.startup();
				}

				if (vDataVal.length > 0) {
					// Mostrar Dialog
					dijit.byId("dlgKPJDiffShow").show();
					vRet = 2;
				} else {
					vRet = 1;
				}
			});
	while (vRet == 0) {
		// Esperar hasta que de un resultado, porque es async
	}
	return (vRet == 1 ? true : false);
}

function fKPJValAdd(vArr, vTipo, vIdTree, vObjId, vTextAdi) {
	var vObj = dijit.byId(vObjId);
	var vLbl = document.getElementById("lbl" + vObjId.substr(3, vObjId.length));
	var vObjValDes = "";
	var vErr = false;

	var vLblDes = "";
	if (vLbl) {
		vLblDes = vLbl.innerHTML.replace(":", "");
		vLblDes = vLblDes.replace("<BR>", " ");
	}
	if (vTextAdi) {
		vLblDes += vTextAdi;
	}

	if (vTipo == "A") {
		// Alfabetico
		if (String(vObj.get("value")).length == 0) {
			vObjValDes = "Debe ingresar un valor.";
			vErr = true;
		} else {
			if (!fValType(vTipo, String(vObj.get("value")))) {
				vObjValDes = "Debe ingresar un valor alfab&eacute;tico v&aacute;lido.";
				vErr = true;
			}
		}
	} else if (vTipo == "T" || vTipo == "R") {
		// Texto
		if (String(vObj.get("value")).length == 0) {
			vObjValDes = "Debe ingresar un valor.";
			vErr = true;
		} else {
			if (!fValType(vTipo, String(vObj.get("value")))) {
				vObjValDes = "El campo tiene caracteres inv&aacute;lidos.";
				vErr = true;
			}
		}
	} else if (vTipo == "C") {
		// Combo
		if (String(vObj.get("value")).length == 0) {
			vObjValDes = "Debe seleccionar un valor.";
			vErr = true;
		} else if (vObj.get("value") == "0") {
			vObjValDes = "Debe seleccionar un valor.";
			vErr = true;
		}
	} else if (vTipo == "N") {
		// Numero
		if (isNaN(vObj.get("value")) || vObj.get("value") == 0) {
			vObjValDes = "Debe ingresar un valor num&eacute;rico v&aacute;lido.";
			vErr = true;
		}
	} else if (vTipo == "D") {
		// Fecha
		if (vObj.get("value") == null) {
			vObjValDes = "Debe ingresar una fecha v&aacute;lida.";
			vErr = true;
		}
	} else if (vTipo == "M") {
		// eMail
		if (String(vObj.get("value")).length > 0) {
			if (!fValType(vTipo, String(vObj.get("value")))) {
				vObjValDes = "El eMail ingresado es inv&aacute;lido.";
				vErr = true;
			}
		}
	}

	if (vErr) {
		var vVal = {
			id : vIdTree,
			label : vLblDes + ' - <font color="red"><b>' + vObjValDes
					+ '</b></font>',
			obj : vObjId
		};
		vArr.push(vVal);
	}
}

function fKPJValAddMan(vArr, vLey, vIdTree, vObjId, vTextAdi) {
	var vVal = {
		id : vIdTree,
		label : vLey + ' - <font color="red"><b>' + vTextAdi + '</b></font>',
		obj : vObjId
	};
	vArr.push(vVal);
}

function fKPJValAddRep(vArr, vIdTree, vObjId) {
	// Grilla Representantes
	var vObj = dijit.byId(vObjId);
	var vLbl = document.getElementById("lbl" + vObjId.substr(3, vObjId.length));

	var vLblDes = "";
	if (vLbl) {
		vLblDes = vLbl.innerHTML.replace(":", "");
	}

	var vModGrid = vObj.store._arrayOfTopLevelItems;

	// Si esta vacia
	if (vModGrid.length == 0) {
		var vDiff = {
			id : vIdTree,
			label : vLblDes
					+ ' - <font color="red"><b>Debe incluir al menos un representante.</b></font>',
			obj : 'dgrKPJRepLista'
		};
		vArr.push(vDiff);
	}
}

function fKPJValAddRepSCC(vArr, vIdTree, vObjId) {
	// Grilla Representantes SCC
	var vObj = dijit.byId(vObjId);
	var vLbl = document.getElementById("lbl" + vObjId.substr(3, vObjId.length));

	var vLblDes = "";
	if (vLbl) {
		vLblDes = vLbl.innerHTML.replace(":", "");
	}

	var vModGrid = vObj.store._arrayOfTopLevelItems;
	var vEnc = false;

	// Si ninguno esta marcado
	for ( var i = 0; i < vModGrid.length; i++) {
		if (vModGrid[i].esSCC == "true") {
			vEnc = true;
		}
	}

	if (!vEnc && vModGrid.length > 0) {
		var vDiff = {
			id : vIdTree,
			label : vLblDes
					+ ' - <font color="red"><b>Al menos un representante debe ser SCC.</b></font>',
			obj : 'cboKPJRepSCC'
		};
		vArr.push(vDiff);
	}
}

function fKPJValAddCia(vArr, vIdTree, vObjId) {
	// Grilla Companias
	var vObj = dijit.byId(vObjId);
	var vLbl = document.getElementById("lbl" + vObjId.substr(3, vObjId.length));

	var vLblDes = "";
	if (vLbl) {
		vLblDes = vLbl.innerHTML.replace(":", "");
	}

	var vModGrid = vObj.store._arrayOfTopLevelItems;

	// Si esta vacia
	if (vModGrid.length == 0) {
		var vDiff = {
			id : vIdTree,
			label : vLblDes
					+ ' - <font color="red"><b>Debe incluir al menos una compa&ntilde;&iacute;a.</b></font>',
			obj : 'cboKPJCia'
		};
		vArr.push(vDiff);
	}
}

function fKPJValAddOIn(vArr, vIdTree, vObjId) {
	// Grilla Operaciones Inusuales
	var vObj = dijit.byId(vObjId);
	var vLbl = document.getElementById("lbl" + vObjId.substr(3, vObjId.length));

	var vLblDes = "";
	if (vLbl) {
		vLblDes = vLbl.innerHTML.replace(":", "");
	}

	var vModGrid = vObj.store._arrayOfTopLevelItems;

	// Si esta vacia
	if (vModGrid.length == 0) {
		var vDiff = {
			id : vIdTree,
			label : vLblDes
					+ ' - <font color="red"><b>Debe incluir al menos una operaci&oacute;n inusual.</b></font>',
			obj : 'cboKPJOIn'
		};
		vArr.push(vDiff);
	}
}

function fKPJValFocus(vItem) {
	if (vItem.obj) {
		dijit.byId('dlgKPJDiffShow').onCancel();
		var vObj = dijit.byId(String(vItem.obj));
		if (vObj) {
			if (vObj.isFocusable()) {
				vObj.focus();
			}
		}
	}
}

function fKPJDataLoad(vUser, vProfileKey) {
	// Espera
	fWaitMsgBoxIni("Consultando",
			[ "Se est&aacute; procesando la consulta de KYC..." ]);

	// Perfil
	var vRO = true;
	if (vProfileKey == "OPERADOR") {
		vRO = false;
	}

	// KYC Personas Juridicas
	require(
			[ "dojo/request", "dojox/grid/DataGrid",
					"dojo/data/ItemFileWriteStore", "dojo/domReady!" ],
			function(request, DataGrid, ItemFileWriteStore) {

				var vURL = fGetURLSvc("KYCService/getKYCPersJur?cache="
						+ fGetCacheRnd()
						+ "&"
						+ document.getElementById("lblKPJEstado").parNumeroCUIT
						+ "&"
						+ document.getElementById("lblKPJEstado").parRazonSocial);
				var deferred = request.get(vURL, {
					handleAs : "json"
				});

				deferred
						.then(function(response) {
							// Manejar Respuesta
							if (response.error) {
								fWaitMsgBoxUpd(
										0,
										"Se ha producido un error al consultar el KYC.",
										"E");
								fWaitMsgBoxClose();
								return;
							} else if (response.result == null) {
								fWaitMsgBoxUpd(
										0,
										"Se ha producido un error al consultar el KYC.",
										"E");
								fWaitMsgBoxClose();
								return;
							}

							var vJSONO = response.result[0];
							var vJSONA = response.result[1];

							if (vJSONO == null || vJSONA == null) {
								fWaitMsgBoxUpd(
										0,
										"Se ha producido un error al consultar el KYC.",
										"E");
								fWaitMsgBoxClose();
								return;
							}

							// Verificar
							var vRes = fKPJDataLoadVerify(vJSONA, vJSONO, vRO);
							if (vRes == "N") {
								// No permite avanzar
								return;
							} else if (vRes == "V") {
								// Dar vuelta
								vJSONO = response.result[1];
								vJSONA = response.result[0];
							} else if (vRes == "U") {
								// Uno solo
								vJSONO = response.result[0];
								vJSONA = response.result[0];
							} else if (vRes == "S") {
								// Uno solo pero el segundo
								vJSONO = response.result[1];
								vJSONA = response.result[1];
							} else if (vRes == "E") {
								// Uno solo pero ahora es ReadOnly
								vJSONO = response.result[0];
								vJSONA = response.result[0];
								vRO = true;
							} else if (vRes == "R") {
								// Ok pero ahora es ReadOnly
								vRO = true;
							} else if (vRes == "O") {
								// Ok
							}

							// Mostrar Paneles
							dijit.byId("tpnKYCPersJurP1").set("open", true);
							dijit.byId("tpnKYCPersJurP2").set("open", true);
							dijit.byId("tpnKYCPersJurP3").set("open", true);
							dijit.byId("tpnKYCPersJurP4").set("open", true);

							// KYC Personas Juridicas
							fKPJDataLoadGral(vJSONA, vJSONO, vRO);
							fKPJDataLoadTpn1(vJSONA, vJSONO, vRO);
							fKPJDataLoadTpn2(vJSONA, vJSONO, vRO);
							fKPJDataLoadTpn3(vJSONA, vJSONO, vRO);
							fKPJDataLoadTpn4(vJSONA, vJSONO);

							// Representantes / Rep SCC
							// Guardar el original
							document.getElementById("hdgrKPJRepLista").value = JSON
									.stringify(vJSONO.representanteList);
							var vDataRep = {
								items : vJSONA.representanteList
							};
							var jsonDataSourceRep = new ItemFileWriteStore({
								data : vDataRep
							});

							// Representantes
							var layout = [ [ {
								name : "T.Doc.",
								field : "tipoDoc",
								formatter : fDgrColTDo,
								width : "50px"
							}, {
								name : "N.Doc.",
								field : "numeroDoc",
								width : "50px"
							}, {
								name : "Apellido",
								field : "apellido",
								width : "180px"
							}, {
								name : "Nombre",
								field : "nombre",
								width : "160px"
							}, {
								name : "Fecha Nac.",
								field : "fechaConstitNacim",
								formatter : fDgrColFec,
								width : "60px"
							} ] ];

							if (dijit.byId("dgrKPJRepLista") == null) {
								oGrid = new DataGrid({
									id : "dgrKPJRepLista",
									store : jsonDataSourceRep,
									structure : layout,
									rowSelector : "25px",
									rowCount : 20,
									style : 'width: 610px; height: 80px;',
									selectionMode : "single",
									onRowDblClick : function() {
										fKPJRepUpd();
									}
								}, "_divKPJRepLista");

								oGrid.startup();
							} else {
								dijit.byId("dgrKPJRepLista").setStructure(
										layout);
								dijit.byId("dgrKPJRepLista").setStore(
										jsonDataSourceRep);
							}

							// Representantes SCC
							var layout = [ [ {
								name : "T.Doc.",
								field : "tipoDoc",
								formatter : fDgrColTDo,
								width : "50px"
							}, {
								name : "N.Doc.",
								field : "numeroDoc",
								width : "50px"
							}, {
								name : "Apellido",
								field : "apellido",
								width : "140px"
							}, {
								name : "Nombre",
								field : "nombre",
								width : "120px"
							}, {
								name : "SCC",
								field : "esSCC",
								formatter : fDgrColBln,
								width : "40px"
							}, {
								name : "Cargo",
								field : "cargo",
								width : "140px"
							}, {
								name : "PEP",
								field : "esPEP",
								formatter : fDgrColBln,
								width : "40px"
							} ] ];

							if (dijit.byId("dgrKPJRepSCCLista") == null) {
								oGrid = new DataGrid({
									id : "dgrKPJRepSCCLista",
									store : jsonDataSourceRep,
									structure : layout,
									rowSelector : "25px",
									rowCount : 20,
									style : 'width: 720px; height: 80px;',
									selectionMode : "single"
								}, "_divKPJRepSCCLista");

								oGrid.startup();
							} else {
								dijit.byId("dgrKPJRepSCCLista").setStructure(
										layout);
								dijit.byId("dgrKPJRepSCCLista").setStore(
										jsonDataSourceRep);
							}

							// Companias
							// Guardar el original
							document.getElementById("hdgrKPJCiaLista").canOrig = vJSONO.companiaList.length;
							document.getElementById("hdgrKPJCiaLista").value = JSON
									.stringify(vJSONO.companiaList);
							var vDataCia = {
								items : vJSONA.companiaList
							};
							var jsonDataSourceCia = new ItemFileWriteStore({
								data : vDataCia
							});

							// Companias
							var layout = [ [ {
								name : "Raz&oacute;n social",
								field : "razonSocial",
								width : "360px"
							}, {
								name : "SCC",
								field : "esSCC",
								formatter : fDgrColBln,
								width : "40px"
							}, {
								name : "Fecha Constit.",
								field : "fechaConstitucion",
								formatter : fDgrColFec,
								width : "70px"
							} ] ];

							if (dijit.byId("dgrKPJCiaLista") == null) {
								oGrid = new DataGrid({
									id : "dgrKPJCiaLista",
									store : jsonDataSourceCia,
									structure : layout,
									rowSelector : "25px",
									rowCount : 20,
									style : 'width: 560px; height: 80px;',
									selectionMode : "single"
								}, "_divKPJCiaLista");

								oGrid.startup();
							} else {
								dijit.byId("dgrKPJCiaLista").setStructure(
										layout);
								dijit.byId("dgrKPJCiaLista").setStore(
										jsonDataSourceCia);
							}

							// Operaciones Inusuales
							// Guardar el original
							document.getElementById("hdgrKPJOInLista").canOrig = vJSONO.opeInusualList.length;
							document.getElementById("hdgrKPJOInLista").value = JSON
									.stringify(vJSONO.opeInusualList);
							var vDataOIn = {
								items : vJSONA.opeInusualList
							};
							var jsonDataSourceOIn = new ItemFileWriteStore({
								data : vDataOIn
							});

							// Operaciones Inusuales
							var layout = [ [ {
								name : "Fecha",
								field : "fecha",
								formatter : fDgrColFec,
								width : "60px"
							}, {
								name : "Tip.Oper.",
								field : "tipoOperacion",
								width : "140px"
							}, {
								name : "Orig.Fondos",
								field : "origenFondos",
								width : "140px"
							}, {
								name : "Monto",
								field : "monto",
								width : "80px"
							}, {
								name : "Observacion",
								field : "observacion",
								width : "160px"
							} ] ];

							if (dijit.byId("dgrKPJOInLista") == null) {
								oGrid = new DataGrid({
									id : "dgrKPJOInLista",
									store : jsonDataSourceOIn,
									structure : layout,
									rowSelector : "25px",
									rowCount : 20,
									style : 'width: 720px; height: 80px;',
									selectionMode : "single",
									onMouseOver : function() {
										fKPJHelpIn(this.id);
									}
								}, "_divKPJOInLista");

								oGrid.startup();
							} else {
								dijit.byId("dgrKPJOInLista").setStructure(
										layout);
								dijit.byId("dgrKPJOInLista").setStore(
										jsonDataSourceOIn);
							}

							// Mensaje de exito
							fWaitMsgBoxUpd(0, "Datos KYC cargados.", "O");
							fWaitMsgBoxClose();
							dijit.byId("dlgWait").onCancel();

							// Cerrar Dialog
							dijit.byId('dlgKPJFinder').onCancel();

							fMnuDeselect();
						});
			});
}

function fKPJDataLoadVerify(vJSONA, vJSONO, vRO) {
	var vRet = "O";
	fKPJReadOnly(vRO);

	if (!vRO) {
		// Si NO es ReadOnly
		if (document.getElementById("lblKPJEstado").parTipoAcc == "tipoAcc=O") {
			// Si entra para ver el Original
			fKPJReadOnly(true);
			dijit.byId("btnKPJImprimir").set("disabled", false);
			dijit.byId("btnKPJOriginal").set("label", "Ver KYC Pendiente...");
			document.getElementById("divKPJOriginal").style.display = "block";
			document.getElementById("divKPJOriginal").mark = "V";
			vRet = "E";
		} else {
			// Si entra desde Formularios
			if (vJSONO.estadoKYC.codigo == "P"
					|| vJSONA.estadoKYC.codigo == "P") {
				fKPJReadOnly(true);
				fWaitMsgBoxUpd(
						0,
						"El KYC encontrado no corresponde a una persona jur&iacute;dica.",
						"W");
				fWaitMsgBoxClose();
				vRet = "N";
			} else if (vJSONO.estadoKYC.codigo == "X"
					&& vJSONA.estadoKYC.codigo == "X") {
				fKPJReadOnly(true);
				fWaitMsgBoxUpd(
						0,
						"No se encontr&oacute; informaci&oacute;n para los datos ingresados.<br/>"
								+ "Esto se puede deber a que:<br/>"
								+ "<ul>"
								+ "<li>Se necesita una b&uacute;squeda m&aacute;s precisa<br/>"
								+ "ingresando raz&oacute;n social.</li>"
								+ "<li>No existe un cliente con los datos ingresados.<br/>"
								+ "Es posible que la p&oacute;liza del cliente no se haya<br/>"
								+ "procesado a&uacute;n</li>" + "</ul>", "W");
				fWaitMsgBoxClose();
				vRet = "N";
			} else if (vJSONO.estadoKYC.codigo == "X"
					&& vJSONA.estadoKYC.codigo == "N") {
				dijit.byId("tpnKPJHelp").set("style", "display:block;");
				dijit.byId("btnKPJImprimir").set("disabled", true);
				dijit.byId("btnKPJDiff").set("disabled", true);
				vRet = "S";
			} else if ((vJSONO.estadoKYC.codigo == "O" || vJSONO.estadoKYC.codigo == "V")
					&& (vJSONA.estadoKYC.codigo == "X" || vJSONA.estadoKYC.codigo == "N")) {
				dijit.byId("tpnKPJHelp").set("style", "display:block;");
				vRet = "U";
			} else if (vJSONO.estadoKYC.codigo == "X"
					&& (vJSONA.estadoKYC.codigo == "A" || vJSONA.estadoKYC.codigo == "I")) {
				fKPJReadOnly(true);
				vRet = "R";
			} else if ((vJSONO.estadoKYC.codigo == "O" || vJSONO.estadoKYC.codigo == "V")
					&& (vJSONA.estadoKYC.codigo == "A" || vJSONA.estadoKYC.codigo == "I")) {
				fKPJReadOnly(true);
				dijit.byId("btnKPJDiff").set("disabled", false);
				document.getElementById("divKPJOriginal").style.display = "block";
				document.getElementById("divKPJOriginal").mark = "O";
				vRet = "R";
			}
		}
	} else {
		// Si es ReadOnly
		if (document.getElementById("lblKPJEstado").parTipoAcc == "tipoAcc=A") {
			// Si entra para Aprobar
			if (vJSONO.estadoKYC.codigo == "X"
					&& (vJSONA.estadoKYC.codigo == "A" || vJSONA.estadoKYC.codigo == "I")) {
				vRet = "O";
			} else if ((vJSONO.estadoKYC.codigo == "O" || vJSONO.estadoKYC.codigo == "V")
					&& (vJSONA.estadoKYC.codigo == "A" || vJSONA.estadoKYC.codigo == "I")) {
				dijit.byId("btnKPJDiff").set("disabled", false);
				vRet = "O";
			}
			dijit.byId("btnKPJOriginal").set("label",
					"Ir a aprobaci&oacute;n...");
			document.getElementById("divKPJOriginal").style.display = "block";
			document.getElementById("divKPJOriginal").mark = "A";
		} else {
			// Si entra para Consultar
			if (vJSONO.estadoKYC.codigo == "P"
					|| vJSONA.estadoKYC.codigo == "P") {
				fWaitMsgBoxUpd(
						0,
						"El KYC encontrado no corresponde a una persona jur&iacute;dica.",
						"W");
				fWaitMsgBoxClose();
				vRet = "N";
			} else if (vJSONO.estadoKYC.codigo == "X"
					&& (vJSONA.estadoKYC.codigo == "X"
							|| vJSONA.estadoKYC.codigo == "N"
							|| vJSONA.estadoKYC.codigo == "A" || vJSONA.estadoKYC.codigo == "I")) {
				fWaitMsgBoxUpd(0,
						"No se encontr&oacute; un KYC con el CUIT ingresado.",
						"W");
				fWaitMsgBoxClose();
				vRet = "N";
			} else if ((vJSONO.estadoKYC.codigo == "O" || vJSONO.estadoKYC.codigo == "V")
					&& (vJSONA.estadoKYC.codigo == "X"
							|| vJSONA.estadoKYC.codigo == "N"
							|| vJSONA.estadoKYC.codigo == "A" || vJSONA.estadoKYC.codigo == "I")) {
				dijit.byId("btnKPJImprimir").set("disabled", false);
				vRet = "V";
			}
		}
	}

	return vRet;
}

function fKPJDataLoadGral(vJSONA, vJSONO, vRO) {
	// Generales
	document.getElementById("lblKPJEstado").innerHTML = vJSONA.estadoKYC.descripcion;
	document.getElementById("lblKPJEstado").origValue = vJSONA.estadoKYC.codigo;
	document.getElementById("lblKPJEstado").esReadOnly = vRO;
	// Datos de AIS para grabacion
	document.getElementById("lblKPJEstado").perfilObligenAIS = vJSONA.perfilObligenAIS;
	document.getElementById("lblKPJEstado").tipoOperacion = vJSONA.tipoOperacion;
	document.getElementById("lblKPJEstado").vigenciaDesde = vJSONA.vigenciaDesde;
	document.getElementById("lblKPJEstado").vigenciaHasta = vJSONA.vigenciaHasta;
	// Otros Datos
	dijit.byId("txtKPJOpePSoft").set("value", vJSONA.operador.peopleSoft);
	dijit.byId("txtKPJOpeNombre").set("value",
			vJSONA.operador.lName + ", " + vJSONA.operador.fName);
	dijit.byId("txtKPJOpeFecha").set("value", fDgrColFec(vJSONA.opeFechaUpd));
	if (vJSONA.supervisor.peopleSoft != "") {
		dijit.byId("txtKPJSupPSoft").set("value", vJSONA.supervisor.peopleSoft);
		dijit.byId("txtKPJSupNombre").set("value",
				vJSONA.supervisor.lName + ", " + vJSONA.supervisor.fName);
		dijit.byId("txtKPJSupFecha").set("value",
				fDgrColFec(vJSONA.supFechaUpd));
		dijit.byId("txtKPJSupComentario").set("value",
				vJSONA.supComentario);
	}
	if (vJSONA.compliance.peopleSoft != "") {
		dijit.byId("txtKPJComPSoft").set("value", vJSONA.compliance.peopleSoft);
		dijit.byId("txtKPJComNombre").set("value",
				vJSONA.compliance.lName + ", " + vJSONA.compliance.fName);
		dijit.byId("txtKPJComFecha").set("value",
				fDgrColFec(vJSONA.comFechaUpd));
		dijit.byId("txtKPJComComentario").set("value",
				vJSONA.comComentario);
	}
}

function fKPJDataLoadTpn1(vJSONA, vJSONO, vRO) {
	dijit.byId("txtKPJCUIT").set("value", vJSONA.numeroCUIT);
	dijit.byId("txtKPJRazonSocial").set("value", vJSONA.razonSocial);
	dijit.byId("txtKPJFechaConst").set("value",
			fFormatDTB(vJSONA.fechaConstitucion));
	dijit.byId("txtKPJDirCalle").set("value", vJSONA.dirCalle, false);
	dijit.byId("txtKPJDirNumero").set("value", vJSONA.dirNumero, false);
	dijit.byId("txtKPJDirPiso").set("value", vJSONA.dirPiso);
	dijit.byId("txtKPJDirDepto").set("value", vJSONA.dirDepto);
	dijit.byId("cboKPJDirProv").set("value", vJSONA.dirProvincia.id, false);
	fCPProvSel('KPJ');
	dijit.byId("txtKPJDirLocal").set("value", vJSONA.dirLocalidad, false);
	// Si es ReadOnly la deshabilito
	if (vRO) {
		dijit.byId("txtKPJDirLocal").set("disabled", true);
	}
	dijit.byId("txtKPJDirCP").set("value", vJSONA.dirCodigoPostal);
	dijit.byId("txtKPJTelefono").set("value", vJSONA.telefono);
	dijit.byId("txtKPJEmail").set("value", vJSONA.email);
	dijit.byId("cboKPJTitMPg").set("value", vJSONA.esTitMPago ? "S" : "N");
	if (!vJSONA.esTitMPago) {
		dijit.byId("cboKPJTitMPgTipDoc").set("value",
				vJSONA.titMPagoList[0].tipoDoc.id);
		dijit.byId("txtKPJTitMPgNroDoc").set("value",
				vJSONA.titMPagoList[0].numeroDoc);
		dijit.byId("txtKPJTitMPgApellido").set("value",
				vJSONA.titMPagoList[0].apellido);
		dijit.byId("txtKPJTitMPgNombre").set("value",
				vJSONA.titMPagoList[0].nombre);
		dijit.byId("txtKPJTitMPgMedioPago").set("value",
				vJSONA.titMPagoList[0].medioPago);
	}
	// Valores Originales
	dijit.byId("txtKPJRazonSocial").set("origValue", vJSONO.razonSocial);
	dijit.byId("txtKPJFechaConst").set("origValue",
			fFormatDTB(vJSONO.fechaConstitucion));
	dijit.byId("txtKPJDirCalle").set("origValue", vJSONO.dirCalle);
	dijit.byId("txtKPJDirNumero").set("origValue", vJSONO.dirNumero);
	dijit.byId("txtKPJDirPiso").set("origValue", vJSONO.dirPiso);
	dijit.byId("txtKPJDirDepto").set("origValue", vJSONO.dirDepto);
	dijit.byId("cboKPJDirProv").set("origValue", vJSONO.dirProvincia.id);
	dijit.byId("cboKPJDirProv").set("origDisplayedValue",
			vJSONO.dirProvincia.name);
	dijit.byId("txtKPJDirLocal").set("origValue", vJSONO.dirLocalidad);
	dijit.byId("txtKPJDirCP").set("origValue", vJSONO.dirCodigoPostal);
	dijit.byId("txtKPJTelefono").set("origValue", vJSONO.telefono);
	dijit.byId("txtKPJEmail").set("origValue", vJSONO.email);
	dijit.byId("cboKPJTitMPg").set("origValue", vJSONO.esTitMPago ? "S" : "N");
	dijit.byId("cboKPJTitMPg").set("origDisplayedValue",
			fDgrColBln(vJSONO.esTitMPago));
	if (!vJSONO.esTitMPago) {
		dijit.byId("cboKPJTitMPgTipDoc").set("origValue",
				vJSONO.titMPagoList[0].tipoDoc.id);
		dijit.byId("cboKPJTitMPgTipDoc").set("origDisplayedValue",
				vJSONO.titMPagoList[0].tipoDoc.name);
		dijit.byId("txtKPJTitMPgNroDoc").set("origValue",
				vJSONO.titMPagoList[0].numeroDoc);
		dijit.byId("txtKPJTitMPgApellido").set("origValue",
				vJSONO.titMPagoList[0].apellido);
		dijit.byId("txtKPJTitMPgNombre").set("origValue",
				vJSONO.titMPagoList[0].nombre);
		dijit.byId("txtKPJTitMPgMedioPago").set("origValue",
				vJSONO.titMPagoList[0].medioPago);
	} else {
		dijit.byId("cboKPJTitMPgTipDoc").set("origValue", 0);
		dijit.byId("cboKPJTitMPgTipDoc").set("origDisplayedValue", "");
		dijit.byId("txtKPJTitMPgNroDoc").set("origValue", 0);
		dijit.byId("txtKPJTitMPgApellido").set("origValue", "");
		dijit.byId("txtKPJTitMPgNombre").set("origValue", "");
		dijit.byId("txtKPJTitMPgMedioPago").set("origValue", "");
	}
}

function fKPJDataLoadTpn2(vJSONA, vJSONO, vRO) {
	fComboAdd("cboKPJActividad", vJSONA.actividad);
	dijit.byId("cboKPJActividad").set("value", vJSONA.actividad.id);
	dijit.byId("txtKPJActivDes").set("value", vJSONA.actividadDes);
	dijit.byId("txtKPJPropositoDes").set("value", vJSONA.propositoDes);
	dijit.byId("cboKPJCaracter").set("value", vJSONA.caracter.id);
	dijit.byId("txtKPJCaracterDes").set("value", vJSONA.caracterDes);
	dijit.byId("cboKPJBco").set("value", vJSONA.esClienteBco ? "S" : "N");
	dijit.byId("cboKPJCotBolsa").set("value", vJSONA.cotizaBolsa ? "S" : "N");
	dijit.byId("cboKPJSubsCia").set("value",
			vJSONA.subsCiaCotizaBolsa ? "S" : "N");
	dijit.byId("cboKPJCliRegOrg").set("value",
			vJSONA.cliRegOrganismo ? "S" : "N");
	dijit.byId("cboKPJSCC").set("value", vJSONA.esSCC ? "S" : "N");
	dijit.byId("txtKPJSCCMot").set("value", vJSONA.motivoSCC);
	dijit.byId("cboKPJRepSCC").set("value", vJSONA.tieneRepSCC ? "S" : "N");
	dijit.byId("txtKPJAccionistas").set("value", vJSONA.accionistas);
	dijit.byId("cboKPJCia").set("value",
			vJSONA.companiaList.length > 0 ? "S" : "N");
	dijit.byId("txtKPJBalFecEstCont").set("value",
			fFormatDTB(vJSONA.balFechaEstContable), false);
	dijit.byId("txtKPJBalAuditor").set("value", vJSONA.balAuditor);
	dijit.byId("txtKPJBalFecha").set("value", fFormatDTB(vJSONA.balFecha));
	dijit.byId("txtKPJBalActivo").set("value", vJSONA.balActivo, false);
	dijit.byId("txtKPJBalPasivo").set("value", vJSONA.balPasivo, false);
	dijit.byId("txtKPJBalPN").set("value", vJSONA.balPatNeto);
	dijit.byId("txtKPJBalVentas").set("value", vJSONA.balVentas, false);
	dijit.byId("txtKPJBalResFinal").set("value", vJSONA.balResFinal);
	dijit.byId("txtKPJDocResDet").set("value", vJSONA.docResDetalle);
	dijit.byId("txtKPJObserv").set("value", vJSONA.observaciones);
	dijit.byId("cboKPJRel").set("value", vJSONA.tieneRelHSBC ? "S" : "N");
	dijit.byId("txtKPJRelDet").set("value", vJSONA.relDetalle);
	dijit.byId("txtKPJIniAnn").set("value", vJSONA.inicioAnn);
	// Valores Originales
	dijit.byId("cboKPJActividad").set("origValue", vJSONO.actividad.id);
	dijit.byId("cboKPJActividad").set("origDisplayedValue",
			vJSONO.actividad.name);
	dijit.byId("txtKPJActivDes").set("origValue", vJSONO.actividadDes);
	dijit.byId("txtKPJPropositoDes").set("origValue", vJSONO.propositoDes);
	dijit.byId("cboKPJCaracter").set("origValue", vJSONO.caracter.id);
	dijit.byId("cboKPJCaracter")
			.set("origDisplayedValue", vJSONO.caracter.name);
	dijit.byId("txtKPJCaracterDes").set("origValue", vJSONO.caracterDes);
	dijit.byId("cboKPJBco").set("origValue", vJSONO.esClienteBco ? "S" : "N");
	dijit.byId("cboKPJBco").set("origDisplayedValue",
			fDgrColBln(vJSONO.esClienteBco));
	dijit.byId("cboKPJCotBolsa").set("origValue",
			vJSONO.cotizaBolsa ? "S" : "N");
	dijit.byId("cboKPJCotBolsa").set("origDisplayedValue",
			fDgrColBln(vJSONO.cotizaBolsa));
	dijit.byId("cboKPJSubsCia").set("origValue",
			vJSONO.subsCiaCotizaBolsa ? "S" : "N");
	dijit.byId("cboKPJSubsCia").set("origDisplayedValue",
			fDgrColBln(vJSONO.subsCiaCotizaBolsa));
	dijit.byId("cboKPJCliRegOrg").set("origValue",
			vJSONO.cliRegOrganismo ? "S" : "N");
	dijit.byId("cboKPJCliRegOrg").set("origDisplayedValue",
			fDgrColBln(vJSONO.cliRegOrganismo));
	dijit.byId("cboKPJSCC").set("origValue", vJSONO.esSCC ? "S" : "N");
	dijit.byId("cboKPJSCC").set("origDisplayedValue", fDgrColBln(vJSONO.esSCC));
	dijit.byId("txtKPJSCCMot").set("origValue", vJSONO.motivoSCC);
	dijit.byId("cboKPJRepSCC").set("origValue", vJSONO.tieneRepSCC ? "S" : "N");
	dijit.byId("cboKPJRepSCC").set("origDisplayedValue",
			fDgrColBln(vJSONO.tieneRepSCC));
	dijit.byId("txtKPJAccionistas").set("origValue", vJSONO.accionistas);
	dijit.byId("cboKPJCia").set("origValue",
			vJSONO.companiaList.length > 0 ? "S" : "N");
	dijit.byId("cboKPJCia").set("origDisplayedValue",
			fDgrColBln(vJSONO.companiaList.length > 0));
	dijit.byId("txtKPJBalFecEstCont").set("origValue",
			fFormatDTB(vJSONO.balFechaEstContable));
	dijit.byId("txtKPJBalAuditor").set("origValue", vJSONO.balAuditor);
	dijit.byId("txtKPJBalFecha").set("origValue", fFormatDTB(vJSONO.balFecha));
	dijit.byId("txtKPJBalActivo").set("origValue", vJSONO.balActivo);
	dijit.byId("txtKPJBalPasivo").set("origValue", vJSONO.balPasivo);
	dijit.byId("txtKPJBalPN").set("origValue", vJSONO.balPatNeto);
	dijit.byId("txtKPJBalVentas").set("origValue", vJSONO.balVentas);
	dijit.byId("txtKPJBalResFinal").set("origValue", vJSONO.balResFinal);
	dijit.byId("txtKPJDocResDet").set("origValue", vJSONO.docResDetalle);
	dijit.byId("txtKPJObserv").set("origValue", vJSONO.observaciones);
	dijit.byId("cboKPJRel").set("origValue", vJSONO.tieneRelHSBC ? "S" : "N");
	dijit.byId("cboKPJRel").set("origDisplayedValue",
			fDgrColBln(vJSONO.tieneRelHSBC));
	dijit.byId("txtKPJRelDet").set("origValue", vJSONO.relDetalle);
	dijit.byId("txtKPJIniAnn").set("origValue", vJSONO.inicioAnn);
	// Si no es ReadOnly pongo los valores del AIS
	if (!vRO) {
		dijit.byId("cboKPJSCC").set("value", vJSONA.esSCCenAIS ? "S" : "N");
		if (vJSONA.esSCCenAIS) {
			dijit.byId("cboKPJSCC").set("disabled", true);
		}
	}
}

function fKPJDataLoadTpn3(vJSONA, vJSONO, vRO) {
	dijit.byId("txtKPJValOpe").set("value", vJSONA.valorOperar);
	dijit.byId("txtKPJAcuPri").set("value", vJSONA.primaAnual);
	dijit.byId("txtKPJValOpeMot").set("value", vJSONA.valorOperarMot);
	dijit.byId("txtKPJComent").set("value", vJSONA.perfilComentarios);
	dijit.byId("txtKPJUltFec").set("value", fFormatDTB(vJSONA.ultFecha));
	// Valores Originales
	dijit.byId("txtKPJValOpe").set("origValue", vJSONO.valorOperar);
	dijit.byId("txtKPJAcuPri").set("origValue", vJSONO.primaAnual);
	dijit.byId("txtKPJValOpeMot").set("origValue", vJSONO.valorOperarMot);
	dijit.byId("txtKPJComent").set("origValue", vJSONO.perfilComentarios);
	// Si no es ReadOnly pongo los valores del AIS
	if (!vRO) {
		dijit.byId("txtKPJAcuPri").set("value", vJSONA.primaAnualenAIS);
	}
}

function fKPJDataLoadTpn4(vJSONA, vJSONO) {
	// Valores Originales
	dijit.byId("cboKPJOIn").set("value",
			vJSONA.opeInusualList.length > 0 ? "S" : "N");
	// Valores Originales
	dijit.byId("cboKPJOIn").set("origValue",
			vJSONO.opeInusualList.length > 0 ? "S" : "N");
	dijit.byId("cboKPJOIn").set("origDisplayedValue",
			fDgrColBln(vJSONO.opeInusualList.length > 0));
}

function fKPJRepNew() {
	var oGrid = dijit.byId("dgrKPJRepLista");
	oGrid.selection.setSelected(oGrid.selection.selectedIndex, false);

	// Verificar que no se pase del maximo permitido
	if (oGrid.store._arrayOfTopLevelItems.length < 10) {
		dijit.byId("tpnKYCRepEdit").set("style", "width: 650px;height: 140px;");
		dijit.byId("tpnKYCRepEdit").set("open", true);
		fKPJReadOnlyRep(false);
	} else {
		fMsgBox("No se pueden cargar m&aacute;s representantes.",
				"Advertencia", "W");
	}
}

function fKPJRepUpd() {
	var oGrid = dijit.byId("dgrKPJRepLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un representante.", "Advertencia", "W");
		return;
	} else {
		dojo.forEach(oItems,
				function(selectedItem) {
					if (selectedItem !== null) {
						dijit.byId("tpnKYCRepEdit").set("style",
								"width: 650px;height: 140px;");
						dijit.byId("tpnKYCRepEdit").set("open", true);
						fKPJReadOnlyRep(false);
						dijit.byId("cboKPJRepTipDoc").set("disabled", true);
						dijit.byId("txtKPJRepNroDoc").set("disabled", true);
						dijit.byId("cboKPJRepTipDoc").set("value",
								selectedItem.tipoDoc[0].id[0]);
						dijit.byId("txtKPJRepNroDoc").set("value",
								selectedItem.numeroDoc);
						dijit.byId("txtKPJRepApellido").set("value",
								selectedItem.apellido);
						dijit.byId("txtKPJRepNombre").set("value",
								selectedItem.nombre);
						dijit.byId("txtKPJFechaNac").set("value",
								fFormatDTB(selectedItem.fechaConstitNacim));
					}
				});
	}
}

function fKPJRepDel() {
	// Abrir panel 2
	dijit.byId("tpnKYCPersJurP2").set("open", true);

	var oGrid = dijit.byId("dgrKPJRepLista");
	var oItems = oGrid.selection.getSelected();
	var jsonDataSource = oGrid.store;
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un representante.", "Advertencia", "W");
		return;
	} else {
		dojo.forEach(oItems, function(selectedItem) {
			if (selectedItem !== null) {
				// Delete the item from the data store:
				jsonDataSource.deleteItem(selectedItem);
			}
		});
		oGrid.setStore(jsonDataSource);
		oGrid.update();
	}
}

function fKPJRepApl() {
	// Validar
	if (dijit.byId("cboKPJRepTipDoc").get("value") == "") {
		fMsgBox("Debe seleccionar un tipo de documento.", "Advertencia", "W");
		return;
	}
	if (isNaN(dijit.byId("txtKPJRepNroDoc").get("value"))
			|| dijit.byId("txtKPJRepNroDoc").get("value") == 0) {
		fMsgBox("Debe ingresar un n&uacute;mero de documento.", "Advertencia",
				"W");
		return;
	}
	if (String(dijit.byId("txtKPJRepApellido").get("value")).length == 0
			|| !fValType("A", String(dijit.byId("txtKPJRepApellido").get(
					"value")))) {
		fMsgBox("Debe ingresar un apellido v&aacute;lido.", "Advertencia", "W");
		return;
	}
	if (String(dijit.byId("txtKPJRepNombre").get("value")).length == 0
			|| !fValType("A",
					String(dijit.byId("txtKPJRepNombre").get("value")))) {
		fMsgBox("Debe ingresar un nombre v&aacute;lido.", "Advertencia", "W");
		return;
	}
	if (dijit.byId("txtKPJFechaNac").get("value") == null) {
		fMsgBox("Debe ingresar una fecha v&aacute;lida.", "Advertencia", "W");
		return;
	}

	// Abrir panel 2
	dijit.byId("tpnKYCPersJurP2").set("open", true);

	var oGrid = dijit.byId("dgrKPJRepLista");
	var jsonDataSource = oGrid.store;
	var vEnc = false;

	// Buscar si existe
	jsonDataSource.fetch({
		query : {
			numeroDoc : dijit.byId("txtKPJRepNroDoc").get("value")
		},
		onItem : function(item) {
			jsonDataSource.setValue(item, 'apellido', dijit.byId(
					"txtKPJRepApellido").get("value"));
			jsonDataSource.setValue(item, 'nombre', dijit.byId(
					"txtKPJRepNombre").get("value"));
			jsonDataSource.setValue(item, 'fechaConstitNacim', dojo.date.locale
					.format( dijit.byId("txtKPJFechaNac").get("value"), {
						datePattern : "yyyyMMdd",
						selector : "date"
					}));
			vEnc = true;
		}
	});

	if (!vEnc) {
		var vNewItem = {
			tipoDoc : {
				id : dijit.byId("cboKPJRepTipDoc").get("value"),
				name : dijit.byId("cboKPJRepTipDoc").get("displayedValue")
			},
			numeroDoc : dijit.byId("txtKPJRepNroDoc").get("value"),
			apellido : dijit.byId("txtKPJRepApellido").get("value"),
			nombre : dijit.byId("txtKPJRepNombre").get("value"),
			fechaConstitNacim : dojo.date.locale.format(dijit.byId("txtKPJFechaNac")
					.get("value"), {
				datePattern : "yyyyMMdd", 
				selector : "date"
				}),
			esSCC : false,
			cargo : "",
			esPEP : false
		};
		jsonDataSource.newItem(vNewItem);
	}

	oGrid.setStore(jsonDataSource);
	oGrid.update();

	// Limpiar
	fKPJReadOnlyRep(true);
	fKPJCleanRep();
}

function fKPJRepCan() {
	var oGrid = dijit.byId("dgrKPJRepLista");
	oGrid.selection.setSelected(oGrid.selection.selectedIndex, false);
	// Limpiar
	fKPJReadOnlyRep(true);
	fKPJCleanRep();
}

function fKPJRepSCCUpd() {
	var oGrid = dijit.byId("dgrKPJRepSCCLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un representante.", "Advertencia", "W");
		return;
	} else {
		dojo.forEach(oItems, function(selectedItem) {
			if (selectedItem !== null) {
				dijit.byId("tpnKYCRepSCCEdit").set("style",
						"width: 720px;height: 100px;");
				dijit.byId("tpnKYCRepSCCEdit").set("open", true);
				fKPJReadOnlyRepSCC(false);
				dijit.byId("cboKPJRepSCCTipDoc").set("value",
						selectedItem.tipoDoc[0].id[0]);
				dijit.byId("txtKPJRepSCCNroDoc").set("value",
						selectedItem.numeroDoc);
				dijit.byId("cboKPJRepSCCSCC").set("value",
						selectedItem.esSCC == "true" ? "S" : "N");
				dijit.byId("txtKPJRepSCCCargo")
						.set("value", selectedItem.cargo);
				dijit.byId("cboKPJRepSCCPEP").set("value",
						selectedItem.esPEP == "true" ? "S" : "N");
			}
		});
	}
}

function fKPJRepSCCApl() {
	// Validar
	if (dijit.byId("cboKPJRepSCCSCC").get("value") == "") {
		fMsgBox("Debe seleccionar si el representante es SCC.", "Advertencia",
				"W");
		return;
	}
	if (dijit.byId("cboKPJRepSCCSCC").get("value") == "S") {
		if (String(dijit.byId("txtKPJRepSCCCargo").get("value")).length == 0) {
			fMsgBox("Debe ingresar un cargo.", "Advertencia", "W");
			return;
		} else if (!fValType("R", String(dijit.byId("txtKPJRepSCCCargo").get(
				"value")))) {
			fMsgBox("El cargo tienen caracteres inv&aacute;lidos.",
					"Advertencia", "W");
			return;
		}
	}
	if (dijit.byId("cboKPJRepSCCPEP").get("value") == "") {
		fMsgBox("Debe seleccionar si el representante es PEP.", "Advertencia",
				"W");
		return;
	}
	if (dijit.byId("cboKPJRepSCCSCC").get("value") == "N"
			&& dijit.byId("cboKPJRepSCCPEP").get("value") == "S") {
		fMsgBox("El representante no puede ser PEP si no es SCC.",
				"Advertencia", "W");
		return;
	}

	// Abrir panel 1
	dijit.byId("tpnKYCPersJurP1").set("open", true);

	var oGrid = dijit.byId("dgrKPJRepLista");
	var jsonDataSource = oGrid.store;

	// Buscar
	jsonDataSource.fetch({
		query : {
			numeroDoc : dijit.byId("txtKPJRepSCCNroDoc").get("value")
		},
		onItem : function(item) {
			jsonDataSource
					.setValue(item, 'esSCC', dijit.byId("cboKPJRepSCCSCC").get(
							"value") == "S" ? true : false);
			jsonDataSource.setValue(item, 'cargo', dijit.byId(
					"txtKPJRepSCCCargo").get("value"));
			jsonDataSource
					.setValue(item, 'esPEP', dijit.byId("cboKPJRepSCCPEP").get(
							"value") == "S" ? true : false);
		}
	});

	oGrid.setStore(jsonDataSource);
	oGrid.update();

	// Limpiar
	fKPJReadOnlyRepSCC(true);
	fKPJCleanRepSCC();
}

function fKPJRepSCCCan() {
	var oGrid = dijit.byId("dgrKPJRepSCCLista");
	oGrid.selection.setSelected(oGrid.selection.selectedIndex, false);
	// Limpiar
	fKPJReadOnlyRepSCC(true);
	fKPJCleanRepSCC();
}

function fKPJCiaNew() {
	var oGrid = dijit.byId("dgrKPJCiaLista");
	oGrid.selection.setSelected(oGrid.selection.selectedIndex, false);

	// Verificar que no se pase del maximo permitido
	if (oGrid.store._arrayOfTopLevelItems.length < 10) {
		dijit.byId("tpnKYCCiaEdit").set("style", "width: 560px;height: 140px;");
		dijit.byId("tpnKYCCiaEdit").set("open", true);
		document.getElementById("hdgrKPJCiaLista").canOrig = parseInt(document
				.getElementById("hdgrKPJCiaLista").canOrig) + 1;
		dijit.byId("txtKPJCiaRazSoc").set("secuencia",
				document.getElementById("hdgrKPJCiaLista").canOrig);
		fKPJReadOnlyCia(false);
	} else {
		fMsgBox("No se pueden cargar m&aacute;s compa&ntilde;&iacute;as.",
				"Advertencia", "W");
	}
}

function fKPJCiaUpd() {
	var oGrid = dijit.byId("dgrKPJCiaLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una compa&ntilde;&iacute;a.", "Advertencia",
				"W");
		return;
	} else {
		dojo.forEach(oItems, function(selectedItem) {
			if (selectedItem !== null) {
				dijit.byId("tpnKYCCiaEdit").set("style",
						"width: 560px;height: 140px;");
				dijit.byId("tpnKYCCiaEdit").set("open", true);
				fKPJReadOnlyCia(false);
				dijit.byId("txtKPJCiaRazSoc").set("secuencia",
						selectedItem.secuencia);
				dijit.byId("txtKPJCiaRazSoc").set("value",
						selectedItem.razonSocial);
				dijit.byId("cboKPJCiaSCC").set("value",
						selectedItem.esSCC == "true" ? "S" : "N");
				dijit.byId("txtKPJFechaConstit").set("value",
						fFormatDTB(selectedItem.fechaConstitucion));
			}
		});
	}
}

function fKPJCiaDel() {
	// Abrir panel 2
	dijit.byId("tpnKYCPersJurP2").set("open", true);

	var oGrid = dijit.byId("dgrKPJCiaLista");
	var oItems = oGrid.selection.getSelected();
	var jsonDataSource = oGrid.store;
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una compa&ntilde;&iacute;a.", "Advertencia",
				"W");
		return;
	} else {
		dojo.forEach(oItems, function(selectedItem) {
			if (selectedItem !== null) {
				// Delete the item from the data store:
				jsonDataSource.deleteItem(selectedItem);
			}
		});
		oGrid.setStore(jsonDataSource);
		oGrid.update();
	}
}

function fKPJCiaApl() {
	// Validar
	if (String(dijit.byId("txtKPJCiaRazSoc").get("value")).length == 0
			|| !fValType("R",
					String(dijit.byId("txtKPJCiaRazSoc").get("value")))) {
		fMsgBox("Debe ingresar una raz&oacute;n social v&aacute;lida.",
				"Advertencia", "W");
		return;
	}
	if (dijit.byId("cboKPJCiaSCC").get("value") == "") {
		fMsgBox("Debe seleccionar si la compa&ntilde;&iacute;a es SCC.",
				"Advertencia", "W");
		return;
	}
	if (dijit.byId("txtKPJFechaConstit").get("value") == null) {
		fMsgBox("Debe ingresar una fecha v&aacute;lida.", "Advertencia", "W");
		return;
	}

	// Abrir panel 2
	dijit.byId("tpnKYCPersJurP2").set("open", true);

	var oGrid = dijit.byId("dgrKPJCiaLista");
	var jsonDataSource = oGrid.store;
	var vEnc = false;

	// Buscar si existe
	jsonDataSource
			.fetch({
				query : {
					secuencia : parseInt(dijit.byId("txtKPJCiaRazSoc").get(
							"secuencia"))
				},
				onItem : function(item) {
					jsonDataSource.setValue(item, 'razonSocial', dijit.byId(
							"txtKPJCiaRazSoc").get("value"));
					jsonDataSource.setValue(item, 'esSCC', dijit.byId(
							"cboKPJCiaSCC").get("value") == "S" ? true : false);
					jsonDataSource.setValue(item, 'fechaConstitucion', dojo.date.locale
							.format( dijit.byId("txtKPJFechaConstit").get("value"), {
								datePattern : "yyyyMMdd",
								selector : "date"
							}));
					vEnc = true;
				}
			});

	if (!vEnc) {
		var vNewItem = {
			secuencia : parseInt(dijit.byId("txtKPJCiaRazSoc").get("secuencia")),
			razonSocial : dijit.byId("txtKPJCiaRazSoc").get("value"),
			esSCC : dijit.byId("cboKPJCiaSCC").get("value") == "S" ? true
					: false,
					fechaConstitucion : dojo.date.locale.format(dijit.byId("txtKPJFechaConstit")
							.get("value"), {
						datePattern : "yyyyMMdd", 
						selector : "date"
						})
		};
		jsonDataSource.newItem(vNewItem);
	}

	oGrid.setStore(jsonDataSource);
	oGrid.update();

	// Limpiar
	fKPJReadOnlyCia(true);
	fKPJCleanCia();
}

function fKPJCiaCan() {
	var oGrid = dijit.byId("dgrKPJCiaLista");
	oGrid.selection.setSelected(oGrid.selection.selectedIndex, false);
	// Limpiar
	fKPJReadOnlyCia(true);
	fKPJCleanCia();
}

function fKPJOInNew() {
	var oGrid = dijit.byId("dgrKPJOInLista");
	oGrid.selection.setSelected(oGrid.selection.selectedIndex, false);

	// Verificar que no se pase del maximo permitido
	if (oGrid.store._arrayOfTopLevelItems.length < 10) {
		dijit.byId("tpnKYCOInEdit").set("style", "width: 720px;height: 140px;");
		dijit.byId("tpnKYCOInEdit").set("open", true);
		document.getElementById("hdgrKPJOInLista").canOrig = parseInt(document
				.getElementById("hdgrKPJOInLista").canOrig) + 1;
		dijit.byId("txtKPJOInTipOpe").set("secuencia",
				document.getElementById("hdgrKPJOInLista").canOrig);
		fKPJReadOnlyOIn(false);
	} else {
		fMsgBox("No se pueden cargar m&aacute;s operaciones.", "Advertencia",
				"W");
	}
}

function fKPJOInUpd() {
	var oGrid = dijit.byId("dgrKPJOInLista");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	} else {
		dojo.forEach(oItems, function(selectedItem) {
			if (selectedItem !== null) {
				dijit.byId("tpnKYCOInEdit").set("style",
						"width: 720px;height: 140px;");
				dijit.byId("tpnKYCOInEdit").set("open", true);
				fKPJReadOnlyOIn(false);
				dijit.byId("txtKPJOInTipOpe").set("secuencia",
						selectedItem.secuencia);
				dijit.byId("txtKPJOInFecha").set("value",
						fFormatDTB(selectedItem.fecha));
				dijit.byId("txtKPJOInTipOpe").set("value",
						selectedItem.tipoOperacion);
				dijit.byId("txtKPJOInOriFon").set("value",
						selectedItem.origenFondos);
				dijit.byId("txtKPJOInMonto").set("value",
						parseFloat(selectedItem.monto));
				dijit.byId("txtKPJOInObserv").set("value",
						selectedItem.observacion);
			}
		});
	}
}

function fKPJOInDel() {
	var oGrid = dijit.byId("dgrKPJOInLista");
	var oItems = oGrid.selection.getSelected();
	var jsonDataSource = oGrid.store;
	if (!oItems.length) {
		fMsgBox("Debe seleccionar una operaci&oacute;n.", "Advertencia", "W");
		return;
	} else {
		dojo.forEach(oItems, function(selectedItem) {
			if (selectedItem !== null) {
				// Delete the item from the data store:
				jsonDataSource.deleteItem(selectedItem);
			}
		});
		oGrid.setStore(jsonDataSource);
		oGrid.update();
	}
}

function fKPJOInApl() {
	// Validar
	if (dijit.byId("txtKPJOInFecha").get("value") == null) {
		fMsgBox("Debe seleccionar una fecha.", "Advertencia", "W");
		return;
	}
	if (String(dijit.byId("txtKPJOInTipOpe").get("value")).length == 0) {
		fMsgBox("Debe ingresar un tipo de operaci&oacute;n.", "Advertencia",
				"W");
		return;
	} else if (!fValType("R",
			String(dijit.byId("txtKPJOInTipOpe").get("value")))) {
		fMsgBox(
				"El tipo de operaci&oacute;n tienen caracteres inv&aacute;lidos.",
				"Advertencia", "W");
		return;
	}
	if (String(dijit.byId("txtKPJOInOriFon").get("value")).length == 0) {
		fMsgBox("Debe ingresar el origen de los fondos.", "Advertencia", "W");
		return;
	} else if (!fValType("R",
			String(dijit.byId("txtKPJOInOriFon").get("value")))) {
		fMsgBox("El origen de los fondos tienen caracteres inv&aacute;lidos.",
				"Advertencia", "W");
		return;
	}
	if (isNaN(dijit.byId("txtKPJOInMonto").get("value"))
			|| dijit.byId("txtKPJOInMonto").get("value") == 0) {
		fMsgBox("Debe ingresar un monto.", "Advertencia", "W");
		return;
	}
	if (!fValType("R", String(dijit.byId("txtKPJOInObserv").get("value")))) {
		fMsgBox("La observaci&oacute;n tienen caracteres inv&aacute;lidos.",
				"Advertencia", "W");
		return;
	}

	var oGrid = dijit.byId("dgrKPJOInLista");
	var jsonDataSource = oGrid.store;
	var vEnc = false;

	// Buscar si existe
	jsonDataSource
			.fetch({
				query : {
					secuencia : parseInt(dijit.byId("txtKPJOInTipOpe").get(
							"secuencia"))
				},
				onItem : function(item) {
					jsonDataSource.setValue(item, 'fecha', dojo.date.locale
							.format(dijit.byId("txtKPJOInFecha").get("value"),
									{
										datePattern : "yyyyMMdd",
										selector : "date"
									}));
					jsonDataSource.setValue(item, 'tipoOperacion', dijit.byId(
							"txtKPJOInTipOpe").get("value"));
					jsonDataSource.setValue(item, 'origenFondos', dijit.byId(
							"txtKPJOInOriFon").get("value"));
					jsonDataSource.setValue(item, 'monto', dijit.byId(
							"txtKPJOInMonto").get("value"));
					jsonDataSource.setValue(item, 'observacion', dijit.byId(
							"txtKPJOInObserv").get("value"));
					vEnc = true;
				}
			});

	if (!vEnc) {
		var vNewItem = {
			secuencia : parseInt(dijit.byId("txtKPJOInTipOpe").get("secuencia")),
			fecha : dojo.date.locale.format(dijit.byId("txtKPJOInFecha").get(
					"value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			}),
			tipoOperacion : dijit.byId("txtKPJOInTipOpe").get("value"),
			origenFondos : dijit.byId("txtKPJOInOriFon").get("value"),
			monto : dijit.byId("txtKPJOInMonto").get("value"),
			observacion : dijit.byId("txtKPJOInObserv").get("value")
		};
		jsonDataSource.newItem(vNewItem);
	}

	oGrid.setStore(jsonDataSource);
	oGrid.update();

	// Limpiar
	fKPJReadOnlyOIn(true);
	fKPJCleanOIn();
}

function fKPJOInCan() {
	var oGrid = dijit.byId("dgrKPJOInLista");
	oGrid.selection.setSelected(oGrid.selection.selectedIndex, false);
	// Limpiar
	fKPJReadOnlyOIn(true);
	fKPJCleanOIn();
}

function fKPJActividadFilter() {
	// Validar
	if (String(dijit.byId("txtKPJActividad").get("value")).length < 5) {
		fMsgBox("Debe escribir un filtro de al menos 5 caracteres.",
				"Advertencia", "W");
		return;
	}

	fSessionValidate("fSessionVoid");

	// Limpiar el combo
	fComboClean("cboKPJActividad");
	dijit.byId("cboKPJActividad").set("disabled", true);

	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {

				var vURL = fGetURLSvc("ParametersService/getActividadList?filtroAct="
						+ dijit.byId("txtKPJActividad").get("value"));
				var deferred = request.get(vURL, {
					handleAs : "json"
				});

				deferred
						.then(function(response) {
							if (response.error || response.result == null) {
								fMsgBox(
										"Se ha producido un error al consultar las actividades.",
										"Error", "E");
								return;
							} else if (response.result.length == 0) {
								fMsgBox(
										"No se encontraron resultados con el filtro ingresado.",
										"Advertencia", "W");
								return;
							} else if (response.result.length > 50) {
								fMsgBox(
										"Demasiados resultados, debe ingresar un filtro mas adecuado.",
										"Advertencia", "W");
								return;
							}

							fComboLoad(response, "cboKPJActividad", 80);
							if (dijit.byId("cboKPJActividad").getOptions().length > 0)
								dijit.byId("cboKPJActividad").set("disabled",
										false);
						});
			});
}

function fKPJBalResFinal(vNoPerfil) {
	var vPatNeto = 0;
	var vVentas = 0;
	vPatNeto += dijit.byId("txtKPJBalActivo").get("value");
	vPatNeto -= dijit.byId("txtKPJBalPasivo").get("value");
	vVentas = dijit.byId("txtKPJBalVentas").get("value");
	if (isNaN(vPatNeto)) {
		vPatNeto = parseFloat(vPatNeto);
	}
	if (isNaN(vVentas)) {
		vVentas = parseFloat(vVentas);
	}
	// Calculo PN
	dijit.byId("txtKPJBalPN").set("value", vPatNeto);
	// Calculo Perfil
	if (vNoPerfil == "S") {
		return;
	} else {
		dijit.byId("txtKPJValOpe").set("value", vVentas);
	}
}

function fKPJFecEstCont() {
	if (dijit.byId("txtKPJBalFecEstCont").get("value") != null) {
		vFecShow = dojo.date.locale.format(dijit.byId("txtKPJBalFecEstCont")
				.get("value"), {
			datePattern : "dd/MM/yyyy",
			selector : "date"
		});
		vFecCalc = dojo.date.locale.format(dijit.byId("txtKPJBalFecEstCont")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		vFecVenc = fFormatNxF(fDateAdd(vFecCalc, 18));

		fMsgBox(
				"La fecha de finalizaci&oacute;n del estado contable es "
						+ vFecShow
						+ "<br/>"
						+ "siendo su vencimiento, por pol&iacute;tica de Galicia Mas,  18 meses despu&eacute;s ("
						+ vFecVenc
						+ ").<br/><br/>"
						+ "Aseg&uacute;rese de que esta informaci&oacute;n sea correcta.",
				"Advertencia", "W");
	}
}

function fKPJHelpIn(vId) {
	dijit.byId("btnKPJHelp").set("disabled", true);
	document.getElementById("divKPJHelpBtn").style.display = "none";
	document.getElementById("lblKPJHelp").allHTML = "";

	if (vId == "txtKPJComent") {
		document.getElementById("lblKPJHelp").innerHTML = "<b>Comentarios del perfil transaccional</b><br/>"
				+ "Indicar si el an&aacute;lisis del perfil es consistente con los seguros/operaciones contratadas. En caso de existir inconsistencias, reportar a Compliance.";
	} else if (vId == "txtKPJValOpeMot") {
		document.getElementById("lblKPJHelp").innerHTML = "<b>Motivo en caso de modificar el perfil transaccional</b><br/>"
				+ "Importante: El perfil transaccional deber&aacute; expresarse en pesos. La cifras deber&aacute;n incluir los ingresos del cliente correspondientes a 1 a&ntilde;o";
	} else if (vId == "txtKPJDocResDet") {
		document.getElementById("lblKPJHelp").innerHTML = "<b>Detalle de la documentaci&oacute;n de respaldo</b><br/>"
				+ "La documentaci&oacute;n a considerar para la determinaci&oacute;n del perfil transaccional ser&aacute; la siguiente...";
		dijit.byId("btnKPJHelp").set("disabled", false);
		document.getElementById("divKPJHelpBtn").style.display = "block";
		document.getElementById("lblKPJHelp").allHTML = "<b>Detalle de la documentaci&oacute;n de respaldo</b><br/>"
				+ "<p align='justify' style='width:600px;'>"
				+ "La documentaci&oacute;n a considerar para la determinaci&oacute;n del perfil transaccional ser&aacute; la siguiente:<br/>"
				+ "<ul>"
				+ "<li>Balance firmado por contador, certificado por el Consejo Profesional</li>"
				+ "<li>Certificaci&oacute;n de ventas por CPN</li>"
				+ "<li>&Uacute;ltimos 3 pagos de IVA</li>"
				+ "<li>&Uacute;ltimos 3 pagos de IIBB</li>" + "</ul>" + "</p>";
	} else if (vId == "dgrKPJOInLista" || vId == "cboKPJOIn") {
		document.getElementById("lblKPJHelp").innerHTML = "<b>Operaciones Inusuales</b><br/>"
				+ "Aportes extraordinarios, rescates mayores a $40.000, etc.";
	} else if (vId == "txtKPJActivDes") {
		document.getElementById("lblKPJHelp").innerHTML = "<b>Actividad econ&oacute;mica</b><br/>"
				+ "Descripci&oacute;n exhaustiva de la actividad del cliente que permita conocer cual es la fuente donde obtiene sus ingresos en el desarrollo de su...";
		dijit.byId("btnKPJHelp").set("disabled", false);
		document.getElementById("divKPJHelpBtn").style.display = "block";
		document.getElementById("lblKPJHelp").allHTML = "<b>Actividad econ&oacute;mica</b><br/>"
				+ "<p align='justify' style='width:600px;'>"
				+ "Descripci&oacute;n exhaustiva de la actividad del cliente que permita conocer cual es la "
				+ "fuente donde obtiene sus ingresos en el desarrollo de su actividad.<br/>"
				+ "Puede utilizarse como fuentes de informaci&oacute;n los estados contables, la informaci&oacute;n "
				+ "proporcionada por el cliente de su actividad, publicidad institucional del cliente por &eacute;l "
				+ "aportada, etc.<br/>NO COLOCAR SOLO EL RAMO DE LA ACTIVIDAD SIN OTRA INFORMACI&Oacute;N ADICIONAL.<br/>"
				+ "Por ejemplo, si en  'Tipo de Actividad' figura 'Comercio Minorista', no alcanza con colocar 'El "
				+ "cliente tiene un negocio de venta de ropa' y en cambio, abundar en detalles que indiquen "
				+ "antig&uuml;edad del comercio, marcas con las que opera, clientela target, trayectoria, clientes "
				+ "importantes, etc." + "</p>";
	} else if (vId == "txtKPJPropositoDes") {
		document.getElementById("lblKPJHelp").innerHTML = "<b>Prop&oacute;sito y objetivo</b><br/>"
				+ "Detallar la demanda en la contrataci&oacute;n del seguro. Por ejemplo: para el caso donde el tomador contrate un producto colectivo...";
		dijit.byId("btnKPJHelp").set("disabled", false);
		document.getElementById("divKPJHelpBtn").style.display = "block";
		document.getElementById("lblKPJHelp").allHTML = "<b>Prop&oacute;sito y objetivo</b><br/>"
				+ "<p align='justify' style='width:600px;'>"
				+ "Detallar la demanda en la contrataci&oacute;n del seguro. Por ejemplo: para el caso donde el tomador "
				+ "contrate un producto colectivo con ahorro, un ejemplo ser&iacute;a: 'El cliente contrata el seguro "
				+ "colectivo con ahorro como parte del beneficio que el Tomador le asigna a sus diretores, etc.'.<br/>"
				+ "No alcanza con indicar 'Seguros de Vida' o 'Seguros de Retiro' sin otro detalle."
				+ "</p>";
	} else if (vId == "txtKPJSCCMot") {
		document.getElementById("lblKPJHelp").innerHTML = "<b>Motivo SCC</b><br/>"
				+ "Explique brevemente por qu&eacute; motivo el cliente es SCC (sobre titpificaci&oacute;n Com. O&M P1498)";
	} else if (vId == "txtKPJAccionistas") {
		document.getElementById("lblKPJHelp").innerHTML = "<b>Accionistas</b><br/>"
				+ "Describir la estructura accionaria del cliente con el mayor grado posible de informaci&oacute;n. Deben "
				+ "quedar claramente indicados...";
		dijit.byId("btnKPJHelp").set("disabled", false);
		document.getElementById("divKPJHelpBtn").style.display = "block";
		document.getElementById("lblKPJHelp").allHTML = "<b>Accionistas</b><br/>"
				+ "<p align='justify' style='width:600px;'>"
				+ "Describir la estructura accionaria del cliente con el mayor grado posible de informaci&oacute;n.<br/>"
				+ "Deben quedar claramente indicados los accionistas directos y/o los indirectos, es decir, se debe "
				+ "identificar en todos los casos a las personas f&iacute;sicas titulares del capital y adicionalmente "
				+ "si lo hubiere, aquellas que posean m&aacute;s de un 20% de tenenecia accionaria en el cliente "
				+ "encuestado." + "</p>";
	} else if (vId == "btnKPJImprimir") {
		if (!dijit.byId(vId).get("disabled")) {
			document.getElementById("lblKPJHelp").innerHTML = "<b>Bot&oacute;n Imprimir</b><br/>"
					+ "Se imprimir&aacute;n los datos originales, sin tener en cuenta los cambios realizados.";
		}
	} else {
		document.getElementById("lblKPJHelp").innerHTML = "Para ver la ayuda contextual pase el mouse sobre algunos campos.";
	}
}

function fKPJHelpView() {
	fMsgBox(document.getElementById("lblKPJHelp").allHTML, "Ayuda", "I");
}

function fKPJHelpOut() {
	dijit.byId("btnKPJHelp").set("disabled", true);
	document.getElementById("divKPJHelpBtn").style.display = "none";
	document.getElementById("lblKPJHelp").innerHTML = "Pase el mouse sobre algunos campos para ver la ayuda contextual.";
	document.getElementById("lblKPJHelp").allHTML = "";
}