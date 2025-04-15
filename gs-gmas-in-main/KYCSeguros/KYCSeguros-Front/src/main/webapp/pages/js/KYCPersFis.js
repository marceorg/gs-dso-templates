function onKPFLoad() {
	// Inicializar
	if (!fKPFInitialize()) {
		fKPFReadOnly(true);
		dijit.byId("btnKPFConsultar").set("disabled", true);
		fMsgBox("Se ha producido un error al inicializar.<br/>"
				+ "Por favor, vuelva a ingresar al men&uacute; Formularios.",
				"Error", "E");
		return;
	}
	// Tomar Parametros
	var vParTAc = fGetParamURL("tipoAcc");
	var vParCUI = fGetParamURL("numeroCUIL");
	var vParApe = fGetParamURL("apellido");
	var vParNom = fGetParamURL("nombre");
	document.getElementById("lblKPFEstado").parTipoAcc = vParTAc;
	document.getElementById("lblKPFEstado").parNumeroCUIL = vParCUI;
	document.getElementById("lblKPFEstado").parApellido = vParApe;
	document.getElementById("lblKPFEstado").parNombre = vParNom;
	// Deshabilitar
	fKPFReadOnly(true);

	if (vParCUI.length == 0) {
		fSessionValidate("fKPFBusDialog");
	} else {
		fSessionValidate("fKPFDataLoad");
	}
}

function fKPFBusDialog(vUser, vProfileKey) {
	// Habilitar / Deshabilitar Apellido y Nombre
	if (vProfileKey == "OPERADOR") {
		dijit.byId("txtKPFBusApellido").set("disabled", false);
		dijit.byId("txtKPFBusNombre").set("disabled", false);
	} else {
		dijit.byId("txtKPFBusApellido").set("disabled", true);
		dijit.byId("txtKPFBusNombre").set("disabled", true);
	}

	// Mostrar Dialog
	dijit.byId("dlgKPFFinder").show();
}

function fKPFInitialize() {
	var vRet = true;
	// Resize
	fBrowserResize();
	// Tama�o de botones
	dojo.style("btnKPFConsultar", "width", "120px");
	dojo.style("btnKPFDiff", "width", "120px");
	dojo.style("btnKPFImprimir", "width", "120px");
	dojo.style("btnKPFEnviar", "width", "120px");
	// Valores
	document.getElementById("lblKPFEstado").fechaHoy = "0";
	document.getElementById("lblKPFEstado").origValue = "";
	document.getElementById("lblKPFEstado").esReadOnly = true;

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
										document.getElementById("lblKPFEstado").fechaHoy = response.result;
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
				fComboLoad(response, "cboKPFDirProv");
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
				fComboLoadSCUIT(response, "cboKPFRepTipDoc");
				fComboLoad(response, "cboKPFTitMPgTipDoc");
				fComboLoadSCUIT(response, "cboKPFRepSCCTipDoc");
			}
		}, function(err) {
			vRet = false;
		});
	});
	// Cargar Combo Condicion de IVA
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getCondicionIVAList");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				fComboLoad(response, "cboKPFCondIVA");
			}
		}, function(err) {
			vRet = false;
		});
	});
	// Cargar Combo Pais
	require([ "dojo/request", "dojo/domReady!" ], function(request) {

		var vURL = fGetURLSvc("ParametersService/getPaisList");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			if (response.error) {
				vRet = false;
			} else {
				fComboLoad(response, "cboKPFNacionalidad");
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
				fComboSupLoad(response, "cboKPFAprSup");
			}
		}, function(err) {
			vRet = false;
		});
	});

	return vRet;
}

function fKPFRepShow(value) {
	var cboRepSCC = dijit.byId("cboKPFRepSCC");

	if (value == "S") {
		document.getElementById("trKPFRepLista").style.display = "";
		if (dijit.byId("dgrKPFRepLista") != null)
			dijit.byId("dgrKPFRepLista").update();
		cboRepSCC.set("disabled", false);
	} else {
		document.getElementById("trKPFRepLista").style.display = "none";
		cboRepSCC.set("disabled", true);
		cboRepSCC.set("value", "N");
	}
}

function fKPFMPgShow(value) {
	if (value == "N") {
		document.getElementById("trKPFMPgLista").style.display = "";
	} else {
		document.getElementById("trKPFMPgLista").style.display = "none";
	}
}

function fKPFMPgTDoShow(value) {
	if (value == "4") {
		dijit.byId("txtKPFTitMPgNombre").set("value", "");
		dijit.byId("txtKPFTitMPgNombre").set("disabled", true);
	} else {
		dijit.byId("txtKPFTitMPgNombre").set("disabled", false);
	}
}

function fKPFSCCShow(value) {
	if (value == "S") {
		document.getElementById("trKPFSCCMot").style.display = "";
		// Si No requiere PT
		if (!document.getElementById("lblKPFEstado").perfilObligenAIS) {
			document.getElementById("trKPFSCCLeyIng").style.display = "";
			document.getElementById("trKPFSCCLeyPfT").style.display = "";
		}
	} else {
		document.getElementById("trKPFSCCMot").style.display = "none";
		document.getElementById("trKPFSCCLeyIng").style.display = "none";
		document.getElementById("trKPFSCCLeyPfT").style.display = "none";
	}
}

function fKPFRepSCCShow(value) {
	if (value == "S") {
		document.getElementById("trKPFRepSCCLista").style.display = "";
		if (dijit.byId("dgrKPFRepSCCLista") != null)
			dijit.byId("dgrKPFRepSCCLista").update();
	} else {
		document.getElementById("trKPFRepSCCLista").style.display = "none";
	}
}

function fKPFRelShow(value) {
	if (value == "S") {
		document.getElementById("trKPFRelDet").style.display = "";
	} else {
		document.getElementById("trKPFRelDet").style.display = "none";
	}
}

function fKPFCondIVAShow(value) {
	if (value == "8") {
		document.getElementById("trKPFCIVACatMono").style.display = "";
	} else {
		dijit.byId("txtKPFCIVACatMono").set("value", "");
		document.getElementById("trKPFCIVACatMono").style.display = "none";
	}
}

function fKPFCondLabShow(value) {
	if (value == "R") {
		document.getElementById("trKPFIngSMe").style.display = "";
		dijit.byId("txtKPFIngSal").set("disabled", true);
		document.getElementById("lblKPFIngSal").innerHTML = "Salario neto anualizado:";
		dijit.byId("txtKPFIngSMe").set("value", 0, false);
		dijit.byId("txtKPFIngSal").set("value", 0, false);
	} else {
		document.getElementById("trKPFIngSMe").style.display = "none";
		dijit.byId("txtKPFIngSal").set("disabled", false);
		document.getElementById("lblKPFIngSal").innerHTML = "Salario neto anualizado (incluyendo SAC y bonos cobrados en el &uacute;ltimo a&ntilde;o):";
		dijit.byId("txtKPFIngSMe").set("value", 0, false);
	}
}

function fKPFOInShow(value) {
	if (value == "S") {
		document.getElementById("trKPFOInLista").style.display = "";
		if (dijit.byId("dgrKPFOInLista") != null)
			dijit.byId("dgrKPFOInLista").update();
	} else {
		document.getElementById("trKPFOInLista").style.display = "none";
	}
}

function fKPFReadOnly(value) {
	// Opciones
	if (document.getElementById("lblKPFEstado").parTipoAcc == "tipoAcc=A"
			|| document.getElementById("lblKPFEstado").parTipoAcc == "tipoAcc=O") {
		dijit.byId("btnKPFConsultar").set("disabled", true);
	} else {
		dijit.byId("btnKPFConsultar").set("disabled", false);
	}
	dijit.byId("btnKPFImprimir").set("disabled", value);
	dijit.byId("btnKPFDiff").set("disabled", value);
	dijit.byId("btnKPFEnviar").set("disabled", value);
	// 1- Informacion Basica
	dijit.byId("txtKPFApellido").set("disabled", value);
	dijit.byId("txtKPFNombre").set("disabled", value);
	dijit.byId("cboKPFNacionalidad").set("disabled", value);
	dijit.byId("txtKPFFechaNacim").set("disabled", value); // PPCR_2015-00142_(ENS)
	dijit.byId("txtKPFDirCalle").set("disabled", value);
	dijit.byId("txtKPFDirNumero").set("disabled", value);
	dijit.byId("txtKPFDirPiso").set("disabled", value);
	dijit.byId("txtKPFDirDepto").set("disabled", value);
	dijit.byId("cboKPFDirProv").set("disabled", value);
	if (value)
		dijit.byId("txtKPFDirLocal").set("disabled", value);
	dijit.byId("btnKPFDirCP").set("disabled", value);
	dijit.byId("txtKPFTelefono").set("disabled", value);
	dijit.byId("txtKPFEmail").set("disabled", value);
	dijit.byId("cboKPFRep").set("disabled", value);
	if (value)
		fKPFReadOnlyRep(value);
	dijit.byId("btnKPFRepNew").set("disabled", value);
	dijit.byId("btnKPFRepUpd").set("disabled", value);
	dijit.byId("btnKPFRepDel").set("disabled", value);
	dijit.byId("cboKPFTitMPg").set("disabled", value);
	dijit.byId("cboKPFTitMPgTipDoc").set("disabled", value);
	dijit.byId("txtKPFTitMPgNroDoc").set("disabled", value);
	dijit.byId("txtKPFTitMPgApellido").set("disabled", value);
	dijit.byId("txtKPFTitMPgNombre").set("disabled", value);
	dijit.byId("txtKPFTitMPgMedioPago").set("disabled", value);
	// 2- Informacion Detallada
	dijit.byId("txtKPFActividad").set("disabled", value);
	dijit.byId("btnKPFActividad").set("disabled", value);
	if (value)
		dijit.byId("cboKPFActividad").set("disabled", value);
	dijit.byId("txtKPFActivDes").set("disabled", value);
	dijit.byId("txtKPFPropositoDes").set("disabled", value);
	dijit.byId("cboKPFSCC").set("disabled", value);
	dijit.byId("txtKPFSCCMot").set("disabled", value);
	dijit.byId("cboKPFPEP").set("disabled", value);
	if (value)
		dijit.byId("cboKPFRepSCC").set("disabled", value);
	if (value)
		fKPFReadOnlyRepSCC(value);
	dijit.byId("btnKPFRepSCCUpd").set("disabled", value);
	dijit.byId("cboKPFBco").set("disabled", value);
	dijit.byId("cboKPFCondIVA").set("disabled", value);
	dijit.byId("cboKPFCondLab").set("disabled", value);
	dijit.byId("txtKPFCIVACatMono").set("disabled", value);
	dijit.byId("txtKPFIngFecha").set("disabled", value);
	dijit.byId("txtKPFIngSMe").set("disabled", value);
	dijit.byId("txtKPFIngSal").set("disabled", value);
	dijit.byId("txtKPFIngGan").set("disabled", value);
	dijit.byId("txtKPFIngOtros").set("disabled", value);
	dijit.byId("txtKPFDocResDet").set("disabled", value);
	dijit.byId("cboKPFRel").set("disabled", value);
	dijit.byId("txtKPFRelDet").set("disabled", value);
	dijit.byId("txtKPFIniAnn").set("disabled", value);
	// 3- Perfil Transaccional
	dijit.byId("txtKPFValOpe").set("disabled", value);
	dijit.byId("txtKPFValOpeMot").set("disabled", value);
	dijit.byId("txtKPFComent").set("disabled", value);
	// 4- Operaciones Inusuales
	dijit.byId("cboKPFOIn").set("disabled", value);
	if (value)
		fKPFReadOnlyOIn(value);
	dijit.byId("btnKPFOInNew").set("disabled", value);
	dijit.byId("btnKPFOInUpd").set("disabled", value);
	dijit.byId("btnKPFOInDel").set("disabled", value);
}

function fKPFReadOnlyRep(value) {
	dijit.byId("btnKPFRepApl").set("disabled", value);
	dijit.byId("btnKPFRepCan").set("disabled", value);
	dijit.byId("cboKPFRepTipDoc").set("disabled", value);
	dijit.byId("txtKPFRepNroDoc").set("disabled", value);
	dijit.byId("txtKPFRepApellido").set("disabled", value);
	dijit.byId("txtKPFRepNombre").set("disabled", value);
	dijit.byId("txtKPFFechaNac").set("disabled", value);
}

function fKPFReadOnlyRepSCC(value) {
	dijit.byId("btnKPFRepSCCApl").set("disabled", value);
	dijit.byId("btnKPFRepSCCCan").set("disabled", value);
	dijit.byId("cboKPFRepSCCSCC").set("disabled", value);
	dijit.byId("cboKPFRepSCCPEP").set("disabled", value);
}

function fKPFReadOnlyOIn(value) {
	dijit.byId("btnKPFOInApl").set("disabled", value);
	dijit.byId("btnKPFOInCan").set("disabled", value);
	dijit.byId("txtKPFOInFecha").set("disabled", value);
	dijit.byId("txtKPFOInTipOpe").set("disabled", value);
	dijit.byId("txtKPFOInOriFon").set("disabled", value);
	dijit.byId("txtKPFOInMonto").set("disabled", value);
	dijit.byId("txtKPFOInObserv").set("disabled", value);
}

function fKPFClean() {
	// Limpiar Estado
	document.getElementById("lblKPFEstado").innerHTML = "";
	document.getElementById("lblKPFEstado").origValue = "";
	document.getElementById("lblKPFEstado").perfilObligenAIS = false;
	document.getElementById("lblKPFEstado").tipoOperacion = "";
	document.getElementById("lblKPFEstado").vigenciaDesde = "0";
	document.getElementById("lblKPFEstado").vigenciaHasta = "0";
	document.getElementById("lblKPFEstado").esReadOnly = true;
	document.getElementById("lblKPFEstado").parNumeroCUIL = "";
	document.getElementById("lblKPFEstado").parApellido = "";
	document.getElementById("lblKPFEstado").parNombre = "";
	document.getElementById("divKPFOriginal").style.display = "none";
	// Cerrar Paneles
	fKPFHelpOut();
	dijit.byId("tpnKPFHelp").set("style", "display:none;");
	dijit.byId("tpnKYCPersFisP1").set("open", false);
	dijit.byId("tpnKYCPersFisP2").set("open", false);
	dijit.byId("tpnKYCPersFisP3").set("open", false);
	dijit.byId("tpnKYCPersFisP4").set("open", false);
	dijit.byId("tpnKYCPersFisP5").set("open", false);
	// Panel 1
	fComboClean("cboKPFTipDoc");
	dijit.byId("txtKPFNroDoc").set("value", "");
	dijit.byId("txtKPFCUIL").set("value", "");
	dijit.byId("txtKPFApellido").set("value", "");
	dijit.byId("txtKPFNombre").set("value", "");
	dijit.byId("cboKPFNacionalidad").set("value", "");
	dijit.byId("txtKPFDirCalle").set("value", "", false);
	dijit.byId("txtKPFDirNumero").set("value", "", false);
	dijit.byId("txtKPFDirPiso").set("value", "");
	dijit.byId("txtKPFDirDepto").set("value", "");
	dijit.byId("cboKPFDirProv").set("value", "", false);
	dijit.byId("txtKPFDirLocal").set("value", "", false);
	dijit.byId("txtKPFDirCP").set("value", "");
	dijit.byId("txtKPFTelefono").set("value", "");
	dijit.byId("txtKPFEmail").set("value", "");
	dijit.byId("cboKPFRep").set("value", "");
	dijit.byId("cboKPFTitMPg").set("value", "");
	fGridClean("dgrKPFRepLista");
	fKPFCleanRep();
	dijit.byId("cboKPFTitMPgTipDoc").set("value", "");
	dijit.byId("txtKPFTitMPgNroDoc").set("value", "");
	dijit.byId("txtKPFTitMPgApellido").set("value", "");
	dijit.byId("txtKPFTitMPgNombre").set("value", "");
	dijit.byId("txtKPFTitMPgMedioPago").set("value", "");
	// Panel 2
	dijit.byId("txtKPFActividad").set("value", "");
	fComboClean("cboKPFActividad");
	dijit.byId("txtKPFActivDes").set("value", "");
	dijit.byId("txtKPFPropositoDes").set("value", "");
	dijit.byId("cboKPFSCC").set("value", "");
	dijit.byId("txtKPFSCCMot").set("value", "");
	dijit.byId("cboKPFPEP").set("value", "");
	dijit.byId("cboKPFRepSCC").set("value", "");
	fKPFCleanRepSCC();
	dijit.byId("cboKPFBco").set("value", "");
	dijit.byId("cboKPFCondIVA").set("value", "");
	dijit.byId("cboKPFCondLab").set("value", "");
	dijit.byId("txtKPFCIVACatMono").set("value", "");
	dijit.byId("txtKPFIngFecha").set("value", null);
	dijit.byId("txtKPFIngSMe").set("value", "", false);
	dijit.byId("txtKPFIngSal").set("value", "", false);
	dijit.byId("txtKPFIngGan").set("value", "", false);
	dijit.byId("txtKPFIngOtros").set("value", "", false);
	dijit.byId("txtKPFIngTotal").set("value", "");
	dijit.byId("txtKPFDocResDet").set("value", "");
	dijit.byId("cboKPFRel").set("value", "");
	dijit.byId("txtKPFRelDet").set("value", "");
	dijit.byId("txtKPFIniAnn").set("value", "");
	// Panel 3
	dijit.byId("txtKPFValOpe").set("value", "");
	dijit.byId("txtKPFAcuPri").set("value", "");
	dijit.byId("txtKPFValOpeMot").set("value", "");
	dijit.byId("txtKPFComent").set("value", "");
	dijit.byId("txtKPFUltFec").set("value", null);
	// Panel 4
	dijit.byId("cboKPFOIn").set("value", "");
	fGridClean("dgrKPFOInLista");
	fKPFCleanOIn();
	// Otros Datos
	dijit.byId("txtKPFOpePSoft").set("value", "");
	dijit.byId("txtKPFOpeNombre").set("value", "");
	dijit.byId("txtKPFOpeFecha").set("value", "");
	dijit.byId("txtKPFSupPSoft").set("value", "");
	dijit.byId("txtKPFSupNombre").set("value", "");
	dijit.byId("txtKPFSupFecha").set("value", "");
	dijit.byId("txtKPFSupComentario").set("value", "");
	dijit.byId("txtKPFComPSoft").set("value", "");
	dijit.byId("txtKPFComNombre").set("value", "");
	dijit.byId("txtKPFComFecha").set("value", "");
	dijit.byId("txtKPFComComentario").set("value", "");
}

function fKPFCleanRep() {
	dijit.byId("tpnKYCRepEdit").set("style", "width: 650px;height: 25px;");
	dijit.byId("tpnKYCRepEdit").set("open", false);
	dijit.byId("cboKPFRepTipDoc").set("value", "");
	dijit.byId("txtKPFRepNroDoc").set("value", "");
	dijit.byId("txtKPFRepApellido").set("value", "");
	dijit.byId("txtKPFRepNombre").set("value", "");
	dijit.byId("txtKPFFechaNac").set("value", null);
}

function fKPFCleanRepSCC() {
	dijit.byId("tpnKYCRepSCCEdit").set("style", "width: 720px;height: 25px;");
	dijit.byId("tpnKYCRepSCCEdit").set("open", false);
	dijit.byId("cboKPFRepSCCTipDoc").set("value", "");
	dijit.byId("txtKPFRepSCCNroDoc").set("value", "");
	dijit.byId("cboKPFRepSCCSCC").set("value", "");
	dijit.byId("cboKPFRepSCCPEP").set("value", "");
}

function fKPFCleanOIn() {
	dijit.byId("tpnKYCOInEdit").set("style", "width: 720px;height: 25px;");
	dijit.byId("tpnKYCOInEdit").set("open", false);
	dijit.byId("txtKPFOInFecha").set("value", null);
	dijit.byId("txtKPFOInTipOpe").set("value", "");
	dijit.byId("txtKPFOInTipOpe").set("secuencia", "");
	dijit.byId("txtKPFOInOriFon").set("value", "");
	dijit.byId("txtKPFOInMonto").set("value", "");
	dijit.byId("txtKPFOInObserv").set("value", "");
}

function fKPFConsultar() {
	if (document.getElementById("lblKPFEstado").origValue != ""
			&& !document.getElementById("lblKPFEstado").esReadOnly) {
		fQstBox(
				"Est&aacute; seguro de consultar otro KYC?<br/>Se perderan los cambios realizados",
				"fKPFSearch()");
	} else {
		fKPFSearch();
	}
}

function fKPFImprimir() {
	// Verificar Session
	fSessionValidate("fKPFPrint");
}

function fKPFEnviar() {
	// Acomodar importes totales si quedaron mal
	fKPFIngTotal("S");

	// Si no realizo ningun cambio (Excepto RECUPERADO)
	if (document.getElementById("lblKPFEstado").innerHTML
			.indexOf("(RECUPERADO)") == -1) {
		if (!fKPFDiffShow(false)) {
			fMsgBox("No se realiz&oacute; ning&uacute;n cambio.",
					"Advertencia", "W");
			return;
		}
	}

	if (fKPFValidate()) {
		// Limpiar
		dijit.byId("cboKPFAprSup").set("value", "");
		// Si es nuevo o No actualiza el perfil transaccional
		// if (document.getElementById("lblKPFEstado").origValue == "N"
		// Solo si No actualiza el perfil transaccional
		if (!fKPFActPerfilTrans()) {
			fQstBox("Est&aacute; seguro de enviar el KYC?",
					"fSessionValidate('fKPFSend')");
		} else if (document.getElementById("lblKPFEstado").origValue == "O"
				|| document.getElementById("lblKPFEstado").origValue == "V"
				|| document.getElementById("lblKPFEstado").origValue == "N") {
			// Mostrar Dialog
			dijit.byId("dlgKPFSend").show();
		}
	}
}

function fKPFEnviarOk() {
	if (dijit.byId("cboKPFAprSup").get("value") == "") {
		fMsgBox("Debe seleccionar un Supervisor.", "Advertencia", "W");
		return;
	}
	dijit.byId('dlgKPFSend').onCancel();
	fSessionValidate("fKPFSend");
}

function fKPFClear() {
	// Limpiar
	fKPFClean();
	// Deshabilitar
	fKPFReadOnly(true);
}

function fKPFBuscar() {
	// Validar
	if (isNaN(dijit.byId("txtKPFBusCUIL").get("value"))
			|| String(dijit.byId("txtKPFBusCUIL").get("value")).length < 11
			|| String(dijit.byId("txtKPFBusCUIL").get("value")).substr(0, 1) != "2"
			|| !fValCUIT(String(dijit.byId("txtKPFBusCUIL").get("value")))) {
		fMsgBox("Debe ingresar un CUIL/CUIT/CDI v&aacute;lido.", "Advertencia",
				"W");
		return;
	}
	if (!fValType("A", String(dijit.byId("txtKPFBusApellido").get("value")))) {
		fMsgBox("Debe ingresar un apellido v&aacute;lido.", "Advertencia", "W");
		return;
	}
	if (!fValType("A", String(dijit.byId("txtKPFBusNombre").get("value")))) {
		fMsgBox("Debe ingresar un nombre v&aacute;lido.", "Advertencia", "W");
		return;
	}

	// Parametros
	document.getElementById("lblKPFEstado").parNumeroCUIL = "numeroCUIL="
			+ dijit.byId("txtKPFBusCUIL").get("value");
	document.getElementById("lblKPFEstado").parApellido = "apellido="
			+ dijit.byId("txtKPFBusApellido").get("value");
	document.getElementById("lblKPFEstado").parNombre = "nombre="
			+ dijit.byId("txtKPFBusNombre").get("value");

	// Verificar Session
	fSessionValidate("fKPFDataLoad");
}

function fKPFSearch() {
	// Limpiar
	fKPFClean();
	// Deshabilitar
	fKPFReadOnly(true);
	// Limpiar Busqueda
	dijit.byId("txtKPFBusCUIL").set("value", "");
	dijit.byId("txtKPFBusApellido").set("value", "");
	dijit.byId("txtKPFBusNombre").set("value", "");
	// Mostrar Dialog
	dijit.byId("dlgKPFFinder").show();
}

function fKPFPrint(vUser) {
	window.open(
			fGetURLPag("interface/PDFImpreso.html?tipoPersona=F&numeroCUIL="
					+ dijit.byId("txtKPFCUIL").get("value")), "impreso",
			"resizable=yes,height=550,width=750,top=50,left=100");
}

function fKPFSend(vUser, vProfileKey, vUsrApe, vUsrNom) {
	try {
		// Espera
		fWaitMsgBoxIni("Procesando...", [ "Guardado de KYC",
				"Env&iacute;o al Sistema Central", "Estado del proceso" ]);

		// Guardar
		require(
				[ "dojo/request", "dojo/domReady!" ],
				function(request) {
					fWaitMsgBoxUpd(0, "Guardando KYC...", "A");

					var vURL = fGetURLSvc("KYCService/setKYCPersFis");
					var vPar = fKPFSendGetSave(vUser, vProfileKey, vUsrApe,
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

											vURL = fGetURLSvc("KYCService/setKYCPersFisAIS");
											vPar = fKPFSendGetSend();

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
																	fKPFClean();
																	// Deshabilitar
																	fKPFReadOnly(true);
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

function fKPFSendGetSave(vUser, vProfileKey, vUsrApe, vUsrNom) {
	var vPar = "";

	vPar += "cache=" + fGetCacheRnd();
	vPar += "&tipoDocNum=" + dijit.byId("cboKPFTipDoc").get("value");
	vPar += "&tipoDocDes=" + dijit.byId("cboKPFTipDoc").get("displayedValue");
	vPar += "&numeroDoc=" + dijit.byId("txtKPFNroDoc").get("value");
	vPar += "&numeroCUIL=" + dijit.byId("txtKPFCUIL").get("value");
	vPar += "&apellido=" + dijit.byId("txtKPFApellido").get("value");
	vPar += "&nombre=" + dijit.byId("txtKPFNombre").get("value");
	vPar += "&nacionalidadCod=" + dijit.byId("cboKPFNacionalidad").get("value");
	// PPCR_2015-00142_(ENS)
	if (dijit.byId("txtKPFFechaNacim").get("value") != null) {
		vPar += "&fechaNacimiento="
				+ dojo.date.locale.format(dijit.byId("txtKPFFechaNacim").get(
						"value"), {
					datePattern : "yyyyMMdd",
					selector : "date"
				});
	} else {
		vPar += "&fechaNacimiento=0";
	}
	// fin
	vPar += "&dirCalle=" + dijit.byId("txtKPFDirCalle").get("value");
	vPar += "&dirNumero=" + dijit.byId("txtKPFDirNumero").get("value");
	vPar += "&dirPiso=" + dijit.byId("txtKPFDirPiso").get("value");
	vPar += "&dirDepto=" + dijit.byId("txtKPFDirDepto").get("value");
	vPar += "&dirProvincia=" + dijit.byId("cboKPFDirProv").get("value");
	vPar += "&dirLocalidad=" + dijit.byId("txtKPFDirLocal").get("value");
	vPar += "&dirCodigoPostal=" + dijit.byId("txtKPFDirCP").get("value");
	vPar += "&telefono=" + dijit.byId("txtKPFTelefono").get("value");
	vPar += "&email=" + dijit.byId("txtKPFEmail").get("value");
	vPar += "&tieneRep="
			+ (dijit.byId("cboKPFRep").get("value") == "S" ? true : false);
	vPar += "&representanteList=" + fKPFSendGetArrRep();
	vPar += "&esTitMPago="
			+ (dijit.byId("cboKPFTitMPg").get("value") == "S" ? true : false);
	vPar += "&titMPagoList=" + fKPFSendGetArrTitMPg();
	vPar += "&actividadCod=" + dijit.byId("cboKPFActividad").get("value");
	vPar += "&actividadNom="
			+ fEncodeURI(dijit.byId("cboKPFActividad").get("displayedValue"));
	vPar += "&actividadDes="
			+ fEncodeURI(dijit.byId("txtKPFActivDes").get("value"));
	vPar += "&propositoDes="
			+ fEncodeURI(dijit.byId("txtKPFPropositoDes").get("value"));
	vPar += "&esSCC="
			+ (dijit.byId("cboKPFSCC").get("value") == "S" ? true : false);
	vPar += "&motivoSCC=" + fEncodeURI(dijit.byId("txtKPFSCCMot").get("value"));
	vPar += "&esPEP="
			+ (dijit.byId("cboKPFPEP").get("value") == "S" ? true : false);
	vPar += "&tieneRepSCC="
			+ (dijit.byId("cboKPFRepSCC").get("value") == "S" ? true : false);
	vPar += "&esClienteBco="
			+ (dijit.byId("cboKPFBco").get("value") == "S" ? true : false);
	vPar += "&condicionIVA=" + dijit.byId("cboKPFCondIVA").get("value");
	vPar += "&condicionLab=" + dijit.byId("cboKPFCondLab").get("value");
	vPar += "&categoriaMono=" + dijit.byId("txtKPFCIVACatMono").get("value");
	if (dijit.byId("txtKPFIngFecha").get("value") != null) {
		vPar += "&ingFecha="
				+ dojo.date.locale.format(dijit.byId("txtKPFIngFecha").get(
						"value"), {
					datePattern : "yyyyMMdd",
					selector : "date"
				});
	} else {
		vPar += "&ingFecha=0";
	}
	vPar += "&ingSalMen=" + dijit.byId("txtKPFIngSMe").get("value");
	vPar += "&ingSalario=" + dijit.byId("txtKPFIngSal").get("value");
	vPar += "&ingGanancia=" + dijit.byId("txtKPFIngGan").get("value");
	vPar += "&ingOtros=" + dijit.byId("txtKPFIngOtros").get("value");
	vPar += "&ingTotal=" + dijit.byId("txtKPFIngTotal").get("value");
	vPar += "&docResDetalle="
			+ fEncodeURI(dijit.byId("txtKPFDocResDet").get("value"));
	vPar += "&tieneRelHSBC="
			+ (dijit.byId("cboKPFRel").get("value") == "S" ? true : false);
	vPar += "&relDetalle="
			+ fEncodeURI(dijit.byId("txtKPFRelDet").get("value"));
	vPar += "&inicioAnn=" + dijit.byId("txtKPFIniAnn").get("value");
	vPar += "&valorOperar=" + dijit.byId("txtKPFValOpe").get("value");
	vPar += "&primaAnual=" + dijit.byId("txtKPFAcuPri").get("value");
	vPar += "&valorOperarMot="
			+ fEncodeURI(dijit.byId("txtKPFValOpeMot").get("value"));
	vPar += "&perfilComentarios="
			+ fEncodeURI(dijit.byId("txtKPFComent").get("value"));
	if (dijit.byId("txtKPFUltFec").get("value") != null) {
		vPar += "&ultFecha="
				+ dojo.date.locale.format(dijit.byId("txtKPFUltFec").get(
						"value"), {
					datePattern : "yyyyMMdd",
					selector : "date"
				});
	} else {
		vPar += "&ultFecha=0";
	}
	vPar += "&opeInusualList=" + fKPFSendGetArrOIn();
	vPar += "&opePeopleSoft=" + vUser;
	vPar += "&opeApellido=" + vUsrApe;
	vPar += "&opeNombre=" + vUsrNom;

	return vPar;
}

function fKPFSendGetSend() {
	var vPar = "";

	vPar += "cache=" + fGetCacheRnd();
	vPar += "&numeroCUIL=" + dijit.byId("txtKPFCUIL").get("value");
	vPar += "&tipoOperacion="
			+ document.getElementById("lblKPFEstado").tipoOperacion;
	vPar += "&actPerfilTrans=" + fKPFActPerfilTrans();
	vPar += "&esKYCNuevo=" + fKPFesKYCNuevo();
	vPar += "&vigenciaDesde="
			+ document.getElementById("lblKPFEstado").vigenciaDesde;
	vPar += "&vigenciaHasta="
			+ document.getElementById("lblKPFEstado").vigenciaHasta;
	vPar += "&perfilObligenAIS="
			+ document.getElementById("lblKPFEstado").perfilObligenAIS;
	if (dijit.byId("cboKPFAprSup").get("value") != "") {
		vPar += "&supPeopleSoft="
				+ dijit.byId("cboKPFAprSup").get("value").split("|")[0];
		vPar += "&supApellido="
				+ dijit.byId("cboKPFAprSup").get("value").split("|")[1];
		vPar += "&supNombre="
				+ dijit.byId("cboKPFAprSup").get("value").split("|")[2];
	} else {
		vPar += "&supPeopleSoft=" + "&supApellido=" + "&supNombre=";
	}

	return vPar;
}

function fKPFSendGetArrRep() {
	// Pasar a string array de Representantes
	var oGridStore = dijit.byId("dgrKPFRepLista").store._arrayOfTopLevelItems;
	var vRet = '{"representanteList":[';
	if (dijit.byId("cboKPFRep").get("value") == "S") {
		for (var i = 0; i < oGridStore.length; i++) {
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
	}
	vRet += ']}';
	return vRet;
}

function fKPFSendGetArrTitMPg() {
	// Pasar a string array de Titular de Medios de Pago
	var vRet = '{"titMPagoList":[';
	if (dijit.byId("cboKPFTitMPg").get("value") == "N") {
		vRet += '{';
		vRet += '"tipoDoc":' + dijit.byId("cboKPFTitMPgTipDoc").get("value")
				+ ',';
		vRet += '"numeroDoc":' + dijit.byId("txtKPFTitMPgNroDoc").get("value")
				+ ',';
		vRet += '"apellido":"'
				+ dijit.byId("txtKPFTitMPgApellido").get("value") + '",';
		vRet += '"nombre":"' + dijit.byId("txtKPFTitMPgNombre").get("value")
				+ '",';
		vRet += '"medioPago":"'
				+ dijit.byId("txtKPFTitMPgMedioPago").get("value") + '"';
		vRet += '}';
	}
	vRet += ']}';
	return vRet;
}

function fKPFSendGetArrOIn() {
	// Pasar a string array de Operaciones Inusuales
	var oGridStore = dijit.byId("dgrKPFOInLista").store._arrayOfTopLevelItems;
	var vRet = '{"opeInusualList":[';
	if (dijit.byId("cboKPFOIn").get("value") == "S") {
		for (var i = 0; i < oGridStore.length; i++) {
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

function fKPFActPerfilTrans() {
	if (document.getElementById("lblKPFEstado").origValue == "N") {
		// Si es nueva - NO Actualiza Perfil Transaccional
		return true;
	} else {
		if (document.getElementById("lblKPFEstado").innerHTML
				.indexOf("(RECUPERADO)") > 0) {
			// Si es RECUPERADA - Siempre Actualiza Perfil Transaccional
			return true;
		} else {
			// Verifica si se modificaron los campos
			var vDiffTpn3 = [];
			fKPFDiffAdd(vDiffTpn3, "T", "3.1", "txtKPFValOpe");
			fKPFDiffAdd(vDiffTpn3, "T", "3.2", "txtKPFAcuPri");
			fKPFDiffAdd(vDiffTpn3, "T", "3.3", "txtKPFValOpeMot");
			fKPFDiffAdd(vDiffTpn3, "T", "3.4", "txtKPFComent");
			var vDiffTpn3Lng = vDiffTpn3.length;
			if (vDiffTpn3Lng == 0) {
				return false;
			} else {
				return true;
			}
		}
	}
}

function fKPFesKYCNuevo() {
	if (document.getElementById("lblKPFEstado").tipoOperacion == "A") {
		return true;
	} else {
		return false;
	}
	;
}

function fKPFOriginal() {
	fSessionValidate("fSessionVoid");

	if (document.getElementById("divKPFOriginal").mark == "O") {
		var vURL = fGetURLPag("interface/KYCPersFis.html?tipoAcc=O&"
				+ document.getElementById("lblKPFEstado").parNumeroCUIL + "&"
				+ document.getElementById("lblKPFEstado").parApellido + "&"
				+ document.getElementById("lblKPFEstado").parNombre);
		var oCP = dijit.byId("divContent");
		oCP.set("href", vURL);
		oCP.set("onDownloadEnd", function() {
			onKPFLoad();
		});
	} else if (document.getElementById("divKPFOriginal").mark == "V") {
		var vURL = fGetURLPag("interface/KYCPersFis.html?tipoAcc=F&"
				+ document.getElementById("lblKPFEstado").parNumeroCUIL + "&"
				+ document.getElementById("lblKPFEstado").parApellido + "&"
				+ document.getElementById("lblKPFEstado").parNombre);
		var oCP = dijit.byId("divContent");
		oCP.set("href", vURL);
		oCP.set("onDownloadEnd", function() {
			onKPFLoad();
		});
	} else if (document.getElementById("divKPFOriginal").mark == "A") {
		var url = fGetURLPag("interface/KYCAprobacion.html?id="
				+ dijit.byId("txtKPFCUIL").get("value"));
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onKAPLoad();
		});
	}
}

function fKPFDiffShow(vShow) {
	var vChange = false;

	require(
			[ "dojo/request", "dijit/Tree", "dojo/data/ItemFileReadStore",
					"dijit/tree/ForestStoreModel", "dojo/domReady!" ],
			function(request, Tree, ItemFileReadStore, ForestStoreModel) {
				// Titulos
				dijit.byId("dlgKPFDiffShow").set("title",
						"Diferencias / Modificaciones realizadas");
				document.getElementById("lblKPFDiffShow").innerHTML = "Lista de modificaciones realizadas:";
				document.getElementById("lblKPFDiffLey").innerHTML = "La secci&oacute;n marcada en rojo "
						+ "contiene los campos que requieren aprobaci&oacute;n";

				var vDiffTpn1 = [];
				var vDiffTpn2 = [];
				var vDiffTpn3 = [];
				var vDiffTpn4 = [];

				// Diferencias Panel 1
				fKPFDiffAdd(vDiffTpn1, "T", "1.1", "txtKPFApellido");
				fKPFDiffAdd(vDiffTpn1, "T", "1.2", "txtKPFNombre");
				fKPFDiffAdd(vDiffTpn1, "C", "1.3", "cboKPFNacionalidad");
				fKPFDiffAdd(vDiffTpn1, "D", "1.4", "txtKPFFechaNacim");
				fKPFDiffAdd(vDiffTpn1, "T", "1.5", "txtKPFDirCalle");
				fKPFDiffAdd(vDiffTpn1, "T", "1.6", "txtKPFDirNumero");
				fKPFDiffAdd(vDiffTpn1, "T", "1.7", "txtKPFDirPiso");
				fKPFDiffAdd(vDiffTpn1, "T", "1.8", "txtKPFDirDepto");
				fKPFDiffAdd(vDiffTpn1, "C", "1.9", "cboKPFDirProv");
				fKPFDiffAdd(vDiffTpn1, "T", "1.10", "txtKPFDirLocal");
				fKPFDiffAdd(vDiffTpn1, "T", "1.11", "txtKPFDirCP");
				fKPFDiffAdd(vDiffTpn1, "T", "1.12", "txtKPFTelefono");
				fKPFDiffAdd(vDiffTpn1, "T", "1.13", "txtKPFEmail");
				fKPFDiffAdd(vDiffTpn1, "C", "1.14", "cboKPFRep");
				fKPFDiffAdd(vDiffTpn1, "C", "1.15", "cboKPFTitMPg");
				fKPFDiffAddRep(vDiffTpn1, "1.16", "dgrKPFRepLista");
				// Solo mostrar diferencias cuando es N
				if (dijit.byId("cboKPFTitMPg").get("value") == "N") {
					fKPFDiffAdd(vDiffTpn1, "C", "1.17", "cboKPFTitMPgTipDoc",
							" del titular del medio de pago");
					fKPFDiffAdd(vDiffTpn1, "T", "1.18", "txtKPFTitMPgNroDoc",
							" Documento del titular del medio de pago");
					fKPFDiffAdd(vDiffTpn1, "T", "1.19", "txtKPFTitMPgApellido",
							" del titular del medio de pago");
					fKPFDiffAdd(vDiffTpn1, "T", "1.20", "txtKPFTitMPgNombre",
							" del titular del medio de pago");
					fKPFDiffAdd(vDiffTpn1, "T", "1.21",
							"txtKPFTitMPgMedioPago",
							" del titular del medio de pago");
				}

				var vDiffTpn1Lng = vDiffTpn1.length;
				if (vDiffTpn1Lng > 0) {
					vChange = true;
				}

				// Diferencias Panel 2
				fKPFDiffAdd(vDiffTpn2, "C", "2.1", "cboKPFActividad");
				fKPFDiffAdd(vDiffTpn2, "T", "2.2", "txtKPFActivDes");
				fKPFDiffAdd(vDiffTpn2, "T", "2.3", "txtKPFPropositoDes");
				fKPFDiffAdd(vDiffTpn2, "C", "2.4", "cboKPFSCC");
				fKPFDiffAdd(vDiffTpn2, "T", "2.5", "txtKPFSCCMot", " si es SCC");
				fKPFDiffAdd(vDiffTpn2, "C", "2.6", "cboKPFPEP");
				fKPFDiffAdd(vDiffTpn2, "C", "2.7", "cboKPFRepSCC");
				// Si RepSCC no cambia y era NO, no chequeo Listado Rep SCC
				if (!(dijit.byId("cboKPFRepSCC").get("value") == "N" && dijit
						.byId("cboKPFRepSCC").get("origValue") == "N")) {
					fKPFDiffAddRepSCC(vDiffTpn2, "2.8", "dgrKPFRepSCCLista");
				}
				fKPFDiffAdd(vDiffTpn2, "C", "2.9", "cboKPFBco");
				fKPFDiffAdd(vDiffTpn2, "C", "2.10", "cboKPFCondIVA");
				fKPFDiffAdd(vDiffTpn2, "C", "2.21", "cboKPFCondLab");
				// Si es 8
				if (dijit.byId("cboKPFCondIVA").get("value") == "8") {
					fKPFDiffAdd(vDiffTpn2, "T", "2.11", "txtKPFCIVACatMono");
				}
				fKPFDiffAdd(vDiffTpn2, "D", "2.12", "txtKPFIngFecha");
				if (dijit.byId("cboKPFCondLab").get("value") == "R") {
					fKPFDiffAdd(vDiffTpn2, "T", "2.22", "txtKPFIngSMe");
				}
				fKPFDiffAdd(vDiffTpn2, "T", "2.13", "txtKPFIngSal");
				fKPFDiffAdd(vDiffTpn2, "T", "2.14", "txtKPFIngGan");
				fKPFDiffAdd(vDiffTpn2, "T", "2.15", "txtKPFIngOtros");
				fKPFDiffAdd(vDiffTpn2, "T", "2.16", "txtKPFIngTotal");
				fKPFDiffAdd(vDiffTpn2, "T", "2.17", "txtKPFDocResDet");
				fKPFDiffAdd(vDiffTpn2, "C", "2.18", "cboKPFRel");
				fKPFDiffAdd(vDiffTpn2, "T", "2.19", "txtKPFRelDet",
						" si tiene relaci&oacute;n con otra compa&ntilde;&iacute;a del grupo");
				fKPFDiffAdd(vDiffTpn2, "T", "2.20", "txtKPFIniAnn");

				var vDiffTpn2Lng = vDiffTpn2.length;
				if (vDiffTpn2Lng > 0) {
					vChange = true;
				}

				// Diferencias Panel 3
				fKPFDiffAdd(vDiffTpn3, "T", "3.1", "txtKPFValOpe");
				fKPFDiffAdd(vDiffTpn3, "T", "3.2", "txtKPFAcuPri");
				fKPFDiffAdd(vDiffTpn3, "T", "3.3", "txtKPFValOpeMot");
				fKPFDiffAdd(vDiffTpn3, "T", "3.4", "txtKPFComent");

				var vDiffTpn3Lng = vDiffTpn3.length;
				if (vDiffTpn3Lng > 0) {
					vChange = true;
				}

				// Diferencias Panel 4
				fKPFDiffAdd(vDiffTpn4, "C", "4.1", "cboKPFOIn");
				fKPFDiffAddOIn(vDiffTpn4, "4.2", "dgrKPFOInLista");

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

					if (dijit.byId("treKPFDiffShow") != null) {
						fDestroyElement("treKPFDiffShow");
						document.getElementById("tdKPFDiffShow").innerHTML = '<div id="_divKPFDiffShow" style="width: 600px; height: 400px;"></div>';
					}
					if (dijit.byId("treKPFDiffShow") == null) {
						oTree = dijit.Tree({
							id : "treKPFDiffShow",
							style : 'width: 600px; height: 400px;',
							model : vTreeModel,
							autoExpand : false,
							showRoot : false,
							_createTreeNode : function(args) {
								var tnode = new dijit._TreeNode(args);
								tnode.labelNode.innerHTML = args.label;
								return tnode;
							}
						}, "_divKPFDiffShow");

						oTree.startup();
					}
				}
			});

	// Mostrar Dialog
	if (vShow) {
		dijit.byId("dlgKPFDiffShow").show();
	}

	return vChange;
}

function fKPFDiffAdd(vArr, vTipo, vIdTree, vObjId, vTextAdi) {
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

function fKPFDiffAddRep(vArr, vIdTree, vObjId) {
	// Grilla Representantes
	var vObj = dijit.byId(vObjId);
	var vLbl = document.getElementById("lbl" + vObjId.substr(3, vObjId.length));

	var vLblDes = "";
	if (vLbl) {
		vLblDes = vLbl.innerHTML.replace(":", "");
	}

	var vModGrid = vObj.store._arrayOfTopLevelItems;
	var vOriGrid = JSON.parse(document.getElementById("hdgrKPFRepLista").value);
	var vEnc = false;
	var vDiffGrid = [];

	// Nuevos y modificados
	for (var i = 0; i < vModGrid.length; i++) {
		vEnc = false;
		for (var j = 0; j < vOriGrid.length; j++) {
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
	for (var j = 0; j < vOriGrid.length; j++) {
		vEnc = false;
		for (var i = 0; i < vModGrid.length; i++) {
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

function fKPFDiffAddRepSCC(vArr, vIdTree, vObjId) {
	// Grilla Representantes SCC
	var vObj = dijit.byId(vObjId);
	var vLbl = document.getElementById("lbl" + vObjId.substr(3, vObjId.length));

	var vLblDes = "";
	if (vLbl) {
		vLblDes = vLbl.innerHTML.replace(":", "");
	}

	var vModGrid = vObj.store._arrayOfTopLevelItems;
	var vOriGrid = JSON.parse(document.getElementById("hdgrKPFRepLista").value);
	var vEnc = false;
	var vDiffGrid = [];

	// Nuevos y modificados
	for (var i = 0; i < vModGrid.length; i++) {
		vEnc = false;
		for (var j = 0; j < vOriGrid.length; j++) {
			if (vModGrid[i].numeroDoc == vOriGrid[j].numeroDoc) {
				vEnc = true;
				if ((vModGrid[i].esSCC != String(vOriGrid[j].esSCC))
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
													+ (vOriGrid[j].esPEP ? "Es PEP"
															: "No es PEP")
										},
										{
											id : vIdTree + '.1.' + i + ".2",
											label : '<font color="blue"><b>Valor Modificado: </b>'
													+ (vModGrid[i].esSCC == "true" ? "Es SCC"
															: "No es SCC")
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
								+ (vModGrid[i].esPEP == "true" ? "Es PEP"
										: "No es PEP") + "</font>"
					});
		}
	}
	// Eliminados
	for (var j = 0; j < vOriGrid.length; j++) {
		vEnc = false;
		for (var i = 0; i < vModGrid.length; i++) {
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

function fKPFDiffAddOIn(vArr, vIdTree, vObjId) {
	// Grilla Operaciones Inusuales
	var vObj = dijit.byId(vObjId);
	var vLbl = document.getElementById("lbl" + vObjId.substr(3, vObjId.length));

	var vLblDes = "";
	if (vLbl) {
		vLblDes = vLbl.innerHTML.replace(":", "");
	}

	var vModGrid = vObj.store._arrayOfTopLevelItems;
	var vOriGrid = JSON.parse(document.getElementById("hdgrKPFOInLista").value);
	var vEnc = false;
	var vDiffGrid = [];

	// Nuevos y modificados
	for (var i = 0; i < vModGrid.length; i++) {
		vEnc = false;
		for (var j = 0; j < vOriGrid.length; j++) {
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
	for (var j = 0; j < vOriGrid.length; j++) {
		vEnc = false;
		for (var i = 0; i < vModGrid.length; i++) {
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

function fKPFValidate() {
	var vRet = 0;
	require(
			[ "dojo/request", "dijit/Tree", "dojo/data/ItemFileReadStore",
					"dijit/tree/ForestStoreModel", "dojo/domReady!" ],
			function(request, Tree, ItemFileReadStore, ForestStoreModel) {
				// Titulos
				dijit.byId("dlgKPFDiffShow").set("title", "Validaci&oacute;n");
				document.getElementById("lblKPFDiffShow").innerHTML = "<font color='red'><b>Lista de Errores de Validaci&oacute;n:<b></font>";
				document.getElementById("lblKPFDiffLey").innerHTML = "Hacer doble clic en el error para ir a la posici&oacute;n del campo.";

				var vDataVal = [];
				var vValTpn1 = [];
				var vValTpn2 = [];
				var vValTpn3 = [];
				var vValTpn4 = [];

				// Validacion Panel 1
				fKPFValAdd(vValTpn1, "A", "1.1", "txtKPFApellido");
				fKPFValAdd(vValTpn1, "A", "1.2", "txtKPFNombre");
				fKPFValAdd(vValTpn1, "D", "1.3", "txtKPFFechaNacim"); // PPCR_2015-00142_(ENS)
				fKPFValAdd(vValTpn1, "T", "1.4", "txtKPFDirCalle");
				fKPFValAdd(vValTpn1, "R", "1.5", "txtKPFDirNumero");
				fKPFValAdd(vValTpn1, "C", "1.7", "cboKPFDirProv");
				fKPFValAdd(vValTpn1, "T", "1.8", "txtKPFDirLocal");
				fKPFValAdd(vValTpn1, "N", "1.9", "txtKPFDirCP");
				// Validar CP (Solo CABA)
				if (dijit.byId("txtKPFDirCP").get("value") != "0") {
					if (dijit.byId("cboKPFDirProv").get("value") == "1") {
						if (!fCPFinderValCPXAltura(dijit.byId("txtKPFDirCalle")
								.get("value"), dijit.byId("txtKPFDirNumero")
								.get("value"), dijit.byId("txtKPFDirCP").get(
								"value"))) {
							fKPFValAddMan(vValTpn1, "C.Postal", "1.9",
									"txtKPFDirNumero",
									"No corresponde con la calle y el n&uacute;mero.");
						}
					}
				}
				fKPFValAdd(vValTpn1, "R", "1.10", "txtKPFTelefono");
				fKPFValAdd(vValTpn1, "M", "1.11", "txtKPFEmail");
				fKPFValAdd(vValTpn1, "C", "1.12", "cboKPFRep");
				// Solo valida cuando es S
				if (dijit.byId("cboKPFRep").get("value") == "S") {
					fKPFValAddRep(vValTpn1, "1.14", "dgrKPFRepLista");
				}
				fKPFValAdd(vValTpn1, "C", "1.13", "cboKPFTitMPg");
				// Solo validar cuando es N
				if (dijit.byId("cboKPFTitMPg").get("value") == "N") {
					fKPFValAdd(vValTpn1, "C", "1.15", "cboKPFTitMPgTipDoc",
							" del titular del medio de pago");
					fKPFValAdd(vValTpn1, "N", "1.16", "txtKPFTitMPgNroDoc",
							" Documento del titular del medio de pago");
					// Validar solo para CUIT
					if (dijit.byId("cboKPFTitMPgTipDoc").get("value") == "4"
							&& !isNaN(dijit.byId("txtKPFTitMPgNroDoc").get(
									"value"))
							&& dijit.byId("txtKPFTitMPgNroDoc").get("value") != 0) {
						if (!fValCUIT(String(dijit.byId("txtKPFTitMPgNroDoc")
								.get("value")))) {
							fKPFValAddMan(vValTpn1,
									"Documento del titular del medio de pago",
									"1.16", "txtKPFTitMPgNroDoc",
									"Debe ingresar un CUIT v&aacute;lido.");
						}
					}
					fKPFValAdd(vValTpn1, "R", "1.17", "txtKPFTitMPgApellido",
							" del titular del medio de pago");
					if (dijit.byId("cboKPFTitMPgTipDoc").get("value") != "4") {
						fKPFValAdd(vValTpn1, "A", "1.18", "txtKPFTitMPgNombre",
								" del titular del medio de pago");
					}
					fKPFValAdd(vValTpn1, "R", "1.19", "txtKPFTitMPgMedioPago",
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
				fKPFValAdd(vValTpn2, "C", "2.1", "cboKPFActividad");
				fKPFValAdd(vValTpn2, "T", "2.2", "txtKPFActivDes");
				fKPFValAdd(vValTpn2, "T", "2.3", "txtKPFPropositoDes");
				fKPFValAdd(vValTpn2, "C", "2.4", "cboKPFSCC");
				// Solo valida cuando es S
				if (dijit.byId("cboKPFSCC").get("value") == "S") {
					fKPFValAdd(vValTpn2, "T", "2.5", "txtKPFSCCMot",
							" si es SCC");
				}
				fKPFValAdd(vValTpn2, "C", "2.6", "cboKPFPEP");
				// Si es PEP y no es SCC
				if (dijit.byId("cboKPFSCC").get("value") == "N"
						&& dijit.byId("cboKPFPEP").get("value") == "S") {
					fKPFValAddMan(vValTpn2, "Es PEP", "2.6", "cboKPFPEP",
							"No puede seleccionar 'Si' si no es SCC.");
				}
				fKPFValAdd(vValTpn2, "C", "2.7", "cboKPFRepSCC");
				// Solo valida cuando es S
				if (dijit.byId("cboKPFRepSCC").get("value") == "S") {
					fKPFValAddRepSCC(vValTpn2, "2.8", "dgrKPFRepSCCLista");
				}
				fKPFValAdd(vValTpn2, "C", "2.9", "cboKPFBco");
				fKPFValAdd(vValTpn2, "C", "2.10", "cboKPFCondIVA");
				fKPFValAdd(vValTpn2, "C", "2.21", "cboKPFCondLab");
				if (dijit.byId("cboKPFCondIVA").get("value") == "8") {
					fKPFValAdd(vValTpn2, "A", "2.11", "txtKPFCIVACatMono");
				}
				// Si el perfil transaccional es obligatorio
				if (dijit.byId("cboKPFSCC").get("value") == "N"
						|| document.getElementById("lblKPFEstado").perfilObligenAIS) {
					fKPFValAdd(vValTpn2, "D", "2.12", "txtKPFIngFecha");
					fKPFValAdd(vValTpn2, "U", "2.22", "txtKPFIngSMe");
					if (dijit.byId("txtKPFIngGan").get("value") == 0) {
						fKPFValAdd(vValTpn2, "N", "2.13", "txtKPFIngSal");
						fKPFValAdd(vValTpn2, "U", "2.14", "txtKPFIngGan");
					} else {
						fKPFValAdd(vValTpn2, "U", "2.13", "txtKPFIngSal");
						fKPFValAdd(vValTpn2, "N", "2.14", "txtKPFIngGan");
					}
					fKPFValAdd(vValTpn2, "U", "2.15", "txtKPFIngOtros");
					fKPFValAdd(vValTpn2, "T", "2.16", "txtKPFDocResDet");
				} else {
					fKPFValAdd(vValTpn2, "U", "2.22", "txtKPFIngSMe");
					fKPFValAdd(vValTpn2, "U", "2.13", "txtKPFIngSal");
					fKPFValAdd(vValTpn2, "U", "2.14", "txtKPFIngGan");
					fKPFValAdd(vValTpn2, "U", "2.15", "txtKPFIngOtros");
				}
				// Si tiene algo en la fecha
				if (dijit.byId("txtKPFIngFecha").get("value") != null) {
					var vIngFecha = dojo.date.locale.format(dijit.byId(
							"txtKPFIngFecha").get("value"), {
						datePattern : "yyyyMMdd",
						selector : "date"
					});
					if (vIngFecha > document.getElementById("lblKPFEstado").fechaHoy) {
						fKPFValAddMan(
								vValTpn2,
								"&Uacute;ltima fecha de actualizaci&oacute;n de ingresos",
								"2.12", "txtKPFIngFecha",
								"La fecha no puede ser mayor a la actual.");
					}
				}
				fKPFValAdd(vValTpn2, "C", "2.17", "cboKPFRel");
				// Solo valida cuando es S
				if (dijit.byId("cboKPFRel").get("value") == "S") {
					fKPFValAdd(vValTpn2, "T", "2.18", "txtKPFRelDet",
							" si tiene relaci&oacute;n con otra compa&ntilde;&iacute;a del grupo");
				}
				fKPFValAdd(vValTpn2, "N", "2.19", "txtKPFIniAnn");

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
				if (dijit.byId("cboKPFSCC").get("value") == "N"
						|| document.getElementById("lblKPFEstado").perfilObligenAIS) {
					fKPFValAdd(vValTpn3, "N", "3.2", "txtKPFValOpe");
					if (dijit.byId("txtKPFValOpe").get("value") > 0) {
						if (dijit.byId("txtKPFValOpe").get("value") < dijit
								.byId("txtKPFIngTotal").get("value")) {
							fKPFValAddMan(
									vValTpn3,
									"Ingresos Totales (cifra en Pesos) Perfil Transaccional",
									"3.2", "txtKPFValOpe",
									"El valor debe ser mayor o igual al TOTAL INGRESO ANUAL.");
						}
					}
					fKPFValAdd(vValTpn3, "T", "3.3", "txtKPFValOpeMot");
					fKPFValAdd(vValTpn3, "T", "3.4", "txtKPFComent");
				} else {
					fKPFValAdd(vValTpn3, "U", "3.2", "txtKPFValOpe");
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
				fKPFValAdd(vValTpn4, "C", "4.1", "cboKPFOIn");
				// Solo valida cuando es S
				if (dijit.byId("cboKPFOIn").get("value") == "S") {
					fKPFValAddOIn(vValTpn4, "4.2", "dgrKPFOInLista");
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

				if (dijit.byId("treKPFDiffShow") != null) {
					fDestroyElement("treKPFDiffShow");
					document.getElementById("tdKPFDiffShow").innerHTML = '<div id="_divKPFDiffShow" style="width: 600px; height: 400px;"></div>';
				}
				if (dijit.byId("treKPFDiffShow") == null) {
					oTree = dijit.Tree({
						id : "treKPFDiffShow",
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
							fKPFValFocus(item);
						}
					}, "_divKPFDiffShow");

					oTree.startup();
				}

				if (vDataVal.length > 0) {
					// Mostrar Dialog
					dijit.byId("dlgKPFDiffShow").show();
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

function fKPFValAdd(vArr, vTipo, vIdTree, vObjId, vTextAdi) {
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
	} else if (vTipo == "U") {
		// Numero (puede ser 0)
		if (isNaN(vObj.get("value"))) {
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

function fKPFValAddMan(vArr, vLey, vIdTree, vObjId, vTextAdi) {
	var vVal = {
		id : vIdTree,
		label : vLey + ' - <font color="red"><b>' + vTextAdi + '</b></font>',
		obj : vObjId
	};
	vArr.push(vVal);
}

function fKPFValAddRep(vArr, vIdTree, vObjId) {
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
			obj : 'cboKPFRep'
		};
		vArr.push(vDiff);
	}
}

function fKPFValAddRepSCC(vArr, vIdTree, vObjId) {
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
	for (var i = 0; i < vModGrid.length; i++) {
		if (vModGrid[i].esSCC == "true") {
			vEnc = true;
		}
	}

	if (!vEnc && vModGrid.length > 0) {
		var vDiff = {
			id : vIdTree,
			label : vLblDes
					+ ' - <font color="red"><b>Al menos un representante debe ser SCC.</b></font>',
			obj : 'cboKPFRepSCC'
		};
		vArr.push(vDiff);
	}
}

function fKPFValAddOIn(vArr, vIdTree, vObjId) {
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
			obj : 'cboKPFOIn'
		};
		vArr.push(vDiff);
	}
}

function fKPFValFocus(vItem) {
	if (vItem.obj) {
		dijit.byId('dlgKPFDiffShow').onCancel();
		var vObj = dijit.byId(String(vItem.obj));
		if (vObj) {
			if (vObj.isFocusable()) {
				vObj.focus();
			}
		}
	}
}

function fKPFDataLoad(vUser, vProfileKey) {
	// Espera
	fWaitMsgBoxIni("Consultando",
			[ "Se est&aacute; procesando la consulta de KYC..." ]);

	// Perfil
	var vRO = true;
	if (vProfileKey == "OPERADOR") {
		vRO = false;
	}

	// KYC Personas Fisicas
	require(
			[ "dojo/request", "dojox/grid/DataGrid",
					"dojo/data/ItemFileWriteStore", "dojo/domReady!" ],
			function(request, DataGrid, ItemFileWriteStore) {

				var vURL = fGetURLSvc("KYCService/getKYCPersFis?cache="
						+ fGetCacheRnd() + "&"
						+ document.getElementById("lblKPFEstado").parNumeroCUIL
						+ "&"
						+ document.getElementById("lblKPFEstado").parApellido
						+ "&"
						+ document.getElementById("lblKPFEstado").parNombre);
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
							var vRes = fKPFDataLoadVerify(vJSONA, vJSONO, vRO);
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
							dijit.byId("tpnKYCPersFisP1").set("open", true);
							dijit.byId("tpnKYCPersFisP2").set("open", true);
							dijit.byId("tpnKYCPersFisP3").set("open", true);
							dijit.byId("tpnKYCPersFisP4").set("open", true);

							// KYC Personas Fisicas
							fKPFDataLoadGral(vJSONA, vJSONO, vRO);
							fKPFDataLoadTpn1(vJSONA, vJSONO, vRO);
							fKPFDataLoadTpn2(vJSONA, vJSONO, vRO);
							fKPFDataLoadTpn3(vJSONA, vJSONO, vRO);
							fKPFDataLoadTpn4(vJSONA, vJSONO);

							// Representantes / Rep SCC
							// Guardar el original
							document.getElementById("hdgrKPFRepLista").value = JSON
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

							if (dijit.byId("dgrKPFRepLista") == null) {
								oGrid = new DataGrid({
									id : "dgrKPFRepLista",
									store : jsonDataSourceRep,
									structure : layout,
									rowSelector : "25px",
									rowCount : 20,
									style : 'width: 610px; height: 80px;',
									selectionMode : "single",
									onRowDblClick : function() {
										fKPFRepUpd();
									}
								}, "_divKPFRepLista");

								oGrid.startup();
							} else {
								dijit.byId("dgrKPFRepLista").setStructure(
										layout);
								dijit.byId("dgrKPFRepLista").setStore(
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
								width : "180px"
							}, {
								name : "Nombre",
								field : "nombre",
								width : "180px"
							}, {
								name : "SCC",
								field : "esSCC",
								formatter : fDgrColBln,
								width : "40px"
							}, {
								name : "PEP",
								field : "esPEP",
								formatter : fDgrColBln,
								width : "40px"
							} ] ];

							if (dijit.byId("dgrKPFRepSCCLista") == null) {
								oGrid = new DataGrid({
									id : "dgrKPFRepSCCLista",
									store : jsonDataSourceRep,
									structure : layout,
									rowSelector : "25px",
									rowCount : 20,
									style : 'width: 670px; height: 80px;',
									selectionMode : "single",
									onRowDblClick : function() {
										fKPFRepSCCUpd();
									}
								}, "_divKPFRepSCCLista");

								oGrid.startup();
							} else {
								dijit.byId("dgrKPFRepSCCLista").setStructure(
										layout);
								dijit.byId("dgrKPFRepSCCLista").setStore(
										jsonDataSourceRep);
							}

							// Operaciones Inusuales
							// Guardar el original
							document.getElementById("hdgrKPFOInLista").canOrig = vJSONO.opeInusualList.length;
							document.getElementById("hdgrKPFOInLista").value = JSON
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

							if (dijit.byId("dgrKPFOInLista") == null) {
								oGrid = new DataGrid({
									id : "dgrKPFOInLista",
									store : jsonDataSourceOIn,
									structure : layout,
									rowSelector : "25px",
									rowCount : 20,
									style : 'width: 720px; height: 80px;',
									selectionMode : "single",
									onMouseOver : function() {
										fKPFHelpIn(this.id);
									}
								}, "_divKPFOInLista");

								oGrid.startup();
							} else {
								dijit.byId("dgrKPFOInLista").setStructure(
										layout);
								dijit.byId("dgrKPFOInLista").setStore(
										jsonDataSourceOIn);
							}

							// Mensaje de exito
							fWaitMsgBoxUpd(0, "Datos KYC cargados.", "O");
							fWaitMsgBoxClose();
							dijit.byId("dlgWait").onCancel();

							// Cerrar Dialog
							dijit.byId('dlgKPFFinder').onCancel();

							fMnuDeselect();
						});
			});
}

function fKPFDataLoadVerify(vJSONA, vJSONO, vRO) {
	var vRet = "O";
	fKPFReadOnly(vRO);

	if (!vRO) {
		// Si NO es ReadOnly
		if (document.getElementById("lblKPFEstado").parTipoAcc == "tipoAcc=O") {
			// Si entra para ver el Original
			fKPFReadOnly(true);
			dijit.byId("btnKPFImprimir").set("disabled", false);
			dijit.byId("btnKPFOriginal").set("label", "Ver KYC Pendiente...");
			document.getElementById("divKPFOriginal").style.display = "block";
			document.getElementById("divKPFOriginal").mark = "V";
			vRet = "E";
		} else {
			// Si entra desde Formularios
			if (vJSONO.estadoKYC.codigo == "P"
					|| vJSONA.estadoKYC.codigo == "P") {
				fKPFReadOnly(true);
				fWaitMsgBoxUpd(
						0,
						"El KYC encontrado no corresponde a una persona f&iacute;sica.",
						"W");
				fWaitMsgBoxClose();
				vRet = "N";
			} else if (vJSONO.estadoKYC.codigo == "X"
					&& vJSONA.estadoKYC.codigo == "X") {
				fKPFReadOnly(true);
				fWaitMsgBoxUpd(
						0,
						"No se encontr&oacute; informaci&oacute;n para los datos ingresados.<br/>"
								+ "Esto se puede deber a que:<br/>"
								+ "<ul>"
								+ "<li>Se necesita una b&uacute;squeda m&aacute;s precisa<br/>"
								+ "ingresando apellido y nombre.</li>"
								+ "<li>No existe un cliente con los datos ingresados.<br/>"
								+ "Es posible que la p&oacute;liza del cliente no se haya<br/>"
								+ "procesado a&uacute;n</li>" + "</ul>", "W");
				fWaitMsgBoxClose();
				vRet = "N";
			} else if (vJSONO.estadoKYC.codigo == "X"
					&& vJSONA.estadoKYC.codigo == "N") {
				dijit.byId("tpnKPFHelp").set("style", "display:block;");
				dijit.byId("btnKPFImprimir").set("disabled", true);
				dijit.byId("btnKPFDiff").set("disabled", true);
				vRet = "S";
			} else if ((vJSONO.estadoKYC.codigo == "O" || vJSONO.estadoKYC.codigo == "V")
					&& (vJSONA.estadoKYC.codigo == "X" || vJSONA.estadoKYC.codigo == "N")) {
				dijit.byId("tpnKPFHelp").set("style", "display:block;");
				vRet = "U";
			} else if (vJSONO.estadoKYC.codigo == "X"
					&& (vJSONA.estadoKYC.codigo == "A" || vJSONA.estadoKYC.codigo == "I")) {
				fKPFReadOnly(true);
				vRet = "R";
			} else if ((vJSONO.estadoKYC.codigo == "O" || vJSONO.estadoKYC.codigo == "V")
					&& (vJSONA.estadoKYC.codigo == "A" || vJSONA.estadoKYC.codigo == "I")) {
				fKPFReadOnly(true);
				dijit.byId("btnKPFDiff").set("disabled", false);
				document.getElementById("divKPFOriginal").style.display = "block";
				document.getElementById("divKPFOriginal").mark = "O";
				vRet = "R";
			}
		}
	} else {
		// Si es ReadOnly
		if (document.getElementById("lblKPFEstado").parTipoAcc == "tipoAcc=A") {
			// Si entra para Aprobar
			if (vJSONO.estadoKYC.codigo == "X"
					&& (vJSONA.estadoKYC.codigo == "A" || vJSONA.estadoKYC.codigo == "I")) {
				vRet = "O";
			} else if ((vJSONO.estadoKYC.codigo == "O" || vJSONO.estadoKYC.codigo == "V")
					&& (vJSONA.estadoKYC.codigo == "A" || vJSONA.estadoKYC.codigo == "I")) {
				dijit.byId("btnKPFDiff").set("disabled", false);
				vRet = "O";
			}
			dijit.byId("btnKPFOriginal").set("label",
					"Ir a aprobaci&oacute;n...");
			document.getElementById("divKPFOriginal").style.display = "block";
			document.getElementById("divKPFOriginal").mark = "A";
		} else {
			// Si entra para Consultar
			if (vJSONO.estadoKYC.codigo == "P"
					|| vJSONA.estadoKYC.codigo == "P") {
				fWaitMsgBoxUpd(
						0,
						"El KYC encontrado no corresponde a una persona f&iacute;sica.",
						"W");
				fWaitMsgBoxClose();
				vRet = "N";
			} else if (vJSONO.estadoKYC.codigo == "X"
					&& (vJSONA.estadoKYC.codigo == "X"
							|| vJSONA.estadoKYC.codigo == "N"
							|| vJSONA.estadoKYC.codigo == "A" || vJSONA.estadoKYC.codigo == "I")) {
				fWaitMsgBoxUpd(
						0,
						"No se encontr&oacute; un KYC con el CUIL/CUIT/CDI ingresado.",
						"W");
				fWaitMsgBoxClose();
				vRet = "N";
			} else if ((vJSONO.estadoKYC.codigo == "O" || vJSONO.estadoKYC.codigo == "V")
					&& (vJSONA.estadoKYC.codigo == "X"
							|| vJSONA.estadoKYC.codigo == "N"
							|| vJSONA.estadoKYC.codigo == "A" || vJSONA.estadoKYC.codigo == "I")) {
				dijit.byId("btnKPFImprimir").set("disabled", false);
				vRet = "V";
			}
		}
	}

	return vRet;
}

function fKPFDataLoadGral(vJSONA, vJSONO, vRO) {
	// Generales
	document.getElementById("lblKPFEstado").innerHTML = vJSONA.estadoKYC.descripcion;
	document.getElementById("lblKPFEstado").origValue = vJSONA.estadoKYC.codigo;
	document.getElementById("lblKPFEstado").esReadOnly = vRO;
	// Datos de AIS para grabacion
	document.getElementById("lblKPFEstado").perfilObligenAIS = vJSONA.perfilObligenAIS;
	document.getElementById("lblKPFEstado").tipoOperacion = vJSONA.tipoOperacion;
	document.getElementById("lblKPFEstado").vigenciaDesde = vJSONA.vigenciaDesde;
	document.getElementById("lblKPFEstado").vigenciaHasta = vJSONA.vigenciaHasta;
	// Otros Datos
	dijit.byId("txtKPFOpePSoft").set("value", vJSONA.operador.peopleSoft);
	dijit.byId("txtKPFOpeNombre").set("value",
			vJSONA.operador.lName + ", " + vJSONA.operador.fName);
	dijit.byId("txtKPFOpeFecha").set("value", fDgrColFec(vJSONA.opeFechaUpd));
	if (vJSONA.supervisor.peopleSoft != "") {
		dijit.byId("txtKPFSupPSoft").set("value", vJSONA.supervisor.peopleSoft);
		dijit.byId("txtKPFSupNombre").set("value",
				vJSONA.supervisor.lName + ", " + vJSONA.supervisor.fName);
		dijit.byId("txtKPFSupFecha").set("value",
				fDgrColFec(vJSONA.supFechaUpd));
		dijit.byId("txtKPFSupComentario").set("value", vJSONA.supComentario);
	}
	if (vJSONA.compliance.peopleSoft != "") {
		dijit.byId("txtKPFComPSoft").set("value", vJSONA.compliance.peopleSoft);
		dijit.byId("txtKPFComNombre").set("value",
				vJSONA.compliance.lName + ", " + vJSONA.compliance.fName);
		dijit.byId("txtKPFComFecha").set("value",
				fDgrColFec(vJSONA.comFechaUpd));
		dijit.byId("txtKPFComComentario").set("value", vJSONA.comComentario);
	}
}

function fKPFDataLoadTpn1(vJSONA, vJSONO, vRO) {
	fComboAdd("cboKPFTipDoc", vJSONA.tipoDoc);
	dijit.byId("cboKPFTipDoc").set("value", vJSONA.tipoDoc.id);
	dijit.byId("txtKPFNroDoc").set("value", vJSONA.numeroDoc);
	dijit.byId("txtKPFCUIL").set("value", vJSONA.numeroCUIL);
	dijit.byId("txtKPFApellido").set("value", vJSONA.apellido);
	dijit.byId("txtKPFNombre").set("value", vJSONA.nombre);
	dijit.byId("cboKPFNacionalidad").set("value", vJSONA.nacionalidad.id);
	// fecha nacimiento desde aquiedu
	dijit.byId("txtKPFFechaNacim").set("value",
			fFormatDTB(vJSONA.fechaNacimiento));
	// fecha nacimiento hasta aquiedu
	dijit.byId("txtKPFDirCalle").set("value", vJSONA.dirCalle, false);
	dijit.byId("txtKPFDirNumero").set("value", vJSONA.dirNumero, false);
	dijit.byId("txtKPFDirPiso").set("value", vJSONA.dirPiso);
	dijit.byId("txtKPFDirDepto").set("value", vJSONA.dirDepto);
	dijit.byId("cboKPFDirProv").set("value", vJSONA.dirProvincia.id, false);
	fCPProvSel('KPF');
	dijit.byId("txtKPFDirLocal").set("value", vJSONA.dirLocalidad, false);
	// Si es ReadOnly la deshabilito
	if (vRO) {
		dijit.byId("txtKPFDirLocal").set("disabled", true);
	}
	dijit.byId("txtKPFDirCP").set("value", vJSONA.dirCodigoPostal);
	dijit.byId("txtKPFTelefono").set("value", vJSONA.telefono);
	dijit.byId("txtKPFEmail").set("value", vJSONA.email);
	dijit.byId("cboKPFRep").set("value", vJSONA.tieneRep ? "S" : "N");
	dijit.byId("cboKPFTitMPg").set("value", vJSONA.esTitMPago ? "S" : "N");
	if (!vJSONA.esTitMPago) {
		dijit.byId("cboKPFTitMPgTipDoc").set("value",
				vJSONA.titMPagoList[0].tipoDoc.id);
		dijit.byId("txtKPFTitMPgNroDoc").set("value",
				vJSONA.titMPagoList[0].numeroDoc);
		dijit.byId("txtKPFTitMPgApellido").set("value",
				vJSONA.titMPagoList[0].apellido);
		dijit.byId("txtKPFTitMPgNombre").set("value",
				vJSONA.titMPagoList[0].nombre);
		dijit.byId("txtKPFTitMPgMedioPago").set("value",
				vJSONA.titMPagoList[0].medioPago);
	}
	// Valores Originales
	dijit.byId("txtKPFApellido").set("origValue", vJSONO.apellido);
	dijit.byId("txtKPFNombre").set("origValue", vJSONO.nombre);
	dijit.byId("cboKPFNacionalidad").set("origValue", vJSONO.nacionalidad.id);
	dijit.byId("cboKPFNacionalidad").set("origDisplayedValue",
			vJSONO.nacionalidad.name);
	// fecha nacimiento
	dijit.byId("txtKPFFechaNacim").set("origValue",
			fFormatDTB(vJSONA.fechaNacimiento));

	dijit.byId("txtKPFDirCalle").set("origValue", vJSONO.dirCalle);
	dijit.byId("txtKPFDirNumero").set("origValue", vJSONO.dirNumero);
	dijit.byId("txtKPFDirPiso").set("origValue", vJSONO.dirPiso);
	dijit.byId("txtKPFDirDepto").set("origValue", vJSONO.dirDepto);
	dijit.byId("cboKPFDirProv").set("origValue", vJSONO.dirProvincia.id);
	dijit.byId("cboKPFDirProv").set("origDisplayedValue",
			vJSONO.dirProvincia.name);
	dijit.byId("txtKPFDirLocal").set("origValue", vJSONO.dirLocalidad);
	dijit.byId("txtKPFDirCP").set("origValue", vJSONO.dirCodigoPostal);
	dijit.byId("txtKPFTelefono").set("origValue", vJSONO.telefono);
	dijit.byId("txtKPFEmail").set("origValue", vJSONO.email);
	dijit.byId("cboKPFRep").set("origValue", vJSONO.tieneRep ? "S" : "N");
	dijit.byId("cboKPFRep").set("origDisplayedValue",
			fDgrColBln(vJSONO.tieneRep));
	dijit.byId("cboKPFTitMPg").set("origValue", vJSONO.esTitMPago ? "S" : "N");
	dijit.byId("cboKPFTitMPg").set("origDisplayedValue",
			fDgrColBln(vJSONO.esTitMPago));
	if (!vJSONO.esTitMPago) {
		dijit.byId("cboKPFTitMPgTipDoc").set("origValue",
				vJSONO.titMPagoList[0].tipoDoc.id);
		dijit.byId("cboKPFTitMPgTipDoc").set("origDisplayedValue",
				vJSONO.titMPagoList[0].tipoDoc.name);
		dijit.byId("txtKPFTitMPgNroDoc").set("origValue",
				vJSONO.titMPagoList[0].numeroDoc);
		dijit.byId("txtKPFTitMPgApellido").set("origValue",
				vJSONO.titMPagoList[0].apellido);
		dijit.byId("txtKPFTitMPgNombre").set("origValue",
				vJSONO.titMPagoList[0].nombre);
		dijit.byId("txtKPFTitMPgMedioPago").set("origValue",
				vJSONO.titMPagoList[0].medioPago);
	} else {
		dijit.byId("cboKPFTitMPgTipDoc").set("origValue", 0);
		dijit.byId("cboKPFTitMPgTipDoc").set("origDisplayedValue", "");
		dijit.byId("txtKPFTitMPgNroDoc").set("origValue", 0);
		dijit.byId("txtKPFTitMPgApellido").set("origValue", "");
		dijit.byId("txtKPFTitMPgNombre").set("origValue", "");
		dijit.byId("txtKPFTitMPgMedioPago").set("origValue", "");
	}
}

function fKPFDataLoadTpn2(vJSONA, vJSONO, vRO) {
	fComboAdd("cboKPFActividad", vJSONA.actividad);
	dijit.byId("cboKPFActividad").set("value", vJSONA.actividad.id);
	dijit.byId("txtKPFActivDes").set("value", vJSONA.actividadDes);
	dijit.byId("txtKPFPropositoDes").set("value", vJSONA.propositoDes);
	dijit.byId("cboKPFSCC").set("value", vJSONA.esSCC ? "S" : "N");
	dijit.byId("txtKPFSCCMot").set("value", vJSONA.motivoSCC);
	dijit.byId("cboKPFPEP").set("value", vJSONA.esPEP ? "S" : "N");
	dijit.byId("cboKPFRepSCC").set("value", vJSONA.tieneRepSCC ? "S" : "N");
	dijit.byId("cboKPFBco").set("value", vJSONA.esClienteBco ? "S" : "N");
	dijit.byId("cboKPFCondIVA").set("value", vJSONA.condicionIVA.id);
	dijit.byId("cboKPFCondLab").set("value", vJSONA.condicionLab, false);
	fKPFCondLabShow(dijit.byId("cboKPFCondLab").get("value"));
	dijit.byId("txtKPFCIVACatMono").set("value", vJSONA.categoriaMono);
	dijit.byId("txtKPFIngFecha").set("value", fFormatDTB(vJSONA.ingFecha));
	dijit.byId("txtKPFIngSMe").set("value", vJSONA.ingSalMen, false);
	dijit.byId("txtKPFIngSal").set("value", vJSONA.ingSalario, false);
	dijit.byId("txtKPFIngGan").set("value", vJSONA.ingGanancia, false);
	dijit.byId("txtKPFIngOtros").set("value", vJSONA.ingOtros, false);
	dijit.byId("txtKPFIngTotal").set("value", vJSONA.ingTotal);
	dijit.byId("txtKPFDocResDet").set("value", vJSONA.docResDetalle);
	dijit.byId("cboKPFRel").set("value", vJSONA.tieneRelHSBC ? "S" : "N");
	dijit.byId("txtKPFRelDet").set("value", vJSONA.relDetalle);
	dijit.byId("txtKPFIniAnn").set("value", vJSONA.inicioAnn);
	// Valores Originales
	dijit.byId("cboKPFActividad").set("origValue", vJSONO.actividad.id);
	dijit.byId("cboKPFActividad").set("origDisplayedValue",
			vJSONO.actividad.name);
	dijit.byId("txtKPFActivDes").set("origValue", vJSONO.actividadDes);
	dijit.byId("txtKPFPropositoDes").set("origValue", vJSONO.propositoDes);
	dijit.byId("cboKPFSCC").set("origValue", vJSONO.esSCC ? "S" : "N");
	dijit.byId("cboKPFSCC").set("origDisplayedValue", fDgrColBln(vJSONO.esSCC));
	dijit.byId("txtKPFSCCMot").set("origValue", vJSONO.motivoSCC);
	dijit.byId("cboKPFPEP").set("origValue", vJSONO.esPEP ? "S" : "N");
	dijit.byId("cboKPFPEP").set("origDisplayedValue", fDgrColBln(vJSONO.esPEP));
	dijit.byId("cboKPFRepSCC").set("origValue", vJSONO.tieneRepSCC ? "S" : "N");
	dijit.byId("cboKPFRepSCC").set("origDisplayedValue",
			fDgrColBln(vJSONO.tieneRepSCC));
	dijit.byId("cboKPFBco").set("origValue", vJSONO.esClienteBco ? "S" : "N");
	dijit.byId("cboKPFBco").set("origDisplayedValue",
			fDgrColBln(vJSONO.esClienteBco));
	dijit.byId("cboKPFCondIVA").set("origValue", vJSONO.condicionIVA.id);
	dijit.byId("cboKPFCondIVA").set("origDisplayedValue",
			vJSONO.condicionIVA.name);
	dijit.byId("cboKPFCondLab").set("origValue", vJSONO.condicionLab);
	dijit.byId("cboKPFCondLab")
			.set(
					"origDisplayedValue",
					vJSONO.condicionLab == "R" ? "RELACION DE DEPENDENCIA"
							: "AUTONOMO");
	dijit.byId("txtKPFCIVACatMono").set("origValue", vJSONO.categoriaMono);
	dijit.byId("txtKPFIngFecha").set("origValue", fFormatDTB(vJSONO.ingFecha));
	dijit.byId("txtKPFIngSMe").set("origValue", vJSONO.ingSalMen);
	dijit.byId("txtKPFIngSal").set("origValue", vJSONO.ingSalario);
	dijit.byId("txtKPFIngGan").set("origValue", vJSONO.ingGanancia);
	dijit.byId("txtKPFIngOtros").set("origValue", vJSONO.ingOtros);
	dijit.byId("txtKPFIngTotal").set("origValue", vJSONO.ingTotal);
	dijit.byId("txtKPFDocResDet").set("origValue", vJSONO.docResDetalle);
	dijit.byId("cboKPFRel").set("origValue", vJSONO.tieneRelHSBC ? "S" : "N");
	dijit.byId("cboKPFRel").set("origDisplayedValue",
			fDgrColBln(vJSONO.tieneRelHSBC));
	dijit.byId("txtKPFRelDet").set("origValue", vJSONO.relDetalle);
	dijit.byId("txtKPFIniAnn").set("origValue", vJSONO.inicioAnn);
	// Si no es ReadOnly pongo los valores del AIS
	if (!vRO) {
		dijit.byId("cboKPFSCC").set("value", vJSONA.esSCCenAIS ? "S" : "N");
		dijit.byId("cboKPFPEP").set("value", vJSONA.esPEPenAIS ? "S" : "N");
		if (vJSONA.esSCCenAIS) {
			dijit.byId("cboKPFSCC").set("disabled", true);
		}
		if (vJSONA.esPEPenAIS) {
			dijit.byId("cboKPFPEP").set("disabled", true);
		}
	}
}

function fKPFDataLoadTpn3(vJSONA, vJSONO, vRO) {
	dijit.byId("txtKPFValOpe").set("value", vJSONA.valorOperar);
	dijit.byId("txtKPFAcuPri").set("value", vJSONA.primaAnual);
	dijit.byId("txtKPFValOpeMot").set("value", vJSONA.valorOperarMot);
	dijit.byId("txtKPFComent").set("value", vJSONA.perfilComentarios);
	dijit.byId("txtKPFUltFec").set("value", fFormatDTB(vJSONA.ultFecha));
	// Valores Originales
	dijit.byId("txtKPFValOpe").set("origValue", vJSONO.valorOperar);
	dijit.byId("txtKPFAcuPri").set("origValue", vJSONO.primaAnual);
	dijit.byId("txtKPFValOpeMot").set("origValue", vJSONO.valorOperarMot);
	dijit.byId("txtKPFComent").set("origValue", vJSONO.perfilComentarios);
	// Si no es ReadOnly pongo los valores del AIS
	if (!vRO) {
		dijit.byId("txtKPFAcuPri").set("value", vJSONA.primaAnualenAIS);
	}
}

function fKPFDataLoadTpn4(vJSONA, vJSONO) {
	// Valores Originales
	dijit.byId("cboKPFOIn").set("value",
			vJSONA.opeInusualList.length > 0 ? "S" : "N");
	// Valores Originales
	dijit.byId("cboKPFOIn").set("origValue",
			vJSONO.opeInusualList.length > 0 ? "S" : "N");
	dijit.byId("cboKPFOIn").set("origDisplayedValue",
			fDgrColBln(vJSONO.opeInusualList.length > 0));
}

function fKPFRepNew() {
	var oGrid = dijit.byId("dgrKPFRepLista");
	oGrid.selection.setSelected(oGrid.selection.selectedIndex, false);

	// Verificar que no se pase del maximo permitido
	if (oGrid.store._arrayOfTopLevelItems.length < 10) {
		dijit.byId("tpnKYCRepEdit").set("style", "width: 650px;height: 140px;");
		dijit.byId("tpnKYCRepEdit").set("open", true);
		fKPFReadOnlyRep(false);
	} else {
		fMsgBox("No se pueden cargar m&aacute;s representantes.",
				"Advertencia", "W");
	}
}

function fKPFRepUpd() {
	var oGrid = dijit.byId("dgrKPFRepLista");
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
						fKPFReadOnlyRep(false);
						dijit.byId("cboKPFRepTipDoc").set("disabled", true);
						dijit.byId("txtKPFRepNroDoc").set("disabled", true);
						dijit.byId("cboKPFRepTipDoc").set("value",
								selectedItem.tipoDoc[0].id[0]);
						dijit.byId("txtKPFRepNroDoc").set("value",
								selectedItem.numeroDoc);
						dijit.byId("txtKPFRepApellido").set("value",
								selectedItem.apellido);
						dijit.byId("txtKPFRepNombre").set("value",
								selectedItem.nombre);
						dijit.byId("txtKPFFechaNac").set("value",
								fFormatDTB(selectedItem.fechaConstitNacim));
					}
				});
	}
}

function fKPFRepDel() {
	// Abrir panel 2
	dijit.byId("tpnKYCPersFisP2").set("open", true);

	var oGrid = dijit.byId("dgrKPFRepLista");
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

function fKPFRepApl() {
	// Validar Representante
	if (dijit.byId("cboKPFRepTipDoc").get("value") == "") {
		fMsgBox("Debe seleccionar un tipo de documento.", "Advertencia", "W");
		return;
	}
	if (isNaN(dijit.byId("txtKPFRepNroDoc").get("value"))
			|| dijit.byId("txtKPFRepNroDoc").get("value") == 0) {
		fMsgBox("Debe ingresar un n&uacute;mero de documento.", "Advertencia",
				"W");
		return;
	}
	if (String(dijit.byId("txtKPFRepApellido").get("value")).length == 0
			|| !fValType("A", String(dijit.byId("txtKPFRepApellido").get(
					"value")))) {
		fMsgBox("Debe ingresar un apellido v&aacute;lido.", "Advertencia", "W");
		return;
	}
	if (String(dijit.byId("txtKPFRepNombre").get("value")).length == 0
			|| !fValType("A",
					String(dijit.byId("txtKPFRepNombre").get("value")))) {
		fMsgBox("Debe ingresar un nombre v&aacute;lido.", "Advertencia", "W");
		return;
	}
	if (dijit.byId("txtKPFFechaNac").get("value") == null) {
		fMsgBox("Debe ingresar una fecha v&aacute;lida.", "Advertencia", "W");
		return;
	}

	// Abrir panel 2
	dijit.byId("tpnKYCPersFisP2").set("open", true);

	var oGrid = dijit.byId("dgrKPFRepLista");
	var jsonDataSource = oGrid.store;
	var vEnc = false;

	// Buscar si existe
	jsonDataSource.fetch({
		query : {
			numeroDoc : dijit.byId("txtKPFRepNroDoc").get("value")
		},
		onItem : function(item) {
			jsonDataSource.setValue(item, 'apellido', dijit.byId(
					"txtKPFRepApellido").get("value"));
			jsonDataSource.setValue(item, 'nombre', dijit.byId(
					"txtKPFRepNombre").get("value"));
			jsonDataSource.setValue(item, 'fechaConstitNacim', dojo.date.locale
					.format(dijit.byId("txtKPFFechaNac").get("value"), {
						datePattern : "yyyyMMdd",
						selector : "date"
					}));
			vEnc = true;
		}
	});
	if (!vEnc) {
		var vNewItem = {
			tipoDoc : {
				id : dijit.byId("cboKPFRepTipDoc").get("value"),
				name : dijit.byId("cboKPFRepTipDoc").get("displayedValue")
			},
			numeroDoc : dijit.byId("txtKPFRepNroDoc").get("value"),
			apellido : dijit.byId("txtKPFRepApellido").get("value"),
			nombre : dijit.byId("txtKPFRepNombre").get("value"),
			fechaConstitNacim : dojo.date.locale.format(dijit.byId(
					"txtKPFFechaNac").get("value"), {
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
	fKPFReadOnlyRep(true);
	fKPFCleanRep();
}

function fKPFRepCan() {
	var oGrid = dijit.byId("dgrKPFRepLista");
	oGrid.selection.setSelected(oGrid.selection.selectedIndex, false);
	// Limpiar
	fKPFReadOnlyRep(true);
	fKPFCleanRep();
}

function fKPFRepSCCUpd() {
	var oGrid = dijit.byId("dgrKPFRepSCCLista");
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
				fKPFReadOnlyRepSCC(false);
				dijit.byId("cboKPFRepSCCTipDoc").set("value",
						selectedItem.tipoDoc[0].id[0]);
				dijit.byId("txtKPFRepSCCNroDoc").set("value",
						selectedItem.numeroDoc);
				dijit.byId("cboKPFRepSCCSCC").set("value",
						selectedItem.esSCC == "true" ? "S" : "N");
				dijit.byId("cboKPFRepSCCPEP").set("value",
						selectedItem.esPEP == "true" ? "S" : "N");
			}
		});
	}
}

function fKPFRepSCCApl() {
	// Validar
	if (dijit.byId("cboKPFRepSCCSCC").get("value") == "") {
		fMsgBox("Debe seleccionar si el representante es SCC.", "Advertencia",
				"W");
		return;
	}
	if (dijit.byId("cboKPFRepSCCPEP").get("value") == "") {
		fMsgBox("Debe seleccionar si el representante es PEP.", "Advertencia",
				"W");
		return;
	}
	if (dijit.byId("cboKPFRepSCCSCC").get("value") == "N"
			&& dijit.byId("cboKPFRepSCCPEP").get("value") == "S") {
		fMsgBox("El representante no puede ser PEP si no es SCC.",
				"Advertencia", "W");
		return;
	}

	// Abrir panel 1
	dijit.byId("tpnKYCPersFisP1").set("open", true);

	var oGrid = dijit.byId("dgrKPFRepLista");
	var jsonDataSource = oGrid.store;

	// Buscar
	jsonDataSource.fetch({
		query : {
			numeroDoc : dijit.byId("txtKPFRepSCCNroDoc").get("value")
		},
		onItem : function(item) {
			jsonDataSource
					.setValue(item, 'esSCC', dijit.byId("cboKPFRepSCCSCC").get(
							"value") == "S" ? true : false);
			jsonDataSource
					.setValue(item, 'esPEP', dijit.byId("cboKPFRepSCCPEP").get(
							"value") == "S" ? true : false);
		}
	});

	oGrid.setStore(jsonDataSource);
	oGrid.update();

	// Limpiar
	fKPFReadOnlyRepSCC(true);
	fKPFCleanRepSCC();
}

function fKPFRepSCCCan() {
	var oGrid = dijit.byId("dgrKPFRepSCCLista");
	oGrid.selection.setSelected(oGrid.selection.selectedIndex, false);
	// Limpiar
	fKPFReadOnlyRepSCC(true);
	fKPFCleanRepSCC();
}

function fKPFOInNew() {
	var oGrid = dijit.byId("dgrKPFOInLista");
	oGrid.selection.setSelected(oGrid.selection.selectedIndex, false);

	// Verificar que no se pase del maximo permitido
	if (oGrid.store._arrayOfTopLevelItems.length < 10) {
		dijit.byId("tpnKYCOInEdit").set("style", "width: 720px;height: 140px;");
		dijit.byId("tpnKYCOInEdit").set("open", true);
		document.getElementById("hdgrKPFOInLista").canOrig = parseInt(document
				.getElementById("hdgrKPFOInLista").canOrig) + 1;
		dijit.byId("txtKPFOInTipOpe").set("secuencia",
				document.getElementById("hdgrKPFOInLista").canOrig);
		fKPFReadOnlyOIn(false);
	} else {
		fMsgBox("No se pueden cargar m&aacute;s operaciones.", "Advertencia",
				"W");
	}
}

function fKPFOInUpd() {
	var oGrid = dijit.byId("dgrKPFOInLista");
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
				fKPFReadOnlyOIn(false);
				dijit.byId("txtKPFOInTipOpe").set("secuencia",
						selectedItem.secuencia);
				dijit.byId("txtKPFOInFecha").set("value",
						fFormatDTB(selectedItem.fecha));
				dijit.byId("txtKPFOInTipOpe").set("value",
						selectedItem.tipoOperacion);
				dijit.byId("txtKPFOInOriFon").set("value",
						selectedItem.origenFondos);
				dijit.byId("txtKPFOInMonto").set("value",
						parseFloat(selectedItem.monto));
				dijit.byId("txtKPFOInObserv").set("value",
						selectedItem.observacion);
			}
		});
	}
}

function fKPFOInDel() {
	var oGrid = dijit.byId("dgrKPFOInLista");
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

function fKPFOInApl() {
	// Validar
	if (dijit.byId("txtKPFOInFecha").get("value") == null) {
		fMsgBox("Debe seleccionar una fecha.", "Advertencia", "W");
		return;
	}
	if (String(dijit.byId("txtKPFOInTipOpe").get("value")).length == 0) {
		fMsgBox("Debe ingresar un tipo de operaci&oacute;n.", "Advertencia",
				"W");
		return;
	} else if (!fValType("R",
			String(dijit.byId("txtKPFOInTipOpe").get("value")))) {
		fMsgBox(
				"El tipo de operaci&oacute;n tienen caracteres inv&aacute;lidos.",
				"Advertencia", "W");
		return;
	}
	if (String(dijit.byId("txtKPFOInOriFon").get("value")).length == 0) {
		fMsgBox("Debe ingresar el origen de los fondos.", "Advertencia", "W");
		return;
	} else if (!fValType("R",
			String(dijit.byId("txtKPFOInOriFon").get("value")))) {
		fMsgBox("El origen de los fondos tienen caracteres inv&aacute;lidos.",
				"Advertencia", "W");
		return;
	}
	if (isNaN(dijit.byId("txtKPFOInMonto").get("value"))
			|| dijit.byId("txtKPFOInMonto").get("value") == 0) {
		fMsgBox("Debe ingresar un monto.", "Advertencia", "W");
		return;
	}
	if (!fValType("R", String(dijit.byId("txtKPFOInObserv").get("value")))) {
		fMsgBox("La observaci&oacute;n tienen caracteres inv&aacute;lidos.",
				"Advertencia", "W");
		return;
	}

	var oGrid = dijit.byId("dgrKPFOInLista");
	var jsonDataSource = oGrid.store;
	var vEnc = false;

	// Buscar si existe
	jsonDataSource
			.fetch({
				query : {
					secuencia : parseInt(dijit.byId("txtKPFOInTipOpe").get(
							"secuencia"))
				},
				onItem : function(item) {
					jsonDataSource.setValue(item, 'fecha', dojo.date.locale
							.format(dijit.byId("txtKPFOInFecha").get("value"),
									{
										datePattern : "yyyyMMdd",
										selector : "date"
									}));
					jsonDataSource.setValue(item, 'tipoOperacion', dijit.byId(
							"txtKPFOInTipOpe").get("value"));
					jsonDataSource.setValue(item, 'origenFondos', dijit.byId(
							"txtKPFOInOriFon").get("value"));
					jsonDataSource.setValue(item, 'monto', dijit.byId(
							"txtKPFOInMonto").get("value"));
					jsonDataSource.setValue(item, 'observacion', dijit.byId(
							"txtKPFOInObserv").get("value"));
					vEnc = true;
				}
			});

	if (!vEnc) {
		var vNewItem = {
			secuencia : parseInt(dijit.byId("txtKPFOInTipOpe").get("secuencia")),
			fecha : dojo.date.locale.format(dijit.byId("txtKPFOInFecha").get(
					"value"), {
				datePattern : "yyyyMMdd",
				selector : "date"
			}),
			tipoOperacion : dijit.byId("txtKPFOInTipOpe").get("value"),
			origenFondos : dijit.byId("txtKPFOInOriFon").get("value"),
			monto : dijit.byId("txtKPFOInMonto").get("value"),
			observacion : dijit.byId("txtKPFOInObserv").get("value")
		};
		jsonDataSource.newItem(vNewItem);
	}

	oGrid.setStore(jsonDataSource);
	oGrid.update();

	// Limpiar
	fKPFReadOnlyOIn(true);
	fKPFCleanOIn();
}

function fKPFOInCan() {
	var oGrid = dijit.byId("dgrKPFOInLista");
	oGrid.selection.setSelected(oGrid.selection.selectedIndex, false);
	// Limpiar
	fKPFReadOnlyOIn(true);
	fKPFCleanOIn();
}

function fKPFActividadFilter() {
	// Validar
	if (String(dijit.byId("txtKPFActividad").get("value")).length < 5) {
		fMsgBox("Debe escribir un filtro de al menos 5 caracteres.",
				"Advertencia", "W");
		return;
	}

	fSessionValidate("fSessionVoid");

	// Limpiar el combo
	fComboClean("cboKPFActividad");
	dijit.byId("cboKPFActividad").set("disabled", true);

	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {

				var vURL = fGetURLSvc("ParametersService/getActividadList?filtroAct="
						+ dijit.byId("txtKPFActividad").get("value"));
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

							fComboLoad(response, "cboKPFActividad", 80);
							if (dijit.byId("cboKPFActividad").getOptions().length > 0)
								dijit.byId("cboKPFActividad").set("disabled",
										false);
						});
			});
}

function fKPFIngTotal(vNoPerfil) {
	var vSum = 0;
	vSum += dijit.byId("txtKPFIngSal").get("value");
	vSum += dijit.byId("txtKPFIngGan").get("value");
	vSum += dijit.byId("txtKPFIngOtros").get("value");
	if (isNaN(vSum)) {
		vSum = parseFloat(vSum);
	}
	// Calculo Total
	dijit.byId("txtKPFIngTotal").set("value", vSum);
	// Calculo Perfil
	if (vNoPerfil == "S") {
		return;
	} else {
		dijit.byId("txtKPFValOpe").set("value", vSum);
	}
}

function fKPFIngSalMen() {
	var vSum = 0;
	vSum = dijit.byId("txtKPFIngSMe").get("value") * 15;
	if (isNaN(vSum)) {
		vSum = parseFloat(vSum);
	}
	dijit.byId("txtKPFIngSal").set("value", vSum);
	// Calculo Total
	fKPFIngTotal();
}

function fKPFHelpIn(vId) {
	dijit.byId("btnKPFHelp").set("disabled", true);
	document.getElementById("divKPFHelpBtn").style.display = "none";
	document.getElementById("lblKPFHelp").allHTML = "";

	if (vId == "txtKPFComent") {
		document.getElementById("lblKPFHelp").innerHTML = "<b>Comentarios del perfil transaccional</b><br/>"
				+ "Indicar si el an&aacute;lisis del perfil es consistente con los seguros/operaciones contratadas. En caso de existir inconsistencias, reportar a Compliance.";
	} else if (vId == "txtKPFValOpeMot") {
		document.getElementById("lblKPFHelp").innerHTML = "<b>Motivo en caso de modificar el perfil transaccional</b><br/>"
				+ "Importante: El perfil transaccional deber&aacute; expresarse en pesos. Las cifras deber&aacute;n incluirse en valores absolutos y completos...";
		dijit.byId("btnKPFHelp").set("disabled", false);
		document.getElementById("divKPFHelpBtn").style.display = "block";
		document.getElementById("lblKPFHelp").allHTML = "<b>Motivo en caso de modificar el perfil transaccional</b><br/>"
				+ "<p align='justify' style='width:600px;'>"
				+ "Importante:<br/>"
				+ "El perfil transaccional deber&aacute; expresarse en pesos.<br/>"
				+ "Las cifras deber&aacute;n incluirse en valores absolutos y completos (no en miles o millones de pesos).<br/>"
				+ "La cifras deber&aacute;n incluir los ingresos del cliente correspondientes a 1 a&ntilde;o.<br/>"
				+ "El Perfil Transaccional nunca debe ser confeccionado o indicado en base al monto operado por el cliente, "
				+ "sino bas&aacute;ndose en la documentaci&oacute;n aportada por el mismo."
				+ "</p>";
	} else if (vId == "txtKPFDocResDet") {
		document.getElementById("lblKPFHelp").innerHTML = "<b>Detalle de la documentaci&oacute;n de respaldo</b><br/>"
				+ "La documentaci&oacute;n a considerar para la determinaci&oacute;n del perfil transaccional ser&aacute; la siguiente...";
		dijit.byId("btnKPFHelp").set("disabled", false);
		document.getElementById("divKPFHelpBtn").style.display = "block";
		document.getElementById("lblKPFHelp").allHTML = "<b>Detalle de la documentaci&oacute;n de respaldo</b><br/>"
				+ "<p align='justify' style='width:600px;'>"
				+ "La documentaci&oacute;n a considerar para la determinaci&oacute;n del perfil transaccional ser&aacute; la siguiente:<br/>"
				+ "<ul>"
				+ "<li>&Uacute;ltimo recibo de sueldo (Retribuci&oacute;n Fija)</li>"
				+ "<li>&Uacute;ltimos 6 recibos de sueldo (Retribuci&oacute;n variable)</li>"
				+ "<li>&Uacute;ltima DDJJ de ganancias + Ticket de presentaci&oacute;n y pago</li>"
				+ "<li>&Uacute;ltimos 3 pagos de IVA F 731 + Ticket de presentaci&oacute;n y pago</li>"
				+ "<li>&Uacute;ltimos 3 pagos de monotributo + Ticket de presentaci&oacute;n y pago</li>"
				+ "<li>Cuando el cliente perciba otros ingresos en forma independiente a su actividad, la documentaci&oacute;n<br/>"
				+ "de respaldo correspondiente deber&aacute; ser acorde con lo declarado por el cliente</li>"
				+ "</ul><br/>"
				+ "Valor a ingresar seg&uacute;n la documentaci&oacute;n de respaldo presentada:"
				+ "<ul>"
				+ "<li>Recibo de sueldo retribuci&oacute;n fija: (Valor del &uacute;ltimo recibo de sueldo)* 12 + aguinaldo + bonos</li>"
				+ "<li>Recibo de sueldo retribuci&oacute;n variable: (Suma de los &uacute;ltimos 6 recibos de sueldo) * 2 + bonos + aguinaldo</li>"
				+ "<li>&Uacute;ltima DDJJ de ganancias + Ticket de presentaci&oacute;n o pago: sumatoria del total de ingresos gravados de<br/>"
				+ "todas las categor&iacute;as de fuente argentina y extranjera + ganancias exentas/no gravadas</li>"
				+ "<li>&Uacute;ltimos 3 pagos de IVA F 731 + Ticket de presentaci&oacute;n o pago: (promedio de la suma de d&eacute;bitos<br/>"
				+ "fiscales) / 21 * 100 * 12 (si la al&iacute;cuota es del 21%)</li>"
				+ "<li>&Uacute;ltimos 3 pagos de monotributo + Ticket de presentaci&oacute;n o pago: en base al importe del pago, se<br/>"
				+ "obtiene la categor&iacute;a y en funci&oacute;n a la misma la facturaci&oacute;n anual</li>"
				+ "</ul>" + "</p>";
	} else if (vId == "dgrKPFOInLista" || vId == "cboKPFOIn") {
		document.getElementById("lblKPFHelp").innerHTML = "<b>Operaciones Inusuales</b><br/>"
				+ "Aportes extraordinarios, rescates mayores a $40.000, etc.";
	} else if (vId == "txtKPFActivDes") {
		document.getElementById("lblKPFHelp").innerHTML = "<b>Descripci&oacute;n Actividad</b><br/>"
				+ "Descripci&oacute;n exhaustiva de la actividad del cliente que permita conocer cual es la fuente donde obtiene sus ingresos en el desarrollo de su...";
		dijit.byId("btnKPFHelp").set("disabled", false);
		document.getElementById("divKPFHelpBtn").style.display = "block";
		document.getElementById("lblKPFHelp").allHTML = "<b>Descripci&oacute;n Actividad</b><br/>"
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
	} else if (vId == "txtKPFPropositoDes") {
		document.getElementById("lblKPFHelp").innerHTML = "<b>Prop&oacute;sito y objetivo</b><br/>"
				+ "Detallar la demanda que genera la contrataci&oacute;n del servicio, por ejemplo, protecci&oacute;n de riesgos de vida, ahorro, seguro de retiro, etc.";
	} else if (vId == "txtKPFSCCMot") {
		document.getElementById("lblKPFHelp").innerHTML = "<b>Motivo SCC</b><br/>"
				+ "Explique brevemente por qu&eacute; motivo el cliente es SCC (sobre titpificaci&oacute;n Com. O&M P1498)";
	} else if (vId == "btnKPFImprimir") {
		if (!dijit.byId(vId).get("disabled")) {
			document.getElementById("lblKPFHelp").innerHTML = "<b>Bot&oacute;n Imprimir</b><br/>"
					+ "Se imprimir&aacute;n los datos originales, sin tener en cuenta los cambios realizados.";
		}
	} else {
		document.getElementById("lblKPFHelp").innerHTML = "Para ver la ayuda contextual pase el mouse sobre algunos campos.";
	}
}

function fKPFHelpView() {
	fMsgBox(document.getElementById("lblKPFHelp").allHTML, "Ayuda", "I");
}

function fKPFHelpOut() {
	dijit.byId("btnKPFHelp").set("disabled", true);
	document.getElementById("divKPFHelpBtn").style.display = "none";
	document.getElementById("lblKPFHelp").innerHTML = "Pase el mouse sobre algunos campos para ver la ayuda contextual.";
	document.getElementById("lblKPFHelp").allHTML = "";
}
