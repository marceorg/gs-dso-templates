function onOSDLoad() {
	// Inicializar
	fOSDInitialize();
	// Tomar parametro
	var vParOrd = fGetParamURL("orden");
	document.getElementById("hidOSDOrden").value = vParOrd;
	// Parametros para volver
	var vParTIn = fGetParamURL("tipoInforme");
	document.getElementById("hidOSDTipoInforme").value = vParTIn;
	if (vParTIn == "tipoInforme=OSS") {
		var vParFDe = fGetParamURL("fechaDesde");
		var vParFHa = fGetParamURL("fechaHasta");
		var vParCia = fGetParamURL("compania");
		var vParTDo = fGetParamURL("tipDoc");
		var vParNDo = fGetParamURL("nroDoc");
		var vParApe = fGetParamURL("apellido");
		var vParPol = fGetParamURL("poliza");
		var vParOrd = fGetParamURL("ordenPar");
		var vParEst = fGetParamURL("estado");
		var vParPSt = fGetParamURL("paramStart");
		document.getElementById("hidOSDFechaDesde").value = vParFDe;
		document.getElementById("hidOSDFechaHasta").value = vParFHa;
		document.getElementById("hidOSDCompania").value = vParCia;
		document.getElementById("hidOSDTipDoc").value = vParTDo;
		document.getElementById("hidOSDNroDoc").value = vParNDo;
		document.getElementById("hidOSDApellido").value = vParApe;
		document.getElementById("hidOSDPoliza").value = vParPol;
		document.getElementById("hidOSDOrdenPar").value = vParOrd;
		document.getElementById("hidOSDEstado").value = vParEst;
		document.getElementById("hidOSDParamStart").value = vParPSt;
	}
	fSessionValidate('fOSDDataLoad');
}

function fOSDInitialize() {
	// Resize
	fBrowserResize();
	// Tamano de botones
	dojo.style("btnOSDImprimir", "width", "120px");
	dojo.style("btnOSDEnviar", "width", "120px");
}

function fOSDDataLoad() {
	// Espera
	fWaitMsgBoxIni("Consultando", [ "Consultando Denuncia..." ]);

	// Consulta Denuncia
	require([ "dojo/request", "dojo/domReady!" ], function(request) {
		var url = fGetURLSvc("BSService/getOpeSiniestro?cache="
				+ fGetCacheRnd() + "&"
				+ document.getElementById("hidOSDOrden").value);
		var deferred = request.get(url, {
			handleAs : "json"
		});

		deferred.then(function(response) {
			// Manejar Respuesta
			if (response.error) {
				fWaitMsgBoxUpd(0,
						"Se ha producido un error en la consulta.(TO)", "E");
				fWaitMsgBoxClose();
				return;
			}

			var vJSON = response.result;

			// Si da error
			if (vJSON == null) {
				fWaitMsgBoxUpd(0,
						"Se ha producido un error en la consulta.(AS)", "E");
				fWaitMsgBoxClose();
				return;
			}
			// Si no trae nada
			if (vJSON.length == 0) {
				fWaitMsgBoxUpd(0,
						"No se encontr&oacute; ning&uacute;n registro.", "W");
				fWaitMsgBoxClose();
				return;
			}

			// Datos
			fOSDDataFill(vJSON);

			// Mensaje de exito
			fWaitMsgBoxUpd(0, "Denuncia cargada.", "O");
			fWaitMsgBoxClose();
			dijit.byId("dlgWait").onCancel();

			fMnuDeselect();
		}, function(err) {
			fWaitMsgBoxUpd(0, "Se ha producido un error en la consulta.", "E");
			fWaitMsgBoxClose();
		});
	});
}

function fOSDDataFill(vJSONDat) {
	// Datos a mostrar
	document.getElementById("hidOSDCompaniaCod").value = vJSONDat.compania.id;
	document.getElementById("txtOSDCompania").innerHTML = vJSONDat.compania.name;
	document.getElementById("txtOSDProducto").innerHTML = vJSONDat.producto.id
			+ " " + vJSONDat.producto.name;
	document.getElementById("txtOSDPoliza").innerHTML = vJSONDat.poliza;
	document.getElementById("txtOSDSiniestro").innerHTML = vJSONDat.siniestro;
	document.getElementById("txtOSDTomador").innerHTML = vJSONDat.tomador;
	document.getElementById("txtOSDDocumento").innerHTML = vJSONDat.tipDoc
			+ " " + vJSONDat.nroDoc;
	document.getElementById("txtOSDOrden").innerHTML = vJSONDat.orden;
	document.getElementById("txtOSDEstado").innerHTML = fSinEstadoDen(vJSONDat.estado);
	document.getElementById("hidOSDEstadoCod").value = vJSONDat.estado;
	document.getElementById("txtOSDFechaDenuncia").innerHTML = fDgrColFec(vJSONDat.fechaDenuncia);
	document.getElementById("txtOSDFechaSiniestro").innerHTML = fDgrColFec(vJSONDat.fechaSiniestro);
	dijit.byId("cboOSDDenunciante")
			.set("value", vJSONDat.esDenAseg ? "S" : "N");
	document.getElementById("txtOSDDenDocumento").innerHTML = vJSONDat.denTipDoc
			+ " " + vJSONDat.denNroDoc;
	document.getElementById("txtOSDDenApellido").innerHTML = vJSONDat.denApeNom;
	document.getElementById("txtOSDDenParentesco").innerHTML = vJSONDat.denParentesco.name;
	dijit.byId("txtOSDDescSiniestro").set("value", vJSONDat.descSiniestro);
	dijit.byId("txtOSDDatosSiniestro").set("value", vJSONDat.datosSiniestro);
	document.getElementById("txtOSDUsuario").innerHTML = vJSONDat.peopleSoft
			+ " - " + vJSONDat.usuApeNom;
	dijit.byId("btnOSDVerAdj1").set("disabled", !vJSONDat.adjunto1);
	dijit.byId("btnOSDVerAdj2").set("disabled", !vJSONDat.adjunto2);
	dijit.byId("btnOSDVerAdj3").set("disabled", !vJSONDat.adjunto3);

	// Adjuntos
	if (fOSDContAdj() > 0) {
		document.getElementById("trOSDArchAdj").style.display = "";
		document.getElementById("trOSDArchNoFound").style.display = "none";
	} else {
		document.getElementById("trOSDArchAdj").style.display = "none";
		document.getElementById("trOSDArchNoFound").style.display = "";
	}

}

function fOSDDenShow(value) {
	if (value == "N") {
		document.getElementById("trOSDDenunciante").style.display = "";
	} else {
		document.getElementById("trOSDDenunciante").style.display = "none";
	}
}

function fOSDImprimir() {
	fSessionValidate('fOSDImprimirExec');
}

function fOSDImprimirExec() {
	window.open(fGetURLMVC("retrieveSvc.html?" + "cache=" + fGetCacheRnd()
			+ "&tipo=I&" + document.getElementById("hidOSDOrden").value),
			"impreso", "resizable=yes,height=550,width=750,top=50,left=100");
}

function fOSDEnviar() {
	fOSDGetMail();
	fQstBox(
			"Est&aacute; seguro de volver a enviar el eMail<br/>de la Denuncia a la Compa&ntilde;&iacute;a?",
			"fSessionValidate('fOSDSendMail')");
}

function fOSDSendMail() {
	if (document.getElementById("hidOSDEstadoCod").value != "P") {
		fWaitMsgBoxIni("Env&iacute;o eMail", [ "Enviando eMail..." ]);
	} else {
		fWaitMsgBoxIni("Procesando...", [ "Enviando eMail...",
				"Confirmar Env&iacute;o" ]);
	}
	// Enviar EMail
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {

				var vURL = fGetURLSvc("BSService/setOpeSiniestroSendMail?cache="
						+ fGetCacheRnd()
						+ "&"
						+ document.getElementById("hidOSDOrden").value
						+ "&recipientTO="
						+ document.getElementById("hidOSDRecipientTO").value
						+ "&cantAdj=" + fOSDContAdj());
				var deferred = request.get(vURL, {
					handleAs : "json"
				});

				deferred
						.then(
								function(response) {
									if (response.error || !response.result) {
										fWaitMsgBoxUpd(
												0,
												"Se ha producido un error al enviar el email.",
												"E");
										fWaitMsgBoxClose();
									} else if (response.result) {
										fWaitMsgBoxUpd(
												0,
												"El email fue enviado con &eacute;xito!",
												"O");
										// Solo para estado P (pendientes)
										if (document
												.getElementById("hidOSDEstadoCod").value == "P") {
											// Cambiar Estado a ENVIADO
											fWaitMsgBoxUpd(
													1,
													"Confirmando Env&iacute;o...",
													"A");
											require(
													[ "dojo/request",
															"dojo/domReady!" ],
													function(request) {

														var vURL = fGetURLSvc("BSService/setOpeSiniestroEst?cache="
																+ fGetCacheRnd()
																+ "&"
																+ document
																		.getElementById("hidOSDOrden").value
																+ "&estado=E");
														var deferred = request
																.get(
																		vURL,
																		{
																			handleAs : "json"
																		});

														deferred
																.then(
																		function(
																				response) {
																			if (response.error
																					|| !response.result) {
																				fWaitMsgBoxUpd(
																						1,
																						"Se ha producido un error al confirmar el env&iacute;o.",
																						"E");
																				fWaitMsgBoxClose();
																			} else if (response.result) {
																				document
																						.getElementById("txtOSDEstado").innerHTML = fSinEstadoDen("E");
																				fWaitMsgBoxUpd(
																						1,
																						"El env&iacute;o se ha confirmado con &eacute;xito!",
																						"O");
																				fWaitMsgBoxClose();
																			}
																		},
																		function(
																				err) {
																			fWaitMsgBoxUpd(
																					1,
																					"Se ha producido un error al confirmar el env&iacute;o.",
																					"E");
																			fWaitMsgBoxClose();
																		});
													});
										} else {
											fWaitMsgBoxClose();
										}
									}
								},
								function(err) {
									fWaitMsgBoxUpd(
											0,
											"Se ha producido un error al enviar el email.",
											"E");
									fWaitMsgBoxClose();
								});
			});
}

function fOSDGetMail() {
	// eMail
	require(
			[ "dojo/request", "dojo/domReady!" ],
			function(request) {

				var vURL = fGetURLSvc("ParametersService/getCompaniaList");
				var deferred = request.get(vURL, {
					handleAs : "json",
					sync : true
				});

				deferred
						.then(function(response) {
							if (!response.error) {
								for ( var i in response.result) {
									if (String(response.result[i].id) == document
											.getElementById("hidOSDCompaniaCod").value) {
										document
												.getElementById("hidOSDRecipientTO").value = response.result[i].email;
										break;
									}
								}
							}
						});
			});
}

function fOSDContAdj() {
	var vRet = 0;
	if (!dijit.byId("btnOSDVerAdj1").get("disabled")) {
		vRet++;
	}
	if (!dijit.byId("btnOSDVerAdj2").get("disabled")) {
		vRet++;
	}
	if (!dijit.byId("btnOSDVerAdj3").get("disabled")) {
		vRet++;
	}
	return vRet;
}

function fOSDVerAdj1() {
	fOSDVerAdj("1");
}

function fOSDVerAdj2() {
	fOSDVerAdj("2");
}

function fOSDVerAdj3() {
	fOSDVerAdj("3");
}

function fOSDVerAdj(vArchAdj) {
	window.open(fGetURLMVC("retrieveSvc.html?" + "cache=" + fGetCacheRnd()
			+ "&tipo=A&" + document.getElementById("hidOSDOrden").value
			+ "&archAdj=" + vArchAdj), "impreso",
			"resizable=yes,height=550,width=750,top=50,left=100");
}

function fOSDVolver() {
	fSessionValidate("fOSDBack");
}

function fOSDBack() {
	if (document.getElementById("hidOSDTipoInforme").value == "tipoInforme=OSS") {
		url = fGetURLPag("interface/OpeSiniestroSeg.html?"
				+ document.getElementById("hidOSDFechaDesde").value + "&"
				+ document.getElementById("hidOSDFechaHasta").value + "&"
				+ document.getElementById("hidOSDCompania").value + "&"
				+ document.getElementById("hidOSDTipDoc").value + "&"
				+ document.getElementById("hidOSDNroDoc").value + "&"
				+ document.getElementById("hidOSDApellido").value + "&"
				+ document.getElementById("hidOSDPoliza").value + "&"
				+ document.getElementById("hidOSDOrdenPar").value + "&"
				+ document.getElementById("hidOSDEstado").value + "&"
				+ document.getElementById("hidOSDParamStart").value);
		var oCP = dijit.byId("divContent");
		oCP.set("href", url);
		oCP.set("onDownloadEnd", function() {
			onOSSLoad();
		});
	}
}